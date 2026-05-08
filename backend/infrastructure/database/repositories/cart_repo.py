


from infrastructure.database.db_connector import SessionLocal
from infrastructure.database.models.cart_model import Cart, CartItem

from sqlalchemy import delete, select
from sqlalchemy.orm import selectinload

class CartRepository:
    
    async def select_all_products_from_cart(self, cart_id : int):
        async with SessionLocal() as session:
            res = await session.execute(select(CartItem).where(CartItem.cart_id == cart_id).options(selectinload(CartItem.product)))
            return res.scalars().all()
    
    async def get_active_cart(self, user_id : int):
        async with SessionLocal() as session:
            
            stmt = select(Cart).where(Cart.user_id == user_id)
            res = await session.execute(stmt)
            cart = res.scalars().first()
            
            if not cart:
                cart = Cart(user_id=user_id)
                session.add(cart)
                await session.commit()
                await session.refresh(cart)
            
            return cart
                
    
    async def create_new_cart(self, user_id : int):
        async with SessionLocal() as session:   
            
            new_cart = Cart(user_id=user_id)
            
            session.add(new_cart)
            await session.commit()
            await session.refresh(new_cart)
            
            return new_cart
    
    async def clear_cart(self, cart_id : int):
        async with SessionLocal() as session:
            await session.execute(delete(CartItem).where(CartItem.cart_id == cart_id))
            
            await session.execute(delete(Cart).where(Cart.id == cart_id))
            
            await session.commit()
            
    async def add_product_to_cart(self, cart_id : int, product_id : int, quantity: int):
        async with SessionLocal() as session:
            stmt = select(CartItem).where(CartItem.cart_id == cart_id, 
                                          CartItem.product_id == product_id)
            
            res = await session.execute(stmt)
            product_to_cart = res.scalar_one_or_none()
            
            if product_to_cart:
                product_to_cart.quantity += quantity
                
            else:
                product_to_cart = CartItem(cart_id=cart_id, product_id=product_id, quantity=quantity)
                session.add(product_to_cart)
            
            await session.commit()
            await session.refresh(product_to_cart)
            
            return product_to_cart
    
    async def delete_product_from_cart(self, cart_id : int, product_id : int, quantity : int):
        async with SessionLocal() as session:
            
            stmt = select(CartItem).where(CartItem.cart_id == cart_id,
                                            CartItem.product_id == product_id)
            
            res = await session.execute(stmt)
            product_from_cart = res.scalar_one_or_none()
            
            if not product_from_cart:
                return None
            
            product_from_cart.quantity -= quantity
            
            if product_from_cart.quantity <= 0:
                await session.delete(product_from_cart)
                
            await session.commit()
            return product_from_cart
            
            
            