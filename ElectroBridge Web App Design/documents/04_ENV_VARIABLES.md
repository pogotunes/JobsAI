# Environment Variables

## Frontend (Netlify — Next.js)

| Variable | Required | Status |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✅ Set — `https://jbqjipwanfsxyqkfrrpx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✅ Set (anon key) |
| `NEXT_PUBLIC_SITE_URL` | | ✅ Set — `https://electrobridge.netlify.app` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | | ✅ Set — `electrobridge2026` |

## Backend (Render)

Set via Render API (`PUT /v1/services/{id}/env-vars/{key}`) on service `electrobridge-api` (`srv-d91ojvi8qa3s73b00na0`).

| Variable | Required | Status |
|----------|----------|--------|
| `SUPABASE_URL` | ✓ | ✅ Set — `https://jbqjipwanfsxyqkfrrpx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✅ Set (service role JWT) |
| `NEON_DATABASE_URL` | ✓ | ✅ Set — `neondb_owner` @ `ep-shy-resonance-atwa1cr9-pooler` (Neon project: `raspy-mouse-45454356`) |
| `RESEND_API_KEY` | ✓ | ✅ Set |
| `FROM_EMAIL` | ✓ | ✅ Set — `hello@electrobridge.com` |
| `CRON_SECRET` | ✓ | ✅ Set |
| `GROQ_API_KEY` | ✓ | ❌ **Not set** — needs user to provide |
| `GEMINI_API_KEY` | ✓ | ❌ **Not set** — needs user to provide |
| `OPENROUTER_API_KEY` | | ❌ Not set (optional) |
| `TELEGRAM_BOT_TOKEN` | | ❌ Not set (optional) |
| `TELEGRAM_CHANNEL_ID` | | ❌ Not set (optional) |
| `NODE_ENV` | | ✅ Set — `production` |
| `LOG_LEVEL` | | ✅ Set — `info` |

## Deployment Configuration Complete (2026-06-30)

All services are linked, migrations applied, and env vars set. Missing AI keys (`GROQ_API_KEY`, `GEMINI_API_KEY`) need to be provided by user.

| Service | Status | Key Details |
|---------|--------|-------------|
| Supabase | ✅ Linked + Migrations pushed | Project: `ElectroBridge` (`jbqjipwanfsxyqkfrrpx`), Singapore region |
| Neon | ✅ Database exists | Project: `electrobridge` (`raspy-mouse-45454356`), us-east-1 |
| Netlify | ✅ Linked + Env vars set | Site: `electrobridge` (`8d7c536f`), URL: `https://electrobridge.netlify.app` |
| Render | ✅ Service exists + Env vars set | Service: `electrobridge-api` (`srv-d91ojvi8qa3s73b00na0`), URL: `https://electrobridge-api.onrender.com` |
| Resend | ✅ Key configured in Render | `FROM_EMAIL: hello@electrobridge.com` |

## Local Development (.env.local)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
NEON_DATABASE_URL=your_neon_connection_string

# Email
RESEND_API_KEY=re_your_key
FROM_EMAIL=hello@electrobridge.com

# AI
GROQ_API_KEY=gsk_your_key
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key

# Cron
CRON_SECRET=your_cron_secret

# Admin
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@your_channel

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Security Notes

- NEVER commit `.env.local` or any `.env` file to version control
- Rotate keys regularly
- Use separate keys for development and production
- Supabase anon key is public (safe for client-side usage)
- Service role key must NEVER be exposed client-side
- API keys should be restricted to specific origins where possible
