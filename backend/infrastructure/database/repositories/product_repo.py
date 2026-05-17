

from infrastructure.database.db_connector import SessionLocal
from infrastructure.database.models.product_model import Product
from typing import Optional

from sqlalchemy import delete, select

class ProductRepository:
    
    async def search_products(self, query : str):
        async with SessionLocal() as session:
            stmt = select(Product).where(
                Product.product_name.ilike(f"%{query}%") |
                Product.product_description.ilike(f"%{query}%")
            )
            res = await session.execute(stmt)
            return res.scalars().all()
    
    async def select_all_products(self):
        async with SessionLocal() as session:
            res = await session.execute(select(Product).where(Product.is_active == True))
            all_products = res.scalars().all()
                 
            return all_products
        
    async def select_all_games(self):
        async with SessionLocal() as session:
            res = await session.execute(select(Product).where(Product.product_category == "Games", Product.is_active == True))
            all_games = res.scalars().all()
            
            return all_games
        
    async def select_all_dlc(self):
        async with SessionLocal() as session:
            res = await session.execute(select(Product).where(Product.product_category == "DLC", Product.is_active == True))
            all_dlc = res.scalars().all()
            
            return all_dlc
    
    async def select_all_subscribes(self):
        async with SessionLocal() as session:
            res = await session.execute(select(Product).where(Product.product_category == "Subscribes", Product.is_active == True))
            all_sub = res.scalars().all()
            
            return all_sub
                    
    async def create_product(self, 
                             product_category : str, 
                             product_name : str, 
                             product_description : str, 
                             product_price : float, 
                             product_quantity : int,
                             product_imageUrl : Optional[str],
                             ):
        
        async with SessionLocal() as session:
            
            product = Product(product_category=product_category, 
                              product_name=product_name, 
                              product_description=product_description,
                              product_price=product_price, 
                              product_quantity=product_quantity,
                              product_imageUrl=product_imageUrl
                              )
            
            session.add(product) 
            await session.commit()
            await session.refresh(product)
            
            return product
            
    
    async def delete_product_by_id(self, product_id : int):
        async with SessionLocal() as session:
            stmt = select(Product).where(Product.id == product_id)
            res = await session.execute(stmt)
            product = res.scalar_one_or_none()
            
            if not product:
                return False
            
            product.is_active = False
            await session.commit()
            return True            
              
    async def find_product_by_id(self, product_id : int):
        
        async with SessionLocal() as session:
            stmt = select(Product).where(Product.id == product_id)
            res = await session.execute(stmt)
            return res.scalars().first()
    
    async def find_product_by_category(self, category : str):
        async with SessionLocal() as session:
            stmt = select(Product).where(Product.category == category)
            res = await session.execute(stmt)
            return res.scalars().first()
    
    async def find_product_by_name(self, name : str):
        async with SessionLocal() as session:
            stmt = select(Product).where(Product.name == name)
            res = await session.execute(stmt)
            return res.scalars().first()