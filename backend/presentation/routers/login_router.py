import traceback

from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from fastapi import status

from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse

from app.dto.login_dto import LoginDTO
from app.dto.login_service_dto import LoginServiceDTO

from app.services.login_service import LoginService

from domain.services.user_service import UserModelService

from infrastructure.services.hash_pass_service import HashPassService
from infrastructure.services.hash_token_service import HashTokenService
from infrastructure.services.jwt_tokens_service import JwtTokensService
from infrastructure.services.brute_protection_service import BruteService

from infrastructure.database.repositories.user_repo import UserRepository
from infrastructure.database.repositories.log_repo import LogRepo

from domain.services.log_service import LogService

from pydantic import ValidationError

from presentation.routers.deps import get_current_user

login_router = APIRouter()

templates = Jinja2Templates(directory="C:/Users/udgit/Documents/site_project_fastapi/frontend/static/html")


def get_login_service():
    
    
    user_repo = UserRepository()
    log_repo = LogRepo()
    
    return LoginService(
        db_user_service=UserModelService(repository=user_repo),
        log_service=LogService(repo=log_repo),
        
        brute_service=BruteService(),
        hash_pass_service=HashPassService(), 
        hash_token_service=HashTokenService(),
        jwt_service=JwtTokensService(),
        
    )
    
@login_router.get("/api/auth/me/")
async def get(request: Request):
    access_token = request.cookies.get("access_token") or request.cookies.get("access")
    user = await get_current_user(access_token)
    
    return {
        "id" : user.id,
        "username" : user.username,
        "email" : user.email
    }
    
@login_router.post('/auth/login/')
async def login_for_accsess_token(request : Request, data : LoginDTO, service = Depends(get_login_service)):

    client_host = request.client.host
    
    login_dto = LoginServiceDTO(
        username=data.username,
        password=data.password,
        ip=client_host
    )

    try:
        tokens = await service.login(login_dto=login_dto)
        
        response = JSONResponse({
            "success": True,
            "username" : login_dto.username
        })
        
        response.set_cookie(
            key = 'refresh_token',    
            path="/",
            value = tokens.refresh_token,
            httponly=True,
            secure=False,
            samesite="lax"
        )
        
        response.set_cookie(
            key='access_token',
            path='/',
            value=tokens.access_token,
            httponly=True,
            secure=False,
            samesite='lax'
        )
        return response
    
    except ValidationError as ve:
        errors = {}
        for err in ve.errors():
            field = err["loc"][0]
            errors[field] = err["msg"]

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=errors
        )
    
    
    except ValueError as e: 
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=str(e)
    )
    
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
        
    
    
    