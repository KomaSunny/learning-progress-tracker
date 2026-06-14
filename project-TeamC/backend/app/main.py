from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.reports import router as reports_router
from app.api.users import router as users_router
from app.api.health import router as health_router

app = FastAPI(title="Learning Progress API")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(reports_router)
app.include_router(health_router)

