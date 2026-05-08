

from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


user_setting_router = APIRouter()

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site-shop/frontend/static/html")

router = APIRouter()

@router.get("/")
async def get(request: Request):
    return templates.TemplateResponse("main_page.html", {"request" : request})