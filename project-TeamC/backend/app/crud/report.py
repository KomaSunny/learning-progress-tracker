from sqlmodel import Session, desc, select

from app.models.report import Report
from app.schemas.report import ReportCreate, ReportUpdate


def get_reports_for_teacher(session: Session) -> list[Report]:
    statement = select(Report).order_by(desc(Report.created_at))
    return list(session.exec(statement).all())


def get_reports_for_student(session: Session, user_id: int) -> list[Report]:
    statement = (
        select(Report)
        .where(Report.user_id == user_id)
        .order_by(desc(Report.created_at))
    )
    return list(session.exec(statement).all())


def get_report_by_id(session: Session, report_id: int) -> Report | None:
    return session.get(Report, report_id)


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
    return report


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
    return report


def delete_report(session: Session, report: Report) -> None:
    session.delete(report)
    session.commit()