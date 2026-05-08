from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Text
)
from sqlalchemy.orm import relationship

from infrastructure.database.db_connector import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_category = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    product_description = Column(Text, nullable=False)
    product_price = Column(Numeric(10, 2), nullable=False)
    product_quantity = Column(Integer)
    product_imageUrl = Column(String)
    
    cart_items = relationship("CartItem", back_populates="product")