from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from app.core.security import decode_access_token
from app.db.session import get_session
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> dict:
    # JWTからログイン中ユーザーを特定し、APIで利用できる形で返す。
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報が正しくありません",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報が正しくありません",
        )

    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証情報が正しくありません",
        ) from exc

    user = session.get(User, user_id_int)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーが見つかりません",
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }