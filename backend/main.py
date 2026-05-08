from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from presentation.routers.main_page_router import router as main_page_router
from presentation.routers.admin_router import router as admin_router
from presentation.routers.products_router import router as product_router
from presentation.routers.cart_router import router as cart_router

from presentation.routers.login_router import login_router
from presentation.routers.logout_router import logout_router
from presentation.routers.feedback_router import feedback_router 
from presentation.routers.register_router import register_router
from presentation.routers.order_router import router as order_router

from presentation.routers.user_settings_router import user_setting_router 

from infrastructure.database.init_db import init_db

init_db()

app = FastAPI()

app.include_router(main_page_router)
app.include_router(admin_router)
app.include_router(product_router) 
app.include_router(cart_router)
app.include_router(user_setting_router)

app.include_router(login_router)
app.include_router(register_router)
app.include_router(logout_router)
app.include_router(feedback_router)
app.include_router(order_router)


app.mount("/static", StaticFiles(directory="./frontend/static"), name = "static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], #временно
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    