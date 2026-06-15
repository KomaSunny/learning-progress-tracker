from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ReportBase(BaseModel):
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