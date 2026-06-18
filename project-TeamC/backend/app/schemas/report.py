from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ReportBase(BaseModel):
    # API設計.mdに合わせて、リクエスト/レスポンスのJSON項目はcamelCaseで定義する。
    # DBモデル側ではsnake_caseを使用するため、API層で変換する。
    type: Literal["daily_report", "progress_report"] = "progress_report"
    title: str
    content: str
    blockers: str | None = None
    nextAction: str | None = None
    studyMinutes: int | None = Field(default=None, ge=0)
    understandingLevel: int | None = Field(default=None, ge=1, le=5)


class ReportCreate(ReportBase):
    pass


class ReportUpdate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    userId: int
    userName: str
    createdAt: datetime
    updatedAt: datetime


class ReportDeleteResponse(BaseModel):
    message: str
