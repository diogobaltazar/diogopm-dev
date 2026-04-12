# diogopm.dev

Personal website — About page and blog.

**Live:** [diogopm.dev](https://diogopm.dev) · [pereiramarques.dev](https://pereiramarques.dev) · [diogopm-dev.pages.dev](https://diogopm-dev.pages.dev)

---

## Stack

| Concern    | Choice                        |
|------------|-------------------------------|
| Bundler    | Vite 5                        |
| Framework  | React 18 + TypeScript         |
| Styling    | Tailwind CSS v4               |
| Animation  | Framer Motion                 |
| Routing    | React Router v6               |
| Blog       | MDX files in `src/posts/`     |
| Hosting    | Cloudflare Pages (free tier)  |

---

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Writing a blog post

Create a `.mdx` file in `src/posts/`:

```mdx
---
title: My Post Title
date: 2026-04-12
description: One-line summary shown in the post list.
---

Post body in Markdown here.
```

The post is automatically picked up, sorted by date, and listed at `/blog`. The slug is derived from the filename.

---

## Infrastructure setup (done — do not repeat)

Everything below was configured programmatically. It is recorded here for reference.

### 1. Commit signing

SSH signing configured locally in `.git/config`:

```
[user]
  name = diogobaltazar
  email = d.ogobaltazar+github@gmail.com
  signingkey = /Users/pereid22/.ssh/gh_diogobaltazar_signing.pub
[gpg]
  format = ssh
[commit]
  gpgsign = true
```

### 2. GitHub — repository metadata

```bash
gh repo edit diogobaltazar/diogopm-dev \
  --description "Personal website — About & Blog. diogopm.dev" \
  --homepage "https://diogopm.dev" \
  --add-topic personal-website \
  --add-topic react \
  --add-topic typescript \
  --add-topic blog \
  --add-topic cloudflare-pages
```

### 3. GitHub — Actions secrets

Set programmatically via the `gh` CLI:

```bash
echo "<token>" | gh secret set CLOUDFLARE_API_TOKEN --repo diogobaltazar/diogopm-dev
echo "<account-id>" | gh secret set CLOUDFLARE_ACCOUNT_ID --repo diogobaltazar/diogopm-dev
```

| Secret | Value source |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens (custom token: Account › Cloudflare Pages › Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | `13187ee3...` — visible in the Cloudflare dashboard URL |

### 4. GitHub — Actions workflows

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| CI | `.github/workflows/ci.yml` | Push & PR to `main` | `npm ci && npm run build` — must pass before merge |
| Deploy | `.github/workflows/deploy.yml` | Push to `main` | Build + deploy to Cloudflare Pages via `cloudflare/pages-action@v1` |

### 5. GitHub — branch protection (main)

Applied via the GitHub REST API (`enforce_admins: false` so the owner can push directly):

```bash
gh api repos/diogobaltazar/diogopm-dev/branches/main/protection \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": false,
    "contexts": ["CI / build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

Rules in effect:
- No force pushes
- No branch deletion
- `CI / build` must pass before any merge (PRs from others)

### 6. Cloudflare Pages — project creation

Created via the Cloudflare API (the project did not exist beforehand — `cloudflare/pages-action` requires a pre-existing project):

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<account-id>/pages/projects" \
  -H "Authorization: Bearer <pages-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"diogopm-dev","production_branch":"main"}'
```

### 7. Cloudflare Pages — custom domains

Both domains attached via the Cloudflare Pages API:

```bash
for domain in diogopm.dev pereiramarques.dev; do
  curl -X POST \
    "https://api.cloudflare.com/client/v4/accounts/<account-id>/pages/projects/diogopm-dev/domains" \
    -H "Authorization: Bearer <pages-token>" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$domain\"}"
done
```

### 8. Cloudflare DNS — CNAME records

The Pages domain attachment does not automatically create DNS records. Both zones had no records pointing to Pages, so CNAMEs were created via the DNS API (requires a separate token with **Zone › DNS › Edit** permission — named `diogopm-dev-dns`):

```bash
for zone_id in 69ce5da4d75b2bb35a79e54080460927 8483d1a46bb2041c583094fddfc55cf7; do
  curl -X POST \
    "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
    -H "Authorization: Bearer <dns-token>" \
    -H "Content-Type: application/json" \
    -d '{"type":"CNAME","name":"@","content":"diogopm-dev.pages.dev","proxied":true}'
done
```

| Zone | Zone ID |
|------|---------|
| `diogopm.dev` | `69ce5da4d75b2bb35a79e54080460927` |
| `pereiramarques.dev` | `8483d1a46bb2041c583094fddfc55cf7` |

With the proxied CNAME in place, Cloudflare completes HTTP validation and issues TLS certificates via Google Trust Services automatically.

**API tokens in use:**

| Token name | Permission | Used for |
|------------|-----------|---------|
| `diogopm-dev-deploy` | Account › Cloudflare Pages › Edit | GitHub Actions deployment |
| `diogopm-dev-dns` | Zone › DNS › Edit | Creating DNS records |

---

## Deployment flow

Every push to `main`:

1. GitHub Actions runs `CI` (build check) and `Deploy` in parallel
2. `Deploy` builds the site and uploads `dist/` to Cloudflare Pages via Wrangler
3. Cloudflare serves the new version globally within seconds

No manual steps required after a push.
