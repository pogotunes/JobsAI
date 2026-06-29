# API Keys — Free Tier Limits & Safety Guide

⚠️ **SECURITY: Never share API keys. Never show keys in screenshots or commit them to git.**

---

## Free Tier Limits (Daily)

| Provider | Model | Free Limit | Best For |
|----------|-------|------------|----------|
| Groq | Llama 3.1 8B Instant | 14,400 req/day | Speed, chatbot |
| NVIDIA NIM | Llama 3.1 8B Instruct | 1,000 req/day (generous credits) | High quality, writing |
| Gemini | Gemini 1.5 Flash | 1,500 req/day | Quality summaries |
| OpenRouter | Llama 3.1 8B Free | ~50 req/day | Backup |
| Cloudflare | Llama 3.1 8B | 10,000 neurons/day | Reliable backup |
| HuggingFace | Mistral 7B | Rate limited | Last resort |

**Total: Thousands of free AI calls per day — more than enough for ElectroBridge.**

---

## Fallback Order (in `providers.ts`)

1st: Groq (fastest, most generous)  
2nd: NVIDIA NIM (high quality, generous free credits)  
3rd: Gemini (most capable)  
4th: OpenRouter (good backup)  
5th: Cloudflare (reliable)  
6th: HuggingFace (always available, slowest)

If any provider fails → automatically tries next in chain.

---

## How to Get New API Keys

### Groq (Recommended — start here)
1. Go to [console.groq.com](https://console.groq.com) → Login
2. API Keys → Create New Key
3. Name: `electrobridge-prod`
4. Copy key → set as `GROQ_API_KEY`

### NVIDIA NIM
1. Go to [build.nvidia.com](https://build.nvidia.com) → Sign in with NVIDIA account
2. Click "API Keys" in the top right
3. Generate a new key → starts with `nvapi-`
4. Copy → set as `NVIDIA_NIM_API_KEY`

### Gemini
1. Go to [aistudio.google.com](https://aistudio.google.com) → Login
2. Get API Key → Create in new project named "electrobridge"
3. Copy → set as `GEMINI_API_KEY`

### OpenRouter
1. Go to [openrouter.ai](https://openrouter.ai) → Login
2. Keys → Create Key named "electrobridge"
3. Copy → set as `OPENROUTER_API_KEY`

### Cloudflare Workers AI
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Login
2. My Profile → API Tokens → Create Token
3. Template: "Workers AI Read"
4. Copy Account ID from dashboard sidebar
5. Set `CLOUDFLARE_AI_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`

### HuggingFace
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. New Token → Name: "electrobridge" → Role: Read
3. Copy → set as `HUGGINGFACE_API_KEY`

---

## .env.local Template

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026

# AI Providers
GROQ_API_KEY=
NVIDIA_NIM_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
CLOUDFLARE_AI_TOKEN=
CLOUDFLARE_ACCOUNT_ID=

# Optional (email digest via Resend)
RESEND_API_KEY=
```

---

## Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com) → ElectroBridge project
2. Settings → Environment Variables
3. For each key: add Name and Value, tick **Production + Preview + Development**
4. Redeploy

---

## AI Feature → Provider Mapping

| Feature | Primary | Fallback |
|---------|---------|----------|
| Chatbot | Groq (fast responses) | Gemini |
| Opportunity Summarizer | Gemini (quality) | Groq |
| News Filter | Groq (speed) | Cloudflare |
| Smart Search | Groq (fast) | Gemini |
| Newsletter | NVIDIA NIM (advanced writing) | Gemini |
| Expiry Checker | Cloudflare (save credits) | HuggingFace |

---

## Cost Monitoring

All AI calls are logged to `ai_usage_log` table in Supabase.
Admin panel → AI Usage tab shows:
- Provider breakdown chart
- Feature usage chart
- Recent call log

If any provider is near limit, update `PROVIDER_ORDER` array in `providers.ts`.
