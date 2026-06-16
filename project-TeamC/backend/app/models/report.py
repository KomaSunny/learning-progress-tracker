from datetime import datetime

from app.models.user import User
from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlmodel import Field, Relationship, SQLModel


class Report(SQLModel, table=True):
    __tablename__ = "reports"

    # DB設計.mdに合わせて、DB保存時にも投稿種別・学習時間・理解度の値を制限
    __table_args__ = (
        CheckConstraint(
            "type IN ('daily_report', 'progress_report')",
            name="check_reports_type",
        ),
        CheckConstraint(
            "study_minutes IS NULL OR study_minutes >= 0",
            name="check_reports_study_minutes",
        ),
        CheckConstraint(
            "understanding_level IS NULL OR understanding_level BETWEEN 1 AND 5",
            name="check_reports_understanding_level",
        ),
    )

    id: int | None = Field(
        default=None,
        sa_column=Column(BigInteger, primary_key=True, autoincrement=True),
    )
    user_id: int = Field(
        sa_column=Column(
            BigInteger,
            ForeignKey("users.id"),
            nullable=False,
            index=True,
        ),
    )
    type: str = Field(
        default="progress_report",
        sa_column=Column(
            String(50),
            nullable=False,
            default="progress_report",
        ),
    )
    title: str = Field(
        sa_column=Column(String(255), nullable=False),
    )
    content: str = Field(
        sa_column=Column(Text, nullable=False),
    )
    blockers: str | None = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
    )
    next_action: str | None = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
    )
    study_minutes: int | None = Field(
        default=None,
        sa_column=Column(Integer, nullable=True),
    )
    understanding_level: int | None = Field(
        default=None,
        sa_column=Column(Integer, nullable=True),
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, nullable=False, default=datetime.utcnow, index=True),
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

    # 投稿者名はreportsには保存せず、usersテーブルとのリレーションから取得
    user: User | None = Relationship(back_populates="reports")
