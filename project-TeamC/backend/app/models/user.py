from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, CheckConstraint, Column, DateTime, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.report import Report


class User(SQLModel, table=True):
    __tablename__ = "users"

    # roleは今回利用する student / teacher のみに制限
    __table_args__ = (
        CheckConstraint(
            "role IN ('student', 'teacher')",
            name="check_users_role",
        ),
    )

    id: int | None = Field(
        default=None,
        sa_column=Column(BigInteger, primary_key=True, autoincrement=True),
    )
    name: str = Field(
        sa_column=Column(String(255), nullable=False),
    )
    email: str = Field(
        sa_column=Column(String(255), nullable=False, unique=True, index=True),
    )
    password_hash: str = Field(
        sa_column=Column(String(255), nullable=False),
    )
    role: str = Field(
        default="student",
        sa_column=Column(String(50), nullable=False, default="student"),
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, nullable=False, default=datetime.utcnow),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(
            DateTime,
            nullable=False,
            default=datetime.utcnow,
            onupdate=datetime.utcnow,
        ),
    )

    # User1人に対して複数のReportを紐づける
    reports: list["Report"] = Relationship(back_populates="user")
