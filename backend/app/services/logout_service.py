from domain.interfaces.user_interface import IUserRepository
from domain.interfaces.jwt_interface import IJWTService
from domain.interfaces.hash_tokens_service import IHashTokenService
from domain.interfaces.log_interface import ILogRepo
from domain.interfaces.brute_interface import IBruteService

from domain.models.log_domain_model import LogDomainModel

from app.dto.logout_dto import LogoutDTO
from app.exceptions.logout_exceptions import TokenNotFound
class LogoutService:
    
    def __init__(self,
                db_user_service : IUserRepository,
                jwt_service : IJWTService,
                hash_token_service : IHashTokenService,
                log_service : ILogRepo,
                brute_service : IBruteService):
        
        self.db_user_service = db_user_service
        self.jwt_service = jwt_service
        self.hash_token_service = hash_token_service
        self.log_service = log_service
        self.brute_service = brute_service
    
    async def logout(self, logout_dto : LogoutDTO):
    
        refresh_token = logout_dto.refresh_token
        
        
        if not refresh_token: 
            await self.log_service.create_log(LogDomainModel(event_type="Logout", username=None, user_id=None, status="Failed", ip=logout_dto.ip, reason="Выход невозможен, refresh токен не найден!"))
            raise TokenNotFound()
            
        payload = self.jwt_service.decode_jwt_token(refresh_token)
        user_id = payload.get("user_id") if payload else None
        user_in_db = await self.db_user_service.get_user_by_user_id(user_id=user_id)
        
        if not user_in_db:
            return {"error" : "Пользователь не найден"}

        await self.log_service.create_log(LogDomainModel(event_type="Logout", username = user_in_db.username, user_id=user_in_db.id, status="Success", ip=logout_dto.ip, reason="Успешный выход!"))
        return {"status" : "succses"}
                
        
            