from fastapi import Cookie, HTTPException, status
import jwt

from infrastructure.database.repositories.user_repo import UserRepository
from infrastructure.services.jwt_tokens_service import JwtTokensService


async def get_current_user(
    access_token: str = Cookie(None),
):

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token not found"
        )

    jwt_service = JwtTokensService()

    try:
        payload = jwt_service.decode_jwt_token(access_token)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid payload"
        )

    repo = UserRepository()

    user = await repo.get_user_by_user_id(user_id=user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user