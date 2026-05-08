from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    DateTime,
    func, 
    Float
)
from sqlalchemy.orm import relationship

from infrastructure.database.db_connector import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(ForeignKey("Users.ID"), nullable=False)
    
    total_amount = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")



class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)

    order_id = Column(ForeignKey("orders.id"), nullable=False)
    product_id = Column(ForeignKey("products.id"), nullable=False)

    product_name = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
