from fastapi import HTTPException


class AuthException(HTTPException):
    def __init__(self, detail="Ошибка авторизации"):
        super().__init__(status_code=401, detail=detail)


class TokenNotFound(AuthException):
    def __init__(self, msg="Refresh токен не найден!"):
        super().__init__(msg)


class TokenTypeIncorrect(AuthException):
    def __init__(self, msg="Неверный тип токена!"):
        super().__init__(msg)


class UserNotFound(AuthException):
    def __init__(self, msg="Пользователь не найден!"):
        super().__init__(msg)


class TokenIsBlacklisted(AuthException):
    def __init__(self, msg="Токен в черном списке!"):
        super().__init__(msg)