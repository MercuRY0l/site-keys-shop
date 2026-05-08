




from infrastructure.database.db_connector import SessionLocal
from infrastructure.database.models.order_model import Order, OrderItem

from sqlalchemy import delete, select

class OrderRepository:    
    
    
    async def create_order(self, 
                             user_id : int,
                             total_amount : float,
                             status : str
                             ):
        
        async with SessionLocal() as session:
            
            order = Order(user_id=user_id,
                            total_amount=total_amount,
                            status=status)
                            
            
            session.add(order) 
            await session.commit()
            await session.refresh(order)
            
            return order
            
    async def delete_order(self, order_id : int):
        
        async with SessionLocal() as session:
            
            stmt = delete(Order).where(Order.id == order_id)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
            
    async def find_order_by_id(self, order_id : int):
        
        async with SessionLocal() as session:
            stmt = select(Order).where(Order.id == order_id)
            res = await session.execute(stmt)
            return res.scalars().first()
        
        
    async def get_order_by_user_id(self, user_id : int):
        async with SessionLocal() as session:
            stmt = select(Order).where(Order.user_id == user_id)
            res = await session.execute(stmt)
            return res.scalars().all()

class OrderItemRepository:

    async def create_order_item(
        self,
        order_id: int,
        product_id: int,
        product_name : str,
        product_quantity: int,
        product_price: float
    ):
        async with SessionLocal() as session:
            item = OrderItem(
                order_id=order_id,
                product_id=product_id,
                product_name=product_name,
                product_price=product_price,
                quantity=product_quantity
            )
            session.add(item)
            await session.commit()
            await session.refresh(item)
            return item

    async def get_items_by_order(self, order_id: int):
        async with SessionLocal() as session:
            stmt = select(OrderItem).where(OrderItem.order_id == order_id)
            res = await session.execute(stmt)
            return res.scalars().all()

    async def delete_items_by_order(self, order_id: int):
        async with SessionLocal() as session:
            stmt = delete(OrderItem).where(OrderItem.order_id == order_id)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
