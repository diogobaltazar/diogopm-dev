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

Applied via the GitHub REST API:

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
  "enforce_admins": true,
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
- `CI / build` must pass before any merge

### 6. Cloudflare Pages — project creation

Created via the Cloudflare API (the project did not exist beforehand):

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<account-id>/pages/projects" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"diogopm-dev","production_branch":"main"}'
```

### 7. Cloudflare Pages — custom domains

Both domains attached via the Cloudflare API:

```bash
for domain in diogopm.dev pereiramarques.dev; do
  curl -X POST \
    "https://api.cloudflare.com/client/v4/accounts/<account-id>/pages/projects/diogopm-dev/domains" \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$domain\"}"
done
```

Cloudflare provisions TLS certificates automatically (Google Trust Services). DNS is managed by Cloudflare nameservers.

---

## Deployment flow

Every push to `main`:

1. GitHub Actions runs `CI` (build check) and `Deploy` in parallel
2. `Deploy` builds the site and uploads `dist/` to Cloudflare Pages via Wrangler
3. Cloudflare serves the new version globally within seconds

No manual steps required after a push.
