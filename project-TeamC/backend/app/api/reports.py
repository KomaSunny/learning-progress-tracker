from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])


dummy_reports = [
    {
        "id": 1,
        "user_id": 1,
        "user_name": "生徒ユーザー",
        "title": "Next.jsの学習",
        "content": "App Routerについて学習しました。",
        "next_action": "認証まわりを復習する",
        "study_minutes": 90,
        "understanding_level": 3,
    },
    {
        "id": 2,
        "user_id": 3,
        "user_name": "別の生徒",
        "title": "Pythonの学習",
        "content": "FastAPIのルーティングを確認しました。",
        "next_action": "JWT認証を復習する",
        "study_minutes": 60,
        "understanding_level": 4,
    },
]


@router.get("", response_model=list[ReportResponse])
def get_reports(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "teacher":
        return dummy_reports

    return [
        report
        for report in dummy_reports
        if report["user_id"] == current_user["id"]
    ]


@router.post("", response_model=ReportResponse)
def create_report(
    request: ReportCreate,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="講師ユーザーは投稿を作成できません",
        )

    new_report = {
        "id": len(dummy_reports) + 1,
        "user_id": current_user["id"],
        "user_name": current_user["name"],
        **request.model_dump(),
    }

    dummy_reports.append(new_report)

    return new_report


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
):
    report = find_report(report_id)

    if current_user["role"] == "teacher":
        return report

    if report["user_id"] != current_user["id"]:
        raise_not_found()

    return report


@router.put("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    request: ReportUpdate,
    current_user: dict = Depends(get_current_user),
):
    report = find_report(report_id)

    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="講師ユーザーは投稿を更新できません",
        )

    if report["user_id"] != current_user["id"]:
        raise_not_found()

    report.update(request.model_dump())

    return report


@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: dict = Depends(get_current_user),
):
    report = find_report(report_id)

    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="講師ユーザーは投稿を削除できません",
        )

    if report["user_id"] != current_user["id"]:
        raise_not_found()

    dummy_reports.remove(report)

    return {"message": "Deleted"}


def find_report(report_id: int):
    for report in dummy_reports:
        if report["id"] == report_id:
            return report

    raise_not_found()


def raise_not_found():
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="投稿が見つかりません",
    )