FROM python:3.12-slim

ARG TECTONIC_VERSION=0.16.9
ARG TARGETARCH=amd64

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && case "$TARGETARCH" in \
         amd64) TECTONIC_TRIPLE=x86_64-unknown-linux-musl ;; \
         arm64) TECTONIC_TRIPLE=aarch64-unknown-linux-musl ;; \
         *) echo "unsupported arch: $TARGETARCH" >&2; exit 1 ;; \
       esac \
    && curl -fsSL "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-${TECTONIC_TRIPLE}.tar.gz" \
       | tar -xz -C /usr/local/bin tectonic \
    && tectonic --version \
    && apt-get purge -y curl && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /cv
COPY cv/cv.tex .
RUN tectonic cv.tex && rm cv.tex

WORKDIR /app
COPY src/api/pyproject.toml .
RUN pip install --no-cache-dir .

COPY src/api/main.py src/api/auth.py src/api/cv.py src/api/store.py ./

ENV CV_PDF_PATH=/cv/cv.pdf
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
