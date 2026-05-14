
from datetime import datetime, timezone, timedelta

from domain.interfaces.user_interface import IUserRepository
from domain.interfaces.jwt_interface import IJWTService
from domain.interfaces.hash_tokens_service import IHashTokenService
from domain.interfaces.log_interface import ILogRepo
from domain.interfaces.brute_interface import IBruteService

from domain.models.log_domain_model import LogDomainModel


from app.dto.refresh_dto import RefreshDTO

from app.exceptions.refresh_exceptions import TokenNotFound, UserNotFound, TokenTypeIncorrect
class RefreshService:
    
    def __init__(self,
                 db_user_service : IUserRepository,
                 jwt_service: IJWTService,
                 hash_token_service : IHashTokenService,
                 log_service : ILogRepo,
                 brute_service : IBruteService):
        
        
        self.db_user_service = db_user_service
        self.jwt_service = jwt_service
        self.hash_token_service = hash_token_service
        self.log_service = log_service
        self.brute_service = brute_service
        
    async def refresh(self, refresh_dto: RefreshDTO):
        
        refresh_token = refresh_dto.refresh_token
        
        if not refresh_token:
            await self.log_service.create_log(LogDomainModel(event_type="Refresh", username=None, user_id=None, status="Failed", ip=refresh_dto.ip, reason="Невозможно обновить токен, refresh токена нет!"))
            return {"error" : "Refresh токен не найден"}
        
        try:
            payload = self.jwt_service.decode_jwt_token(refresh_token)
            
            user_id = payload.get("user_id")
            username = payload.get("username")
             
        except:
            await self.log_service.create_log(LogDomainModel(
                event_type="Refresh",username=username,  
                user_id=user_id, 
                status="Failed", 
                ip=refresh_dto.ip, 
                reason="Невозможно обновить токен, неверный тип токена!")
            )
            raise TokenNotFound()
        
        if payload.get("type") != 'refresh':
            await self.log_service.create_log(LogDomainModel(event_type="Refresh",username=username,  user_id=user_id, status="Failed", ip=refresh_dto.ip, reason="Невозможно обновить токен, неверный тип токена!"))
            raise TokenTypeIncorrect()
        
        user_from_db = await self.db_user_service.get_user_by_user_id(user_id=user_id)
        
        if not user_from_db:
            await self.log_service.create_log(LogDomainModel(event_type="Refresh", username=username,user_id=user_id, status="Failed", ip=refresh_dto.ip, reason="Невозможно обновить токен, пользователь не найден!"))
            raise UserNotFound()
            
        
        tokens = self.jwt_service.create_jwt_token(user_id = user_from_db.id, username=user_from_db.username)

        await self.log_service.create_log(LogDomainModel(event_type="Refresh", username=user_from_db.username, user_id=user_from_db.id, status="Success", ip=refresh_dto.ip, reason="Токен успешно обновлен!"))
        return {"refresh_token" : tokens['refresh'], "access_token" : tokens['access'], "ip" : refresh_dto.ip}

    