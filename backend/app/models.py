# this file defines our actual database table looks like

from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    price = Column(Numeric(10,2), nullable=False)
    stock = Column(Integer, default=0)
    category = Column(String(100), index=True)

class Cart(Base):
    __tablename__ = "shopping_carts"

    id = Column(Integer, primary_key=True)
    session_id = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items = relationship("CartItem", back_populates="cart")

class CartItem(Base):
    __tablename__ = "items_in_cart"

    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("shopping_carts.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")

class OrderPlaced(Base):
    __tablename__ = "orders_placed"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, index=True)
    order_total = Column(Numeric(10,2), nullable=False)
    order_complete = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    items = relationship("AllOrderedItems", back_populates="order")

class OrderItem(Base):
    __tablename__ = "all_ordered_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders_placed.id"), index=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True)
    quantity = Column(Integer, default=1, nullable=False)
    price = Column(Numeric(10,2))

    order = relationship("OrderPlaced", back_populates="items")
    product = relationship("Product")