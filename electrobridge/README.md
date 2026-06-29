# ElectroBridge

Your gateway to electronics & semiconductor opportunities in India and globally. Aggregates JRF/PhD/government/private sector positions, tech news, and research resources — all in one place.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components)
- **Database:** Supabase (PostgreSQL, RLS)
- **Styling:** Tailwind CSS (dark theme)
- **AI:** Groq, Gemini, OpenRouter, Cloudflare Workers AI, HuggingFace (multi-provider fallback)
- **Deployment:** Vercel (root: `electrobridge/`)

## Features

### Opportunities
- 7 category pages: JRF, SRF, PhD, Govt Jobs, Fellowships, Private Sector, International
- Dynamic filtering, search, eligibility/location filters
- Verification system (verified/unverified/expired)
- Link checking automation
- Calendar export for deadlines

### Tech News
- RSS scraper fetching from 18 electronics-specific sources
- Multi-layer AI filter: hard blocklist → keyword whitelist → auto-tagging (20+ tags)
- Category tabs, search, source color badges
- News detail pages with NewsArticle schema

### AI Integration
- **Smart Search** — AI-parsed search queries with chip filters
- **Opportunity Matcher** — Describe your profile, get matched opportunities
- **AI Chat** — Ask questions about the platform, opportunities, research careers
- **Summarizer** — Auto-summarize opportunity descriptions
- **Expiry Checker** — Cron endpoint to auto-expire outdated listings
- **Weekly Digest** — AI-generated newsletter content
- **Usage Analytics** — Admin panel tracks per-provider/feature usage

### Resource Guides
- JRF Complete Guide (FAQPage schema, stipend table, live feed)
- International Fellowships (DAAD, SINGA, MEXT, Marie Curie comparison)
- VLSI Career Guide (roles, companies, salary tables)
- NET vs GATE Comparison

### Other Features
- Organization pages (per-org opportunity listings)
- Find My Match (profile-based matching)
- Admin panel (add/edit/expire opportunities, add news, add opportunity, view subscribers, AI analytics, trigger scrapes)
- Weekly email digests
- Contact/suggestions form
- Full SEO with JSON-LD schemas, sitemap, Open Graph
- ISR (Incremental Static Regeneration) on detail pages (3600s opps, 1800s news)
- Input validation (email regex, UUID check, 500-char limit on reports)
- Rate limiting (3 requests/IP/hour on subscribe API)
- Plausible analytics (privacy-first)
- News dedup (check-then-insert by source_url + cleanup API endpoint)

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Supabase Setup

Create a project at [supabase.com](https://supabase.com). Apply migrations:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Or run the SQL files in `supabase/migrations/` manually.

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026

# AI Providers (optional — each is auto-detected)
GROQ_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
CLOUDFLARE_AI_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Seed Data

```bash
curl http://localhost:3000/api/seed
```

## Deploy to Vercel

1. Push to GitHub
2. Import project — set root directory to `electrobridge/`
3. Add all environment variables
4. Deploy

## Admin Panel

Access `/admin` with password (default: `electrobridge2026`).

Tabs:
- **Dashboard** — Stats overview
- **Add Opportunity** — Manual entry form
- **AI Usage** — Provider/feature usage analytics
- **Subscribers** — Email subscriber list
- **Actions** — Trigger scrape, check links, generate digest

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/opportunities` | GET | List opportunities (with filters) |
| `/api/opportunities` | POST | Create opportunity |
| `/api/opportunities/[id]` | GET/PATCH/DELETE | Single opportunity CRUD |
| `/api/news` | GET | List news articles (search, tag, limit) |
| `/api/news/scrape` | GET | Trigger RSS scrape (protected) |
| `/api/subscribe` | POST | Subscribe email (rate limited: 3/IP/hr) |
| `/api/subscribe?email=` | DELETE | Unsubscribe |
| `/api/cleanup-news` | POST | Deduplicate news by source_url (protected) |
| `/api/report-issue` | POST | Report broken link (UUID + 500-char validation) |
| `/api/seed` | GET | Seed sample data |
| `/api/ai/match` | POST | AI opportunity matcher |
| `/api/ai/search` | GET | AI smart search |
| `/api/ai/chat` | POST | AI chat assistant |
| `/api/ai/opportunity-summary/[slug]` | GET | AI summary for opportunity |
| `/api/ai/expire` | GET | Auto-expire outdated listings |
| `/api/calendar-export/[id]` | GET | Download .ics calendar file |

## RSS News Sources

The scraper fetches from 10 RSS sources: IEEE Spectrum, EE Times, Semiconductor Engineering, Electronics Weekly, The Hindu Science, Physics World, Nature Electronics, Economic Times Tech, Times of India Science, Hindustan Times Tech — plus 3 HTML scrapers (ISRO, DRDO, CSIR).
