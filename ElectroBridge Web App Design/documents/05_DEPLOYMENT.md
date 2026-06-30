# Deployment

## Target Platform

| Component | Platform | Configuration |
|-----------|----------|--------------|
| Frontend | Netlify | Next.js App Router, ISR, SSR |
| Backend | Render | Express/Fastify API, Docker |
| Database | Supabase + Neon | PostgreSQL managed |
| Email | Resend | Transactional + newsletter |
| Domain | Netlify DNS | electrobridge.com |

## Frontend Deployment (Netlify)

### Build Settings
```
Base directory: frontend/
Build command: npm run build
Publish directory: frontend/.next
Node version: 20.x
```

### Netlify Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/api/:splat"
  status = 200
```

### Environment Variables
Set via Netlify CLI (all contexts):
- `NEXT_PUBLIC_SUPABASE_URL` — `https://jbqjipwanfsxyqkfrrpx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon JWT
- `NEXT_PUBLIC_SITE_URL` — `https://electrobridge.netlify.app`
- `NEXT_PUBLIC_ADMIN_PASSWORD` — `electrobridge2026`

## Backend Deployment (Render)

### Web Service (Already Deployed)
```
Name: electrobridge-api
ID: srv-d91ojvi8qa3s73b00na0
URL: https://electrobridge-api.onrender.com
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Health Check Path: /health
Repo: https://github.com/amitkr26/JobsAI
Root Dir: ElectroBridge Web App Design/backend
Region: Oregon (us-east)
Plan: Free
```

### Env Vars Set (2026-06-30)
Set via Render API (`PUT /v1/services/{id}/env-vars/{key}`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEON_DATABASE_URL`
- `RESEND_API_KEY`, `FROM_EMAIL`, `CRON_SECRET`
- `NODE_ENV=production`, `LOG_LEVEL=info`
- **Missing**: `GROQ_API_KEY`, `GEMINI_API_KEY` (needs user to provide)

### Cron Jobs (Render Cron)
```
Schedule 1: 0 6 * * * → /api/scrape?mode=all
Schedule 2: 0 12 * * * → /api/check-links
Schedule 3: 0 3 * * 0 → /api/send-digest
```

### Background Workers
```
Name: electrobridge-worker
Type: Background Worker
Command: npm run worker
```

## Database Setup (Complete)

### Supabase
- **Project**: `ElectroBridge` (ref: `jbqjipwanfsxyqkfrrpx`)
- **Region**: Southeast Asia (Singapore)
- **Status**: ✅ Linked via CLI, migrations pushed
- **Migrations applied**:
  - `20260630000001_base_schema.sql` — 11 tables (opportunities, news_articles, subscribers, user_profiles, saved_opportunities, applications, user_alerts, ai_usage_log, link_check_logs, opportunity_reports, suggestions)
  - `20260630000002_extensions.sql` — pgcrypto, slug auto-generation trigger
  - `20260630000003_rls_policies.sql` — RLS policies for all tables
- **Auth**: Email/password ready (not yet configured)

### Neon
- **Project**: `electrobridge` (id: `raspy-mouse-45454356`)
- **Region**: us-east-1 (AWS)
- **Branch**: `production` (primary)
- **Database**: `neondb`, Role: `neondb_owner`
- **Connection**: Pooled via `ep-shy-resonance-atwa1cr9-pooler`
- **Analytics schema**: Not yet applied

## CI/CD

### GitHub Actions
- On push to main: build + lint + test
- On PR: build + lint + typecheck
- On tag: deploy to production

### Branch Strategy
- `main` → production
- `develop` → staging
- `feature/*` → feature branches

## Vercel Migration Notes

Removed from legacy:
- `vercel.json` — replaced with Netlify config
- Vercel Edge Functions — replaced with Netlify Functions
- Vercel Cron — replaced with Render Cron
- Vercel-specific env vars — replaced with Netlify/Render equivalents

## Monitoring

- Netlify analytics for frontend
- Render dashboard for backend
- Supabase dashboard for database
- Plausible analytics for user tracking
- Sentry for error tracking (future)
