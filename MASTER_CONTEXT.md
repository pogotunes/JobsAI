# MASTER_CONTEXT.md — ElectroBridge
**Ye file OpenCode / AI coding assistant ko har session ke shuru mein deni hai.**
**Last updated:** June 2026 | **Audit version:** v3 (all 10 tasks complete)

---

## PROJECT IDENTITY

| | |
|---|---|
| Name | ElectroBridge |
| URL | https://electrobridge.vercel.app |
| GitHub | https://github.com/amitkr26/JobsAI |
| Root directory | `electrobridge/` |
| Stack | Next.js 14.2.0 (App Router) + TypeScript + Supabase + Tailwind CSS |
| Deployment | Vercel (auto-deploy from `main` branch) |
| Path alias | `@/*` → `./src/*` |

**Mission:** India ka trusted electronics + semiconductor career platform. Har listed opportunity verified honi chahiye. Koi fake job nahi. Koi broken link nahi. Koi expired listing default view mein nahi.

---

## TECH STACK & KEY PACKAGES

| Package | Version | Use |
|---------|---------|-----|
| next | 14.2.0 | Framework |
| typescript | ^5 | Language |
| tailwindcss | ^3.4.1 | Styling |
| @supabase/supabase-js | ^2.108.2 | Database |
| sonner | ^2.0.7 | Toast notifications |
| date-fns | ^3.6.0 | Date formatting |
| lucide-react | ^0.383.0 | Icons |
| clsx | ^2.1.1 | Conditional classNames |
| cheerio | ^1.2.0 | HTML scraping |
| rss-parser | ^3.13.0 | RSS feeds |
| resend | ^16.6.0 | Email digest |
| @tailwindcss/typography | ^0.5.20 | Rich text |

**Fonts:** Space Grotesk (display) + Inter (body) via next/font in layout.tsx
**Dark mode:** `html class="dark"` set in layout.tsx
**Custom Tailwind colors:** navy, navy-light, cyan, purple, text-primary, text-muted, success, warning

---

## DATABASE SCHEMA (Supabase: `aqauempuwmbizqoaolop`)

### `opportunities` (28 records)
```
id                  uuid PK
title               text NOT NULL
organization        text NOT NULL
category            text NOT NULL    -- 'JRF' | 'PhD' | 'Job' | 'Internship' | 'Fellowship'
location            text
description         text
apply_link          text
official_page_url   text
deadline            timestamptz      -- nullable = rolling applications
stipend             text             -- e.g. "₹37,000 + HRA"
tags                text[]
is_active           boolean          -- default true
verification_status text             -- 'verified' | 'link_unavailable' | 'pending'
verified_at         timestamptz
created_at          timestamptz
apply_clicks        integer          -- default 0
posted_at           timestamptz      -- default now()
```

### `news_articles` (560 records)
```
id           uuid PK
title        text NOT NULL
slug         text NOT NULL UNIQUE
description  text
content      text
source_name  text
source_url   text
image_url    text
category     text
tags         text[]
published_at timestamptz
created_at   timestamptz
```

### `subscribers` (3 records)
```
id         uuid PK
email      text UNIQUE NOT NULL
keywords   text[]
categories text[]
is_active  boolean
created_at timestamptz
```

### Other tables
- `link_check_logs` — opportunity_id, status_code, checked_at
- `ai_usage_log` — feature, provider, model, prompt_length, response_length, success, error_message
- `opportunity_reports` — opportunity_id, reason, notes
- `suggestions` — contact form submissions
- `telegram_subscribers` — chat_id, keywords, categories
- `calendar_exports` — opportunity_id, exported_at

### Supabase client usage rule
- **Browser/client components** → `supabase` (anon key) from `lib/supabase.ts`
- **Server/API routes** → `supabaseAdmin` (service_role) from `lib/supabase.ts`
- Always check `isConfigured` guard before using either client

---

## COMPLETE FILE STRUCTURE

```
electrobridge/src/
├── app/
│   ├── globals.css                          -- Tailwind directives only (no @import fonts)
│   ├── layout.tsx                           -- Root layout, dark mode, fonts, <Toaster/>
│   ├── page.tsx                             -- Homepage: StatsBar + ExpiringSoon + opps + news
│   ├── sitemap.ts                           -- Dynamic XML sitemap
│   ├── not-found.tsx                        -- Global 404 page
│   ├── error.tsx                            -- Global error boundary (client component)
│   ├── admin/
│   │   ├── page.tsx                         -- Password-protected admin dashboard
│   │   ├── add-news/page.tsx                -- Manually add news article
│   │   ├── add-opportunity/page.tsx         -- Manually add opportunity
│   │   └── edit-opportunity/[id]/page.tsx   -- Edit / soft-delete opportunity
│   ├── about/page.tsx
│   ├── categories/page.tsx
│   ├── category/[category]/page.tsx
│   ├── chat/
│   │   ├── layout.tsx                       -- SEO metadata for chat
│   │   ├── loading.tsx                      -- Loading state
│   │   └── page.tsx                         -- AI chat interface
│   ├── contact/page.tsx                     -- Contact form → suggestions table
│   ├── match/
│   │   ├── layout.tsx                       -- SEO metadata for match
│   │   └── page.tsx                         -- AI resume-to-opportunity matching
│   ├── news/
│   │   ├── loading.tsx                      -- 6-card skeleton
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       ├── not-found.tsx
│   │       └── page.tsx
│   ├── opportunities/
│   │   ├── loading.tsx                      -- 6-card skeleton
│   │   ├── page.tsx                         -- Listing with filters + AI search
│   │   └── [slug]/
│   │       ├── loading.tsx                  -- Full-page skeleton
│   │       ├── not-found.tsx
│   │       └── page.tsx                     -- Detail: countdown, share, similar
│   ├── organizations/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── resources/
│   │   ├── international-fellowships/page.tsx
│   │   ├── jrf-guide/page.tsx
│   │   └── vlsi-careers/page.tsx
│   └── api/
│       ├── admin/recheck-link/route.ts      -- POST: recheck one link
│       ├── ai/
│       │   ├── chat/route.ts                -- POST: AI chat
│       │   ├── expire/route.ts              -- POST: auto-expire past-deadline (cron)
│       │   ├── match/route.ts               -- POST: AI resume matching
│       │   ├── opportunity-summary/[slug]/route.ts
│       │   ├── search/route.ts              -- POST: semantic search
│       │   └── summarize/route.ts
│       ├── calendar-export/[id]/route.ts    -- GET: .ics download
│       ├── check-links/route.ts             -- POST: batch link check (cron)
│       ├── cleanup-news/route.ts            -- POST: deduplicate news (Authorization: Bearer CRON_SECRET)
│       ├── news/route.ts                    -- GET: paginated news
│       ├── og/route.tsx                     -- GET: OG image
│       ├── og/opportunity/[slug]/route.tsx
│       ├── opportunities/route.ts           -- GET: filtered list
│       ├── opportunities/[id]/route.ts      -- GET: single opportunity
│       ├── opportunities-feed/route.ts      -- GET: RSS feed
│       ├── organizations/route.ts           -- GET: orgs with counts
│       ├── report-issue/route.ts            -- POST: report broken link
│       ├── scrape/route.ts                  -- GET: ?mode=news|opportunities|all
│       ├── scrape-jobs/route.ts             -- GET: govt jobs scraper
│       ├── scrape-opportunities/route.ts    -- GET: legacy
│       ├── seed/route.ts                    -- POST: seed opportunities
│       ├── seed-news/route.ts               -- POST: seed news
│       ├── send-digest/route.ts             -- POST: weekly email digest (cron)
│       ├── similar/[id]/route.ts            -- GET: similar by tags
│       ├── subscribe/route.ts               -- POST: email subscription
│       └── track-click/route.ts             -- POST: track apply clicks
├── components/
│   ├── AIAnalyticsPanel.tsx       -- Admin: AI usage stats
│   ├── AIOpportunitySummary.tsx   -- Detail page: AI summary (needs AI key)
│   ├── ApplyButton.tsx            -- Tracked apply CTA → track-click API
│   ├── CategoryHero.tsx           -- Category page header
│   ├── DeadlineCountdown.tsx      -- Color-coded countdown (date-fns)
│   ├── ExpiringSoon.tsx           -- Homepage: closing-soon opps
│   ├── Footer.tsx
│   ├── LoadingSkeleton.tsx        -- Animated placeholder (used by loading.tsx files)
│   ├── Navbar.tsx                 -- Top nav + mobile menu
│   ├── NewsImage.tsx              -- Client image with fallback (onError handler)
│   ├── NewsCard.tsx
│   ├── OpportunityCard.tsx        -- Card: NEW badge, posted_at, org link
│   ├── ReportIssueModal.tsx       -- Modal → report-issue API (sonner toast)
│   ├── SearchBar.tsx              -- Debounced search
│   ├── ShareButtons.tsx           -- WhatsApp + Twitter
│   ├── SimilarOpportunities.tsx   -- Tag-based grid (supabase direct)
│   ├── StatsBar.tsx               -- Live DB counts (supabaseAdmin)
│   ├── SubscribeModal.tsx         -- Email modal → subscribe API (sonner toast)
│   └── SubscribeSection.tsx       -- Inline signup → subscribe API (sonner toast)
├── lib/
│   ├── supabase.ts                -- supabase + supabaseAdmin with isConfigured guard
│   ├── email-digest.ts            -- Resend weekly digest (needs RESEND_API_KEY)
│   ├── rate-limiter.ts            -- In-memory Map rate limiter (3 req/IP/hr on subscribe)
│   ├── telegram-bot.ts            -- Telegram posting (needs TELEGRAM_BOT_TOKEN)
│   ├── types.ts                   -- Core types (may overlap with types/index.ts)
│   ├── ai/
│   │   └── providers.ts           -- callAI(): Groq→Gemini→OpenRouter→CF→HF failover
│   └── scrapers/
│       ├── types.ts
│       ├── isro-scraper.ts        -- ✅ Working
│       ├── drdo-scraper.ts        -- ✅ Working
│       ├── csir-scraper.ts        -- ✅ Working
│       ├── govt-scraper.ts        -- ✅ Working (FindAPhD blocked by CF)
│       ├── opportunity-scraper.ts -- Orchestrator
│       └── rss-parser.ts          -- 10 news RSS sources ✅
└── types/
    └── index.ts
```

---

## ENVIRONMENT VARIABLES

### Set in Vercel ✅ (working)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_ADMIN_PASSWORD
CRON_SECRET
```

### NOT set — need free account signups ❌
```
GROQ_API_KEY           -- groq.com (free) → enables all AI features
GEMINI_API_KEY         -- aistudio.google.com (free) → AI fallback
RESEND_API_KEY         -- resend.com (free 3k/mo) → email digest
FROM_EMAIL             -- resend.com → digest sender address
TELEGRAM_BOT_TOKEN     -- @BotFather on Telegram → auto-posting
TELEGRAM_CHANNEL_ID    -- Your Telegram channel → auto-posting
OPENROUTER_API_KEY     -- optional AI fallback
CLOUDFLARE_AI_TOKEN    -- optional AI fallback
CLOUDFLARE_ACCOUNT_ID  -- optional AI fallback
HUGGINGFACE_API_KEY    -- optional AI fallback
```

---

## CRON JOBS

| Trigger | Endpoint | What |
|---------|----------|------|
| Every 6h (Vercel) | `/api/scrape?mode=all` | ISRO + DRDO + CSIR + 10 news RSS |
| Sunday 3am UTC (Vercel) | `/api/send-digest` | Weekly email to subscribers |
| Daily 3:30am UTC (Supabase pg_cron) | `/api/scrape-jobs` | Govt jobs scraper |

---

## WHAT WORKS vs WHAT DOESN'T

### ✅ Fully working
- All pages load (homepage, opportunities, news, detail pages, organizations, categories, resources)
- Scrapers: ISRO, DRDO, CSIR, 10 news RSS sources (560 news articles in DB)
- Admin dashboard with password protection
- Admin: edit/delete opportunity, add news article, add opportunity
- ISR with generateStaticParams + revalidate on detail pages (opps 3600s, news 1800s)
- Rate limiting on subscribe API (3 req/IP/hour)
- News dedup (check-then-insert by source_url + /api/cleanup-news endpoint)
- Plausible analytics script in layout.tsx
- Apply click tracking
- Issue reporting with toast feedback
- Email subscription form with toast feedback + validation
- Contact form with toast feedback
- Calendar export (.ics)
- RSS feed output (`/api/opportunities-feed`)
- OG image generation
- Similar opportunities
- Link checking cron
- Dynamic sitemap
- Loading skeletons (4 routes)
- Custom 404 pages (global + opportunities + news)
- Error boundary

### ⚠️ Built but needs env vars to activate
- AI chat (`/chat`) → needs `GROQ_API_KEY` or `GEMINI_API_KEY`
- AI match (`/match`) → needs AI key
- AI search on opportunities page → needs AI key
- AI opportunity summary on detail pages → needs AI key
- Weekly email digest → needs `RESEND_API_KEY` + `FROM_EMAIL`
- Telegram auto-posting → needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHANNEL_ID`

### 🔴 Security issues (must fix manually)
- `electrobridge/.env.local` is committed to GitHub with live `SUPABASE_SERVICE_ROLE_KEY`
- Admin password is weak (change in Vercel env)
- Cron secret is weak (change in Vercel env)

### 📝 Minor remaining issues
- FindAPhD RSS blocked by Cloudflare (gracefully returns 0 — not breaking)
- BEL/HAL not scrapable (JS SPAs)
- In-memory rate limiter resets on server restart (consider persistent store for production)

---

## KEY PATTERNS TO FOLLOW

```typescript
// Standard opportunity query (always use these filters)
.from("opportunities")
  .select("*")
  .eq("is_active", true)
  .or(`deadline.gte.${new Date().toISOString()},deadline.is.null`)

// Count query (stats)
.from("opportunities")
  .select("*", { count: "exact", head: true })
  .eq("is_active", true)

// Scraper check-then-insert (no duplicates — by source_url)
const { data: existing } = await supabaseAdmin
  .from("opportunities")
  .select("id")
  .eq("source_url", item.source_url)
  .maybeSingle()
if (!existing) {
  await supabaseAdmin.from("opportunities").insert(item)
}

// Toast pattern (sonner)
import { toast } from "sonner"
toast.success("Done!")
toast.error("Something went wrong.")
```

---

## CODING RULES (never break these)

1. Never hardcode opportunity/news data — always fetch from Supabase
2. `supabase` (anon) for client components, `supabaseAdmin` (service_role) for API routes
3. All Supabase queries must have error handling
4. TypeScript strict — no `any` types
5. Server components by default — `'use client'` only when needed
6. Mobile responsive always (Tailwind mobile-first)
7. Use `sonner` toast for all user action feedback
8. Admin password is `process.env.NEXT_PUBLIC_ADMIN_PASSWORD` — never hardcode
9. All new API routes must check `CRON_SECRET` if called by cron jobs
10. Rate limit public POST endpoints using `rate-limiter.ts`
11. Validate/sanitize all user input (email regex, UUID check, length limits)

---

*ElectroBridge — India's trusted electronics career platform*
*Context file v3 — June 2026 (all 10 tasks complete)*