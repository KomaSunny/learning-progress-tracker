from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])


dummy_reports = [
    {
        "id": 1,
        "userId": 1,
        "userName": "生徒ユーザー",
        "title": "Next.jsの学習",
        "content": "App Routerについて学習しました。",
        "nextAction": "認証まわりを整理する",
        "studyMinutes": 90,
        "understandingLevel": 3,
        "createdAt": datetime(2026, 6, 11, 9, 0, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2026, 6, 11, 9, 0, 0, tzinfo=timezone.utc),
    },
    {
        "id": 2,
        "userId": 3,
        "userName": "別の生徒",
        "title": "Pythonの学習",
        "content": "FastAPIのルーティングを確認しました。",
        "nextAction": "JWT認証を実装する",
        "studyMinutes": 60,
        "understandingLevel": 4,
        "createdAt": datetime(2026, 6, 11, 10, 0, 0, tzinfo=timezone.utc),
        "updatedAt": datetime(2026, 6, 11, 10, 0, 0, tzinfo=timezone.utc),
    },
]


@router.get("", response_model=list[ReportResponse])
def get_reports(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "teacher":
        return dummy_reports

    return [
        report
        for report in dummy_reports
        if report["userId"] == current_user["id"]
    ]


@router.post("", response_model=ReportResponse)
def create_report(
    request: ReportCreate,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="この操作はできません",
        )

    now = datetime.now(timezone.utc)

    new_report = {
        "id": len(dummy_reports) + 1,
        "userId": current_user["id"],
        "userName": current_user["name"],
        **request.model_dump(),
        "createdAt": now,
        "updatedAt": now,
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

    if report["userId"] != current_user["id"]:
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
            detail="この操作はできません",
        )

    if report["userId"] != current_user["id"]:
        raise_not_found()

    report.update(request.model_dump())
    report["updatedAt"] = datetime.now(timezone.utc)

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
            detail="この操作はできません",
        )

    if report["userId"] != current_user["id"]:
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