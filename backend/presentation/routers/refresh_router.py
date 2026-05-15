

from fastapi import APIRouter, Response, Request, Depends

from app.services.refresh_tokens_service import RefreshService
from app.dto.refresh_dto import RefreshDTO

from domain.services.user_service import UserModelService
from domain.services.log_service import LogService

from infrastructure.database.repositories.user_repo import UserRepository
from infrastructure.database.repositories.log_repo import LogRepo
from infrastructure.services.jwt_tokens_service import JwtTokensService
from infrastructure.services.hash_token_service import HashTokenService
from infrastructure.services.brute_protection_service import BruteService

refresh_router = APIRouter()


def get_refresh_service():
    
    user_repo = UserRepository()
    log_repo = LogRepo()
    
    return RefreshService(
        db_user_service=UserModelService(repository=user_repo),
        jwt_service=JwtTokensService(),
        hash_token_service=HashTokenService(),
        log_service=LogService(repo=log_repo),
        brute_service=BruteService()
    )

@refresh_router.post("/auth/refresh")
async def refresh(response: Response, request : Request, service : RefreshService = Depends(get_refresh_service)):
    
    client_host = request.client.host
    
    refresh_token = request.cookies.get("refresh_token")
    
    
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
    
    
    