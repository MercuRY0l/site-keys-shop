from fastapi import Request, Depends

from fastapi.routing import APIRouter 
from fastapi.templating import Jinja2Templates

from presentation.routers.deps import get_current_admin

admin_router = APIRouter()

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

@admin_router.get("/admin/actions")
async def get_admin_auth_page(request : Request, user = Depends(get_current_admin)):
    return templates.TemplateResponse("admin_pages/admin_actions.html", {"request": request})
