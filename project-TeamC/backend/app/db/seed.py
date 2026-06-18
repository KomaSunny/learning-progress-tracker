from app.db.init_db import create_db_and_tables
from app.db.session import get_engine
from app.models.user import User
from passlib.context import CryptContext
from sqlmodel import Session, select

# JWT認証側と同じbcrypt方式で、seedユーザーのパスワードをハッシュ化する。
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """平文パスワードをDB保存用のハッシュ値に変換する。"""
    return pwd_context.hash(password)


def seed_users() -> None:
    """MVPの動作確認に必要な student / teacher ユーザーを作成する。"""
    users = [
        {
            "name": "生徒ユーザー",
            "email": "user@example.com",
            "password": "password",
            "role": "student",
        },
        {
            "name": "講師ユーザー",
            "email": "teacher@example.com",
            "password": "password",
            "role": "teacher",
        },
        {
            "name": "生徒ユーザー2",
            "email": "user2@example.com",
            "password": "password",
            "role": "student",
        },
    ]

    with Session(get_engine()) as session:
        for user_data in users:
            # 同じメールアドレスのユーザーが既にいる場合は重複作成しない。
            existing_user = session.exec(
                select(User).where(User.email == user_data["email"])
            ).first()

            if existing_user:
                continue

            user = User(
                name=user_data["name"],
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                role=user_data["role"],
            )
            session.add(user)

        session.commit()


def init_db() -> None:
    """テーブル作成後、初期ユーザーを投入する。"""
    create_db_and_tables()
    seed_users()


if __name__ == "__main__":
    init_db()
