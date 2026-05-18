


import shutil
from fastapi import APIRouter, Request, Form, UploadFile, File,Query
from fastapi.templating import Jinja2Templates

# from pydantic_models.product_pydantic import Product_pydantic

from infrastructure.database.repositories.product_repo import ProductRepository

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

router = APIRouter()


@router.get("/product/{product_id}/")
async def get_product_page( request: Request):
    return templates.TemplateResponse("product.html", {"request" : request})
    
@router.get("/api/product/{product_id}/")
async def get_product(product_id : int):
    repo = ProductRepository()
    product = await repo.find_product_by_id(product_id = product_id)
    
    if not product:
        return {"message" : "not found"}
    
    return {
        "product_id": product.id,
        "product_category" : product.product_category,
        "product_name": product.product_name,
        "product_description" : product.product_description,
        "product_price": product.product_price,
        "product_quantity" : product.product_quantity,
        "product_imageUrl" : product.product_imageUrl
    }
    
@router.get("/products/search")
async def search_products(q : str = Query(..., min_length=1)): 
    repo = ProductRepository()
    products = await repo.search_products(query=q)

    if not products:
        return {"message" : "not found"}
    
    return [{
        "product_id": p.id,
        "product_category" : p.product_category,
        "product_name": p.product_name,
        "product_description" : p.product_description,
        "product_price": p.product_price,
        "product_quantity" : p.product_quantity,
        "product_imageUrl" : p.product_imageUrl
        }
        for p in products
    ]
    
    

    
    
@router.get("/products/")
async def get_products():
    repo = ProductRepository()
    products = await repo.select_all_products()
    
    return [
        {
            "product_id": p.id,
            "product_category" : p.product_category,
            "product_name": p.product_name,
            "product_description" : p.product_description,
            "product_price": p.product_price,
            "product_quantity" : p.product_quantity,
            "product_imageUrl" : p.product_imageUrl
        }
        for p in products
    ]
    

@router.get("/products/games/")
async def get_all_games(request : Request):
    repo = ProductRepository()
    games = await repo.select_all_games()
    
    return [
        {
            "product_id": p.id,
            "product_category" : p.product_category,
            "product_name": p.product_name,
            "product_description" : p.product_description,
            "product_price": p.product_price,
            "product_quantity" : p.product_quantity,
            "product_imageUrl" : p.product_imageUrl
        }
        for p in games
    ]
    
@router.get("/products/dlc/")
async def get_all_games(request : Request):
    repo = ProductRepository()
    dlc = await repo.select_all_dlc()
    
    return [
        {
            "product_id": p.id,
            "product_category" : p.product_category,
            "product_name": p.product_name,
            "product_description" : p.product_description,
            "product_price": p.product_price,
            "product_quantity" : p.product_quantity,
            "product_imageUrl" : p.product_imageUrl
        }
        for p in dlc
    ]
    
@router.get("/products/subscribes/")
async def get_all_games(request : Request):
    repo = ProductRepository()
    subscribes = await repo.select_all_subscribes()
    
    return [
        {
            "product_id": p.id,
            "product_category" : p.product_category,
            "product_name": p.product_name,
            "product_description" : p.product_description,
            "product_price": p.product_price,
            "product_quantity" : p.product_quantity,
            "product_imageUrl" : p.product_imageUrl
        }
        for p in subscribes
    ]

@router.post("/products/create/")
async def create_product(
    product_category: str = Form(...),
    product_name: str = Form(...),
    product_description: str = Form(...),
    product_price: float = Form(...),
    product_quantity: int = Form(...),
    product_imageUrl: UploadFile = File(...)
):
    
    repo = ProductRepository()

    img_path = f"C:/Users/udgit/Documents/site-shop/frontend/static/images/products/{product_imageUrl.filename}"
    
    with open(img_path, "wb") as img_file:
        shutil.copyfileobj(product_imageUrl.file, img_file)

    url_for_html = f"/static/images/products/{product_imageUrl.filename}"
    

    await repo.create_product(product_category=product_category, 
                              product_name=product_name,
                              product_description=product_description, 
                              product_price=product_price,
                              product_quantity=product_quantity,
                              product_imageUrl=url_for_html)
    
    
    
    return {"message" : "Product created successfully"}


@router.delete("/products/delete/{product_id}")
async def delete_product(product_id : int):
    repo = ProductRepository()
    await repo.delete_product_by_id(product_id=product_id)
    return {"message" : "Product deleted successfully"}


@router.patch("/products/edit/{product_id}")
async def edit_product(product_id : int):
    repo = ProductRepository()
    await repo.edit_product(product_id=product_id)
    return {"message" : "Product successfully updated"}

@router.get("/all_products")
async def all_products_page(request: Request):
    return templates.TemplateResponse("all_products_page.html", {"request": request })

@router.get("/games")
async def get_all_games(request: Request):
    return templates.TemplateResponse("games_page.html", {"request" : request})


@router.get("/dlc")
async def get_all_dlc(request : Request):
    return templates.TemplateResponse("dlc_page.html", {"request" : request})


@router.get("/subscribes")
async def get_all_dlc(request : Request):
    return templates.TemplateResponse("subscribes_page.html", {"request" : request})
    