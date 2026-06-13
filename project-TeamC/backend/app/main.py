from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.reports import router as reports_router

app = FastAPI(title="Learning Progress API")

app.include_router(auth_router)
app.include_router(reports_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}