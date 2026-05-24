# the file that contains the routes for the api, endpoints are logic are defined here

from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import text
from app.database import get_db
from app.models import Product, Cart, CartItem
from app.schema import ProductOut, ProductListResponse, AddToCart, CartItemAddOut, CartOut

router = APIRouter()

# checks connection health to database
@router.get("/db-health")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )
    
# queries all products from database
@router.get("/products", response_model=ProductListResponse)
def get_products(db: Session = Depends(get_db)):

    products = (
        db.query(Product)
        .order_by(Product.id.asc())
        .all()
    )

    return ProductListResponse(
        data=products,
        count=len(products)
    )

# queries a single product from database
@router.get("/products/{product_id}", response_model=ProductOut)
def get_item(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
         raise HTTPException(status_code=404, detail="Product not found")

    return product

def get_or_create_cart(db, session_id: str):
    '''
    checks whether or not the session exists, if it does not exist it will create a new session and then return it.
    '''
    cart = (
        db.query(Cart)
        .filter(Cart.session_id == session_id)
        .first()
    )

    if cart:
        return cart

    cart = Cart(session_id=session_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)

    return cart

# fetches the cart based on session
@router.get("/cart", response_model=CartOut)
def get_cart(db: Session = Depends(get_db), session_id: str | None = Cookie(default=None)):

    if not session_id:
        return CartOut(items=[])
    
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.session_id == session_id)
        .first()
    )

    if not cart:
        return CartOut(items=[])

    return CartOut(items=cart.items)

# adds item to cart
@router.post("/cart/add", response_model=CartItemAddOut)
def add_to_cart(payload: AddToCart, db: Session = Depends(get_db), session_id: str | None = Cookie(default=None)):

    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be > 0")
    
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = get_or_create_cart(db, session_id)

    item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == payload.product_id
        )
        .first()
    )

    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=payload.product_id,
            quantity=payload.quantity
        )
        db.add(item)

    db.commit()
    db.refresh(item)

    return item