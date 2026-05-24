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