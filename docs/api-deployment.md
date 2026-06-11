# API deployment

The site at `diogopm.dev` is a static SPA served from Cloudflare Pages. The CV PDF download is gated behind Auth0 login and served by a small FastAPI backend at `api.diogopm.dev`, co-hosted with `replicable.dev` on a single Hetzner box. The two stacks are isolated at every layer (compose project, ports, networks, volumes, Auth0 application).

## Topology

```
                     ┌─ HTTPS ─▶ Cloudflare Pages   (diogopm.dev, pereiramarques.dev)
                     │              git-built from src/web/
Browser ──▶ Cloudflare
                     │           ┌─ http://178.105.28.85:8080 ─▶ docker compose
                     └─ HTTPS ──▶│                                  ├─ diogopm-api    (FastAPI :8000 → host :8080)
                                 │   (origin port override 8080,    └─ diogopm-store  (Redis, internal only)
                                 │    SSL mode Flexible)
```

- Cloudflare terminates TLS for the browser. The CF↔origin hop is plain HTTP on port 8080 (SSL mode: Flexible).
- The Hetzner box also runs the unrelated replicable stack on port 80. The two compose projects share the host but nothing else.

## Components in this repo

| Path | What it is |
|---|---|
| `src/web/` | Vite + React + TS site, built and deployed by Cloudflare Pages. Public except `/cv`. |
| `src/api/` | FastAPI service. Validates Auth0 JWTs, logs `(sub, email, ts)` to Redis stream `cv:requests`, streams `cv.pdf`. |
| `cv/cv.tex` | LaTeX source. The Dockerfile rebuilds `cv.pdf` with tectonic on every build, so the deployed asset is always pinned to the committed source. |
| `cv/cv.pdf` | A pre-built copy for local convenience. Not used by the deployed image — the build always re-runs tectonic. |
| `compose.yml` | Two services: `api` (host `8080:8000`) and `store` (Redis, no published port). Repo-root file. |
| `.github/workflows/deploy-api.yml` | API deploy. Triggered by changes to `src/api/**`, `cv/**`, `compose.yml`, or the workflow itself. rsync → ssh → `docker compose up --build -d` → curl `/health`. |
| `.github/workflows/deploy.yml` | Existing Cloudflare Pages deploy for the website. Untouched by the API work. |
| `.github/workflows/ci.yml` | Existing CI. Untouched. |

## Auth0

The `auth.replicablelabs.ai` Auth0 tenant hosts both replicable and diogopm-dev. They share **only the tenant** — every other Auth0 object is separate.

| Auth0 object | Identifier | Notes |
|---|---|---|
| API | audience `https://api.diogopm.dev` | RS256. The audience is an opaque string, not a URL that needs to resolve. |
| SPA Application | client id set in CF Pages as `VITE_AUTH0_CLIENT_ID` | **Application Type: Single Page Application.** Token Endpoint Auth Method: None. |

The SPA application's URL allowlists must include all three of these on each list:

| Field | Values |
|---|---|
| Allowed Callback URLs | `https://diogopm.dev`, `https://pereiramarques.dev`, `http://localhost:5173` |
| Allowed Logout URLs | same three |
| Allowed Web Origins | same three |

Tokens issued for replicable's audience are rejected by the diogopm-dev API and vice versa — the validator in `src/api/auth.py` checks `aud == AUTH0_AUDIENCE` and `iss == https://${AUTH0_DOMAIN}/` on every request. Sharing the tenant gives users single-sign-on between the two products without coupling their authorization scopes.

## DNS

| Host | Type | Target | Proxied | Zone |
|---|---|---|---|---|
| `diogopm.dev` | CNAME | `diogopm-dev.pages.dev` | yes | `69ce5da4d75b2bb35a79e54080460927` |
| `pereiramarques.dev` | CNAME | `diogopm-dev.pages.dev` | yes | `8483d1a46bb2041c583094fddfc55cf7` |
| `api.diogopm.dev` | A | `178.105.28.85` (Hetzner) | yes | `69ce5da4d75b2bb35a79e54080460927` |

## Cloudflare configuration — the tricky bits

These two settings are zone-scoped (`diogopm.dev`) and were the source of every deploy-time failure:

### 1. SSL/TLS mode: **Flexible**

`Cloudflare → diogopm.dev → SSL/TLS → Overview → SSL/TLS encryption mode → Flexible`.

- **Full / Full (strict)**: CF requires HTTPS to the origin. Our origin speaks plain HTTP on 8080 → handshake fails → HTTP 525.
- **Flexible**: CF connects HTTP to the origin, serves HTTPS to the browser. Correct for this setup.

Trade-off: this is a **zone-wide** setting. The website at `diogopm.dev` is on Cloudflare Pages, which serves HTTPS regardless of zone mode, so Flexible doesn't break it. If a third origin on this zone ever speaks HTTPS natively, the proper fix is to terminate TLS on the origin (Caddy/nginx in front) and switch to Full — not to add a per-hostname rule, which only paid plans support.

### 2. Origin Rule: rewrite destination port to 8080

`Cloudflare → diogopm.dev → Rules → Overview → Create rule`.

| Field | Value |
|---|---|
| Rule name | `api.diogopm.dev origin port` |
| When incoming requests match | Custom filter expression |
| Field / Operator / Value | `Hostname` / `equals` / `api.diogopm.dev` |
| Then take action | **Set origin parameters → Destination Port → Rewrite to → `8080`** |

Leave Host Header, SNI, and DNS Record on **Preserve**.

Without this, CF dials origin port 80 (Flexible) or 443 (Full) — neither is our API. Symptom: HTTP 521 ("web server is down").

### Token requirements

The DNS record above was created via API with a token scoped to `Zone → DNS → Edit`. The Origin Rule and SSL/TLS mode require additional scopes (`Zone → Config Rules → Edit`, `Zone → Zone Settings → Edit`). The current `diogopm-dev-dns` token in `replicable/.env` cannot do these — they were created in the dashboard.

## Hetzner

Same host as replicable: `178.105.28.85`. Provisioning of the box itself is documented in [`replicable/docs/hetzner-setup.md`](https://github.com/replicablelabs/replicable/blob/master/docs/hetzner-setup.md). This API does not depend on anything in that document beyond Docker being installed.

| Concern | diogopm-dev API | replicable |
|---|---|---|
| Compose project dir | `/opt/diogopm-dev/` | `/opt/replicable/` |
| Container names | `diogopm-api`, `diogopm-store` | `replicable-*` |
| Volumes | `diogopm-dev_store-data` | `replicable_*` |
| Networks | own default | own default |
| Published ports | host 8080 | host 80, 5101, etc. |

Volumes are scoped by compose project name (the directory name), so even though both stacks have a `store-data` declaration in their compose files, Docker keeps them in separate named volumes. A `docker compose down -v` in `/opt/diogopm-dev/` will not touch replicable's data.

### Firewall

The host has UFW installed (from replicable's `provision.sh`) but `Status: inactive` — it's not filtering anything. Whether 8080 is ufw-allowed is therefore irrelevant. **The Hetzner Cloud Firewall is also off by default**, so 8080 is publicly reachable on `178.105.28.85` over the Hetzner network. This is fine because:

- Cloudflare proxies all production traffic.
- The API only does work after JWT validation — an unauthenticated direct hit to `http://178.105.28.85:8080/cv/request` returns 401.

If you ever enable UFW or a Hetzner Cloud Firewall, add `allow 8080/tcp` (ideally restricted to [Cloudflare's IP ranges](https://www.cloudflare.com/ips/)).

## Configuration

### GitHub repository secrets — `diogobaltazar/diogopm-dev`

| Secret | Source / value |
|---|---|
| `DEPLOY_HOST` | `178.105.28.85` |
| `DEPLOY_USER` | `root` |
| `DEPLOY_SSH_KEY` | private key from `~/.ssh/replicable_deploy` (the same key replicable uses; the public key is already in the host's `authorized_keys`) |
| `AUTH0_DOMAIN` | `auth.replicablelabs.ai` |
| `AUTH0_AUDIENCE` | `https://api.diogopm.dev` |
| `REDIS_PASSWORD` | new — `openssl rand -hex 32`. Distinct from replicable's. Lives nowhere else. |
| `CLOUDFLARE_API_TOKEN` | pre-existing — used by the **website** Pages deploy, not the API. |
| `CLOUDFLARE_ACCOUNT_ID` | pre-existing — used by the **website** Pages deploy, not the API. |

```bash
gh secret list --repo diogobaltazar/diogopm-dev
```

### Cloudflare Pages env vars — `diogopm-dev` project

Set under **Workers & Pages → diogopm-dev → Settings → Variables and Secrets**, in **both** Production and Preview tables:

| Var | Value | Why plaintext |
|---|---|---|
| `VITE_AUTH0_DOMAIN` | `auth.replicablelabs.ai` | All `VITE_*` vars are inlined into the JS bundle at build time; they're public regardless. |
| `VITE_AUTH0_CLIENT_ID` | the SPA app client id from Auth0 | same |
| `VITE_AUTH0_AUDIENCE` | `https://api.diogopm.dev` | same |
| `VITE_API_BASE` | `https://api.diogopm.dev` | same |

Pages does **not** rebuild automatically when env vars change. After editing them, manually trigger a build: **Deployments → Create deployment** (against the production branch).

### Local `.env` (the deploy host's, written by CI)

The Deploy API workflow writes `/opt/diogopm-dev/.env` on every run, sourced from GitHub secrets. This file is the only place secrets live on the host:

```
AUTH0_DOMAIN=auth.replicablelabs.ai
AUTH0_AUDIENCE=https://api.diogopm.dev
REDIS_PASSWORD=<from secret>
```

`.env` is gitignored locally (`.gitignore` excludes `.env` and `.env.*` except `.env.example`).

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | none | Returns `{"status":"ok"}`. Used by the deploy workflow's smoke test and the container `HEALTHCHECK`. |
| POST | `/cv/request` | Auth0 JWT (Bearer) | Body: `{"email": "..."}`. Logs `(sub, email, ts)` to Redis stream `cv:requests`. Returns the PDF as `application/pdf` with `Content-Disposition: attachment; filename="diogo-pereira-marques-cv.pdf"`. |

CORS allows `https://diogopm.dev` and `https://pereiramarques.dev` (set via `ALLOWED_ORIGINS` env, hardcoded in `compose.yml`). JWKS is cached in-process for 10 minutes — restart the container to invalidate (e.g. after rotating Auth0 keys).

## How the Docker image is built

The Dockerfile is single-stage. Tectonic ships static musl Linux binaries on its GitHub releases — they're downloaded directly into the runtime image. No registry pull required for the LaTeX toolchain.

```dockerfile
FROM python:3.12-slim
ARG TECTONIC_VERSION=0.16.9
RUN apt-get install curl ca-certificates \
 && curl -fsSL https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic@${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-x86_64-unknown-linux-musl.tar.gz | tar -xz -C /usr/local/bin tectonic \
 && apt-get purge curl
COPY cv/cv.tex /cv/cv.tex
RUN tectonic /cv/cv.tex && rm /cv/cv.tex   # PDF stays at /cv/cv.pdf
COPY src/api/pyproject.toml /app/
RUN pip install --no-cache-dir .
COPY src/api/*.py /app/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Why not the official `ghcr.io/tectonic-typesetting/tectonic` image?** The Hetzner host is logged into ghcr.io (for `replicablelabs/*` pulls), and that login interferes with the anonymous fallback. The pull fails with 403 Forbidden during the deploy. Pulling the binary direct from the GitHub release sidesteps the registry entirely. Trade-off: we have to bump `TECTONIC_VERSION` manually when we want a new release.

The build context must be the **repo root** (so the Dockerfile can see both `cv/cv.tex` and `src/api/`). `compose.yml` sets this with `context: .`.

## Deploy

### Normal flow

Push to `main` with changes touching `src/api/**`, `cv/**`, `compose.yml`, or `.github/workflows/deploy-api.yml` triggers `Deploy API`:

1. rsync the repo to `/opt/diogopm-dev/` on the Hetzner box.
2. Write `.env` from CI secrets.
3. `docker compose build --no-cache api` (re-runs tectonic on the current `cv.tex`).
4. `docker compose down --remove-orphans || true` then `docker compose up -d`.
5. Wait 8s, then `curl http://localhost:8080/health` from the host. Fails the run (and the deployment) if it doesn't return 200.

The website (`src/web/`) deploys independently via `deploy.yml` (Cloudflare Pages). The two never block each other; the API is only required by the gated `/cv` route.

### Forcing a redeploy without code changes

Actions → **Deploy API** → Run workflow → `main`. Or:

```bash
gh workflow run "Deploy API" --repo diogobaltazar/diogopm-dev
```

### Sequencing for breaking frontend changes

Frontend changes that depend on the API (e.g. wiring a new endpoint) should land **after** the API change is live. Two-commit pattern:

1. Push API-only commit. Wait for `Deploy API` green and `curl https://api.diogopm.dev/health` → 200.
2. Push the frontend commit. Pages picks it up.

Otherwise the website ships the new UI before the API is reachable, and there's a window where the gated route 5xx's. Pushed in one commit, both workflows run in parallel and that window is ~3 minutes.

## Operations

### Read the CV request log

```bash
ssh -i ~/.ssh/replicable_deploy root@178.105.28.85
cd /opt/diogopm-dev
docker exec diogopm-store redis-cli -a "$(grep ^REDIS_PASSWORD .env | cut -d= -f2)" XRANGE cv:requests - +
```

### Tail logs

```bash
ssh root@178.105.28.85 'docker logs diogopm-api -f --tail 100'
```

### Rebuild after a `cv.tex` edit (no other changes)

A push of just `cv/cv.tex` triggers `Deploy API` (the workflow's path filter includes `cv/**`). The image rebuild re-runs tectonic; the running container is replaced; the new PDF is served.

### Rotate the Redis password

The deploy workflow rewrites `/opt/diogopm-dev/.env` from secrets on every run, so updating the secret + redeploying is sufficient — both ends (the `--requirepass` on `redis-server` and the `REDIS_URL` for the API) move together:

```bash
NEW=$(openssl rand -hex 32)
echo "$NEW" | gh secret set REDIS_PASSWORD --repo diogobaltazar/diogopm-dev
gh workflow run "Deploy API" --repo diogobaltazar/diogopm-dev
```

The `store-data` volume keeps the existing `cv:requests` stream — only auth changes.

### Rotate the deploy SSH key

The same key (`~/.ssh/replicable_deploy`) authenticates both repo deploys. Rotating it is a host-level change (`authorized_keys` on `178.105.28.85`) — see `replicable/docs/hetzner-setup.md`. After the public key is in place on the host, update the `DEPLOY_SSH_KEY` secret on **both** repos.

### Restart without rebuild

```bash
ssh root@178.105.28.85 'cd /opt/diogopm-dev && docker compose restart api'
```

(Doesn't re-run tectonic. Use only when env or restart-cycle is the issue.)

## Local development

The site defaults to the production API (`VITE_API_BASE` defaults to `https://api.diogopm.dev` if unset, or whatever you set in Pages).

To run the API locally:

```bash
cd src/api
pip install -e .

# In one shell — Redis
docker run --rm -p 6379:6379 redis:7-alpine

# In another — the API
AUTH0_DOMAIN=auth.replicablelabs.ai \
AUTH0_AUDIENCE=https://api.diogopm.dev \
REDIS_URL=redis://localhost:6379 \
ALLOWED_ORIGINS=http://localhost:5173 \
CV_PDF_PATH=../../cv/cv.pdf \
uvicorn main:app --reload --port 8080
```

To point the SPA at the local API:

```bash
echo 'VITE_API_BASE=http://localhost:8080' > .env.local
npm run dev
```

You'll need a real Auth0 JWT to hit `/cv/request` — easiest is to log in via the deployed site and copy `getAccessTokenSilently()`'s output from the browser console.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `curl https://api.diogopm.dev/health` returns **521** | CF can't connect to the origin port. Either the Origin Rule isn't applied (CF dialing 80/443 instead of 8080), or the host firewall is dropping CF traffic. | Verify the Origin Rule is deployed on `diogopm.dev`. Test the origin directly: `curl http://178.105.28.85:8080/health`. |
| Returns **525** | Origin Rule is working (CF reaches 8080) but SSL handshake fails. CF is in Full / Full (strict) mode but origin is plain HTTP. | Set SSL/TLS mode to **Flexible** on the `diogopm.dev` zone. |
| Returns **502 / 504** | Container down or unhealthy. | `ssh root@178.105.28.85 'docker ps; docker logs diogopm-api --tail 100'`. |
| Returns **401** on `/cv/request` | JWT invalid: bad audience, bad issuer, expired, or signature key not in JWKS. | Check the SPA's `VITE_AUTH0_AUDIENCE` matches the API audience exactly. Restart the API container to flush the JWKS cache. |
| Returns **403 / CORS** error in the browser | Origin not in `ALLOWED_ORIGINS`. | Add it to the `ALLOWED_ORIGINS` env in `compose.yml` and redeploy. |
| Deploy API workflow fails at "Write env and deploy" with `failed to fetch oauth token … 403 Forbidden` for `ghcr.io/tectonic-typesetting/tectonic` | The host's existing ghcr login interferes with anonymous pulls. | Should not recur — the Dockerfile no longer pulls from ghcr. If a future change reintroduces a ghcr image, either authorize the existing token for that package or `docker logout ghcr.io` on the host before the pull. |
| Pages site doesn't pick up new `VITE_*` env vars | Pages doesn't auto-rebuild on env changes. | Trigger a manual deployment from the Pages dashboard. |
| `curl http://178.105.28.85:8080/health` from your laptop returns 200 but production still 521 | Origin is fine; CF config issue. | Re-check Origin Rule and SSL/TLS mode on the `diogopm.dev` zone. |
