# the file that contains the routes for the api, endpoints are logic are defined here

from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import text
from app.database import get_db
from app.models import Product, Cart, CartItem, OrderPlaced, OrderItem
from app.schema import ProductOut, ProductListResponse, AddToCart, CartItemAddOut, CartOut, UpdateCartItem, CheckoutIn

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

# queries a specific product from database
@router.get("/products/{product_id}", response_model=ProductOut)
def get_item(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
         raise HTTPException(status_code=404, detail="Product not found")

    return product

def get_or_create_cart(db, session_id: str):
    '''
    helper func, checks whether or not the session exists, if it does not exist it will create a new session and then return it.
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

"""
all api routes for cart related actions
"""
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

@router.post("/cart/add", response_model=CartItemAddOut)
def add_to_cart(
    payload: AddToCart,
    response: Response,
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None)
):

    if not session_id:
        session_id = str(uuid4())
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30 # 30 day cookie age
        )

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

@router.patch("/cart/item/{item_id}")
def update_item(
    item_id: int,
    payload: UpdateCartItem,
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None)
):

    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    if payload.quantity <= 0 or payload.quantity > 10:
        raise HTTPException(status_code=400, detail="Invalid Quantity")

    cart = get_or_create_cart(db, session_id)

    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    item.quantity = payload.quantity

    db.commit()
    db.refresh(item)

    return item

@router.delete("/cart/item/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None)
):

    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    cart = get_or_create_cart(db, session_id)

    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id
        )
        .first()
    )

    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(item)
    db.commit()

    return {"message": "Item removed"}

@router.post("/checkout")
def checkout(
    payload: CheckoutIn,
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None)
):
    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.session_id == session_id)
        .first()
    )

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    total = 0
    for item in cart.items:
        total += item.quantity * item.product.price
    
    # cretae and add the order to table
    order = OrderPlaced(
        first=payload.first,
        last=payload.last,
        email=payload.email,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        zipcode=payload.zipcode,
        order_total=total,
        order_complete=False
    )

    db.add(order)
    db.flush()

    # add items into all ordered items table
    for item in cart.items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.product.price
        ))

    # clear the users cart
    for item in cart.items:
        db.delete(item)

    db.commit()

    return {
        "order_id": order.id,
        "total": total,
        "status": "created"
    }