"""POST /cv/request — validate JWT, log to Redis, stream CV PDF."""

import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr

from auth import require_user
from store import append_cv_request

CV_PDF_PATH = Path(os.environ.get("CV_PDF_PATH", "/cv/cv.pdf"))

router = APIRouter(prefix="/cv")


class CvRequest(BaseModel):
    email: EmailStr


def _pdf_chunks(path: Path, chunk_size: int = 64 * 1024):
    with open(path, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk


@router.post("/request")
async def request_cv(
    body: CvRequest,
    user: dict = Depends(require_user),
) -> StreamingResponse:
    if not CV_PDF_PATH.is_file():
        raise HTTPException(status_code=500, detail="CV file not found")

    ts = datetime.now(timezone.utc).isoformat()
    await append_cv_request(sub=user.get("sub", ""), email=body.email, ts=ts)

    return StreamingResponse(
        _pdf_chunks(CV_PDF_PATH),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="diogo-pereira-marques-cv.pdf"',
        },
    )
