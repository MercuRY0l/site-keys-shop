

from fastapi import APIRouter, Response, Request

from app.services.refresh_tokens_service import RefreshService
from app.dto.refresh_dto import RefreshDTO

refresh_router = APIRouter()

@refresh_router.post("/auth/refresh")
async def refresh(response: Response, request : Request):
    
    client_host = request.client.host
    
    refresh_token = request.cookies.get("refresh_token")
    
    service = RefreshService()
    
    tokens = await service.refresh(RefreshDTO(refresh_token=refresh_token, ip=client_host))
    
    response.set_cookie(
        key="access_token",
        path="/",
        value=tokens.access_token,
        samesite="lax",
        secure=False,
        httponly=False
    )
    
    response.set_cookie(
        key="refresh_token",
        path="/",
        value=tokens.refresh_token,
        samesite="lax",
        secure=False,
        httponly=False
    )
    
    return {"message" : "Токен успешно обновлен"}
    
    
    