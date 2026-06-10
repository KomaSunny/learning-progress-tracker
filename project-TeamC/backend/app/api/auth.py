from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, LogoutResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

dummy_user = {
    "id": 1,
    "email": "user@example.com",
    "password_hash": hash_password("password"),
    "role": "student",
}


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    if request.email != dummy_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
        )

    if not verify_password(request.password, dummy_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
        )

    access_token = create_access_token(
        data={
            "sub": str(dummy_user["id"]),
            "role": dummy_user["role"],
        }
    )

    return TokenResponse(access_token=access_token)


@router.post("/logout", response_model=LogoutResponse)
def logout():
    return LogoutResponse(message="Logged out")