# API deployment

The site at `diogopm.dev` is a static SPA served from Cloudflare Pages. The CV PDF download is gated behind Auth0 login and served by a small FastAPI backend that lives at `api.diogopm.dev` and is co-hosted with `replicable.dev` on the same Hetzner box.

## Topology

```
Browser ── HTTPS ──▶ Cloudflare ──▶ Cloudflare Pages   (diogopm.dev)
                          │
                          └─ HTTP ─▶ Hetzner :8080 ──▶ docker compose
                                       (api.diogopm.dev)        ├─ diogopm-api    (FastAPI)
                                                                └─ diogopm-store  (Redis)
```

Cloudflare terminates TLS; the origin hop is plaintext on port 8080 (CF SSL mode: Flexible). The Hetzner box also runs the unrelated replicable stack on port 80; the two services do not share containers, networks, or volumes.

## Components

| Path | What it is |
|---|---|
| `src/web/` | Vite + React + TS site (Cloudflare Pages). Public except `/cv`. |
| `src/api/` | FastAPI service. Validates Auth0 JWTs, logs request to Redis, streams `cv.pdf`. |
| `cv/cv.tex` | LaTeX source. The Dockerfile rebuilds `cv.pdf` with tectonic on every deploy. |
| `compose.yml` | Two services: `api` (host 8080 → container 8000) and `store` (Redis, internal only). |
| `.github/workflows/deploy-api.yml` | Triggered by changes to `src/api/**`, `cv/**`, `compose.yml`, or itself. rsync → ssh → `docker compose up --build -d` → curl `/health`. |
| `.github/workflows/deploy.yml` | Existing Cloudflare Pages deploy for the website. Untouched. |

## Auth0

The `auth.replicablelabs.ai` tenant hosts both replicable and diogopm-dev. They share **only the tenant**; everything else is separate.

| Auth0 object | Identifier | Notes |
|---|---|---|
| API | `https://api.diogopm.dev` | Audience checked by `src/api/auth.py`. RS256. |
| SPA Application | client id set in CF Pages as `VITE_AUTH0_CLIENT_ID` | Type: SPA. Token endpoint auth method: None. |

The SPA application's URL allowlists must include:

| Field | Values |
|---|---|
| Allowed Callback URLs | `https://diogopm.dev`, `https://pereiramarques.dev`, `http://localhost:5173` |
| Allowed Logout URLs | same three |
| Allowed Web Origins | same three |

## Routing & DNS

| Host | Type | Target | Proxied |
|---|---|---|---|
| `diogopm.dev` | CNAME | `diogopm-dev.pages.dev` | yes |
| `pereiramarques.dev` | CNAME | `diogopm-dev.pages.dev` | yes |
| `api.diogopm.dev` | A | `178.105.28.85` (Hetzner) | yes |

Zone IDs (Cloudflare):

| Zone | ID |
|---|---|
| `diogopm.dev` | `69ce5da4d75b2bb35a79e54080460927` |
| `pereiramarques.dev` | `8483d1a46bb2041c583094fddfc55cf7` |

Cloudflare SSL/TLS mode for `diogopm.dev`: **Flexible** (origin is plain HTTP on 8080). Don't change to Full unless you put a real cert on the origin first.

## Hetzner

Same host as replicable: `178.105.28.85`. Provisioning is documented in [`replicable/docs/hetzner-setup.md`](https://github.com/replicablelabs/replicable/blob/master/docs/hetzner-setup.md).

This API lives at `/opt/diogopm-dev/` on the host. It uses port **8080**; replicable uses **80**. UFW must allow `8080/tcp` (Cloudflare proxy IPs only is the tighter form; `0.0.0.0/0` is acceptable since CF still rejects non-CF traffic at the edge once the hostname is proxied).

The Redis volume `store-data` persists CV request logs across deploys.

## Configuration

### GitHub repository secrets — `diogobaltazar/diogopm-dev`

| Secret | Source |
|---|---|
| `DEPLOY_HOST` | `178.105.28.85` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | private key from `~/.ssh/replicable_deploy` (reused across both repos) |
| `AUTH0_DOMAIN` | `auth.replicablelabs.ai` |
| `AUTH0_AUDIENCE` | `https://api.diogopm.dev` |
| `REDIS_PASSWORD` | new — `openssl rand -hex 32`. Distinct from replicable's. |
| `CLOUDFLARE_API_TOKEN` | pre-existing — used by the website Pages deploy. |
| `CLOUDFLARE_ACCOUNT_ID` | pre-existing — used by the website Pages deploy. |

Inspect with `gh secret list --repo diogobaltazar/diogopm-dev`.

### Cloudflare Pages env vars — `diogopm-dev` project

Set in **Production** and **Preview**:

| Var | Value |
|---|---|
| `VITE_AUTH0_DOMAIN` | `auth.replicablelabs.ai` |
| `VITE_AUTH0_CLIENT_ID` | the SPA application client id from Auth0 |
| `VITE_AUTH0_AUDIENCE` | `https://api.diogopm.dev` |
| `VITE_API_BASE` | `https://api.diogopm.dev` |

Pages does not pick these up retroactively — trigger a redeploy after editing them.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | none | Returns `{"status":"ok"}`. Used by the deploy workflow. |
| POST | `/cv/request` | Auth0 JWT (Bearer) | Body: `{"email": "..."}`. Logs `(sub, email, ts)` to Redis stream `cv:requests`, streams `cv.pdf` as `application/pdf` attachment. |

CORS allows `https://diogopm.dev` and `https://pereiramarques.dev`. JWKS is cached in-process for 10 minutes — restart the container to invalidate.

## Operations

### Deploy

Push to `master` with changes touching `src/api/**`, `cv/**`, `compose.yml`, or `.github/workflows/deploy-api.yml` triggers `Deploy API`. The workflow rebuilds the Docker image (and therefore re-runs tectonic on `cv/cv.tex`), restarts the stack, and fails the run if `/health` doesn't return 200 within 8s.

To force a redeploy without code changes: **Actions → Deploy API → Run workflow**.

The website (`src/web/`) deploys independently via the existing Pages workflow. The two never block each other.

### Reading the CV request log

```bash
ssh -i ~/.ssh/replicable_deploy root@178.105.28.85
cd /opt/diogopm-dev
docker exec diogopm-store redis-cli -a "$(grep ^REDIS_PASSWORD .env | cut -d= -f2)" XRANGE cv:requests - +
```

### Tail logs

```bash
docker logs diogopm-api -f --tail 100
```

### Rebuild from scratch (after a `cv.tex` edit, no other changes)

The deploy workflow filter includes `cv/**`, so a normal push covers this. If you need to rebuild without a push:

```bash
ssh root@178.105.28.85 'cd /opt/diogopm-dev && docker compose build --no-cache api && docker compose up -d api'
```

### Rotate the Redis password

Generate a new value, update the GitHub secret, redeploy. The deploy workflow rewrites `/opt/diogopm-dev/.env` from secrets on every run, so the next deploy picks it up — `down --remove-orphans` then `up -d` brings the stack back with the new password on both ends.

```bash
NEW="$(openssl rand -hex 32)"
echo "$NEW" | gh secret set REDIS_PASSWORD --repo diogobaltazar/diogopm-dev
gh workflow run "Deploy API" --repo diogobaltazar/diogopm-dev
```

The Redis volume keeps the existing stream — only auth changes.

## Local development

The site runs against the production API by default (`VITE_API_BASE` defaults to `https://api.diogopm.dev`). To run the API locally too:

```bash
cd src/api
pip install -e .
AUTH0_DOMAIN=auth.replicablelabs.ai \
AUTH0_AUDIENCE=https://api.diogopm.dev \
REDIS_URL=redis://localhost:6379 \
ALLOWED_ORIGINS=http://localhost:5173 \
CV_PDF_PATH=../../cv/cv.pdf \
uvicorn main:app --reload --port 8080
```

Frontend:

```bash
echo 'VITE_API_BASE=http://localhost:8080' > .env.local
npm run dev
```
