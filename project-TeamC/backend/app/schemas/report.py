from datetime import datetime

from pydantic import BaseModel


class ReportBase(BaseModel):
    title: str
    content: str
    nextAction: str | None = None
    studyMinutes: int
    understandingLevel: int


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