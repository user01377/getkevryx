# this file defines our actual database table looks like

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class ProductCategory(str, enum.Enum):
    TOP = "top"
    BOTTOM = "bottom"
    OUTERWEAR = "outerwear"
    ACCESSORY = "accessory"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    category = Column(Enum(ProductCategory), index=True)


class Cart(Base):
    __tablename__ = "shopping_carts"

    id = Column(Integer, primary_key=True)
    session_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items = relationship(
        "CartItem", back_populates="cart", order_by="CartItem.added_at.asc()"
    )


class CartItem(Base):
    __tablename__ = "items_in_cart"

    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("shopping_carts.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")


class OrderStatus(str, enum.Enum):
    PROCESSING = "processing"
    SHIPPED = "shipped"
    OUT_FOR_DELIVERY = "out_for_delivery"
    FULFILLED = "fulfilled"


class OrderPlaced(Base):
    __tablename__ = "orders_placed"

    id = Column(Integer, primary_key=True)

    # customer information columns
    first = Column(String(255), nullable=False, index=True)
    last = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)

    address = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    zipcode = Column(String(20), nullable=False)

    order_total = Column(Numeric(10, 2), nullable=False)
    order_status = Column(
        Enum(OrderStatus), default=OrderStatus.PROCESSING, nullable=False, index=True
    )
    # processing, shipped, out for delivery, fulfilled.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "all_ordered_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders_placed.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("OrderPlaced", back_populates="items")
    product = relationship("Product")
