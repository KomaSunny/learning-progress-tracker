from pydantic import BaseModel


class ReportBase(BaseModel):
    title: str
    content: str
    next_action: str | None = None
    study_minutes: int
    understanding_level: int


class ReportCreate(ReportBase):
    pass


class ReportUpdate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    user_id: int
    user_name: str