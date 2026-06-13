from sqlmodel import SQLModel

from app.db.session import get_engine
from app.models import Report, User  # noqa: F401


def create_db_and_tables() -> None:
    """読み込み済みのSQLModelモデルをもとにDBテーブルを作成する。"""
    SQLModel.metadata.create_all(get_engine())


if __name__ == "__main__":
    create_db_and_tables()