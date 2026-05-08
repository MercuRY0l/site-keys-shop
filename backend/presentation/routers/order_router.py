from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import HTTPException

from infrastructure.database.repositories.product_repo import ProductRepository
from infrastructure.database.repositories.order_repo import OrderItemRepository, OrderRepository


from infrastructure.database.repositories.cart_repo import CartRepository

from presentation.routers.deps import get_current_user

user_setting_router = APIRouter()

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

router = APIRouter()


@router.get("/orders")
async def user_get_order_page(request : Request):
    return templates.TemplateResponse("user_orders_page.html", {"request" : request})

@router.get("/orders/get")
async def get_products_from_order(user = Depends(get_current_user)):
    order_items_repo = OrderItemRepository()
    order_repo = OrderRepository()
    
    orders = await order_repo.get_order_by_user_id(user.id)
    
    if not orders:
        return []
    
    res = []
    
    for order in orders:
        items = await order_items_repo.get_items_by_order(order.id)
        
        res.append({
            "order_id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "product_price": item.product_price
                }
                for item in items
            ]
        })
        
    return res
    
    
@router.post("/orders/from-product/{product_id}")
async def create_order(product_id : int, quantity : int = 1, user = Depends(get_current_user)):
    order_repo = OrderRepository()
    order_item_repo = OrderItemRepository()
    product_repo = ProductRepository()
    
    product = await product_repo.find_product_by_id(product_id=product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    
    total_amount = product.product_price * quantity
    
    order = await order_repo.create_order(user_id=user.id, total_amount=total_amount, status="new")
    
    await order_item_repo.create_order_item(order_id=order.id, 
                                      product_id=product.id, 
                                      product_name=product.product_name,
                                      product_quantity=quantity,
                                      product_price = product.product_price)
    
    return order
    
@router.post("/orders/from-cart")
async def checkout(user = Depends(get_current_user)):
    order_repo = OrderRepository()
    order_item_repo = OrderItemRepository()
    cart_repo = CartRepository()
    
    cart = await cart_repo.get_active_cart(user_id=user.id)
    cart_items = await cart_repo.select_all_products_from_cart(cart_id=cart.id)
    
    if not cart:
        return
    
    total_amount = sum(item.product.product_price * item.quantity for item in cart_items)
    
    order = await order_repo.create_order(user_id=user.id, total_amount=total_amount, status="new")
    
    for item in cart_items:
        await order_item_repo.create_order_item(
            order_id=order.id,
            product_name=item.product.product_name,
            product_id=item.product_id,
            product_price=item.product.product_price,
            product_quantity=item.quantity,
        )
        
    await cart_repo.clear_cart(cart.id)
    return order 