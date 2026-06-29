# ElectroBridge — Setup Guide (Non-Coder Friendly)
## Bina coding jaane platform launch karo — Step by Step

---

## STEP 1: Accounts Banao (Sabhi FREE)

### 1A. GitHub Account
1. github.com par jao
2. "Sign up" karo — free account banao
3. Username yaad rakh lo

### 1B. Supabase Account (Database)
1. supabase.com par jao
2. "Start your project" → GitHub se login karo
3. "New Project" banao
   - Name: `electrobridge`
   - Database Password: koi bhi strong password (NOTE KAR LO)
   - Region: Southeast Asia (Singapore) — India ke liye fastest
4. 2-3 min mein project ready ho jayega
5. Baad mein yahan se keys copy karo:
   - Settings → API → "Project URL"
   - Settings → API → "anon public" key
   - Settings → API → "service_role" key (SECRET RAKHO)

### 1C. Vercel Account (Deployment)
1. vercel.com par jao
2. "Sign Up" → GitHub se login karo

---

## STEP 2: Database Setup (Supabase)

Do not run raw SQL. Use Supabase migrations:

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
supabase db push
```

All tables will be created automatically:
- `opportunities` (JRF, PhD, Govt jobs, etc.)
- `news_articles` (electronics news with slug)
- `subscribers` (email list)
- `suggestions` (contact form)
- `ai_usage_log` (AI call logging)
- `saved_opportunities` (bookmarks, needs auth)

---

## STEP 3: OpenCode Mein Prompt Karna

OpenCode kholo → yeh paste karo:

```
I want you to work like Claude Code — use agentic loops, create files, run commands, and don't stop until the task is complete. Fix errors automatically.

I am building ElectroBridge. I will paste the build spec now.
```

Phir `docs/01_MASTER_PROMPT.md` ka poora content paste karo + yeh env vars:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026
```

---

## STEP 4: GitHub Par Code Daalo

```bash
cd electrobridge
git init
git add .
git commit -m "Initial ElectroBridge platform"
```

Phir GitHub par new repository banao → wahan ke commands paste karo.

---

## STEP 5: AI API Keys Lena Hai

6 AI providers use hote hain (sab free):

1. **Groq** (primary) → console.groq.com → API Key
2. **NVIDIA NIM** (high quality) → build.nvidia.com → API Key (nvapi-...)
3. **Gemini** (backup) → aistudio.google.com → API Key
4. **OpenRouter** → openrouter.ai → API Key
5. **Cloudflare** → dash.cloudflare.com → API Token + Account ID
6. **HuggingFace** → huggingface.co/settings/tokens

Details ke liye `docs/02_API_KEYS_GUIDE.md` padho.

---

## STEP 6: .env.local File Banao

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026
GROQ_API_KEY=
NVIDIA_NIM_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
CLOUDFLARE_AI_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

---

## STEP 7: Vercel Par Deploy Karo

1. vercel.com → "Add New Project" → GitHub se `electrobridge` select karo
2. **Important:** Root directory = `electrobridge/`
3. Environment Variables section mein saare .env.local wale add karo
4. "Deploy" karo
5. 2-3 minute mein live ho jayega

---

## STEP 8: Seed Data + Verify

Deploy ke baad browser mein jao:
```
https://tumhara-domain.vercel.app/api/seed
```

Isse opportunities database mein aa jayengi.

Admin panel:
```
https://tumhara-domain.vercel.app/admin
```

Password: `electrobridge2026`

Yahaan se:
- Nayi opportunities add karo (AI auto-fill bhi hai)
- AI Usage monitor karo
- News scrape trigger karo
- Subscribers dekhlo

---

## STEP 9: Weekly Maintenance

**Har hafte (30 min):**
1. Admin panel kholo
2. DRDO, ISRO, CSIR, IIT websites check karo
3. Nayi opportunities add karo
4. Expired ones mark karo
5. AI Usage tab mein provider limits check karo

**News automatic update hoti hai** — RSS feeds se.

Details: `docs/04_WEEKLY_MAINTENANCE.md`

---

## Platform Features

- ✅ 7 category pages with SEO content
- ✅ 4 resource guides with live DB feeds
- ✅ AI: Find My Match, Chatbot, Smart Search, Summarizer, Insights
- ✅ News from 18 electronics sources with AI filter
- ✅ Organization pages
- ✅ Verified badges + link checking
- ✅ Email + contact form
- ✅ Mobile responsive with hamburger menu
- ✅ Complete SEO: sitemap, schema, meta tags

---

## Free Tier Limits

| Service | Free Limit | Kab Upgrade Karna Padega |
|---------|------------|--------------------------|
| Supabase | 500MB DB, 2GB bandwidth/mo | 10,000+ users |
| Vercel | 100GB bandwidth/mo | High traffic |
| GitHub | Unlimited public repos | Kabhi nahi |
| Groq AI | 14,400 req/day | Bahut heavy usage |
| NVIDIA NIM | 1,000 req/day (generous free credits) | Heavy usage |
| Total | ₹0/month | 1-2 saal free mein |

---

## Troubleshooting

**Problem:** Vercel deploy fail
**Solution:** OpenCode mein paste karo "Fix Vercel error: [error message]"

**Problem:** Vercel deploy BLOCKED
**Solution:** Hobby plan has deploy rate limit. Wait 1-2 hours or upgrade to Pro ($20/mo).

**Problem:** Database empty
**Solution:** Hit `/api/seed` endpoint or add through admin panel

**Problem:** AI features not working
**Solution:** Check `.env.local` has all API keys. Check `ai_usage_log` table for errors.

**Problem:** Admin panel nahi khul raha
**Solution:** Password case-sensitive hai, exactly `electrobridge2026` daalo
