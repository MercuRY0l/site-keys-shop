
from pydantic import BaseModel

class ProductFromCart(BaseModel):
    cart_id : int
    product_id : int