# MASTER_CONTEXT.md — ElectroBridge
**Ye file OpenCode / AI coding assistant ko deni hai har session ke shuru mein.**
**Last updated:** June 2026 | **Source:** Live PROJECT_AUDIT.md

---

## TUM KYA BUILD KAR RAHE HO

**ElectroBridge** — India ka trusted electronics + semiconductor career platform.
URL: https://electrobridge.vercel.app
GitHub: https://github.com/amitkr26/JobsAI (root directory: `electrobridge/`)

**Core promise:** Har listed opportunity verified honi chahiye. Koi fake job nahi. Koi broken link nahi. Koi expired listing default view mein nahi.

**Primary users:** BTech/MTech/MSc Electronics students, VLSI engineers, embedded engineers, PhD aspirants, JRF/SRF candidates.

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.0 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 + @tailwindcss/typography |
| Database | Supabase (PostgreSQL + RLS) |
| Deployment | Vercel (auto-deploy from `main` branch) |
| Email | Resend (weekly digest) |
| Icons | lucide-react |
| Date handling | date-fns |
| HTML parsing | cheerio (scrapers) |
| RSS parsing | rss-parser |
| AI providers | Groq → Gemini → OpenRouter → Cloudflare → HuggingFace (fallback chain) |

**Project root on disk:** `electrobridge/`
**Source code:** `electrobridge/src/`
**Path alias:** `@/*` → `./src/*`

---

## FONTS & COLORS (Tailwind config)

**Fonts:**
- Display: Space Grotesk (Google Fonts)
- Body: Inter (Google Fonts)

**Custom Tailwind colors:**
- `navy` — primary dark blue
- `navy-light` — lighter blue
- `cyan` — accent teal/cyan
- `purple` — secondary accent
- `text-primary` — main text
- `text-muted` — muted text
- `success` — green
- `warning` — yellow/orange

**Dark mode:** Enabled via `html class="dark"` in `layout.tsx`

---

## DATABASE SCHEMA (Supabase project: `aqauempuwmbizqoaolop`)

### Table: `opportunities`
```
id                  uuid PK (gen_random_uuid)
title               text NOT NULL
organization        text NOT NULL
category            text NOT NULL  -- 'JRF' | 'PhD' | 'Job' | 'Internship' | 'Fellowship'
location            text
description         text
apply_link          text
official_page_url   text
deadline            timestamptz    -- nullable = rolling applications
stipend             text           -- e.g. "₹37,000 + HRA"
tags                text[]
is_active           boolean        -- default true
verification_status text           -- 'verified' | 'link_unavailable' | 'pending'
verified_at         timestamptz
created_at          timestamptz    -- default now()
apply_clicks        integer        -- default 0
posted_at           timestamptz    -- default now()
```
**Current data:** 28 records (10 seed + ~18 scraped)

### Table: `news_articles`
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
**Current data:** 560 records (from RSS feeds)

### Table: `subscribers`
```
id         uuid PK
email      text UNIQUE NOT NULL
keywords   text[]
categories text[]
is_active  boolean  -- default true
created_at timestamptz
```
**Current data:** 3 records

### Table: `link_check_logs`
```
id              uuid PK
opportunity_id  uuid
status_code     integer
checked_at      timestamptz
```

### Table: `ai_usage_log`
```
id              uuid PK
feature         text
provider        text
model           text
prompt_length   integer
response_length integer
success         boolean
error_message   text
created_at      timestamptz
```

### Table: `opportunity_reports`
```
id              uuid PK
opportunity_id  uuid
reason          text
notes           text
created_at      timestamptz
```

### Table: `suggestions` (contact form submissions)
### Table: `telegram_subscribers`
### Table: `calendar_exports`

---

## FILE STRUCTURE

```
electrobridge/src/
├── app/
│   ├── globals.css
│   ├── layout.tsx                  -- Root layout, dark mode class, fonts
│   ├── page.tsx                    -- Homepage: StatsBar + ExpiringSoon + opps + news
│   ├── sitemap.ts                  -- Dynamic XML sitemap
│   ├── admin/page.tsx              -- Password-protected admin dashboard
│   ├── about/page.tsx
│   ├── categories/page.tsx
│   ├── category/[category]/page.tsx
│   ├── chat/page.tsx               -- AI chat interface
│   ├── contact/page.tsx            -- Contact form → suggestions table
│   ├── match/page.tsx              -- AI resume-to-opportunity matching
│   ├── news/page.tsx               -- News listing
│   ├── news/[slug]/page.tsx        -- Single news article
│   ├── opportunities/page.tsx      -- Listing with filters + AI search
│   ├── opportunities/[slug]/page.tsx -- Detail: countdown, share, similar
│   ├── organizations/page.tsx
│   ├── organizations/[slug]/page.tsx
│   ├── resources/international-fellowships/page.tsx
│   ├── resources/jrf-guide/page.tsx
│   ├── resources/vlsi-careers/page.tsx
│   └── api/
│       ├── admin/recheck-link/route.ts    -- POST: recheck one link
│       ├── ai/chat/route.ts               -- POST: AI chat
│       ├── ai/expire/route.ts             -- POST: auto-expire past-deadline (cron)
│       ├── ai/match/route.ts              -- POST: AI resume matching
│       ├── ai/opportunity-summary/[slug]/route.ts
│       ├── ai/search/route.ts             -- POST: semantic search
│       ├── ai/summarize/route.ts          -- POST: text summarization
│       ├── calendar-export/[id]/route.ts  -- GET: .ics file download
│       ├── check-links/route.ts           -- POST: batch link health check (cron)
│       ├── news/route.ts                  -- GET: paginated news
│       ├── og/route.tsx                   -- GET: OG image
│       ├── og/opportunity/[slug]/route.tsx
│       ├── opportunities/route.ts         -- GET: filtered opportunities list
│       ├── opportunities/[id]/route.ts    -- GET: single opportunity
│       ├── opportunities-feed/route.ts    -- GET: RSS feed
│       ├── organizations/route.ts         -- GET: orgs with counts
│       ├── report-issue/route.ts          -- POST: report broken link
│       ├── scrape/route.ts                -- GET: unified scraper (?mode=news|opportunities|all)
│       ├── scrape-jobs/route.ts           -- GET: govt jobs scraper
│       ├── scrape-opportunities/route.ts  -- GET: legacy scraper
│       ├── seed/route.ts                  -- POST: seed opportunities
│       ├── seed-news/route.ts             -- POST: seed news
│       ├── send-digest/route.ts           -- POST: weekly email digest (cron)
│       ├── similar/[id]/route.ts          -- GET: similar by tag overlap
│       ├── subscribe/route.ts             -- POST: email subscription
│       └── track-click/route.ts           -- POST: track apply clicks
├── components/
│   ├── AIAnalyticsPanel.tsx        -- Admin: AI usage stats table
│   ├── AIOpportunitySummary.tsx    -- Detail page: AI-generated summary
│   ├── ApplyButton.tsx             -- Tracked apply CTA (calls track-click)
│   ├── CategoryHero.tsx            -- Category page header
│   ├── DeadlineCountdown.tsx       -- Color-coded countdown badge (date-fns)
│   ├── ExpiringSoon.tsx            -- Homepage: closing-soon opps section
│   ├── Footer.tsx
│   ├── LoadingSkeleton.tsx         -- Animated loading placeholder
│   ├── Navbar.tsx                  -- Top nav + mobile menu + orgs link
│   ├── NewsCard.tsx
│   ├── OpportunityCard.tsx         -- Card with NEW badge, posted_at, org link
│   ├── ReportIssueModal.tsx        -- Modal: report issue (calls report-issue API)
│   ├── SearchBar.tsx               -- Debounced search
│   ├── ShareButtons.tsx            -- WhatsApp + Twitter share
│   ├── SimilarOpportunities.tsx    -- Tag-based similar opps grid
│   ├── StatsBar.tsx                -- Homepage: live DB counts
│   ├── SubscribeModal.tsx          -- Email signup modal
│   └── SubscribeSection.tsx        -- Inline email signup
├── lib/
│   ├── supabase.ts                 -- supabase (anon) + supabaseAdmin (service_role), guarded init
│   ├── email-digest.ts             -- Resend weekly digest logic
│   ├── telegram-bot.ts             -- Telegram channel posting
│   ├── types.ts                    -- Core types (may duplicate types/index.ts)
│   ├── ai/
│   │   └── providers.ts            -- Multi-provider AI: Groq→Gemini→OpenRouter→CF→HF
│   └── scrapers/
│       ├── types.ts
│       ├── isro-scraper.ts         -- ISRO careers page (cheerio)
│       ├── drdo-scraper.ts         -- DRDO vacancies (cheerio)
│       ├── csir-scraper.ts         -- CSIR recruitment (cheerio)
│       ├── govt-scraper.ts         -- Govt jobs + CSIR RSS
│       ├── opportunity-scraper.ts  -- Orchestrator for all scrapers
│       └── rss-parser.ts           -- 10 news RSS sources
└── types/
    └── index.ts
```

---

## ENVIRONMENT VARIABLES

### Set in Vercel ✅
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_ADMIN_PASSWORD
CRON_SECRET
```

### Missing — need to add in Vercel ❌
```
TELEGRAM_BOT_TOKEN       -- For Telegram channel auto-posting
TELEGRAM_CHANNEL_ID      -- For Telegram channel auto-posting
RESEND_API_KEY           -- For weekly email digest
FROM_EMAIL               -- For email digest sender
GEMINI_API_KEY           -- Optional AI (free tier available)
GROQ_API_KEY             -- Optional AI (free tier available)
OPENROUTER_API_KEY       -- Optional AI
CLOUDFLARE_AI_TOKEN      -- Optional AI
CLOUDFLARE_ACCOUNT_ID    -- Optional AI
HUGGINGFACE_API_KEY      -- Optional AI
```

---

## CRON JOBS

| Schedule | Endpoint | What it does |
|----------|----------|-------------|
| Every 6 hours | `/api/scrape?mode=all` | Scrapes ISRO + DRDO + CSIR for new opportunities + news RSS |
| Every Sunday 3am UTC | `/api/send-digest` | Sends weekly email digest to subscribers |
| Daily 3:30am UTC (Supabase pg_cron) | `/api/scrape-jobs` | Govt jobs standalone scraper |

---

## SCRAPERS STATUS

| Source | Method | Status |
|--------|--------|--------|
| ISRO (`isro.gov.in`) | cheerio HTML | ✅ Working |
| DRDO (`drdo.gov.in`) | cheerio HTML | ✅ Working |
| CSIR (`csir.res.in`) | cheerio HTML | ✅ Working |
| CSIR RSS | RSS | ✅ Working |
| FindAPhD RSS | RSS | ❌ Blocked by Cloudflare |
| IEEE Spectrum, EE Times, etc (10 sources) | RSS | ✅ Working (560 news articles) |

---

## WHAT IS WORKING vs WHAT IS NOT

### ✅ Fully Working
- Homepage with live stats, ExpiringSoon, latest opps + news
- Opportunities listing with filters
- Opportunity detail pages
- News listing + detail pages
- Categories, Organizations pages
- Static resource pages (JRF guide, VLSI careers, International fellowships)
- Admin dashboard (password protected)
- Scrapers: ISRO, DRDO, CSIR, RSS news
- Link checking (batch cron)
- Email subscription (form works, digest needs RESEND_API_KEY)
- Apply click tracking
- Issue reporting
- Calendar export (.ics)
- RSS feed output
- OG image generation
- Similar opportunities
- Sitemap

### ⚠️ Partially Working (built but needs env vars)
- Email digest → needs `RESEND_API_KEY` + `FROM_EMAIL`
- Telegram posting → needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHANNEL_ID`
- AI chat, AI search, AI match, AI summarize → needs at least one AI API key (Groq free, Gemini free)
- AI opportunity summary on detail pages → same

### ❌ Known Issues
- No toast/notification system (user has no feedback after subscribe/report)
- No `error.tsx` files (App Router error boundaries missing)
- No `not-found.tsx` (404 is Vercel default)
- No `loading.tsx` files (only LoadingSkeleton component exists)
- `globals.css` double-loads Google Fonts (also in layout.tsx via next/font)
- FindAPhD RSS blocked by Cloudflare
- BEL/HAL websites not scrapable (JS SPAs)

---

## SECURITY STATUS

| Issue | Severity | Status |
|-------|----------|--------|
| `.env.local` committed to git with live secrets | 🔴 CRITICAL | **FIX IMMEDIATELY** |
| Admin password `electrobridge2026` weak | 🔴 Critical | Change in Vercel env |
| Cron secret `mysecretcron2026` weak | 🔴 High | Change in Vercel env |
| No rate limiting on `/api/scrape`, `/api/subscribe` | ⚠️ Medium | Fix later |
| No input validation on contact/subscribe forms | ⚠️ Medium | Fix later |

---

## IMPORTANT RULES FOR CODING (do not violate)

1. **Never hardcode opportunity data** — always fetch from Supabase
2. **Supabase client usage:**
   - Browser/client components: use `supabase` (anon key) from `lib/supabase.ts`
   - Server/API routes: use `supabaseAdmin` (service_role) from `lib/supabase.ts`
   - Always check `isConfigured` guard before using
3. **TypeScript strict** — no `any` types
4. **Server components by default** — only add `'use client'` when interactivity needed
5. **All Supabase queries must handle errors** — show user-friendly messages
6. **Mobile responsive always** — tailwind mobile-first
7. **Never skip verification_status** — it must be visible on all opportunity cards
8. **Admin password is via env var** `NEXT_PUBLIC_ADMIN_PASSWORD` — never hardcode

---

## NEXT PRIORITIES (in order)

1. **Fix `.env.local` git security issue** (manual, not code)
2. **Add toast notifications** — install `sonner` library for user feedback
3. **Add `error.tsx` + `not-found.tsx`** — proper error handling pages
4. **Add `loading.tsx`** — page transition skeletons
5. **Add at least one AI API key** — Groq (free) or Gemini (free) to enable AI features
6. **Add Resend key** — enable email digest
7. **Set up Telegram bot** — auto-post new opportunities

---

*This file represents the complete state of ElectroBridge as of June 2026.*
*Always read this file before making any changes to the codebase.*
