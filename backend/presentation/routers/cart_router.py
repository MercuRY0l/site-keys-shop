




from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates

from pydantic_models.cart import Cart

from presentation.routers.deps import get_current_user

from infrastructure.database.models.user_model import UserModel
from infrastructure.database.repositories.cart_repo import CartRepository

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

router = APIRouter()

from pydantic import BaseModel

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int
    
    
@router.get("/cart")
async def get_cart_page(request : Request):
    return templates.TemplateResponse("cart_page.html", {"request" : request})

@router.get("/cart/current")
async def get_current_cart(
    user: UserModel = Depends(get_current_user)
):
    repo = CartRepository()
    cart = await repo.get_active_cart(user.id)
    return cart

@router.post("/cart/items/")
async def add_to_cart(cart_item : CartItemCreate, user = Depends(get_current_user)):
    repo = CartRepository()
    
    cart = await repo.get_active_cart(user.id)

    await repo.add_product_to_cart(cart_id=cart.id, 
                                   product_id=cart_item.product_id, 
                                   quantity=cart_item.quantity)
    return {"message" : "товар добавлен в корзину"}
    
@router.post("/cart/items/delete")
async def delete_product_from_cart(cart_item : CartItemCreate, user = Depends(get_current_user)):
    repo = CartRepository()
    cart = await repo.get_active_cart(user.id)
    await repo.delete_product_from_cart(cart_id=cart.id, 
                                        product_id=cart_item.product_id,
                                        quantity=cart_item.quantity)
    
    return {"message" : "товар удален из корзины"}
    
@router.get("/cart/items/get")
async def get_products_from_cart(user = Depends(get_current_user)):
    repo = CartRepository()
    cart = await repo.get_active_cart(user_id=user.id)
    cart_items = await repo.select_all_products_from_cart(cart_id=cart.id)
    
    return [
        {
            "cart_id": item.cart_id,
            "product_id": item.product.id,
            "product_name": item.product.product_name,
            "product_description": item.product.product_description,
            "product_price": item.product.product_price,
            "product_quantity": item.quantity,
            "product_imageUrl": item.product.product_imageUrl,
        }
        for item in cart_items
        
    ]
    
    
 