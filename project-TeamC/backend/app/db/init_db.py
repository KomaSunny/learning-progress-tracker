from app.db.session import get_engine
from app.models import Report, User  # noqa: F401
from sqlmodel import SQLModel


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(get_engine())


if __name__ == "__main__":
    create_db_and_tables()
