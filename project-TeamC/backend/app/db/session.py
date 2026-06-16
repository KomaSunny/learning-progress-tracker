from collections.abc import Generator

from app.core.config import get_settings
from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlmodel import Session, create_engine

_engine: Engine | None = None


def get_engine() -> Engine:
    global _engine

    settings = get_settings()

    if settings.database_url is None:
        raise RuntimeError("DATABASE_URL is not set")

    if _engine is None:
        _engine = create_engine(
            settings.database_url,
            echo=settings.db_echo,
        )

    return _engine


def get_session() -> Generator[Session, None, None]:
    with Session(get_engine()) as session:
        yield session


def check_database_connection() -> None:
    """PostgreSQLへの接続確認を行う。"""
    with Session(get_engine()) as session:
        result = session.exec(text("SELECT 1")).scalar_one()

    if result != 1:
        raise RuntimeError("Database health check failed")
