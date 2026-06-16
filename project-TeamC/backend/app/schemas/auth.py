from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
    expiresIn: int


class LogoutResponse(BaseModel):
    message: str
