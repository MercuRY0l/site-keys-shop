
from pydantic import BaseModel

class ProductToCart(BaseModel):
    cart_id : int
    product_id : int