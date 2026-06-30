# PROJECT_AUDIT.md

## 1. Project Overview

### What this project does
ElectroBridge is a one-stop aggregator platform for electronics and semiconductor research opportunities in India and globally. It collects JRF/SRF/PhD positions, government research jobs, private sector roles, fellowships, and tech news from across the web and presents them in a searchable, verified, filterable dashboard. The platform uses AI (multi-provider fallback) for smart search, opportunity matching, summarization, news filtering, chatbot, newsletter generation, and expiry checking.

### Tech stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.0 | React framework (App Router) |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4.1 | Styling (dark theme) |
| Supabase JS | ^2.108.2 | Database client |
| @supabase/ssr | latest | Supabase SSR auth (middleware, client/server clients) |
| PostgreSQL | (via Supabase) | Database |
| PostCSS | ^8 | CSS processing |
| Autoprefixer | ^10.5.2 | CSS vendor prefixes |
| cheerio | ^1.2.0 | HTML parsing for scrapers |
| clsx | ^2.1.1 | Class name utility |
| date-fns | ^3.6.0 | Date formatting |
| lucide-react | ^0.383.0 | Icons |
| resend | ^6.16.0 | Email sending (weekly digest) |
| rss-parser | ^3.13.0 | RSS feed parsing |
| sonner | ^2.0.7 | Toast notifications |
| @tailwindcss/typography | ^0.5.20 | Prose styling |
| eslint | ^8 | Linting |
| eslint-config-next | 14.2.0 | Next.js ESLint config |
| pg | ^8.22.0 | PostgreSQL client (scripts) |

### Deployment config
- **Vercel deployment** (root: `electrobridge/`):
  - `vercel.json` defines 2 cron jobs:
    - `0 6 * * *` → `/api/scrape?mode=all` (daily scrape at 6 AM)
    - `0 3 * * 0` → `/api/send-digest` (weekly digest Sunday 3 AM)
- **next.config.mjs**:
  - Images: all remote patterns allowed (https)
  - Redirect: UUID-based opportunity URLs → `/opportunities`
- **Robots**: index + follow enabled
- **Sitemap**: auto-generated via `src/app/sitemap.ts`
- **Open Graph**: auto-generated OG images via `src/app/api/og/`

---

## 2. Folder & File Structure

```
root/
├── .gitattributes
├── .github/workflows/
│   ├── ci.yml                          # CI workflow
│   └── deploy.yml                      # Deploy workflow
├── .gitignore
├── opencode.json                       # OpenCode AI config
├── README.md                           # Root project README
├── electrobridge_logo.png              # Logo image
├── electrobridge/                      # MAIN APPLICATION
│   ├── .env.local.example              # Env var template
│   ├── .eslintrc.json                  # ESLint config (next/core-web-vitals)
│   ├── .gitignore
│   ├── AUTH_SETUP.md                   # Supabase Auth setup guide
│   ├── DASHBOARD_SUMMARY.md            # User Dashboard & Auth summary
│   ├── DESIGN_SYSTEM.md                # Figma design tokens documentation
│   ├── IMPLEMENTATION_PROGRESS.md       # UI refactor progress tracker
│   ├── README.md                       # App README
│   ├── REFACTOR_SUMMARY.md             # UI refactor summary
│   ├── next-env.d.ts                   # Next.js type declarations
│   ├── next.config.mjs                 # Next.js config (images, redirects)
│   ├── package-lock.json               # Dependency lockfile
│   ├── package.json                    # Dependencies & scripts
│   ├── postcss.config.mjs              # PostCSS config (tailwindcss plugin)
│   ├── tailwind.config.ts              # Tailwind design system config
│   ├── tsconfig.json                   # TypeScript config
│   ├── vercel.json                     # Vercel config (crons)
│   ├── supabase-cleanup.sql            # Quick cleanup SQL
│   ├── supabase-migration.sql          # Initial migration
│   ├── supabase-migration-v2.sql       # V2 migration
│   ├── supabase/
│   │   ├── .temp/                      # Supabase CLI local config
│   │   └── migrations/
│   │       ├── 20260501000001_fix_duplicates_and_cleanup.sql
│   │       ├── 20260501000002_verification_and_slugs.sql
│   │       ├── 20260501000003_cleanup_irrelevant_news.sql
│   │       ├── 20260501000004_ai_usage_log.sql
│   │       ├── 20260501000005_news_slug_suggestions.sql
│   │       └── 20260630000001_user_profiles.sql
│   ├── scripts/
│   │   ├── supabase-setup.mjs          # Node.js Supabase DB setup script
│   │   ├── test-scrapers.mjs           # Scraper test script
│   │   └── test-scrapers2.mjs          # DRDO scraper test script
│   ├── public/
│   │   ├── llms.txt                    # LLM context file
│   │   ├── logo.svg                    # SVG logo
│   │   ├── next.svg                    # Next.js logo
│   │   └── vercel.svg                  # Vercel logo
│   └── src/
│       ├── middleware.ts                # Supabase session refresh middleware
│       ├── types/
│       │   └── index.ts                # All TypeScript interfaces
│       ├── lib/
│       │   ├── supabase.ts             # Supabase client init
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client (@supabase/ssr)
│   │   │   └── server.ts             # Server Supabase client (cookies)
│       │   ├── utils.ts                # Utility functions & constants
│       │   ├── email-digest.ts         # Weekly email digest builder
│       │   ├── rate-limiter.ts         # In-memory rate limiter
│       │   ├── seed-data.ts            # 10 seed opportunities
│       │   ├── telegram-bot.ts         # Telegram notification sender
│       │   └── ai/
│       │       ├── providers.ts        # Multi-provider AI engine (6 providers)
│       │       ├── summarizer.ts       # AI opportunity summarizer
│       │       ├── matcher.ts          # AI opportunity matcher
│       │       ├── news-filter-ai.ts   # AI news relevance filter
│       │       ├── newsletter.ts       # AI weekly digest generator
│       │       ├── search-parser.ts    # AI natural language search parser
│       │       └── expiry-checker.ts   # AI expiry checker
│       │   └── scrapers/
│       │       ├── types.ts            # Scraper type definitions
│       │       ├── utils.ts            # Scraper utilities (cleanTitle, slugify)
│       │       ├── news-filter.ts      # Electronics keyword filter (blocklist + whitelist)
│       │       ├── rss-parser.ts       # RSS feed fetcher (18 sources)
│       │       ├── opportunity-scraper.ts  # Meta-scraper orchestrator
│       │       ├── csir-scraper.ts     # CSIR website scraper
│       │       ├── drdo-scraper.ts     # DRDO website scraper
│       │       ├── isro-scraper.ts     # ISRO website scraper
│       │       └── govt-scraper.ts     # Govt jobs orchestrator (CSIR RSS only; DRDO moved to opportunity-scraper.ts)
│       ├── components/
│       │   ├── Navbar.tsx              # Navigation bar with dropdowns
│       │   ├── Footer.tsx              # Site footer
│       │   ├── OpportunityCard.tsx     # Opportunity listing card
│       │   ├── NewsCard.tsx            # News article card
│       │   ├── FilterBar.tsx           # Category/eligibility/location/deadline filters
│       │   ├── SearchBar.tsx           # Search input
│       │   ├── CategoryBadge.tsx       # Colored category badge
│       │   ├── DeadlineCountdown.tsx   # Live deadline countdown timer
│       │   ├── VerificationBadge.tsx   # Verification status badge
│       │   ├── ApplyButton.tsx         # Apply button with tracking
│       │   ├── ShareButtons.tsx        # Social share (WhatsApp, Twitter, etc.)
│       │   ├── SimilarOpportunities.tsx # Similar opportunities widget
│       │   ├── CopyLinkButton.tsx      # Copy-to-clipboard link
│       │   ├── LinkTypeIndicator.tsx   # Apply link type indicator
│       │   ├── OpportunityDisclaimer.tsx # Report issue + disclaimer
│       │   ├── ReportIssueModal.tsx    # Modal for reporting issues
│       │   ├── SubscribeSection.tsx    # Email subscribe form
│       │   ├── SubscribeModal.tsx      # Subscribe modal
│       │   ├── ExpiringSoon.tsx        # Expiring opportunities section
│       │   ├── NewsImage.tsx           # News article image with fallback
│       │   ├── LoadingSkeleton.tsx     # Loading skeleton placeholder
│       │   ├── AIOpportunitySummary.tsx # AI insights on detail pages
│       │   ├── AIAnalyticsPanel.tsx    # Admin AI usage analytics
│       │   └── SearchBar.tsx           # Search bar component
│       └── app/
│           ├── layout.tsx              # Root layout (Navbar + Footer + Toaster)
│           ├── page.tsx                # Homepage (hero, stats, opportunities, news)
│           ├── globals.css             # Global styles + design tokens
│           ├── error.tsx               # Error boundary
│           ├── loading.tsx             # Root loading
│           ├── not-found.tsx           # 404 page
│           ├── robots.ts               # Robots config
│           ├── sitemap.ts              # Sitemap generator
│           ├── about/page.tsx          # About page
│           ├── contact/page.tsx        # Contact/suggestions page
│           ├── favorites/page.tsx      # Bookmarks page
│           ├── categories/page.tsx     # Categories overview page
│           ├── category/[category]/page.tsx  # Category detail page
│           ├── chat/
│           │   ├── layout.tsx          # Chat layout
│           │   ├── page.tsx            # AI chatbot page
│           │   └── loading.tsx         # Chat loading state
│           ├── match/
│           │   ├── layout.tsx          # Match layout
│           │   └── page.tsx            # Find My Match page
│           ├── news/
│           │   ├── page.tsx            # News listing page
│           │   ├── loading.tsx         # News loading state
│           │   └── [slug]/
│           │       ├── page.tsx        # News detail page
│           │       └── not-found.tsx   # News 404
│           ├── opportunities/
│           │   ├── page.tsx            # All opportunities (client-side filters)
│           │   ├── loading.tsx         # Opportunities loading state
│           │   └── [slug]/
│           │       ├── page.tsx        # Opportunity detail page (ISR 3600s)
│           │       ├── loading.tsx     # Detail loading state
│           │       └── not-found.tsx   # Detail 404
│           ├── organizations/
│           │   ├── page.tsx            # Organizations listing
│           │   └── [slug]/page.tsx     # Organization detail
│           ├── resources/
│           │   ├── page.tsx            # Resources hub
│           │   ├── jrf-guide/page.tsx  # JRF complete guide
│           │   ├── international-fellowships/page.tsx  # International fellowships guide
│           │   ├── phd-guide/page.tsx  # PhD admission guide
│           │   ├── net-vs-gate/page.tsx  # NET vs GATE comparison
│           │   └── vlsi-careers/page.tsx  # VLSI career guide
│           └── api/
│               ├── admin/recheck-link/route.ts
│               ├── ai/
│               │   ├── chat/route.ts
│               │   ├── expire/route.ts
│               │   ├── match/route.ts
│               │   ├── opportunity-summary/[slug]/route.ts
│               │   ├── search/route.ts
│               │   └── summarize/route.ts
│               ├── calendar-export/[id]/route.ts
│               ├── check-links/route.ts
│               ├── cleanup-news/route.ts
│               ├── news/route.ts
│               ├── og/
│               │   ├── route.tsx
│               │   └── opportunity/[slug]/route.tsx
│               ├── opportunities-feed/route.ts
│               ├── opportunities/
│               │   ├── route.ts
│               │   └── [id]/route.ts
│               ├── organizations/route.ts
│               ├── report-issue/route.ts
│               ├── scrape/route.ts
│               ├── scrape-jobs/route.ts
│               ├── scrape-opportunities/route.ts
│               ├── seed/route.ts
│               ├── seed-news/route.ts
│               ├── send-digest/route.ts
│               ├── similar/[id]/route.ts
│               ├── subscribe/route.ts
│               └── track-click/route.ts
├── ElectroBridge Web App Design/       # Figma design files
└── docs/
    ├── 00_START_HERE.md                # Quick reference card
    ├── 01_AI_INTEGRATION_PROMPT.md     # AI integration master prompt
    ├── 01_MASTER_PROMPT.md             # Complete build prompt
    ├── 01_PLATFORM_BLUEPRINT.md        # Platform blueprint with SEO
    ├── 02_API_KEYS_GUIDE.md            # API keys guide
    ├── 02_BUILD_PROMPT.md              # Build prompt
    ├── 02_SETUP_GUIDE.md               # Setup guide
    ├── 03_OPENCODE_PROMPTS.md          # OpenCode prompts
    ├── 04_WEEKLY_MAINTENANCE.md        # Weekly maintenance guide
    ├── API KEYS.md                     # API keys reference
    ├── MASTER_CONTEXT.md               # Master context document
    ├── OPENCODE_STARTER_PROMPT.txt     # Starter prompt for OpenCode
    ├── PROJECT_AUDIT.md                # Previous audit (this file)
    └── TASKS.md                        # Task tracking
```

---

## 3. Database Schema (Supabase)

### Table: `opportunities`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| title | text | NOT NULL | |
| organization | text | NOT NULL | |
| category | text | NOT NULL | One of: JRF, SRF, PhD, Govt Job, Private Job, Fellowship |
| location | text | nullable | |
| stipend | text | nullable | |
| deadline | date | nullable | |
| eligibility | text | nullable | |
| description | text | nullable | |
| apply_link | text | nullable | |
| source_url | text | UNIQUE | Dedup key for scraping |
| is_active | boolean | default true | |
| created_at | timestamptz | default now() | |
| posted_at | timestamptz | default now() | For "X days ago" display |
| tags | text[] | nullable | Array of tag strings |
| slug | text | UNIQUE, NOT NULL | SEO-friendly URL |
| org_slug | text | nullable | For organization pages |
| verification_status | text | default 'unverified', CHECK | verified / unverified / link_unavailable / expired |
| verified_at | timestamptz | nullable | |
| official_page_url | text | nullable | |
| apply_link_type | text | default 'homepage', CHECK | direct / homepage / pdf / email / portal |
| last_link_checked | timestamptz | nullable | |
| link_check_status | integer | nullable | HTTP status code |
| admin_notes | text | nullable | |
| apply_clicks | integer | default 0 | |

**Triggers/Functions:**
- `generate_slug(title, organization, category)` — PL/pgSQL function that generates unique slug
- `auto_slug()` — BEFORE INSERT trigger that auto-generates slug if NULL

**RLS Policies:**
- `Public can read opportunities` — FOR SELECT using (true)
- (Others likely set via service_role bypass)

### Table: `news_articles`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| title | text | NOT NULL | |
| summary | text | nullable | |
| source | text | nullable | |
| source_url | text | UNIQUE | Dedup key |
| published_at | timestamptz | nullable | |
| image_url | text | nullable | |
| tags | text[] | nullable | |
| created_at | timestamptz | default now() | |
| slug | text | UNIQUE | Added in migration 5 |

**RLS Policies:**
- `Public can read news` — FOR SELECT using (true)

### Table: `subscribers`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| email | text | UNIQUE, NOT NULL | |
| keywords | text[] | nullable | |
| categories | text[] | nullable | |
| created_at | timestamptz | default now() | |
| is_active | boolean | default true | |

**RLS Policies:**
- `Anyone can subscribe` — FOR INSERT with check (true)

### Table: `ai_usage_log`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| feature | text | NOT NULL | |
| provider | text | NOT NULL | |
| model | text | nullable | |
| prompt_length | integer | nullable | |
| response_length | integer | nullable | |
| success | boolean | default true | |
| error_message | text | nullable | |
| created_at | timestamptz | default now() | |

**Indexes:**
- idx_ai_usage_log_created_at (created_at DESC)
- idx_ai_usage_log_feature (feature)
- idx_ai_usage_log_provider (provider)

**RLS Policies:**
- `Admin can read ai_usage_log` — FOR SELECT using (true)
- `Service role can insert ai_usage_log` — FOR INSERT with check (true)

### Table: `link_check_logs`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| opportunity_id | uuid | FK → opportunities(id) ON DELETE CASCADE | |
| checked_at | timestamptz | default now() | |
| http_status | integer | nullable | |
| is_reachable | boolean | nullable | |
| error_message | text | nullable | |

### Table: `opportunity_reports`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| opportunity_id | uuid | FK → opportunities(id) | |
| report_type | text | nullable | broken_link / wrong_info / expired / other |
| description | text | nullable | |
| reported_at | timestamptz | default now() | |
| is_resolved | boolean | default false | |

**RLS Policies:**
- `Anyone can report` — FOR INSERT with check (true)

### Table: `telegram_subscribers`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| chat_id | text | UNIQUE, NOT NULL | |
| keywords | text[] | nullable | |
| categories | text[] | nullable | |
| created_at | timestamptz | default now() | |
| is_active | boolean | default true | |

**RLS Policies:**
- `Service role only` — FOR ALL using (false)

### Table: `calendar_exports`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| opportunity_id | uuid | FK → opportunities(id) | |
| exported_at | timestamptz | default now() | |

### Table: `suggestions`
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| type | text | nullable | |
| url | text | nullable | |
| notes | text | nullable | |
| contact_email | text | nullable | |
| submitted_at | timestamptz | default now() | |
| is_reviewed | boolean | default false | |

**RLS Policies:**
- `Anyone can insert suggestions` — FOR INSERT with check (true)
- `Admin can read suggestions` — FOR SELECT using (true)

### Table: `user_profiles` (added in migration 20260630000001)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, FK → auth.users(id) ON DELETE CASCADE | |
| full_name | text | nullable | |
| qualification | text | nullable | MSc, BTech, MTech, PhD, etc. |
| specialization | text | nullable | thin film, VLSI, embedded… |
| has_net | boolean | default false | NET qualified |
| has_gate | boolean | default false | GATE qualified |
| preferred_location | text | nullable | |
| resume_ats_score | integer | default 0 | |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**RLS Policies:**
- `Users can view own profile` — FOR SELECT using (auth.uid() = id)
- `Users can update own profile` — FOR UPDATE using (auth.uid() = id)
- `Users can insert own profile` — FOR INSERT with check (auth.uid() = id)

**Triggers:**
- `on_auth_user_created` — AFTER INSERT ON auth.users → calls `handle_new_user()` which inserts basic profile with full_name from user_metadata

### Table: `saved_opportunities` (added in migration 20260630000001)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK → auth.users(id) ON DELETE CASCADE | |
| opportunity_id | uuid | FK → opportunities(id) ON DELETE CASCADE | |
| created_at | timestamptz | default now() | |
| UNIQUE constraint | (user_id, opportunity_id) | Prevents duplicates | |

**RLS Policies:**
- `Users can view own saved` — FOR SELECT using (auth.uid() = user_id)
- `Users can insert own saved` — FOR INSERT with check (auth.uid() = user_id)
- `Users can delete own saved` — FOR DELETE using (auth.uid() = user_id)

### Table: `applications` (added in migration 20260630000001)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK → auth.users(id) ON DELETE CASCADE | |
| opportunity_id | uuid | FK → opportunities(id) ON DELETE CASCADE | |
| status | text | default 'applied', CHECK | applied / under_review / shortlisted / rejected / accepted |
| applied_at | timestamptz | default now() | |
| notes | text | nullable | |
| updated_at | timestamptz | default now() | |

**RLS Policies:**
- `Users can view own applications` — FOR SELECT using (auth.uid() = user_id)
- `Users can insert own applications` — FOR INSERT with check (auth.uid() = user_id)
- `Users can update own applications` — FOR UPDATE using (auth.uid() = user_id)
- `Users can delete own applications` — FOR DELETE using (auth.uid() = user_id)

### Table: `user_alerts` (added in migration 20260630000001)
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| user_id | uuid | FK → auth.users(id) ON DELETE CASCADE | |
| keywords | text[] | nullable | |
| categories | text[] | nullable | |
| is_active | boolean | default true | |
| created_at | timestamptz | default now() | |

**RLS Policies:**
- `Users can manage own alerts` — FOR ALL using (auth.uid() = user_id)

---

## 4. Pages & Routes

### Homepage
- **File:** `src/app/page.tsx`
- **Route:** `/`
- **Type:** Server component (async)
- **Data fetched:** Stats (7 counts from opportunities + news_articles), latest 6 opportunities, latest 10 news articles, trending tags (aggregated from all active opportunities)
- **Renders:** Hero section with verified count badge, headline, CTAs; 6 stat cards; ExpiringSoon section; Latest Opportunities grid (3 cols); Latest Tech News horizontal scroll; Trending Topics tag cloud; Subscribe CTA section. JSON-LD FAQPage + WebSite schema.

### All Opportunities
- **File:** `src/app/opportunities/page.tsx`
- **Route:** `/opportunities`
- **Type:** Client component
- **Data fetched:** GET `/api/opportunities?category=&eligibility=&location=&deadline=&search=&verified=` — fetches on mount and when filters change; optionally POST `/api/ai/search` for AI search parsing
- **Renders:** Page title, SearchBar with AI chip extraction, "Show unverified" toggle, FilterBar (4 dropdowns), opportunity grid (3 cols), loading spinner, empty state with reset button.

### Opportunity Detail
- **File:** `src/app/opportunities/[slug]/page.tsx`
- **Route:** `/opportunities/[slug]`
- **Type:** Server component with ISR (revalidate: 3600s)
- **Data fetched:** Single opportunity by slug from Supabase; generateStaticParams pre-renders all active slugs
- **Renders:** Breadcrumb, expired/unverified/link_unavailable banners, title, org, verification info, metadata grid (4 cols: location, stipend, deadline, eligibility), description, tags, link type indicator, apply buttons (main + official + calendar), quick facts, share buttons + copy link, AIOpportunitySummary (lazy client), OpportunityDisclaimer, SimilarOpportunities. JSON-LD JobPosting + BreadcrumbList schema.

### Category Page
- **File:** `src/app/category/[category]/page.tsx`
- **Route:** `/category/jrf`, `/category/srf`, `/category/phd`, `/category/govt-job`, `/category/fellowship`, `/category/private`, `/category/international`
- **Type:** Server component
- **Data fetched:** Opportunities filtered by category (URL param)
- **Renders:** Category-specific hero with SEO content, opportunity count, FAQ accordion with FAQPage schema, opportunity grid.

### News Listing
- **File:** `src/app/news/page.tsx`
- **Route:** `/news`
- **Type:** Client component
- **Data fetched:** GET `/api/news?limit=50&search=&tag=`
- **Renders:** Search bar, category tabs (Semiconductor, VLSI, Research, Industry, Space, All), news article cards grid.

### News Detail
- **File:** `src/app/news/[slug]/page.tsx`
- **Route:** `/news/[slug]`
- **Type:** Server component with ISR (revalidate: 1800s)
- **Data fetched:** Single news article by slug
- **Renders:** Back link, article image (NewsImage with error fallback), title, source badge, published date, summary paragraph, tags, source link. JSON-LD NewsArticle schema.

### Categories Overview
- **File:** `src/app/categories/page.tsx`
- **Route:** `/categories`
- **Type:** Server component
- **Data fetched:** 7 category counts from Supabase
- **Renders:** 7 category cards with icons + live DB counts.

### Organizations Listing
- **File:** `src/app/organizations/page.tsx`
- **Route:** `/organizations`
- **Type:** Server component
- **Data fetched:** GET `/api/organizations`
- **Renders:** Organization cards grid with opportunity counts per org.

### Organization Detail
- **File:** `src/app/organizations/[slug]/page.tsx`
- **Route:** `/organizations/[slug]`
- **Type:** Server component with ISR
- **Data fetched:** Opportunities filtered by org_slug
- **Renders:** Org header with count, opportunity cards grid, empty state.

### Find My Match
- **File:** `src/app/match/page.tsx`
- **Route:** `/match`
- **Type:** Client component (with layout.tsx)
- **Data fetched:** Posts to `/api/ai/match` with user profile
- **Renders:** Multi-step form (qualification, specialization, NET/GATE status, location, interests), results as matched opportunity cards with score + AI reason.

### AI Chat
- **File:** `src/app/chat/page.tsx`
- **Route:** `/chat`
- **Type:** Client component (with layout.tsx + loading.tsx)
- **Data fetched:** POST `/api/ai/chat` with conversation messages
- **Renders:** Chat interface with message bubbles, suggestion chips, provider badge.

### About
- **File:** `src/app/about/page.tsx`
- **Route:** `/about`
- **Type:** Server component
- **Data fetched:** Real Supabase counts (active opportunities, distinct organizations, news articles)
- **Renders:** Mission, stats (live DB counts), coverage cards (6), verification steps (4), FAQ (6 items), CTA. JSON-LD WebSite + FAQPage schema.

### Login
- **File:** `src/app/login/page.tsx`
- **Route:** `/login`
- **Type:** Client component
- **Data fetched:** Posts to `supabase.auth.signInWithPassword()` or OAuth
- **Renders:** Email/password form + "Sign in with Google" button. Figma dark theme card. Links to /signup. Toast errors on failure.

### Signup
- **File:** `src/app/signup/page.tsx`
- **Route:** `/signup`
- **Type:** Client component
- **Data fetched:** Posts to `supabase.auth.signUp()` (email) or OAuth
- **Renders:** Full name, email, password fields + "Sign up with Google". Shows "Check your email to confirm" success screen. Links to /login.

### Dashboard
- **File:** `src/app/dashboard/page.tsx`
- **Route:** `/dashboard` (protected — redirects to /login if no session)
- **Type:** Client component
- **Data fetched:** saved_opportunities count, applications count + joined with opportunities, user_profiles (resume_ats_score), user_alerts count
- **Renders:** 4 stat cards (Saved, Applications, Resume Score, Active Alerts), Application Tracker (left column), Resume Score circular progress + improvement tips (right), Upcoming Deadlines countdowns (right). "Build Resume" link to /profile.

### Profile
- **File:** `src/app/profile/page.tsx`
- **Route:** `/profile` (protected — redirects to /login if no session)
- **Type:** Client component
- **Data fetched:** user_profiles by current user ID
- **Renders:** Form with full_name, qualification (select), specialization, hasNET/GATE checkboxes, preferred_location. Upserts to user_profiles on save.

### Auth Callback
- **File:** `src/app/auth/callback/route.ts`
- **Route:** `GET /auth/callback`
- **Type:** Server component (API route)
- **What it does:** Exchanges OAuth code for session via `supabase.auth.exchangeCodeForSession()`, redirects to /dashboard

### Contact
- **File:** `src/app/contact/page.tsx`
- **Route:** `/contact`
- **Type:** Client component
- **Data fetched:** Posts to suggestions table via Supabase
- **Renders:** Contact form (name, email, type, url, notes), submit handler.

### Resources Hub
- **File:** `src/app/resources/page.tsx`
- **Route:** `/resources`
- **Type:** Server component
- **Renders:** 5 resource guide cards linking to sub-pages.

### Resource: JRF Guide
- **File:** `src/app/resources/jrf-guide/page.tsx`
- **Route:** `/resources/jrf-guide`
- **Type:** Server component
- **Data fetched:** Latest 3 JRF opportunities from Supabase (live feed)
- **Renders:** Full guide with stipend table, application process, FAQPage schema.

### Resource: PhD Guide
- **File:** `src/app/resources/phd-guide/page.tsx`
- **Route:** `/resources/phd-guide`
- **Type:** Server component
- **Data fetched:** Latest 3 PhD opportunities (live feed)
- **Renders:** 3 admission routes, top institutions, funding, timeline.

### Resource: International Fellowships
- **File:** `src/app/resources/international-fellowships/page.tsx`
- **Route:** `/resources/international-fellowships`
- **Type:** Server component
- **Renders:** DAAD, SINGA, MEXT, Marie Curie comparison with stipend/eligibility tables.

### Resource: VLSI Careers
- **File:** `src/app/resources/vlsi-careers/page.tsx`
- **Route:** `/resources/vlsi-careers`
- **Type:** Server component
- **Renders:** Roles, top companies, salary tables for VLSI careers.

### Resource: NET vs GATE
- **File:** `src/app/resources/net-vs-gate/page.tsx`
- **Route:** `/resources/net-vs-gate`
- **Type:** Server component
- **Data fetched:** Latest 3 opportunities (live feed)
- **Renders:** Full comparison table, FAQPage schema.

### Admin Panel
- **File:** `src/app/admin/page.tsx`
- **Route:** `/admin`
- **Type:** Client component (with password auth)
- **Data fetched:** All opportunities, subscribers from Supabase; scrape logs in-memory
- **Renders:** Login form → tabs: Opportunities table, Verification Queue (with verify/unavailable/edit/recheck/delete), Add New form, Subscribers list, News Sources (RSS toggle), Most Popular (by clicks), AI Usage (AIAnalyticsPanel), Scrape Logs. AI Auto-Fill button on add form.

### Admin: Add News
- **File:** `src/app/admin/add-news/page.tsx`
- **Route:** `/admin/add-news`
- **Type:** Client component
- **Renders:** News article form (title, slug, description, source, url, category, tags, image, date) → inserts to Supabase.

### Admin: Add Opportunity
- **File:** `src/app/admin/add-opportunity/page.tsx`
- **Route:** `/admin/add-opportunity`
- **Type:** Client component
- **Renders:** Opportunity form with AI Auto-Fill button, all fields → POST `/api/opportunities`.

### Admin: Edit Opportunity
- **File:** `src/app/admin/edit-opportunity/[id]/page.tsx`
- **Route:** `/admin/edit-opportunity/[id]`
- **Type:** Client component
- **Data fetched:** Single opportunity by ID
- **Renders:** Pre-filled edit form → PATCH `/api/opportunities/[id]`.

### Error / Not Found / Loading
- **Files:** `error.tsx`, `not-found.tsx`, `loading.tsx`
- **Routes:** error boundary, 404 page, root loading
- **Renders:** Error with retry button, 404 page with links, loading skeleton.

### Sitemap / Robots
- **Files:** `sitemap.ts`, `robots.ts`
- **Routes:** `/sitemap.xml`, `/robots.txt`
- **Type:** Server components generating XML/text.

---

## 5. API Routes

### `GET /api/opportunities`
- **File:** `src/app/api/opportunities/route.ts`
- **Query params:** category, eligibility, location, deadline, search, verified
- **What it does:** Lists active opportunities with filters, ordered by created_at DESC
- **Response:** `{ opportunities: Opportunity[], count: number }`

### `POST /api/opportunities`
- **File:** `src/app/api/opportunities/route.ts`
- **Body:** Opportunity object
- **What it does:** Inserts new opportunity, posts to Telegram
- **Response:** `{ opportunity: Opportunity }` (201)

### `GET /api/opportunities/[id]`
- **File:** `src/app/api/opportunities/[id]/route.ts`
- **What it does:** Fetches single opportunity by ID
- **Response:** `{ opportunity: Opportunity }`

### `PATCH /api/opportunities/[id]`
- **File:** `src/app/api/opportunities/[id]/route.ts`
- **Body:** Partial opportunity fields
- **What it does:** Updates opportunity
- **Response:** `{ opportunity: Opportunity }`

### `DELETE /api/opportunities/[id]`
- **File:** `src/app/api/opportunities/[id]/route.ts`
- **What it does:** Deletes opportunity
- **Response:** `{ success: true }`

### `GET /api/news`
- **File:** `src/app/api/news/route.ts`
- **Query params:** limit (default 20), search, tag
- **What it does:** Lists news articles with search/tag filters
- **Response:** `{ articles: NewsArticle[], count: number }`

### `GET /api/opportunities-feed`
- **File:** `src/app/api/opportunities-feed/route.ts`
- **What it does:** Returns verified opportunities as JSON feed (public API)
- **Response:** `{ platform, description, last_updated, total_count, opportunities[] }`

### `GET /api/organizations`
- **File:** `src/app/api/organizations/route.ts`
- **What it does:** Aggregates unique organizations with opportunity counts
- **Response:** `{ organizations: [{ name, slug, count }] }`

### `POST /api/subscribe`
- **File:** `src/app/api/subscribe/route.ts`
- **Body:** `{ email, keywords?, categories? }`
- **What it does:** Rate-limited (3/IP/hr), validates email regex, inserts subscriber
- **Response:** `{ success: true }` (201)

### `DELETE /api/subscribe`
- **File:** `src/app/api/subscribe/route.ts`
- **Query param:** email
- **What it does:** Unsubscribes (sets is_active = false)
- **Response:** `{ success: true }`

### `POST /api/report-issue`
- **File:** `src/app/api/report-issue/route.ts`
- **Body:** `{ opportunity_id (UUID), report_type, description (max 500 chars) }`
- **What it does:** Validates UUID format, inserts report
- **Response:** `{ success: true }` (201)

### `POST /api/track-click`
- **File:** `src/app/api/track-click/route.ts`
- **Body:** `{ opportunity_id }`
- **What it does:** Increments apply_clicks on opportunity
- **Response:** `{ success: true }`

### `GET /api/calendar-export/[id]`
- **File:** `src/app/api/calendar-export/[id]/route.ts`
- **What it does:** Generates .ics file with deadline + 7-day alarm
- **Response:** text/calendar download

### `GET /api/ai/chat`
- **File:** `src/app/api/ai/chat/route.ts`
- **Body:** `{ messages: [{ role, content }] }`
- **What it does:** Calls AI with ElectroBridge Assistant system prompt, preferred provider Groq
- **Response:** `{ message, provider, model }`

### `POST /api/ai/search`
- **File:** `src/app/api/ai/search/route.ts`
- **Body:** `{ query }`
- **What it does:** Parses natural language query via AI, applies filters to Supabase query
- **Response:** `{ opportunities, filters, count }`

### `POST /api/ai/summarize`
- **File:** `src/app/api/ai/summarize/route.ts`
- **Body:** `{ rawDescription, title, org }`
- **What it does:** Calls AI summarizer, returns structured data
- **Response:** `AISummary` (clean_title, summary, eligibility_points, suggested_tags, etc.)

### `GET /api/ai/opportunity-summary/[slug]`
- **File:** `src/app/api/ai/opportunity-summary/[slug]/route.ts`
- **What it does:** Fetches opportunity, calls AI for insights (preferred Gemini)
- **Response:** `{ what_you_will_do, why_apply, typical_documents, tips, difficulty_level, career_stage }`

### `POST /api/ai/match`
- **File:** `src/app/api/ai/match/route.ts`
- **Body:** `UserProfile` (qualification, specialization, hasNET, hasGATE, preferredLocation, lookingFor)
- **What it does:** Fetches active opportunities (limit 50), calls AI matcher, returns scored matches
- **Response:** `{ matches: Opportunity[], count }`

### `GET /api/ai/expire`
- **File:** `src/app/api/ai/expire/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Checks all active opportunities for expiry (deadline passed or AI-determined), marks expired
- **Response:** `{ checked, expired, message }`

### `GET /api/scrape`
- **File:** `src/app/api/scrape/route.ts`
- **Auth:** Bearer CRON_SECRET
- **Query params:** mode (all, news, opportunities)
- **What it does:** Runs RSS news scraper + opportunity scrapers (ISRO, CSIR, DRDO — now explicit, CSIR RSS via GovtJobs), deduplicates by source_url, inserts new
- **Response:** `{ message, news: { total_fetched, inserted, skipped }, opportunities: { sources, total_fetched, inserted, skipped } }`

### `GET /api/scrape-jobs` (DEPRECATED)
- **File:** `src/app/api/scrape-jobs/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Runs govt job scrapers (CSIR RSS only — DRDO moved to main /api/scrape). Returns deprecation_notice in response.
- **Response:** `{ message, deprecation_notice, sources, total_fetched, inserted, skipped }`

### `GET /api/scrape-opportunities`
- **File:** `src/app/api/scrape-opportunities/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Runs scrapeAllOpportunities(), deduplicates by source_url, inserts
- **Response:** `{ message, results, total_fetched, inserted, skipped }`

### `POST /api/cleanup-news`
- **File:** `src/app/api/cleanup-news/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Deduplicates news by source_url (keeps oldest), generates slugs for missing ones
- **Response:** `{ success, total, duplicates_found, deleted, slugs_generated }`

### `GET /api/check-links`
- **File:** `src/app/api/check-links/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Checks HEAD requests for all verified opportunities, updates link status, logs to link_check_logs
- **Response:** `{ checked, ok, broken, broken_urls[] }`

### `GET /api/send-digest`
- **File:** `src/app/api/send-digest/route.ts`
- **Auth:** Bearer CRON_SECRET
- **What it does:** Builds weekly digest email with AI content, sends via Resend to all active subscribers
- **Response:** `{ sent, failed, total }`

### `GET /api/seed`
- **File:** `src/app/api/seed/route.ts`
- **What it does:** Inserts 10 seed opportunities (skips if DB has data)
- **Response:** `{ message, count }`

### `GET /api/seed-news`
- **File:** `src/app/api/seed-news/route.ts`
- **What it does:** Fetches RSS from 3 sources (IEEE Spectrum, Semiconductor Engineering, Electronics Weekly), inserts new articles
- **Response:** `{ message, sources: { source: { total, inserted, skipped } } }`

### `POST /api/admin/recheck-link`
- **File:** `src/app/api/admin/recheck-link/route.ts`
- **Body:** `{ opportunity_id }`
- **What it does:** HEAD-checks the apply_link, logs result, updates verification_status
- **Response:** `{ checked, status, reachable, error }`

### `GET /api/og`
- **File:** `src/app/api/og/route.tsx`
- **Runtime:** edge
- **What it does:** Generates default Open Graph image (1200x630) with ElectroBridge branding
- **Response:** PNG image

### `GET /api/og/opportunity/[slug]`
- **File:** `src/app/api/og/opportunity/[slug]/route.tsx`
- **Runtime:** edge
- **What it does:** Generates per-opportunity OG image with title, org, category, location, deadline
- **Response:** PNG image

### `GET /api/similar/[id]`
- **File:** `src/app/api/similar/[id]/route.ts`
- **What it does:** Finds opportunities with overlapping tags (tags overlap query), limit 3
- **Response:** `{ opportunities: Opportunity[] }`

### `GET /api/applications`
- **File:** `src/app/api/applications/route.ts`
- **Auth:** Supabase session (server-side cookie)
- **What it does:** Lists current user's applications joined with opportunity data
- **Response:** `{ applications: Application[] }`

### `PATCH /api/applications`
- **File:** `src/app/api/applications/route.ts`
- **Auth:** Supabase session
- **Body:** `{ id, status?, notes? }`
- **What it does:** Updates application status or notes
- **Response:** `{ success: true }`

### `DELETE /api/applications`
- **File:** `src/app/api/applications/route.ts`
- **Auth:** Supabase session
- **Body:** `{ id }`
- **What it does:** Deletes an application
- **Response:** `{ success: true }`

### `POST /api/auth/signout`
- **File:** `src/app/api/auth/signout/route.ts`
- **What it does:** Calls `supabase.auth.signOut()`, redirects to `/`
- **Response:** 302 redirect

---

## 6. Components

### `Navbar.tsx`
- **Props:** none
- **What it renders:** Sticky nav with logo, dropdown menus (Opportunities, Resources), direct links (Home, News, Find My Match, Ask AI, About), auth-aware right-side buttons. If logged out: Bell + Login outline + Sign Up cyan + Admin. If logged in: Bell + user avatar dropdown (Dashboard, Profile, Sign Out) + Admin. Mobile full-screen hamburger menu with auth state. Uses hover-intent dropdowns with 150ms delay.
- **Dependencies:** supabase/client (auth), next/link, lucide-react

### `Footer.tsx`
- **Props:** none
- **What it renders:** 4-column footer grid (Brand, Opportunities, Resources, Connect), newsletter CTA, copyright. Links to all category pages, resource guides, opportunities, news, organizations, about, contact, match, chat, feed.
- **Dependencies:** none (uses next/link, lucide-react)

### `OpportunityCard.tsx`
- **Props:** `{ opportunity: Opportunity }`
- **What it renders:** Card with org avatar (initials), title (clickable → detail page), org name (clickable → org page), verification badge, posted time, "NEW" badge, category badge, tags as pills, deadline countdown, bookmark button (auth-aware), share buttons. Link-unavailable cards show at 70% opacity.
- **Bookmark behavior:** Checks auth state on mount. If logged in: uses `saved_opportunities` table (inserts/deletes via RLS). If logged out: falls back to localStorage. Shows toast "Sign in to sync" for anonymous users.
- **Dependencies:** supabase/client (auth), sonner (toast), CategoryBadge, DeadlineCountdown, ShareButtons, VerificationBadge, lib/utils (cn, getDaysAgo, isNew)

### `NewsCard.tsx`
- **Props:** `{ article: NewsArticle }`
- **What it renders:** Card with optional image (16x16 rounded, fallback to Newspaper icon), title (2-line clamp), source badge with colored dot (18 sources mapped), time ago, tags (max 2 + overflow), summary (2-line clamp), hover "Read More" link.
- **Dependencies:** none (client component with useState for img error)

### `FilterBar.tsx`
- **Props:** `{ selectedCategory, selectedEligibility, selectedLocation, selectedDeadline, onCategoryChange, onEligibilityChange, onLocationChange, onDeadlineChange }`
- **What it renders:** Vertical sidebar layout with checkbox groups (Job Type, Degree, Location) + deadline select dropdown. "Clear all" link when filters active.
- **Dependencies:** lib/utils (CATEGORIES, ELIGIBILITY_OPTIONS, LOCATIONS, DEADLINE_FILTERS)

### `SearchBar.tsx`
- **Props:** `{ onSearch: (query: string) => void }`
- **What it renders:** Search input with Enter/submit. Used on opportunities page and news page.
- **Dependencies:** none

### `CategoryBadge.tsx`
- **Props:** `{ category: string, className?: string }`
- **What it renders:** Colored rounded badge based on category (cyan for JRF/SRF, purple for PhD, green for Govt Job, orange for Private, blue for Fellowship). Colors from CATEGORY_COLORS in utils.
- **Dependencies:** lib/utils (cn, CATEGORY_COLORS)

### `DeadlineCountdown.tsx`
- **Props:** `{ deadline: string, variant?: "badge" | "progress" }`
- **What it renders:** Badge variant: "Expired" (gray), "Last X days!" (red + pulse, days ≤ 3), "Closes in X days" (orange, days ≤ 7), or "X days left" (muted). Progress variant: horizontal gradient bar showing urgency visually.
- **Dependencies:** lib/utils (getDaysUntilDeadline, isExpired, cn)

### `VerificationBadge.tsx`
- **Props:** `{ status: string, compact?: boolean }`
- **What it renders:** Badge showing verification status: verified (green checkmark), unverified (gray question), expired (red X), link_unavailable (amber alert).
- **Dependencies:** lucide-react

### `ApplyButton.tsx`
- **Props:** `{ applyLink: string, opportunityId: string, verificationStatus?: string, officialPageUrl?: string | null }`
- **What it renders:** "Apply Now" button (tracks click via `/api/track-click`). If link_unavailable + officialPageUrl exists, shows amber "Visit Official Site →" instead.
- **Application tracking:** Checks auth state on mount. If logged in, also inserts row into `applications` table with status='applied' (checks for existing row first to prevent duplicates).
- **Dependencies:** supabase/client (auth), lucide-react

### `ShareButtons.tsx`
- **Props:** `{ title: string, organization: string, deadline: string | null, opportunityUrl: string }`
- **What it renders:** Share buttons for WhatsApp, Twitter, LinkedIn, Email — each with platform-specific intent URLs.
- **Dependencies:** lucide-react

### `SimilarOpportunities.tsx`
- **Props:** `{ currentId: string, tags: string[] }`
- **What it renders:** Fetches `/api/similar/[id]` on mount, renders up to 3 similar opportunity cards in a grid.
- **Dependencies:** OpportunityCard, lucide-react

### `CopyLinkButton.tsx`
- **Props:** `{ url: string }`
- **What it renders:** Button that copies URL to clipboard, shows "Copied!" for 2 seconds. Has fallback for older browsers.
- **Dependencies:** lucide-react

### `LinkTypeIndicator.tsx`
- **Props:** `{ type: "direct" | "homepage" | "pdf" | "email" | "portal" }`
- **What it renders:** Info box explaining what each link type means (e.g., "Direct application link", "PDF notification", etc.)
- **Dependencies:** none

### `OpportunityDisclaimer.tsx`
- **Props:** `{ opportunityId: string, officialPageUrl?: string | null }`
- **What it renders:** Disclaimer text + "Report Issue" button that opens ReportIssueModal.
- **Dependencies:** ReportIssueModal, lucide-react

### `ReportIssueModal.tsx`
- **Props:** `{ opportunityId: string, isOpen: boolean, onClose: () => void }`
- **What it renders:** Modal with report type select (broken_link, wrong_info, expired, other) + textarea + submit. Posts to `/api/report-issue`.
- **Dependencies:** lucide-react, sonner (toast)

### `SubscribeSection.tsx`
- **Props:** none
- **What it renders:** Email input + subscribe button. Calls `/api/subscribe`. Used on homepage.
- **Dependencies:** SubscribeModal (opens on success), lucide-react, sonner (toast)

### `SubscribeModal.tsx`
- **Props:** `{ isOpen: boolean, onClose: () => void }`
- **What it renders:** Full modal with "You're subscribed!" success message, category/keyword preferences, animated checkmark.
- **Dependencies:** lucide-react

### `ExpiringSoon.tsx`
- **File:** `src/components/ExpiringSoon.tsx`
- **Props:** none (async server component)
- **What it renders:** Fetches opportunities with deadline within 7 days (limit 3), renders section with orange gradient background, orange left border on cards. Shows nothing if no expiring opportunities.
- **Dependencies:** supabaseAdmin, OpportunityCard, lucide-react

### `NewsImage.tsx`
- **Props:** `{ src: string, alt: string }`
- **What it renders:** News article image with onError handler (hides on error). Maintains aspect ratio (h-64 sm:h-80).
- **Dependencies:** none

### `LoadingSkeleton.tsx`
- **Props:** `{ className?: string }`
- **What it renders:** Gray animated pulse div.
- **Dependencies:** none

### `AIOpportunitySummary.tsx`
- **Props:** `{ slug: string }`
- **What it renders:** Collapsible "AI Insights" panel. On expand, fetches `/api/ai/opportunity-summary/[slug]`. Shows what_you_will_do, why_apply, typical_documents (list), tips, difficulty_level (color-coded), career_stage. Loading spinner while fetching.
- **Dependencies:** lucide-react

### `AIAnalyticsPanel.tsx`
- **Props:** none
- **What it renders:** Admin panel section. Stats cards (total, today, this week, success rate), provider usage bar chart (colored by provider), feature usage bar chart, recent AI calls table.
- **Dependencies:** supabase (client), lucide-react

---

## 7. Environment Variables

| Variable | Public? | Used In | Purpose |
|----------|---------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (NEXT_PUBLIC_) | `lib/supabase.ts` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (NEXT_PUBLIC_) | `lib/supabase.ts` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | `lib/supabase.ts` | Supabase service_role (admin operations) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Public (NEXT_PUBLIC_) | `admin/page.tsx`, `admin/add-opportunity/page.tsx`, `admin/edit-opportunity/[id]/page.tsx` | Admin panel password |
| `CRON_SECRET` | Private | `api/scrape/route.ts`, `api/ai/expire/route.ts`, `api/send-digest/route.ts`, `api/scrape-opportunities/route.ts`, `api/cleanup-news/route.ts`, `api/scrape-jobs/route.ts`, `api/check-links/route.ts` | Bearer auth for cron endpoints |
| `GROQ_API_KEY` | Private | `lib/ai/providers.ts` | Groq AI API key |
| `NVIDIA_NIM_API_KEY` | Private | `lib/ai/providers.ts` | NVIDIA NIM API key |
| `GEMINI_API_KEY` | Private | `lib/ai/providers.ts` | Google Gemini API key |
| `OPENROUTER_API_KEY` | Private | `lib/ai/providers.ts` | OpenRouter API key |
| `HUGGINGFACE_API_KEY` | Private | `lib/ai/providers.ts` | HuggingFace API key |
| `CLOUDFLARE_AI_TOKEN` | Private | `lib/ai/providers.ts` | Cloudflare Workers AI token |
| `AWS_BEARER_TOKEN_BEDROCK` | Private | `lib/ai/providers.ts` | AWS Bedrock Mantle API key (base64 `MantleApiKey-…` token) |
| `CLOUDFLARE_ACCOUNT_ID` | Private | `lib/ai/providers.ts` | Cloudflare account ID |
| `RESEND_API_KEY` | Private | `lib/email-digest.ts` | Resend email API key |
| `FROM_EMAIL` | Private | `lib/email-digest.ts` | Sender email for digest (default: digest@electrobridge.vercel.app) |
| `TELEGRAM_BOT_TOKEN` | Private | `lib/telegram-bot.ts` | Telegram bot token |
| `TELEGRAM_CHANNEL_ID` | Private | `lib/telegram-bot.ts` | Telegram channel/chat ID |
| `OPENAI_API_KEY` | Private | NOT found in code | Listed in README but not actually used |

---

## 8. Third-Party Integrations

| Service | Files | What For |
|---------|-------|----------|
| **Supabase** | `lib/supabase.ts`, most API routes, all components with data fetching | Database (PostgreSQL), RLS auth, admin client |
| **AWS Bedrock Mantle** | `lib/ai/providers.ts` (callBedrock) | Primary AI provider (provisioned, OpenAI-compatible endpoint, uses `openai.gpt-oss-120b`, first in fallback chain) |
| **Groq AI** | `lib/ai/providers.ts` (callGroq) | Secondary AI provider (14,400 req/day free, Llama 3.1 8B Instant) |
| **NVIDIA NIM** | `lib/ai/providers.ts` (callNvidia, callNvidiaAdvanced) | High quality AI (Llama 3.1 8B Instruct + Mistral 7B), second in fallback chain |
| **Gemini** | `lib/ai/providers.ts` (callGemini) | AI backup (Gemini 1.5 Flash, 1,500 req/day) |
| **OpenRouter** | `lib/ai/providers.ts` (callOpenRouter) | AI backup (Llama 3.1 8B Free, ~50 req/day) |
| **Cloudflare Workers AI** | `lib/ai/providers.ts` (callCloudflare) | AI backup (10,000 neurons/day free) |
| **HuggingFace** | `lib/ai/providers.ts` (callHuggingFace) | Last resort AI (Mistral 7B, rate limited) |
| **Resend** | `lib/email-digest.ts` | Sending weekly email digest |
| **Telegram Bot API** | `lib/telegram-bot.ts` | Posting new opportunities to Telegram channel |
| **Plausible Analytics** | `app/layout.tsx` (Script tag) | Privacy-first analytics |
| **Google Fonts** | `app/globals.css` (Inter + Space Grotesk) | Typography |
| **RSS Feeds (18 sources)** | `lib/scrapers/rss-parser.ts` | News aggregation (IEEE Spectrum, EE Times, etc.) |
| **cheerio** | All scrapers (csir, drdo, isro) | HTML parsing for website scraping |
| **rss-parser** | `lib/scrapers/rss-parser.ts`, `app/api/seed-news/route.ts` | RSS feed parsing |
| **Vercel Cron** | `vercel.json` | Scheduled scraping (daily 6AM) + digest (Sunday 3AM) |

---

## 9. Current Issues & Gaps

### TODO/FIXME/HACK comments
- **No TODO, FIXME, HACK, XXX, or BUG comments found** anywhere in the source code (only false positive in package-lock.json integrity hash).

### Hardcoded data that should come from database
1. **About page stats** (`about/page.tsx`): 500+ opportunities, 50+ organizations, 1000+ news articles, 10K+ monthly visitors — all hardcoded instead of computed from DB.
2. **Admin password default**: `"electrobridge2026"` hardcoded as fallback in 3 files (admin pages). Should use env var only.
3. **CRON_SECRET default**: `"mysecretcron2026"` hardcoded in `check-links/route.ts`.
4. **FROM_EMAIL default**: `"digest@electrobridge.vercel.app"` in `email-digest.ts`.
5. **Link type icons** in `LinkTypeIndicator.tsx`: emoji-based (🔗, 🏛️, 📄, 📧, 🌐) instead of using lucide-react icons.
6. **DeadlineCountdown.tsx**: Uses emoji 🔥 and ⚡ in badge text.
7. **NewsCard category colors**: 18 source-specific colors hardcoded in `SOURCE_COLORS` record.

### Broken or missing imports
- None found. All imports resolve correctly.

### Components that exist but may be unused
- All components are imported and used (verified by grep analysis).

### Pages with no data fetching
- `/resources/vlsi-careers` — no DB query (pure static guide page)
- `/resources/international-fellowships` — no DB query (pure static guide page)
- Most resource guide pages fetch latest 3 opportunities as "live feed" but default to empty state gracefully.

### API routes defined but not called from anywhere
- ~~`/api/scrape-jobs` — defined but not called by any cron or UI (scrape-jobs functionality overlaps with main `/api/scrape`)~~ ✅ **DEPRECATED**: Now returns `deprecation_notice` in response. DRDO moved to main `/api/scrape` endpoint.
- `/api/admin/recheck-link` — called from admin verification tab
- `/api/seed` — called manually to seed initial data
- `/api/seed-news` — separate from main scrape, called manually
- `/api/track-click` — called from ApplyButton

### Issues found
1. **`OPENAI_API_KEY` in .env.example/README but not used** — no OpenAI provider in providers.ts. Listed in README but dead env var.
2. **`calendar_exports` table never written to** — TypeScript interface defined and migration exists, but calendar-export route only generates ICS without logging to the table.
3. **`telegram_subscribers` table never written to** — Migration creates the table but no code inserts or reads from it.
4. ~~**`saved_opportunities` interface exists but no implementation** — TypeScript type defined but no tables, no mutations, no queries.~~ ✅ **FIXED**: `saved_opportunities` table created in migration 20260630000001 with RLS policies. Used by OpportunityCard bookmark (when logged in) and dashboard stat card.
5. **Duplicate scrollbar CSS** in `globals.css` — the `*` scrollbar rules are written twice (lines 89-115 and 117-133).
6. **`checkRateLimit` is in-memory only** — resets on server restart, no persistent storage. Rate limit resets if serverless function cold starts.
7. **News dedup cleanup (`POST /api/cleanup-news`)** — keeps oldest duplicate by `created_at`. Should consider keeping newest article instead with the most metadata.
8. ~~**No Supabase Auth integration** — user-specific features (bookmarks, saved_opportunities) use localStorage instead of server-side auth.~~ ✅ **FIXED**: Full Supabase Auth integrated (email/password + Google OAuth). New tables: user_profiles, saved_opportunities, applications, user_alerts with RLS. Navbar is auth-aware. OpportunityCard bookmark uses Supabase when logged in (localStorage fallback). ApplyButton inserts into applications. Dashboard, Profile, Login, Signup pages built.
9. ~~**DRDO scraper (`drdo-scraper.ts`)** — imported only via `govt-scraper.ts` which is only called from `scrape-jobs/route.ts`. The main `/api/scrape` endpoint does NOT include govt scrapers, only `scrapeAllOpportunities()` (which includes ISRO + CSIR scrapers but NOT DRDO).~~ ✅ **FIXED**: DRDO is now an explicit first-class source in `scrapeAllOpportunities()` (imported directly in `opportunity-scraper.ts`). Removed from `govt-scraper.ts` to prevent double-scraping. `/api/scrape-jobs` deprecated.

---

## 10. What Is Working vs What Is Not

### Fully implemented features
- ✅ **Opportunity CRUD** — Listing, filtering, detail pages with full SEO
- ✅ **News aggregation** — 18 RSS sources + AI filtering + dedup
- ✅ **Category pages** — 7 categories with SEO + live counts
- ✅ **Resource guides** — 5 guide pages (JRF, PhD, VLSI, Fellowships, NET vs GATE)
- ✅ **Multi-provider AI engine** — 7 providers in fallback chain with usage logging (Bedrock first, then Groq, NVIDIA, Gemini, OpenRouter, Cloudflare, HuggingFace)
- ✅ **AI Smart Search** — Natural language → structured filters
- ✅ **AI Opportunity Matcher** — Profile-based matching with scored results
- ✅ **AI Chatbot** — `/chat` page with full conversation
- ✅ **AI Summarizer** — Admin auto-fill + detail page insights
- ✅ **AI News Relevance Filter** — Keyword + AI verification
- ✅ **AI Expiry Checker** — Cron endpoint for auto-expiring
- ✅ **AI Weekly Digest** — Newsletter generation
- ✅ **Admin Panel** — Full admin UI with login, all CRUD, AI analytics, subscriber view, scrape trigger
- ✅ **Email subscriptions** — Rate-limited subscribe/unsubscribe with weekly digest
- ✅ **Verification system** — 4 statuses (verified/unverified/link_unavailable/expired)
- ✅ **Link checking** — Automated HEAD checks with HTTP status logging
- ✅ **Open Graph images** — Per-opportunity dynamic OG images
- ✅ **SEO** — JSON-LD schemas (JobPosting, FAQPage, WebSite, NewsArticle, BreadcrumbList), sitemap, robots, meta tags
- ✅ **Calendar export** — .ics download with deadline + alarm
- ✅ **Telegram notifications** — Posts on new opportunity creation
- ✅ **UI design system** — Full Figma-based dark theme with Space Grotesk + Inter
- ✅ **Mobile responsive** — All pages responsive with hamburger menu, mobile inline sidebar on opportunity detail pages (Apply/Save/Share/Quick Facts on screens < lg)
- ✅ **ISR** — Detail pages revalidated (opps 3600s, news 1800s)
- ✅ **Organization pages** — Per-org listing with counts
- ✅ **Share buttons** — WhatsApp, Twitter, LinkedIn, Email
- ✅ **Favorites/bookmarks** — localStorage-based bookmarking with Supabase sync when logged in
- ✅ **User authentication** — Email/password + Google OAuth via Supabase Auth
- ✅ **User dashboard** — 4 stat cards (saved, applications, resume score, alerts), application tracker with status, resume score circular progress, upcoming deadlines
- ✅ **User profile** — Full name, qualification, specialization, NET/GATE, preferred location with upsert
- ✅ **Auth-aware bookmarking** — Uses saved_opportunities table when logged in, localStorage fallback when anonymous
- ✅ **Application tracking** — Apply Now button inserts into applications table (deduped), tracked on dashboard
- ✅ **Secured user data** — RLS policies on all auth tables ensure users can only access their own data
- ✅ **Protected routes** — Dashboard and Profile redirect to /login if no session
- ✅ **Sign out flow** — Clears session, redirects to home, Navbar updates immediately
- ✅ **Figma-based UI redesign** — All 16 pages and components refactored to exact Figma specs (bg-primary #0A0E1A, surface #111827, accent #22D3EE, Space Grotesk + Inter typography)
- ✅ **Deadline progress bar** — New `variant="progress"` with gradient urgency bar for detail pages
- ✅ **Org-colored avatars** — Consistent color mapping per organization (ISRO, Intel, TIFR, Tata, DRDO)
- ✅ **DRDO in main scrape** — DRDO is now an explicit source in `/api/scrape?mode=opportunities` with its own result entry

### Partially implemented features
- ⚠️ **CRM secret auth** — Used consistently but some endpoints lack proper error messages
- ⚠️ **Admin auth is separate** — Admin uses NEXT_PUBLIC_ADMIN_PASSWORD env var, not Supabase Auth. Two separate auth systems coexist.
- ⚠️ **telegram_subscribers** — Table exists but no subscription management UI
- ⚠️ **Report analytics** — Reports stored but no admin review UI (is_resolved field exists)
- ⚠️ **calendar_exports** — Migration creates table but it's never written to
- ⚠️ **NVIDIA NIM** — Integration done but includes `OPENAI_API_KEY` in README that doesn't exist in code

### Planned/Referenced but not built
- ❌ **Personalized recommendations** — No ML-based opportunity recommendations (beyond current AI match)
- ❌ **Resume builder** — Placeholder in dashboard, no actual resume upload/builder yet
- ❌ **Mobile app** — Web-only, no PWA manifest or service worker
- ❌ **Multi-language support** — English only
- ❌ **Advanced filtering** — No salary range filter, no date range filter
- ❌ **Email templates** — Basic HTML email, no rich design

---

## 11. Supabase Query Inventory

### `opportunities` table

| File | Operation | Conditions | Notes |
|------|-----------|------------|-------|
| `app/page.tsx` | select (count) | is_active=true, deadline >= now or null, various categories | 7 count queries in parallel for stats |
| `app/page.tsx` | select | is_active=true, verification_status=verified, deadline >= today or null, order by created_at DESC, limit 6 | Latest verified opportunities |
| `app/page.tsx` | select (tags only) | is_active=true | For trending tags aggregation |
| `app/opportunities/page.tsx` | select (via API) | Multiple filters via GET /api/opportunities | Client-side filters |
| `app/opportunities/[slug]/page.tsx` | select (single) | slug = params.slug | Detail page (SSG + ISR) |
| `app/opportunities/[slug]/page.tsx` | select (slugs) | is_active=true, slug not null | generateStaticParams |
| `app/category/[category]/page.tsx` | select | is_active=true, category=param, deadline >= today or null | Category listing |
| `app/organizations/[slug]/page.tsx` | select | is_active=true, org_slug=param | Org detail |
| `app/resources/jrf-guide/page.tsx` | select | is_active=true, category=JRF, limit 3 | Live feed |
| `app/resources/phd-guide/page.tsx` | select | is_active=true, category=PhD, limit 3 | Live feed |
| `app/resources/net-vs-gate/page.tsx` | select | is_active=true, limit 3 | Live feed |
| `components/ExpiringSoon.tsx` | select | is_active=true, deadline between today and +7 days, order ASC, limit 3 | Expiring soon |
| `components/SimilarOpportunities.tsx` | select (via API) | Not current ID, is_active=true, tags overlap, limit 3 | Similar opps |
| `app/api/opportunities/route.ts` | select | GET with filters | Main listing API |
| `app/api/opportunities/route.ts` | insert | POST body | Create opportunity |
| `app/api/opportunities/[id]/route.ts` | select (single) | id = params.id | GET single |
| `app/api/opportunities/[id]/route.ts` | update | id = params.id | PATCH update |
| `app/api/opportunities/[id]/route.ts` | delete | id = params.id | DELETE |
| `app/api/opportunities-feed/route.ts` | select | is_active=true, verification_status=verified, order DESC | Public JSON feed |
| `app/api/organizations/route.ts` | select (org only) | is_active=true, deadline >= today or null | Org aggregation |
| `app/api/ai/search/route.ts` | select | Various filters from AI parsing | AI search |
| `app/api/ai/match/route.ts` | select | is_active=true, limit 50 | AI matcher |
| `app/api/ai/opportunity-summary/[slug]/route.ts` | select (single) | slug = params.slug | AI summary |
| `app/api/ai/expire/route.ts` | select | is_active=true | Expiry checker |
| `app/api/ai/expire/route.ts` | update | id for each expired opp | Mark expired |
| `app/api/check-links/route.ts` | select | verification_status=verified, not checked in 24h | Link check |
| `app/api/check-links/route.ts` | update | id for checked opps | Update link status |
| `app/api/scrape/route.ts` | select (maybeSingle) | source_url match | Dedup check |
| `app/api/scrape/route.ts` | insert | New opportunities | Insert scraped |
| `app/api/scrape-opportunities/route.ts` | select (maybeSingle) | source_url match | Dedup check |
| `app/api/scrape-opportunities/route.ts` | insert | New opportunities | Insert |
| `app/api/scrape-jobs/route.ts` | select (maybeSingle) | source_url match | Dedup check |
| `app/api/scrape-jobs/route.ts` | insert | New opportunities | Insert |
| `app/api/seed/route.ts` | select (limit 1) | — | Check if data exists |
| `app/api/seed/route.ts` | insert | SEED_OPPORTUNITIES | Seed |
| `app/api/similar/[id]/route.ts` | select | Tags overlap, not current, active, limit 3 | Similar opps |
| `app/api/track-click/route.ts` | update (increment) | id | Track clicks |
| `app/api/admin/recheck-link/route.ts` | select (single) | id | Recheck |
| `app/api/admin/recheck-link/route.ts` | update | id | Update status |
| `app/admin/page.tsx` | select (all) | none, order DESC | Admin panel |
| `app/admin/page.tsx` | delete | id | Admin delete |
| `app/admin/page.tsx` | update | various | Admin operations |
| `app/admin/edit-opportunity/[id]/page.tsx` | select (single) | id | Edit form |

### `news_articles` table

| File | Operation | Conditions |
|------|-----------|------------|
| `app/page.tsx` | select (count) | published_at >= yesterday (for "news today" stat) |
| `app/page.tsx` | select | order DESC, limit 10 |
| `app/api/news/route.ts` | select | Various filters (search, tag, limit) |
| `app/api/scrape/route.ts` | select (maybeSingle) | source_url match |
| `app/api/scrape/route.ts` | insert | New articles |
| `app/api/cleanup-news/route.ts` | select | all, order ASC |
| `app/api/cleanup-news/route.ts` | delete | duplicate IDs |
| `app/api/cleanup-news/route.ts` | select | slug is null |
| `app/api/cleanup-news/route.ts` | update | Set slug |
| `app/api/seed-news/route.ts` | select (maybeSingle) | source_url match |
| `app/api/seed-news/route.ts` | insert | New articles |

### `subscribers` table

| File | Operation | Conditions |
|------|-----------|------------|
| `app/api/subscribe/route.ts` | insert | New subscriber |
| `app/api/subscribe/route.ts` | update | Set is_active=false (unsubscribe) |
| `lib/email-digest.ts` | select | is_active=true |
| `app/admin/page.tsx` | select | all, order DESC |

### `ai_usage_log` table

| File | Operation | Conditions |
|------|-----------|------------|
| `lib/ai/providers.ts` | insert | After each AI call (success or failure) |
| `components/AIAnalyticsPanel.tsx` | select | all, order DESC, limit 100 |

### `link_check_logs` table

| File | Operation | Conditions |
|------|-----------|------------|
| `app/api/check-links/route.ts` | insert | After each link check |
| `app/api/admin/recheck-link/route.ts` | insert | After recheck |

### `opportunity_reports` table

| File | Operation | Conditions |
|------|-----------|------------|
| `app/api/report-issue/route.ts` | insert | New report |

### `suggestions` table

| File | Operation | Conditions |
|------|-----------|------------|
| `app/contact/page.tsx` | insert | New suggestion |

### `user_profiles` table (new)

| File | Operation | Conditions |
|------|-----------|------------|
| `app/dashboard/page.tsx` | select (single) | id = current user (resume_ats_score) |
| `app/profile/page.tsx` | select (single) | id = current user |
| `app/profile/page.tsx` | upsert | id = current user |
| `app/match/page.tsx` | select (single) | id = current user (pre-fill form) |

### `saved_opportunities` table (new)

| File | Operation | Conditions |
|------|-----------|------------|
| `app/dashboard/page.tsx` | select (count, head) | user_id = current user |
| `components/OpportunityCard.tsx` | select (maybeSingle) | user_id + opportunity_id (check bookmark status) |
| `components/OpportunityCard.tsx` | insert | New bookmark |
| `components/OpportunityCard.tsx` | delete | user_id + opportunity_id (remove bookmark) |

### `applications` table (new)

| File | Operation | Conditions |
|------|-----------|------------|
| `app/dashboard/page.tsx` | select (with join) | user_id = current user, joined with opportunities |
| `app/dashboard/page.tsx` | select (count, head) | user_id = current user |
| `components/ApplyButton.tsx` | select (maybeSingle) | user_id + opportunity_id (check duplicate) |
| `components/ApplyButton.tsx` | insert | New application with status='applied' |
| `app/api/applications/route.ts` | select (with join) | user_id = current user (GET) |
| `app/api/applications/route.ts` | update | id + user_id (PATCH) |
| `app/api/applications/route.ts` | delete | id + user_id (DELETE) |

### `user_alerts` table (new)

| File | Operation | Conditions |
|------|-----------|------------|
| `app/dashboard/page.tsx` | select (count, head) | user_id + is_active=true |

---

## 12. TypeScript Types

### `src/types/index.ts`

#### `Opportunity`
| Field | Type | Notes |
|-------|------|-------|
| id | string (optional) | uuid |
| title | string | |
| organization | string | |
| category | "JRF" | "SRF" | "PhD" | "Govt Job" | "Private Job" | "Fellowship" | Union type |
| location | string | null | |
| stipend | string | null | |
| deadline | string | null | |
| eligibility | string | null | |
| description | string | null | |
| apply_link | string | null | |
| source_url | string | null (optional) | |
| is_active | boolean (optional) | |
| created_at | string (optional) | ISO date |
| posted_at | string (optional) | ISO date |
| apply_clicks | number (optional) | |
| tags | string[] | |
| slug | string (optional) | |
| org_slug | string (optional) | |
| verification_status | "verified" | "unverified" | "link_unavailable" | "expired" (optional) | Union type |
| verified_at | string (optional) | ISO date |
| official_page_url | string (optional) | |
| apply_link_type | "direct" | "homepage" | "pdf" | "email" | "portal" (optional) | Union type |
| last_link_checked | string (optional) | ISO date |
| link_check_status | number (optional) | HTTP status |
| admin_notes | string (optional) | |

#### `NewsArticle`
| Field | Type |
|-------|------|
| id | string (optional) |
| title | string |
| summary | string | null |
| source | string | null |
| source_url | string | null |
| published_at | string | null |
| image_url | string | null |
| tags | string[] |
| created_at | string (optional) |

#### `Subscriber`
| Field | Type |
|-------|------|
| id | string (optional) |
| email | string |
| keywords | string[] |
| categories | string[] |
| created_at | string (optional) |
| is_active | boolean |

#### `SavedOpportunity`
| Field | Type |
|-------|------|
| id | string (optional) |
| user_id | string |
| opportunity_id | string |
| created_at | string (optional) |

#### `LinkCheckLog`
| Field | Type |
|-------|------|
| id | string (optional) |
| opportunity_id | string |
| checked_at | string |
| http_status | number |
| is_reachable | boolean |
| error_message | string |

#### `OpportunityReport`
| Field | Type |
|-------|------|
| id | string (optional) |
| opportunity_id | string |
| report_type | "broken_link" | "wrong_info" | "expired" | "other" (union) |
| description | string |
| reported_at | string |
| is_resolved | boolean |

### `src/lib/scrapers/types.ts`

#### `ScrapedOpportunity`
| Field | Type |
|-------|------|
| title | string |
| organization | string |
| category | string |
| location | string | null |
| stipend | string | null |
| deadline | string | null |
| eligibility | string | null |
| description | string | null |
| apply_link | string | null |
| source_url | string |
| tags | string[] |

#### `ScrapeResult`
| Field | Type |
|-------|------|
| source | string |
| success | boolean |
| count | number |
| error | string (optional) |

### `src/lib/ai/providers.ts`

#### `AIProvider`
Union type: `"bedrock" | "groq" | "nvidia" | "gemini" | "openrouter" | "cloudflare" | "huggingface"`

#### `AIResponse`
| Field | Type |
|-------|------|
| text | string |
| provider | AIProvider |
| model | string |

#### `AILogEntry`
| Field | Type |
|-------|------|
| feature | string |
| provider | AIProvider |
| model | string | null |
| prompt_length | number |
| response_length | number |
| success | boolean |
| error_message | string | null |

### `src/lib/ai/matcher.ts`

#### `UserProfile`
| Field | Type |
|-------|------|
| qualification | string |
| specialization | string |
| hasNET | boolean |
| hasGATE | boolean |
| preferredLocation | string |
| lookingFor | string[] |

#### `MatchResult`
| Field | Type |
|-------|------|
| index | number |
| score | number |
| reason | string |

### `src/lib/ai/search-parser.ts`

#### `AIFilters`
| Field | Type |
|-------|------|
| category | string | null |
| location | string | null |
| tags | string[] |
| organization_hint | string | null |
| eligibility | string | null |

### `src/lib/ai/summarizer.ts`

#### `AISummary`
| Field | Type |
|-------|------|
| clean_title | string |
| summary | string |
| eligibility_points | string[] |
| suggested_tags | string[] |
| stipend_extracted | string | null |
| deadline_extracted | string | null |
