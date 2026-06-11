# Stage 1: build PDF from LaTeX source
FROM ghcr.io/tectonic-typesetting/tectonic:latest AS tex
WORKDIR /cv
COPY cv/cv.tex .
RUN tectonic cv.tex

# Stage 2: Python API
FROM python:3.12-slim

WORKDIR /app
COPY src/api/pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/api/main.py src/api/auth.py src/api/cv.py src/api/store.py ./
COPY --from=tex /cv/cv.pdf /cv/cv.pdf

ENV CV_PDF_PATH=/cv/cv.pdf
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
