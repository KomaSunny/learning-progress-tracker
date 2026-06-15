from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.crud import report as report_crud
from app.db.session import get_session
from app.dependencies import get_current_user
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])


# GET /reports
# API設計.md: roleに応じて投稿一覧を取得
# studentは自分の投稿のみ、teacherは生徒全員分の投稿を取得
@router.get("", response_model=list[ReportResponse])
def get_reports(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if current_user["role"] == "teacher":
        reports = report_crud.get_reports_for_teacher(session)
    else:
        reports = report_crud.get_reports_for_student(
            session,
            user_id=current_user["id"],
        )

    return [to_report_response(report) for report in reports]


# POST /reports
# API設計.md: studentのみ投稿作成可能。teacherは403 Forbidden。
# userIdはリクエストボディでは受け取らず、JWTから取得したログイン中ユーザーIDを使用
@router.post("", response_model=ReportResponse)
def create_report(
    request: ReportCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if current_user["role"] != "student":
        raise_forbidden()

    report = report_crud.create_report(
        session,
        user_id=current_user["id"],
        request=request,
    )
    return to_report_response(report)


# GET /reports/{id}
# API設計.md: studentは自分の投稿のみ、teacherは生徒全員分の投稿詳細を取得可能。
# studentが他人の投稿を取得しようとした場合は、存在有無を知らせないため404を返す。
@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    report = report_crud.get_report_by_id(session, report_id)

    if report is None:
        raise_not_found()

    if current_user["role"] == "teacher":
        return to_report_response(report)

    if report.user_id != current_user["id"]:
        raise_not_found()

    return to_report_response(report)


# PUT /reports/{id}
# API設計.md: studentのみ自分の投稿を更新可能。teacherは403 Forbidden。
# studentが他人の投稿を更新しようとした場合は404を返す。
@router.put("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    request: ReportUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if current_user["role"] != "student":
        raise_forbidden()

    report = report_crud.get_report_by_id(session, report_id)

    if report is None or report.user_id != current_user["id"]:
        raise_not_found()

    updated_report = report_crud.update_report(session, report, request)
    return to_report_response(updated_report)


# DELETE /reports/{id}
# API設計.md: studentのみ自分の投稿を削除可能。teacherは403 Forbidden。
# studentが他人の投稿を削除しようとした場合は404を返す。
@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if current_user["role"] != "student":
        raise_forbidden()

    report = report_crud.get_report_by_id(session, report_id)

    if report is None or report.user_id != current_user["id"]:
        raise_not_found()

    report_crud.delete_report(session, report)
    return {"message": "Report deleted"}


def to_report_response(report: Report) -> ReportResponse:
    # API設計.mdのレスポンス例に合わせて、DBモデルのsnake_caseをcamelCaseに変換
    # userNameはreportsテーブルには保存せず、usersテーブルとのリレーションから取得
    return ReportResponse(
        id=report.id,
        userId=report.user_id,
        userName=report.user.name if report.user else "",
        type=report.type,
        title=report.title,
        content=report.content,
        blockers=report.blockers,
        nextAction=report.next_action,
        studyMinutes=report.study_minutes,
        understandingLevel=report.understanding_level,
        createdAt=report.created_at,
        updatedAt=report.updated_at,
    )


def raise_forbidden():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="この操作はできません",
    )


def raise_not_found():
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="投稿が見つかりません",
    )