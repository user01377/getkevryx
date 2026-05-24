# this file validates api requests from users

from pydantic import BaseModel
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