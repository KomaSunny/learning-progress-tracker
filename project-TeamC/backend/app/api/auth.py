from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, LogoutResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

dummy_users = [
    {
        "id": 1,
        "email": "user@example.com",
        "password_hash": hash_password("password"),
        "role": "student",
    },
    {
        "id": 2,
        "email": "teacher@example.com",
        "password_hash": hash_password("password"),
        "role": "teacher",
    },
]


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    login_user = None

    for user in dummy_users:
        if user["email"] == request.email:
            login_user = user
            break

    if login_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
        )

    if not verify_password(request.password, login_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
        )

    access_token = create_access_token(
        data={
            "sub": str(login_user["id"]),
            "role": login_user["role"],
        }
    )

    return TokenResponse(access_token=access_token)

@router.post("/logout", response_model=LogoutResponse)
def logout():
    return LogoutResponse(message="Logged out")