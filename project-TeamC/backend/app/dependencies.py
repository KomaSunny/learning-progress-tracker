from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


dummy_users = [
    {
        "id": 1,
        "name": "生徒ユーザー",
        "email": "user@example.com",
        "role": "student",
    },
    {
        "id": 2,
        "name": "講師ユーザー",
        "email": "teacher@example.com",
        "role": "teacher",
    },
]


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報が正しくありません",
        )

    user_id = int(payload.get("sub"))

    for user in dummy_users:
        if user["id"] == user_id:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="ユーザーが見つかりません",
    )