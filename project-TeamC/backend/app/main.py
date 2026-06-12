from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlmodel import Session

from app.db.session import get_session

app = FastAPI(title="Learning Progress API")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def db_health_check(session: Session = Depends(get_session)):
    session.exec(text("SELECT 1"))
    return {"status": "ok", "db": "connected"}