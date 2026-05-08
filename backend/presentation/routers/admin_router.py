from fastapi import Request

from fastapi.routing import APIRouter 
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

@router.get("/admin")
async def get_admin_panel(request : Request):
    return templates.TemplateResponse("admin.html", {"request": request})
    
