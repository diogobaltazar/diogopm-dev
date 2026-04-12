# diogopm.dev

Personal website — About page and blog.

Domains: [diogopm.dev](https://diogopm.dev), [pereiramarques.dev](https://pereiramarques.dev)

---

## Stack

| Concern    | Choice                              |
|------------|-------------------------------------|
| Bundler    | Vite 5                              |
| Framework  | React 18 + TypeScript               |
| Styling    | Tailwind CSS v4                     |
| Animation  | Framer Motion                       |
| Routing    | React Router v6                     |
| Blog       | MDX files in `src/posts/`           |
| Hosting    | Cloudflare Pages (free tier)        |

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

The post is automatically picked up and listed at `/blog`. Slug is derived from the filename.

---

## GitHub configuration

The following was set programmatically via the `gh` CLI:

### Repository metadata

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

### Branch protection (main)

Applied via the GitHub API after the first push:

- No force pushes
- No branch deletion
- CI must pass before merge (`CI / build`)

```bash
gh api repos/diogobaltazar/diogopm-dev/branches/main/protection \
  --method PUT \
  --field enforce_admins=true \
  --field "required_status_checks[strict]=false" \
  --field "required_status_checks[contexts][]=CI / build" \
  --field "required_pull_request_reviews=null" \
  --field "restrictions=null" \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

### GitHub Actions

| Workflow | File | Trigger | What it does |
|----------|------|---------|--------------|
| CI | `.github/workflows/ci.yml` | Push & PR to `main` | `npm ci && npm run build` |
| Deploy | `.github/workflows/deploy.yml` | Push to `main` | Build + deploy to Cloudflare Pages |

The deploy workflow uses `cloudflare/pages-action@v1` and posts deployment URLs as commit statuses.

**Required secrets** — add these in GitHub → Settings → Secrets → Actions:

| Secret | Where to find it |
|--------|-----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token (use the *Edit Cloudflare Workers* template or create one with Pages write permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar on any page |

---

## Cloudflare Pages setup

One-time manual step (done from Cloudflare, not GitHub):

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Connect to Git → select `diogobaltazar/diogopm-dev`
3. Set **Build command**: `npm run build`
4. Set **Build output directory**: `dist`
5. Deploy

Then add both custom domains under the project's **Custom Domains** tab:
- `diogopm.dev`
- `pereiramarques.dev`

Cloudflare will issue TLS certificates and configure DNS automatically if your domains are on Cloudflare nameservers.

After this one-time setup, all subsequent deployments happen automatically via the GitHub Actions deploy workflow on every push to `main`.

---

## Commit signing

Commits are signed with an SSH key. Configured in `.git/config`:

```
[user]
  signingkey = /Users/pereid22/.ssh/gh_diogobaltazar_signing.pub
[gpg]
  format = ssh
[commit]
  gpgsign = true
```
