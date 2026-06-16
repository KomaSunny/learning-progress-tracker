from app.models.report import Report
from app.schemas.report import ReportCreate, ReportUpdate
from sqlalchemy.orm import selectinload
from sqlmodel import Session, desc, select


def get_reports_for_teacher(session: Session) -> list[Report]:
    statement = (
        select(Report)
        .options(selectinload(Report.user))
        .order_by(desc(Report.created_at))
    )
    return list(session.exec(statement).all())


def get_reports_for_student(session: Session, user_id: int) -> list[Report]:
    statement = (
        select(Report)
        .options(selectinload(Report.user))
        .where(Report.user_id == user_id)
        .order_by(desc(Report.created_at))
    )
    return list(session.exec(statement).all())


def get_report_by_id(session: Session, report_id: int) -> Report | None:
    statement = (
        select(Report).options(selectinload(Report.user)).where(Report.id == report_id)
    )
    return session.exec(statement).first()


def create_report(session: Session, user_id: int, request: ReportCreate) -> Report:
    report = Report(
        user_id=user_id,
        type=request.type,
        title=request.title,
        content=request.content,
        blockers=request.blockers,
        next_action=request.nextAction,
        study_minutes=request.studyMinutes,
        understanding_level=request.understandingLevel,
    )
    session.add(report)
    session.commit()
    session.refresh(report)

    created_report = get_report_by_id(session, report.id)
    if created_report is None:
        raise RuntimeError("Created report was not found")

    return created_report


def update_report(session: Session, report: Report, request: ReportUpdate) -> Report:
    report.type = request.type
    report.title = request.title
    report.content = request.content
    report.blockers = request.blockers
    report.next_action = request.nextAction
    report.study_minutes = request.studyMinutes
    report.understanding_level = request.understandingLevel

    session.add(report)
    session.commit()
    session.refresh(report)

    updated_report = get_report_by_id(session, report.id)
    if updated_report is None:
        raise RuntimeError("Updated report was not found")

    return updated_report


def delete_report(session: Session, report: Report) -> None:
    session.delete(report)
    session.commit()
