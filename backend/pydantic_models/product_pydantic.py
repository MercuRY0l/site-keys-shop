
from pydantic import BaseModel

class Product_pydantic(BaseModel):
    product_category : str
    product_name : str
    product_description : str
    product_price : float
    product_quantity : int
    product_imageBase64 : str
    filename : str
    