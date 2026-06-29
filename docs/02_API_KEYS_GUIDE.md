API Keys — Free Tier Limits & Safety Guide
⚠️ SECURITY: Apni API keys kisi ke saath share mat karo
Screenshots mein API keys kabhi mat dikhao
---
Free Tier Limits (Daily)
Provider	Model	Free Limit	Best For
Groq	Llama 3.1 8B Instant	14,400 req/day	Speed, chatbot
Gemini	Gemini 1.5 Flash	1,500 req/day	Quality summaries
OpenRouter	Llama 3.1 8B Free	~50 req/day free	Backup
Cloudflare	Llama 3.1 8B	10,000 neurons/day	Reliable backup
HuggingFace	Mistral 7B	Rate limited	Last resort
Total combined: Thousands of free AI calls per day — more than enough for ElectroBridge.
---
Fallback Order (in providers.ts)
```
1st: Groq        (fastest, most generous)
2nd: Gemini      (most capable)
3rd: OpenRouter  (good backup)
4th: Cloudflare  (reliable)
5th: HuggingFace (always available, slowest)
```
If Groq rate limit hit → automatically tries Gemini → then OpenRouter → etc.
---
New API Keys Kaise Banao (After Revoking Old Ones)
Groq (Recommended — start here)
console.groq.com → Login
API Keys → Create New Key
Name: "electrobridge-prod"
Copy key → .env.local mein daalo as GROQ_API_KEY
Gemini
aistudio.google.com → Login
Get API Key → Create new key in new project
Project name: "electrobridge"
Copy key → GEMINI_API_KEY
OpenRouter
openrouter.ai → Login
Keys → Create Key
Name: "electrobridge"
Copy → OPENROUTER_API_KEY
Cloudflare Workers AI
dash.cloudflare.com → Login
My Profile → API Tokens → Create Token
Template: "Workers AI Read"
Also note your Account ID (right sidebar on dashboard)
CLOUDFLARE_AI_TOKEN + CLOUDFLARE_ACCOUNT_ID
HuggingFace
huggingface.co → Settings → Access Tokens
New Token → Name: "electrobridge" → Role: Read
HUGGINGFACE_API_KEY
---
.env.local Template (Fill After Getting New Keys)
```bash
# Supabase (already have these)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin
ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026

# AI Providers (add new keys here)
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AQ...
OPENROUTER_API_KEY=sk-or-v1-...
HUGGINGFACE_API_KEY=hf_...
CLOUDFLARE_AI_TOKEN=cfut_...
CLOUDFLARE_ACCOUNT_ID=681565960522

# Optional (for email digest)
RESEND_API_KEY=re_...
```
---
Vercel Dashboard Mein Keys Kaise Add Karo
vercel.com → ElectroBridge project
Settings → Environment Variables
Har key ke liye:
Name: GROQ_API_KEY (exact name)
Value: gsk_... (exact key)
Environments: Production + Preview + Development (sab tick karo)
Save → Redeploy
---
AI Feature → Provider Mapping
Feature	Primary	Fallback
Chatbot	Groq (fast responses)	Gemini
Opportunity Summarizer	Gemini (quality)	Groq
News Filter	Groq (speed, volume)	Cloudflare
Smart Search	Groq (fast)	Gemini
Newsletter	Gemini (writing quality)	Groq
Expiry Checker	Cloudflare (save credits)	HuggingFace
---
Cost Monitoring
Supabase ai_usage_log table mein har AI call log hogi.
Admin panel pe chart dikhega — kaunsa provider kitna use ho raha hai.
Agar kisi provider ka limit near ho to:
Admin panel → AI Usage tab
Dekho kaunsa provider overloaded hai
providers.ts mein PROVIDER_ORDER array update karo