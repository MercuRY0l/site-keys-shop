from pydantic import BaseModel
from typing import Optional

class ProductUpdateDto(BaseModel):
    product_name: Optional[str] = None
    product_category: Optional[str] = None
    product_description: Optional[str] = None
    product_price: Optional[float] = None
    product_quantity: Optional[int] = None
    product_imageUrl: Optional[str] = None