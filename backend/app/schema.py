# this file validates api requests from users

from pydantic import BaseModel, EmailStr
from datetime import datetime
from decimal import Decimal

class ProductOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: Decimal
    stock: int
    category: str

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    data: list[ProductOut]
    count: int

class AddToCart(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemAddOut(BaseModel):
    id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True
        
class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    items: list[CartItemOut]

class CartSummaryItemOut(BaseModel):
    product: str
    quantity: int
    price: Decimal

class CartSummaryOut(BaseModel):
    items: list[CartSummaryItemOut]
    subtotal: Decimal
    shipping: Decimal
    tax: Decimal
    total: Decimal

class UpdateCartItem(BaseModel):
    quantity: int

class CheckoutIn(BaseModel):
    first: str
    last: str
    email: EmailStr

    address: str
    city: str
    state: str
    zipcode: str

class TrackOrderIn(BaseModel):
    email: EmailStr

class OrderItemOut(BaseModel):
    product: str
    quantity: int
    price: Decimal


class OrderOut(BaseModel):
    id: int
    status: str
    created_at: datetime
    subtotal: Decimal
    shipping: Decimal
    tax: Decimal
    total: Decimal
    items: list[OrderItemOut]