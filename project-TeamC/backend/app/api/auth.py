from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, LogoutResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# reports APIの動作確認用の仮ユーザー
# DB接続版ログインはJWT認証側の後続対応
dummy_users = [
    {
        "id": 1,
        "name": "生徒ユーザー",
        "email": "user@example.com",
        "password_hash": hash_password("password"),
        "role": "student",
    },
    {
        "id": 2,
        "name": "講師ユーザー",
        "email": "teacher@example.com",
        "password_hash": hash_password("password"),
        "role": "teacher",
    },
    {
        "id": 3,
        "name": "生徒ユーザー2",
        "email": "user2@example.com",
        "password_hash": hash_password("password"),
        "role": "student",
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

    return TokenResponse(
        accessToken=access_token,
        tokenType="Bearer",
        expiresIn=3600,
    )


@router.post("/logout", response_model=LogoutResponse)
def logout():
    return LogoutResponse(message="Logged out")