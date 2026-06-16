from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.reports import router as reports_router
from app.api.users import router as users_router
from app.core.cors import register_cors
from app.core.exception_handlers import register_exception_handlers

app = FastAPI(title="Learning Progress API")

register_cors(app)
register_exception_handlers(app)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(reports_router)