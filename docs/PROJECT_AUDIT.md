# ElectroBridge Project Audit

Generated: 2026-06-29

---

## 1. Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | ElectroBridge |
| **Description** | Electronics & semiconductor job aggregator for Indian researchers |
| **URL** | https://electrobridge.vercel.app |
| **GitHub** | https://github.com/amitkr26/JobsAI |
| **Stack** | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase |
| **Deployment** | Vercel (auto-deploy from main branch) |
| **Node** | ^18+ (Next.js 14 requirement) |
| **Package Manager** | npm |

---

## 2. Directory Structure

```
JobsAI/
├── .git/
├── .gitattributes
├── .gitignore
├── .github/
├── docs/
│   └── PROJECT_AUDIT.md          ← THIS FILE
├── README.md
└── electrobridge/
    ├── .env.local                  ← SECRETS COMMITTED (see §6)
    ├── .gitignore                  ← (missing, root .gitignore covers)
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── vercel.json
    ├── supabase-migration.sql
    ├── public/
    │   ├── logo.svg
    │   ├── llms.txt
    │   ├── next.svg
    │   └── vercel.svg
    └── src/
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx                 ← Root layout with metadata + <Toaster>
        │   ├── page.tsx                   ← Homepage w/ stats + ExpiringSoon
        │   ├── sitemap.ts
        │   ├── not-found.tsx              ← Custom 404
        │   ├── error.tsx                  ← Global error boundary (client)
        │   ├── admin/page.tsx
        │   ├── admin/add-news/page.tsx    ← Manually add news article
        │   ├── admin/add-opportunity/page.tsx ← Manually add opportunity
        │   ├── admin/edit-opportunity/[id]/page.tsx ← Edit/delete opportunity
        │   ├── about/page.tsx
        │   ├── categories/page.tsx
        │   ├── category/[category]/page.tsx
        │   ├── chat/layout.tsx            ← SEO metadata
        │   ├── chat/loading.tsx           ← Loading skeleton
        │   ├── chat/page.tsx
        │   ├── contact/page.tsx
        │   ├── match/layout.tsx           ← SEO metadata
        │   ├── match/page.tsx
        │   ├── news/loading.tsx           ← 6-card skeleton
        │   ├── news/page.tsx
        │   ├── news/[slug]/not-found.tsx  ← Article 404
        │   ├── news/[slug]/page.tsx
        │   ├── opportunities/loading.tsx  ← 6-card skeleton
        │   ├── opportunities/page.tsx
        │   ├── opportunities/[slug]/loading.tsx ← Full-page skeleton
        │   ├── opportunities/[slug]/not-found.tsx ← Opportunity 404
        │   ├── opportunities/[slug]/page.tsx
        │   ├── organizations/page.tsx
        │   ├── organizations/[slug]/page.tsx
        │   ├── resources/international-fellowships/page.tsx
        │   ├── resources/jrf-guide/page.tsx
        │   └── resources/vlsi-careers/page.tsx
        │   ├── resources/net-vs-gate/page.tsx
        │   ├── api/
        │   │   ├── admin/recheck-link/route.ts
        │   │   ├── ai/
        │   │   │   ├── chat/route.ts
        │   │   │   ├── expire/route.ts
        │   │   │   ├── match/route.ts
        │   │   │   ├── opportunity-summary/[slug]/route.ts
        │   │   │   ├── search/route.ts
        │   │   │   └── summarize/route.ts
        │   │   ├── calendar-export/[id]/route.ts
        │   │   ├── check-links/route.ts
        │   │   ├── news/route.ts
        │   │   ├── og/route.tsx
        │   │   ├── og/opportunity/[slug]/route.tsx
        │   │   ├── opportunities/route.ts
        │   │   ├── opportunities-feed/route.ts
        │   │   ├── opportunities/[id]/route.ts
        │   │   ├── organizations/route.ts
        │   │   ├── report-issue/route.ts
        │   │   ├── scrape/route.ts
        │   │   ├── scrape-jobs/route.ts
        │   │   ├── scrape-opportunities/route.ts
        │   │   ├── seed/route.ts
        │   │   ├── seed-news/route.ts
        │   │   ├── send-digest/route.ts
        │   │   ├── cleanup-news/route.ts
        │   │   ├── similar/[id]/route.ts
        │   │   ├── subscribe/route.ts
        │   │   └── track-click/route.ts
        ├── components/
        │   ├── AIAnalyticsPanel.tsx
        │   ├── AIOpportunitySummary.tsx
        │   ├── ApplyButton.tsx
        │   ├── CategoryHero.tsx
        │   ├── DeadlineCountdown.tsx
        │   ├── ExpiringSoon.tsx
        │   ├── Footer.tsx
        │   ├── LoadingSkeleton.tsx
        │   ├── Navbar.tsx
        │   ├── NewsCard.tsx
        │   ├── OpportunityCard.tsx
        │   ├── ReportIssueModal.tsx
        │   ├── SearchBar.tsx
        │   ├── ShareButtons.tsx
        │   ├── SimilarOpportunities.tsx
        │   ├── NewsImage.tsx
        │   ├── StatsBar.tsx
        │   ├── SubscribeModal.tsx
        │   └── SubscribeSection.tsx
        ├── lib/
        │   ├── rate-limiter.ts
        │   ├── supabase.ts
        │   ├── email-digest.ts
        │   ├── telegram-bot.ts
        │   ├── types.ts
        │   ├── ai/
        │   │   └── providers.ts
        │   └── scrapers/
        │       ├── types.ts
        │       ├── isro-scraper.ts
        │       ├── drdo-scraper.ts
        │       ├── csir-scraper.ts
        │       ├── govt-scraper.ts
        │       ├── opportunity-scraper.ts
        │       └── rss-parser.ts
        └── types/
            └── index.ts
```

---

## 3. Route Map

### Pages (Client Components)

| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | ✅ Live - Stats bar, ExpiringSoon, latest opps & news |
| `/admin` | `src/app/admin/page.tsx` | ✅ Live - Password-protected dashboard |
| `/admin/add-news` | `src/app/admin/add-news/page.tsx` | ✅ Live - Add news articles manually |
| `/admin/edit-opportunity/[id]` | `src/app/admin/edit-opportunity/[id]/page.tsx` | ✅ Live - Edit/delete opportunities |
| `/about` | `src/app/about/page.tsx` | ✅ Live |
| `/categories` | `src/app/categories/page.tsx` | ✅ Live |
| `/category/[category]` | `src/app/category/[category]/page.tsx` | ✅ Live |
| `/chat` | `src/app/chat/page.tsx` | ✅ Live - AI chat |
| `/contact` | `src/app/contact/page.tsx` | ✅ Live - Form submits to `suggestions` table |
| `/match` | `src/app/match/page.tsx` | ✅ Live - AI-based matchmaking |
| `/news` | `src/app/news/page.tsx` | ✅ Live |
| `/news/[slug]` | `src/app/news/[slug]/page.tsx` | ✅ Live |
| `/opportunities` | `src/app/opportunities/page.tsx` | ✅ Live - Filters, AI search |
| `/opportunities/[slug]` | `src/app/opportunities/[slug]/page.tsx` | ✅ Live - DeadlineCountdown, ShareButtons, SimilarOpportunities |
| `/organizations` | `src/app/organizations/page.tsx` | ✅ Live |
| `/organizations/[slug]` | `src/app/organizations/[slug]/page.tsx` | ✅ Live |
| `/resources/international-fellowships` | `src/app/resources/international-fellowships/page.tsx` | ✅ Live |
| `/resources/jrf-guide` | `src/app/resources/jrf-guide/page.tsx` | ✅ Live |
| `/resources/vlsi-careers` | `src/app/resources/vlsi-careers/page.tsx` | ✅ Live |
| `/sitemap.xml` | `src/app/sitemap.ts` | ✅ Dynamic sitemap |

### API Routes (Server)

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/admin/recheck-link` | `route.ts` | Re-check a single opportunity's apply link |
| `POST /api/ai/chat` | `route.ts` | AI chat endpoint |
| `POST /api/ai/expire` | `route.ts` | Auto-expire past-deadline opportunities (cron) |
| `POST /api/ai/match` | `route.ts` | AI resume-to-opportunity matching |
| `GET /api/ai/opportunity-summary/[slug]` | `route.ts` | AI-generated opportunity summary |
| `POST /api/ai/search` | `route.ts` | AI-powered semantic search |
| `POST /api/ai/summarize` | `route.ts` | AI text summarization |
| `GET /api/calendar-export/[id]` | `route.ts` | Generate .ics file for an opportunity |
| `POST /api/check-links` | `route.ts` | Batch link health check (cron) |
| `GET /api/news` | `route.ts` | Paginated news articles |
| `GET /api/og` | `route.tsx` | OG image generation |
| `GET /api/og/opportunity/[slug]` | `route.tsx` | Per-opportunity OG image |
| `GET /api/opportunities` | `route.ts` | Paginated/filtered opportunities list |
| `GET /api/opportunities/[id]` | `route.ts` | Single opportunity detail |
| `GET /api/opportunities-feed` | `route.ts` | RSS feed output |
| `GET /api/organizations` | `route.ts` | Unique orgs with opportunity counts |
| `POST /api/report-issue` | `route.ts` | Report broken link/issue |
| `GET /api/scrape` | `route.ts` | Unified scraper (`?mode=news\|opportunities\|all`) |
| `GET /api/scrape-jobs` | `route.ts` | Govt jobs scraper |
| `GET /api/scrape-opportunities` | `route.ts` | Legacy scraper endpoint |
| `POST /api/seed` | `route.ts` | Seed opportunities table |
│ `POST /api/cleanup-news` | `route.ts` | Deduplicate news by source_url (protected) |
| `POST /api/seed-news` | `route.ts` | Seed news_articles table |
| `POST /api/send-digest` | `route.ts` | Weekly email digest (cron) |
| `GET /api/similar/[id]` | `route.ts` | Similar opportunities by tag overlap |
| `POST /api/subscribe` | `route.ts` | Email subscription |
| `POST /api/track-click` | `route.ts` | Track apply button clicks |

---

## 4. Database Schema

### Project: `aqauempuwmbizqoaolop` (Supabase)

#### Table: `opportunities`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | Default `gen_random_uuid()` |
| `title` | `text` NOT NULL | |
| `organization` | `text` NOT NULL | |
| `category` | `text` NOT NULL | JRF, PhD, Job, Internship, Fellowship |
| `location` | `text` | |
| `description` | `text` | |
| `apply_link` | `text` | |
| `official_page_url` | `text` | |
| `deadline` | `timestamptz` | Nullable = rolling applications |
| `stipend` | `text` | e.g. "₹37,000 + HRA" |
| `tags` | `text[]` | e.g. `{VLSI, FPGA, IIT}` |
| `is_active` | `boolean` | Default `true` |
| `verification_status` | `text` | `verified`, `link_unavailable`, `pending` |
| `verified_at` | `timestamptz` | |
| `created_at` | `timestamptz` | Default `now()` |
| `apply_clicks` | `integer` | Default `0` (added by migration) |
| `posted_at` | `timestamptz` | Default `now()` (added by migration) |

> **Current count**: 28 records (10 seed + ~18 scraped)

#### Table: `news_articles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `title` | `text` NOT NULL | |
| `slug` | `text` NOT NULL UNIQUE | |
| `description` | `text` | |
| `content` | `text` | |
| `source_name` | `text` | |
| `source_url` | `text` | |
| `image_url` | `text` | |
| `category` | `text` | |
| `tags` | `text[]` | |
| `published_at` | `timestamptz` | |
| `created_at` | `timestamptz` | Default `now()` |

> **Current count**: 560 records (from RSS feeds)

#### Table: `subscribers`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `email` | `text` UNIQUE NOT NULL | |
| `keywords` | `text[]` | |
| `categories` | `text[]` | |
| `is_active` | `boolean` | Default `true` |
| `created_at` | `timestamptz` | Default `now()` |

> **Current count**: 3 records

#### Table: `telegram_subscribers` (created by migration)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `chat_id` | `text` UNIQUE NOT NULL | |
| `keywords` | `text[]` | |
| `categories` | `text[]` | |
| `created_at` | `timestamptz` | Default `now()` |
| `is_active` | `boolean` | Default `true` |

#### Table: `calendar_exports` (created by migration)

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `opportunity_id` | `uuid` FK → opportunities(id) | |
| `exported_at` | `timestamptz` | Default `now()` |

#### Table: `link_check_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `opportunity_id` | `uuid` | |
| `status_code` | `integer` | |
| `checked_at` | `timestamptz` | Default `now()` |

#### Table: `ai_usage_log`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `feature` | `text` | |
| `provider` | `text` | |
| `model` | `text` | |
| `prompt_length` | `integer` | |
| `response_length` | `integer` | |
| `success` | `boolean` | |
| `error_message` | `text` | |
| `created_at` | `timestamptz` | Default `now()` |

#### Table: `opportunity_reports`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | |
| `opportunity_id` | `uuid` | |
| `reason` | `text` | |
| `notes` | `text` | |
| `created_at` | `timestamptz` | Default `now()` |

#### Table: `suggestions` (contact form)

Referenced in `src/app/contact/page.tsx:29` via `.from("suggestions").insert({...})`

---

## 5. Supabase Queries Inventory

### Table Access Patterns

| Table | Read | Write | Update | Delete |
|-------|------|-------|--------|--------|
| `opportunities` | 30+ reads (pages, API, components) | seed, scrape | admin, check-links, track-click | admin, AI expire |
| `news_articles` | 5+ reads (news pages, sitemap) | scrape, seed-news | — | — |
| `subscribers` | admin page | subscribe | — | — |
| `link_check_logs` | — | check-links | — | — |
| `ai_usage_log` | AIAnalyticsPanel | all AI providers | — | — |
| `opportunity_reports` | — | report-issue | — | — |
| `suggestions` | — | contact page | — | — |

### Supabase Client Usage

| File | Client | Pattern |
|------|--------|---------|
| `src/lib/supabase.ts` | `supabase` (anon) + `supabaseAdmin` (service_role) | Guarded initialization |
| Most API routes | `supabaseAdmin` | Server-side data access |
| Admin page, Contact page | `supabase` (anon) | Client-side with RLS |
| `sitemap.ts` | `supabaseAdmin` (via createClient inline) | Dynamic sitemap |

### Key Query Patterns

```typescript
// Pages with active+deadline filtering
.from("opportunities").select("*")
  .eq("is_active", true)
  .or(`deadline.gte.${today},deadline.is.null`)

// Stats (count only)
.from("opportunities").select("*", { count: "exact", head: true })

// Scraper upsert
.from("opportunities").upsert(items, { onConflict: "title,organization" })

// Track clicks (increment)
.from("opportunities").update({ apply_clicks: dbClicks + 1 }).eq("id", id)
```

---

## 6. Environment Variables & Secrets

### Required by Application

| Variable | Used In | Set in Vercel? | Set Locally? |
|----------|---------|----------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/lib/supabase.ts` | ✅ | ✅ |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `src/app/admin/page.tsx:73` | ✅ | ✅ |
| `CRON_SECRET` | 6 API routes | ✅ | ✅ |

### Missing from Vercel (need manual add)

| Variable | Used In | Status |
|----------|---------|--------|
| `TELEGRAM_BOT_TOKEN` | `src/lib/telegram-bot.ts` | ❌ Need BotFather |
| `TELEGRAM_CHANNEL_ID` | `src/lib/telegram-bot.ts` | ❌ Need BotFather |
| `RESEND_API_KEY` | `src/lib/email-digest.ts` | ❌ Need Resend account |
| `FROM_EMAIL` | `src/lib/email-digest.ts:6` (default fallback) | ❌ Need Resend |
| `GEMINI_API_KEY` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |
| `GROQ_API_KEY` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |
| `OPENROUTER_API_KEY` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |
| `CLOUDFLARE_AI_TOKEN` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |
| `CLOUDFLARE_ACCOUNT_ID` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |
| `HUGGINGFACE_API_KEY` | `src/lib/ai/providers.ts` | ❌ Optional AI fallback |

### 🔴 SECURITY ISSUE: Secrets Committed in `.env.local`

**File**: `electrobridge/.env.local` contains live secrets and is committed:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aqauempuwmbizqoaolop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_r3IO09AVXZd-D11-WwS3Uw_rHnJq3uj
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...0u5fIs35SW5lAtmdoxoOrFjLkBHqkPEbLC_oa925Vq4
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026
```

- The root `.gitignore` has `.env*` → but files in subdirectories may still be tracked
- `SUPABASE_SERVICE_ROLE_KEY` (full admin access to Supabase) is committed in plain text
- `CRON_SECRET` is `mysecretcron2026` (weak default)
- `NEXT_PUBLIC_ADMIN_PASSWORD` is `electrobridge2026` (weak password)

**Action Required**: Rotate all secrets and add `electrobridge/.env.local` to `.gitignore`. The service role key in particular gives full database access.

---

## 7. Scrapers & External Data Sources

### Scraper System Architecture

```
API Layer                    Orchestrator Layer              Source Layer
───────────                  ────────────────                ────────────
/api/scrape?mode=all  ───→  opportunity-scraper.ts  ───→  isro-scraper.ts
                                  +                        drdo-scraper.ts
                                  ├── csir-scraper.ts
                                  └── govt-scraper.ts ───→ drdo-scraper (reuse)
                                                 ───→ CSIR RSS feed
                                                 ───→ findaphd.com RSS [BLOCKED]

/api/scrape?mode=news  ──→  rss-parser.ts  ───→ 10 news RSS sources
/api/scrape-jobs       ──→  govt-scraper.ts (standalone)
```

### Sources & Status

| Source | Type | Scraper | Items | Status |
|--------|------|---------|-------|--------|
| ISRO Careers (`isro.gov.in`) | HTML | `isro-scraper.ts` | ~10 opps | ✅ Scraped (result filtered) |
| DRDO Vacancies (`drdo.gov.in`) | HTML | `drdo-scraper.ts` | ~6 opps | ✅ Scraped (result filtered) |
| CSIR Recruitment (`csir.res.in`) | HTML | `csir-scraper.ts` | ~3 opps | ✅ Scraped |
| CSIR RSS (careers) | RSS | `govt-scraper.ts` | varies | ✅ Filtered (no FAQ/assessment) |
| FindAPhD RSS | RSS | `govt-scraper.ts` | 0 | ⚠️ Blocked by Cloudflare |
| IEEE Spectrum | RSS | `rss-parser.ts` | news | ✅ |
| EE Times | RSS | `rss-parser.ts` | news | ✅ |
| Semicon Engineering | RSS | `rss-parser.ts` | news | ✅ |
| Electronics Weekly | RSS | `rss-parser.ts` | news | ✅ |
| The Hindu Science | RSS | `rss-parser.ts` | news | ✅ |
| Physics World | RSS | `rss-parser.ts` | news | ✅ |
| Nature Electronics | RSS | `rss-parser.ts` | news | ✅ |
| Economic Times Tech | RSS | `rss-parser.ts` | news | ✅ |
| Times of India Science | RSS | `rss-parser.ts` | news | ✅ |
| Hindustan Times Tech | RSS | `rss-parser.ts` | news | ✅ |

### Cron Schedule

- **Vercel Cron** (defined in `vercel.json`):
  - `/api/scrape?mode=all` → Every 6 hours (`0 6 * * *`)
  - `/api/send-digest` → Weekly Sunday 3am UTC / 8:30am IST (`0 3 * * 0`)
- **Supabase pg_cron** (jobid=3, `scrape-govt-jobs-daily`):
  - SQL: `select net.http_get(...)` → Daily 3:30am UTC / 9am IST (`30 3 * * *`)
  - Calls `/api/scrape-jobs`

---

## 8. Components & UI

### Component Inventory

| Component | Props | Purpose | Dependencies |
|-----------|-------|---------|-------------|
| `AIAnalyticsPanel` | — | Admin AI usage stats table | `supabase`, `ai_usage_log` |
| `AIOpportunitySummary` | `slug: string` | AI-generated summary on detail page | `fetch(/api/ai/opportunity-summary/...)` |
| `ApplyButton` | `opportunityId: string, applyLink: string` | Tracked apply CTA | `fetch(/api/track-click)` |
| `CategoryHero` | `title, description, icon` | Category page headers | — |
| `DeadlineCountdown` | `deadline: string` | Color-coded countdown badge | `date-fns` |
| `ExpiringSoon` | — | Closing-soon section on homepage | `supabase`, deadline filter |
| `Footer` | — | Site footer | — |
| `LoadingSkeleton` | — | Animated loading placeholder | — |
| `Navbar` | — | Top nav with mobile menu + orgs link | — |
| `NewsCard` | `article` | News article card | — |
| `OpportunityCard` | `opportunity` | Opportunity card with NEW badge, posted_at | `date-fns`, linked org name |
| `ReportIssueModal` | — | Issue report modal | `fetch(/api/report-issue)` |
| `SearchBar` | — | Debounced search input | — |
| `ShareButtons` | `title, url` | WhatsApp + Twitter share | — |
| `SimilarOpportunities` | `opportunityId, tags` | Tag-based similar opps grid | `supabase`, tag overlap query |
| `StatsBar` | — | Live DB counts on homepage | `supabaseAdmin` counts |
| `SubscribeModal` | — | Email signup modal | `fetch(/api/subscribe)` |
| `SubscribeSection` | — | Inline email signup | `fetch(/api/subscribe)` |

### Styling

- **Tailwind Config** (`tailwind.config.ts`): Custom colors `navy`, `navy-light`, `cyan`, `purple`, `text-primary`, `text-muted`, `success`, `warning`
- **Fonts**: Space Grotesk (display) + Inter (body) via Google Fonts
- **Dark Mode**: `html class="dark"` in `layout.tsx`
- **Plugin**: `@tailwindcss/typography` for rich text
- **CSS File**: `globals.css` — tailwind directives + body bg/text colors
- **No CSS-in-JS** or CSS modules used

### UI Patterns Observed

- ✅ Dynamic className generation with template literals (status badges, deadline colors)
- ✅ `clsx` library available in dependencies (for conditional classes)
- ✅ `sonner` installed for toast notifications
- ❌ No form validation library (plain HTML forms + state)
- ✅ Responsive mobile-first approach in components
- ✅ Server components for page content, client components for interactivity

---

## 9. Configuration Files

### `next.config.mjs`
- Remote images: all HTTPS hosts allowed
- Redirect: `/opportunities/:uuid` → `/opportunities` (permanent: false)

### `tsconfig.json`
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- Module resolution: `bundler`
- JSX: `preserve`

### `tailwind.config.ts`
- Custom colors (8 colors)
- Custom font families (display + body)
- Content paths: `src/pages/`, `src/components/`, `src/app/`

### `package.json`
- Scripts: `dev`, `build`, `start`, `lint`
- Key deps: `@supabase/supabase-js`, `cheerio`, `clsx`, `date-fns`, `lucide-react`, `next@14.2.0`, `resend`, `rss-parser`
- Dev deps: `pg` installed in devDependencies (unused in app code, likely for local Supabase CLI)

### `postcss.config.mjs`
- Plugins: `tailwindcss`, `autoprefixer`

### `vercel.json`
- Crons: scrape every 6h, digest every Sunday

### `sitemap.ts`
- Dynamic sitemap: static pages + opportunities + news_articles
- Uses `createClient` inline (not shared supabase instance)

---

## 10. Known Issues & Technical Debt

### Critical
- 🔴 **`.env.local` committed with live secrets** including `SUPABASE_SERVICE_ROLE_KEY` (full database admin access)
- 🔴 **Weak admin password**: `electrobridge2026` (hardcoded fallback in `admin/page.tsx:73`)
- 🔴 **Weak CRON secret**: `mysecretcron2026` (hardcoded fallback in `check-links/route.ts:22`)

### Medium
- ⚠️ **`pg` in devDependencies**: Installed but never imported in application code (likely for `supabase db` CLI only)
- ⚠️ **`llms.txt` in public/**: Contains 10 lines (unknown content, likely AI training directive)
- ⚠️ **sitemap.ts uses inline `createClient`**: Bypasses the guarded initialization from `supabase.ts`

### Low
- 📝 **`supabase-migration.sql` is not executed via migration tool**: Must be run manually in Supabase SQL Editor
- 📝 **No TypeScript strict checks on API response types**: Most `fetch` calls use `any` or no type assertion
- 📝 **No `.nvmrc` or `.node-version`**: No pinned Node.js version
- 📝 **No `.prettierrc` or `.eslintrc` custom config**: Using Next.js defaults

### ✅ Fixed Since Initial Audit
- No toast/notification system → **sonner installed with toasts on all user actions**
- No error boundaries → **`error.tsx` + `not-found.tsx` + route-level 404s created**
- No loading states → **`LoadingSkeleton` + 4 `loading.tsx` files created**
- Google Fonts double loading → **removed `@import` from `globals.css`**
- No input validation → **email regex, UUID check, 500-char limit added**

### Blockers
- 🚫 **FindAPhD RSS**: Blocked by Cloudflare, returns 0 items gracefully
- 🚫 **BEL/HAL websites**: JS-heavy SPAs, not scrapable with cheerio alone

---

## 11. Build & Deploy

### Commands
```bash
npm run dev       # Next.js dev server (localhost:3000)
npm run build     # Production build (currently succeeds: verified)
npm run start     # Start production server
npm run lint      # ESLint (next lint)
```

### Build History
- Initial build failed due to unguarded `supabase.ts` (missing env vars at build time)
- Fixed by adding `isConfigured` guard checking both URL and key length
- Current build: ✅ Passes (verified by Vercel deployment)

### Deployment
- **Platform**: Vercel
- **Trigger**: Push to `main` branch on GitHub
- **Project ID**: `prj_f46hW6bCqJmQ6XVoRYR2olEUPFKf`
- **Root Directory**: `electrobridge`
- **Auto-deploys**: ✅ Working

---

## 12. Dependencies Analysis

### Production Dependencies (13 packages)

| Package | Version | Purpose | Size Impact |
|---------|---------|---------|-------------|
| `@supabase/supabase-js` | ^2.108.2 | Database client | Moderate |
| `@tailwindcss/typography` | ^0.5.20 | Typography plugin | Small |
| `autoprefixer` | ^10.5.2 | CSS vendor prefixes | Small (build-time) |
| `cheerio` | ^1.2.0 | HTML parsing for scrapers | Moderate |
| `clsx` | ^2.1.1 | Conditional className | Tiny |
| `date-fns` | ^3.6.0 | Date formatting/manipulation | Moderate |
| `lucide-react` | ^0.383.0 | Icons | Moderate (tree-shakable) |
| `next` | 14.2.0 | Framework | Large |
| `react` | ^18 | UI library | Large |
| `react-dom` | ^18 | DOM rendering | Large |
| `resend` | ^16.6.0 | Email sending (digest) | Small |
| `rss-parser` | ^3.13.0 | RSS feed parsing | Moderate |
| `sonner` | ^2.0.7 | Toast notifications | Tiny |
| `postcss` | ^8 | CSS processing (build-time) | Small (dev) |

### Dev Dependencies (6 packages)

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^20 | Node type defs |
| `@types/react` | ^18 | React type defs |
| `@types/react-dom` | ^18 | ReactDOM type defs |
| `eslint` | ^8 | Linting |
| `eslint-config-next` | 14.2.0 | Next.js ESLint config |
| `pg` | ^8.22.0 | PostgreSQL client (unused in app) |
| `tailwindcss` | ^3.4.1 | CSS framework |
| `typescript` | ^5 | TypeScript compiler |

### Unused Dependencies
- `pg` (devDependencies) — no imports in app code; likely for `supabase db` CLI or direct DB access

---

## 13. AI System

### Architecture

```typescript
// providers.ts — Multi-provider AI with automatic failover
PROVIDER_ORDER: ["groq", "gemini", "openrouter", "cloudflare", "huggingface"]
```

### Features Using AI

| Feature | Route/Component | Provider Used | Status |
|---------|----------------|---------------|--------|
| Chat | `/api/ai/chat` → `/chat` | First available with key | ✅ Built |
| Match | `/api/ai/match` → `/match` | First available with key | ✅ Built |
| Search | `/api/ai/search` → Opportunities page | First available with key | ✅ Built |
| Summarize | `/api/ai/summarize` | First available with key | ✅ Built |
| Opportunity Summary | `/api/ai/opportunity-summary/[slug]` | First available with key | ✅ Built |
| Auto-Expire | `/api/ai/expire` (cron) | First available with key | ✅ Built |

### Provider Requirement Status

- **None configured**: All API keys are missing from Vercel env
- **Fallback behavior**: AI routes gracefully degrade; `callAI()` throws "All AI providers failed" if none configured
- **Usage logging**: All calls (success/failure) logged to `ai_usage_log` table

---

## 14. Security Audit

| Issue | Severity | Location | Recommendation |
|-------|----------|----------|----------------|
| `.env.local` committed | 🔴 Critical | Repository root | Rotate all secrets, add to `.gitignore`, scrub git history |
| Weak admin password | 🔴 Critical | `admin/page.tsx:73` | Change `NEXT_PUBLIC_ADMIN_PASSWORD` in Vercel env |
| Weak cron secret | 🔴 High | `check-links/route.ts:22` | Change `CRON_SECRET` in Vercel env |
| No rate limiting on API | ⚠️ Medium | All API routes | Add rate limiting to remaining public endpoints |
| No input validation | ⚠️ Medium | Contact form, subscribe | Validate email format, sanitize text inputs |
| No CORS configuration | ⚠️ Low | API routes | Add CORS headers if needed for external access |
| `service_role` key in client env | ⚠️ Medium | `.env.local` | Service role key should not be in `.env.local` (only in Vercel env) |

---

## 15. Recommendations (Priority Order)

### ✅ Completed Since Initial Audit
- Toast notifications (sonner) installed and wired to subscribe, report, contact
- `error.tsx` + `not-found.tsx` + route-level 404s created
- `loading.tsx` files + `LoadingSkeleton` component created
- Google Fonts double loading fixed (removed `@import` from globals.css)
- Input validation on subscribe (email regex) and report (UUID check, 500-char limit)
- SEO metadata added for chat, match, organizations pages
- Admin: edit/delete opportunity page (`/admin/edit-opportunity/[id]`)
- Admin: add news article page (`/admin/add-news`)
- Admin: add opportunity page (`/admin/add-opportunity`)
- Rate limiting added to subscribe API (3 req/IP/hour via in-memory Map)
- Sitemap guard added (gracefully falls back to static URLs when DB unconfigured)
- News dedup: check-then-insert by source_url + `/api/cleanup-news` endpoint
- Opportunity scraper dedup: same check-then-insert pattern
- ISR: `generateStaticParams` + `revalidate` on opps (3600s) and news (1800s) detail pages
- Homepage stats fixed: 6 cards, full-ISO deadline comparison, govt counter works
- Plausible analytics script added to layout.tsx
- News image `onError` extracted to client `NewsImage` component (fixes SSG build)

### Immediate (Security)
1. **Rotate and remove secrets from git**: Rotate `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, review admin password. Delete `.env.local` from git tracking, add to `.gitignore`. Consider using `git-filter-repo` to scrub history.
2. **Set all env vars in Vercel**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `RESEND_API_KEY`, `FROM_EMAIL` are still missing.

### Short Term (Quality of Life)
3. **Stronger admin password**: Generate a random one, store only in Vercel env.

### Medium Term (Features)
4. **Create Telegram bot via @BotFather**: Add TELEGRAM_BOT_TOKEN env var to enable auto-posting.
5. **Create Resend account**: Add RESEND_API_KEY + FROM_EMAIL to enable weekly digest.
6. **Configure at least one AI provider**: Get a free Groq or Gemini API key to enable AI features.
7. **Set OPENAI_API_KEY env var**: Required by opencode.json config for OpenCode's own AI provider.
8. **Run supabase-cleanup.sql**: Add unique constraint on news_articles.source_url, then hit POST /api/cleanup-news.

### Long Term (Architecture)
9. **Move `supabase-migration.sql` to Supabase migrations folder**: Use proper migration tooling.
10. **Persistent rate limiter**: Replace in-memory Map with DB-backed or Redis-based for production scale.
11. **Add more scrapers**: Explore BEL, HAL, and other PSU websites (would need headless browser).