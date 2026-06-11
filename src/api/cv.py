"""CV endpoints — version metadata and gated PDF download."""

import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr

from auth import require_user
from store import append_cv_request

CV_PDF_PATH = Path(os.environ.get("CV_PDF_PATH", "/cv/cv.pdf"))
CV_VERSION_FILE = Path(os.environ.get("CV_VERSION_FILE", "/etc/cv-version"))


def _cv_version() -> str:
    try:
        return CV_VERSION_FILE.read_text().strip() or "0.0.0"
    except FileNotFoundError:
        return "0.0.0"


router = APIRouter(prefix="/cv")


class CvRequest(BaseModel):
    email: EmailStr


def _pdf_chunks(path: Path, chunk_size: int = 64 * 1024):
    with open(path, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk


@router.get("/version")
async def cv_version() -> dict[str, str]:
    return {"version": _cv_version()}


@router.post("/request")
async def request_cv(
    body: CvRequest,
    user: dict = Depends(require_user),
) -> StreamingResponse:
    if not CV_PDF_PATH.is_file():
        raise HTTPException(status_code=500, detail="CV file not found")

    version = _cv_version()
    ts = datetime.now(timezone.utc).isoformat()
    await append_cv_request(
        sub=user.get("sub", ""), email=body.email, ts=ts, version=version,
    )

    return StreamingResponse(
        _pdf_chunks(CV_PDF_PATH),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="diogo-pereira-marques-cv-v{version}.pdf"',
            "X-CV-Version": version,
            "Access-Control-Expose-Headers": "X-CV-Version, Content-Disposition",
        },
    )
