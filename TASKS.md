# TASKS.md — ElectroBridge (ALL DONE ✅)
**Updated:** June 2026 (v3 — all 10 engineering tasks complete)

---

## ALL TASKS COMPLETE ✅

| Task | Status | Details |
|------|--------|---------|
| Sonner toasts | ✅ | Subscribe, report, contact, admin forms |
| Error/404 pages | ✅ | Global error.tsx + not-found.tsx, route-level for opps/[slug] + news/[slug] |
| Loading skeletons | ✅ | LoadingSkeleton.tsx + loading.tsx for 4 routes |
| Google Fonts dedup | ✅ | Removed @import from globals.css |
| Input validation | ✅ | Email regex+lowercase on subscribe; UUID+500-char on report-issue |
| SEO metadata | ✅ | chat/layout.tsx, match/layout.tsx, organizations/page.tsx |
| Admin: edit/delete | ✅ | /admin/edit-opportunity/[id]/page.tsx + edit buttons |
| Admin: add news | ✅ | /admin/add-news/page.tsx |
| Admin: add opportunity | ✅ | /admin/add-opportunity/page.tsx + button in admin header |
| Sitemap guard | ✅ | isConfigured check returns static URLs |
| Rate limiting | ✅ | In-memory limiter, 3 req/IP/hr on subscribe |
| ISR detail pages | ✅ | generateStaticParams + revalidate (opps 3600s, news 1800s) |
| Homepage stats fix | ✅ | 6 cards, full-ISO comparison, govt counter works |
| News dedup | ✅ | check-then-insert by source_url, /api/cleanup-news, migration SQL |
| Opps dedup | ✅ | Same check-then-insert pattern |
| Plausible Analytics | ✅ | Script in layout.tsx |
| NewsImage component | ✅ | Client component for img onError fallback |
| opencode.json config | ✅ | OpenAI provider via {env:OPENAI_API_KEY} |

---

## STILL NEEDED (manual — YOU do these, not OpenCode)

### 🔴 S1 — Fix .env.local Security (DO TODAY)
```bash
echo "electrobridge/.env.local" >> .gitignore
git rm --cached electrobridge/.env.local
git commit -m "Remove .env.local from tracking"
git push
```
Then in Vercel: change ADMIN_PASSWORD + CRON_SECRET. Supabase: regenerate service_role key.

### 🔵 S2 — Enable AI (free signup)
Go to https://console.groq.com → Create API key → Add `GROQ_API_KEY` to Vercel

### 🔵 S3 — Enable Email Digest (free signup)
Go to https://resend.com → Verify domain → Add `RESEND_API_KEY` + `FROM_EMAIL` to Vercel

### 🔵 S4 — Telegram Bot
@BotFather → create bot → add `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHANNEL_ID` to Vercel

### Other manual steps
- Run `supabase-cleanup.sql` in Supabase SQL Editor (adds unique constraint on news source_url)
- Hit `POST /api/cleanup-news` with `Authorization: Bearer CRON_SECRET` to deduplicate
- Set `OPENAI_API_KEY` env var (for opencode config reference in opencode.json)

---

## NEXT OPENCODE SESSION
After you've done S1 (security) and at least S2 (Groq key), tell OpenCode:
"GROQ_API_KEY is set in Vercel. Verify src/lib/ai/providers.ts reads it and model is current. Test /chat page."
