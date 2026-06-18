# the file that contains the routes for the api, endpoints are logic are defined here

from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import text, update
from app.database import get_db
from app.models import Product, Cart, CartItem, OrderPlaced, OrderItem
from app.schema import ProductOut, ProductListResponse, AddToCart, CartItemAddOut, CartOut, UpdateCartItem, CheckoutIn, TrackOrderIn, OrderOut, OrderItemOut, CartSummaryOut, CartSummaryItemOut
from decimal import Decimal

SHIPPING_RATE = Decimal("0.1")
TAX_RATE = Decimal("0.08")

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

@router.get("/cart/summary", response_model=CartSummaryOut)
def cart_summary(
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None)
):

    if not session_id:
        return CartSummaryOut(
            items=[],
            subtotal=Decimal("0"),
            shipping=Decimal("0"),
            tax=Decimal("0"),
            total=Decimal("0")
        )

    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.session_id == session_id)
        .first()
    )

    if not cart:
        return CartSummaryOut(
            items=[],
            subtotal=Decimal("0"),
            shipping=Decimal("0"),
            tax=Decimal("0"),
            total=Decimal("0")
        )

    subtotal = sum(Decimal(str(item.quantity)) * item.product.price for item in cart.items)

    shipping = subtotal * SHIPPING_RATE
    tax = subtotal * TAX_RATE
    total = subtotal + shipping + tax

    return CartSummaryOut(
        items=[
            CartSummaryItemOut(
                product=item.product.name,
                quantity=item.quantity,
                price=item.product.price
            )
            for item in cart.items
        ],
        subtotal=subtotal,
        shipping=shipping,
        tax=tax,
        total=total
    )

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

    try:
        cart = (
            db.query(Cart)
            .filter(Cart.session_id == session_id)
            .first()
        )

        if not cart:
            raise HTTPException(status_code=400, detail="Cart not found")

        cart_items = (
            db.query(CartItem)
            .filter(CartItem.cart_id == cart.id)
            .all()
        )

        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        product_ids = [i.product_id for i in cart_items]

        products = (
            db.query(Product)
            .filter(Product.id.in_(product_ids))
            .with_for_update()
            .all()
        )

        product_map = {p.id: p for p in products}

        total = 0
        order_items = []

        for item in cart_items:
            product = product_map.get(item.product_id)

            if not product:
                raise HTTPException(400, f"Product {item.product_id} not found")

            if product.stock < item.quantity:
                raise HTTPException(400, f"Insufficient stock for product {product.id}")

            product.stock -= item.quantity
            total += item.quantity * product.price

        order = OrderPlaced(
            first=payload.first,
            last=payload.last,
            email=payload.email,
            address=payload.address,
            city=payload.city,
            state=payload.state,
            zipcode=payload.zipcode,
            order_total=total
        )

        db.add(order)
        db.flush()

        for item in cart_items:
            order_items.append(
                OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=product_map[item.product_id].price
                )
            )

        db.add_all(order_items)

        db.query(CartItem).filter(
            CartItem.cart_id == cart.id
        ).delete(synchronize_session=False)

        db.commit()

        return {
            "order_id": order.id,
            "total": total,
            "status": "created"
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Checkout failed")

@router.post("/order-info", response_model=list[OrderOut])
def get_order_info(
    payload: TrackOrderIn,
    db: Session = Depends(get_db)
):

    orders = (
        db.query(OrderPlaced)
        .options(
            joinedload(OrderPlaced.items)
            .joinedload(OrderItem.product)
        )
        .filter(OrderPlaced.email == payload.email)
        .all()
    )

    if not orders:
        return []

    result = []

    for order in orders:

        subtotal = order.order_total
        shipping = order.order_total * SHIPPING_RATE
        tax = order.order_total * TAX_RATE
        total = subtotal + shipping + tax

        result.append(
            OrderOut(
                id=order.id,
                status=(order.order_status),
                created_at=order.created_at,
                subtotal=subtotal,
                shipping=shipping,
                tax=tax,
                total=total,
                items=[
                    OrderItemOut(
                        product=item.product.name,
                        quantity=item.quantity,
                        price=item.unit_price
                    )
                    for item in order.items
                ]
            )
        )

    return result

@router.get("/order-summary/{id}", response_model=OrderOut)
def get_order_summary(
    id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(OrderPlaced)
        .options(
            joinedload(OrderPlaced.items)
            .joinedload(OrderItem.product)
        )
        .filter(OrderPlaced.id == id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    subtotal = order.order_total
    shipping = order.order_total * SHIPPING_RATE
    tax = order.order_total * TAX_RATE
    total = subtotal + shipping + tax
    
    return OrderOut(
        id=order.id,
        status=order.order_status,
        created_at=order.created_at,
        subtotal=subtotal,
        shipping=shipping,
        tax=tax,
        total=total,
        items=[
            OrderItemOut(
                product=item.product.name,
                quantity=item.quantity,
                price=item.unit_price
            )
            for item in order.items
        ]
    )