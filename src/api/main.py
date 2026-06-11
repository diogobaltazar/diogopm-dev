"""FastAPI application for diogopm.dev — serves CV to authenticated users."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cv import router as cv_router

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173")


def create_app() -> FastAPI:
    application = FastAPI(docs_url=None, redoc_url=None)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in ALLOWED_ORIGINS.split(",")],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    application.include_router(cv_router)

    @application.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return application


app = create_app()
