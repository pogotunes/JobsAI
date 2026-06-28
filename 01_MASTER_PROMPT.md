# ElectroBridge — Complete Build Prompt for Claude Code / OpenCode

## ROLE & GOAL
You are a senior full-stack developer. Build a complete, production-ready web platform called **ElectroBridge** — a one-stop aggregator for the electronics and semiconductor community. The platform must aggregate job postings, JRF/PhD positions, government research jobs, technology news, and industry trends from across the web and present them in a clean, filterable dashboard.

**Primary audience:** Electronics engineers, semiconductor researchers, MSc/PhD students in India and globally, looking for opportunities (JRF, SRF, PhD, Govt jobs, private jobs) and industry news.

## TECH STACK (ALL FREE TIER)
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Realtime + Auth)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **Scraping/Aggregation:** Supabase Edge Functions (scheduled cron)
- **Package manager:** npm

## COMPLETE FEATURE LIST

### 1. OPPORTUNITY AGGREGATOR
Aggregate and display:
- JRF / SRF positions (from CSIR, DRDO, ISRO, IITs, NITs, BARC, TIFR, IISER)
- PhD admissions (India + international: Germany, Japan, Singapore, USA)
- Government research jobs (Scientist B/C, Technical Officer)
- Private sector jobs (VLSI, Embedded, Chip Design, MEMS, Photonics)
- International fellowships (DAAD, SINGA, MEXT, Erasmus)

### 2. TECHNOLOGY NEWS FEED
Aggregate news from:
- IEEE Spectrum RSS
- Semiconductor Engineering RSS
- EE Times RSS
- Nature Electronics (new papers)
- Custom keyword search results

### 3. TRENDING TOPICS SECTION
Show trending keywords in electronics/semiconductor space (chip shortage, 2nm process, GaN, SiC, MEMS, spintronics, etc.)

### 4. USER FEATURES
- Email alert subscription (notify when new JRF/PhD posts matching keywords)
- Save/bookmark opportunities
- Filter by: category, location, deadline, eligibility (JRF/NET/GATE)
- Search bar

### 5. ADMIN PANEL
- Add opportunities manually
- Mark opportunities as expired
- Manage news sources

## DATABASE SCHEMA (Supabase)

Create these tables in Supabase:

```sql
-- Opportunities table
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  organization text not null,
  category text not null, -- 'JRF', 'PhD', 'Govt Job', 'Private Job', 'Fellowship', 'SRF'
  location text,
  stipend text,
  deadline date,
  eligibility text, -- 'NET', 'GATE', 'PhD', 'MSc', 'BE/BTech'
  description text,
  apply_link text,
  source_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  tags text[] -- e.g. ['VLSI', 'thin film', 'spintronics']
);

-- News articles table
create table news_articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text,
  source text,
  source_url text,
  published_at timestamp with time zone,
  image_url text,
  tags text[],
  created_at timestamp with time zone default now()
);

-- Email subscribers table
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  keywords text[],
  categories text[],
  created_at timestamp with time zone default now(),
  is_active boolean default true
);

-- Saved/bookmarked opportunities (requires auth)
create table saved_opportunities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  opportunity_id uuid references opportunities(id),
  created_at timestamp with time zone default now()
);
```

## FOLDER STRUCTURE TO CREATE

```
electrobridge/
├── app/
│   ├── layout.tsx          # Root layout with navbar + footer
│   ├── page.tsx            # Homepage with stats + featured opportunities
│   ├── opportunities/
│   │   ├── page.tsx        # All opportunities with filters
│   │   └── [id]/
│   │       └── page.tsx    # Single opportunity detail page
│   ├── news/
│   │   └── page.tsx        # News feed page
│   ├── admin/
│   │   └── page.tsx        # Admin panel (password protected)
│   └── api/
│       ├── opportunities/
│       │   └── route.ts    # GET all, POST new opportunity
│       ├── news/
│       │   └── route.ts    # GET news feed
│       ├── subscribe/
│       │   └── route.ts    # POST email subscription
│       └── scrape/
│           └── route.ts    # Trigger scraping (called by cron)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── OpportunityCard.tsx
│   ├── NewsCard.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   ├── SubscribeModal.tsx
│   ├── CategoryBadge.tsx
│   └── DeadlineCountdown.tsx
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── scrapers/
│   │   ├── rss-parser.ts   # Parse RSS feeds for news
│   │   ├── csir-scraper.ts # Scrape CSIR opportunities
│   │   └── isro-scraper.ts # Scrape ISRO opportunities
│   └── utils.ts            # Helper functions
├── types/
│   └── index.ts            # TypeScript types
├── public/
│   └── logo.svg
├── .env.local              # Environment variables
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## ENVIRONMENT VARIABLES (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password_here
CRON_SECRET=your_random_secret_for_cron_auth
```

## RSS SOURCES TO AGGREGATE (in rss-parser.ts)

```typescript
export const NEWS_SOURCES = [
  { name: 'IEEE Spectrum', url: 'https://spectrum.ieee.org/feeds/feed.rss', tags: ['IEEE', 'electronics'] },
  { name: 'EE Times', url: 'https://www.eetimes.com/feed/', tags: ['semiconductor', 'industry'] },
  { name: 'Semiconductor Engineering', url: 'https://semiengineering.com/feed/', tags: ['semiconductor', 'design'] },
  { name: 'Electronics Weekly', url: 'https://www.electronicsweekly.com/feed/', tags: ['electronics', 'news'] },
  { name: 'The Hindu Science', url: 'https://www.thehindu.com/sci-tech/science/feeder/default.rss', tags: ['India', 'science'] },
];
```

## OPPORTUNITY SOURCES TO MANUALLY SEED + MONITOR

Add these as starting seed data and instruct admin to check weekly:
- https://www.ursc.gov.in (ISRO URSC)
- https://www.drdo.gov.in/careers
- https://www.csir.res.in/funding
- https://www.nplindia.org (CSIR-NPL)
- http://www.ird.iitd.ac.in (IIT Delhi project positions)
- https://www.findaphd.com (international PhD)
- https://www.daad.de/en (DAAD scholarships)

## UI DESIGN REQUIREMENTS

**Color palette:**
- Background: #0A0F1E (deep navy — space/tech feel)
- Primary accent: #00D4FF (electric cyan)
- Secondary accent: #7B2FBE (purple — innovation)
- Card background: #111827
- Text primary: #F9FAFB
- Text muted: #6B7280
- Success/active: #10B981
- Warning/deadline: #F59E0B

**Typography:**
- Display: `Space Grotesk` (Google Fonts)
- Body: `Inter`

**Key UI elements:**
- Deadline countdown badge (red when < 7 days)
- Category color-coded badges (JRF=cyan, PhD=purple, Govt=green, Private=orange)
- Card hover lift effect
- Mobile-first responsive design
- Dark mode only

## HOMEPAGE SECTIONS (in order)

1. **Hero:** "Your Gateway to Electronics & Semiconductor Opportunities" — with live count of active opportunities
2. **Stats bar:** Total JRF positions | Total PhD positions | Total Govt jobs | News articles today
3. **Latest Opportunities** (grid of 6 cards, filterable)
4. **Latest Tech News** (horizontal scroll of news cards)
5. **Trending Tags** (clickable tag cloud)
6. **Subscribe section** (email alert signup)

## OPPORTUNITY CARD COMPONENT

Each card must show:
- Organization logo/initials avatar
- Title
- Organization name
- Category badge (color coded)
- Location
- Stipend (if available)
- Eligibility tags (NET/GATE/MSc etc)
- Deadline with countdown
- "View Details" button → opens detail page
- Bookmark icon (saves to localStorage for now)

## FILTER BAR FEATURES

Filters:
- Category: All | JRF | SRF | PhD | Govt Job | Private Job | Fellowship
- Eligibility: All | NET | GATE | MSc | BE/BTech | PhD
- Location: All | Delhi | Bangalore | Mumbai | International | Remote
- Deadline: All | This Week | This Month | Later
- Search: free text search on title + organization + tags

## ADMIN PANEL (/admin)

Password protect with ADMIN_PASSWORD env variable.

Features:
- Form to add new opportunity manually
- List all opportunities with edit/delete/mark expired buttons
- List all subscribers
- Trigger manual scrape button
- View scrape logs

## SEED DATA

Add 10 real opportunities as seed data in a file `lib/seed-data.ts`:

```typescript
export const SEED_OPPORTUNITIES = [
  {
    title: "Junior Research Fellow (JRF) - THz Detector Materials",
    organization: "ISRO URSC",
    category: "JRF",
    location: "Bangalore",
    stipend: "₹37,000/month",
    deadline: "2026-07-11",
    eligibility: "NET/GATE, MSc Electronics/Physics",
    description: "JRF position for characterization of THz detector materials. Ad No. URSC:02:2026, Position Code JRF-E7.",
    apply_link: "https://www.ursc.gov.in",
    tags: ["THz", "detector", "materials", "ISRO", "JRF"]
  },
  {
    title: "Junior Research Fellow (JRF) - Thin Film Processes",
    organization: "ISRO URSC",
    category: "JRF",
    location: "Bangalore",
    stipend: "₹37,000/month",
    deadline: "2026-07-11",
    eligibility: "NET/GATE, MSc Electronics/Physics",
    description: "JRF position for thin film deposition and process development. Ad No. URSC:02:2026, Position Code JRF-E1.",
    apply_link: "https://www.ursc.gov.in",
    tags: ["thin film", "sputtering", "ISRO", "JRF", "deposition"]
  },
  {
    title: "Research Fellow - Spintronics & Magnetic Materials",
    organization: "DRDO SSPL",
    category: "JRF",
    location: "Delhi",
    stipend: "₹37,000/month",
    deadline: "2026-08-15",
    eligibility: "NET/GATE, MSc Physics/Electronics",
    description: "Research position in spintronics, magnetic thin films, and magnetization dynamics.",
    apply_link: "https://www.drdo.gov.in",
    tags: ["spintronics", "magnetic", "DRDO", "Delhi", "thin film"]
  },
  {
    title: "Project Associate - Thin Film Technology",
    organization: "CSIR-NPL Delhi",
    category: "JRF",
    location: "Delhi",
    stipend: "₹31,000/month",
    deadline: "2026-07-30",
    eligibility: "MSc Electronics/Physics",
    description: "Walk-in position for thin film deposition, XRD and VSM characterization.",
    apply_link: "https://www.nplindia.org",
    tags: ["thin film", "XRD", "VSM", "CSIR", "Delhi", "walk-in"]
  },
  {
    title: "PhD Position - CoFeB Thin Films & Spintronics",
    organization: "TU Chemnitz",
    category: "PhD",
    location: "Germany",
    stipend: "€1,500/month (DAAD funded)",
    deadline: "2026-09-01",
    eligibility: "MSc Electronics/Physics, Research experience in thin films",
    description: "PhD fellowship in spintronics research group, Prof. Georgeta Salvan. DAAD funding available.",
    apply_link: "https://www.tu-chemnitz.de",
    tags: ["PhD", "Germany", "spintronics", "CoFeB", "DAAD", "international"]
  },
  {
    title: "SINGA PhD Fellowship - Semiconductor Devices",
    organization: "A*STAR Singapore",
    category: "Fellowship",
    location: "Singapore",
    stipend: "SGD 2,000/month",
    deadline: "2026-08-31",
    eligibility: "MSc/BE Electronics, Strong academic record",
    description: "Singapore International Graduate Award for PhD research in semiconductor and materials science.",
    apply_link: "https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa",
    tags: ["PhD", "Singapore", "SINGA", "semiconductor", "fellowship", "international"]
  },
  {
    title: "Project Scientific Officer - VLSI Design",
    organization: "IIT Delhi IRD",
    category: "JRF",
    location: "Delhi",
    stipend: "₹40,000/month",
    deadline: "2026-07-20",
    eligibility: "BE/MTech VLSI/Electronics",
    description: "Project position for VLSI circuit design and verification.",
    apply_link: "http://www.ird.iitd.ac.in",
    tags: ["VLSI", "IIT Delhi", "circuit design", "project"]
  },
  {
    title: "Scientist B - Electronics & Radar",
    organization: "DRDO LRDE",
    category: "Govt Job",
    location: "Bangalore",
    stipend: "₹56,100/month (Level 10)",
    deadline: "2026-08-01",
    eligibility: "BE/BTech Electronics, GATE qualified",
    description: "Permanent government scientist position in DRDO's radar research establishment.",
    apply_link: "https://www.drdo.gov.in",
    tags: ["DRDO", "Scientist B", "radar", "permanent job", "government"]
  },
  {
    title: "MEXT Research Student Fellowship",
    organization: "Japanese Government",
    category: "Fellowship",
    location: "Japan",
    stipend: "¥143,000/month",
    deadline: "2026-05-31",
    eligibility: "MSc completed, Under 35 years",
    description: "Japanese government scholarship for research in electronics and semiconductor fields at top Japanese universities.",
    apply_link: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
    tags: ["Japan", "MEXT", "fellowship", "international", "research"]
  },
  {
    title: "Embedded Systems Engineer",
    organization: "Texas Instruments India",
    category: "Private Job",
    location: "Bangalore",
    stipend: "₹8-14 LPA",
    deadline: "2026-07-15",
    eligibility: "BE/MTech Electronics, C/C++ skills",
    description: "Embedded firmware development for analog and mixed-signal ICs.",
    apply_link: "https://careers.ti.com",
    tags: ["embedded", "firmware", "Texas Instruments", "private", "Bangalore"]
  }
];
```

## PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.39.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "@tailwindcss/typography": "^0.5.10",
    "rss-parser": "^3.13.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.383.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

## VERCEL DEPLOYMENT INSTRUCTIONS (add to README)

1. Push code to GitHub repository
2. Go to vercel.com → Import project from GitHub
3. Add environment variables in Vercel dashboard (same as .env.local)
4. Deploy — Vercel auto-detects Next.js

## SUPABASE CRON JOB (for news auto-refresh)

In Supabase dashboard → Edge Functions, create a function called `scrape-news` that:
1. Fetches all RSS_SOURCES
2. Parses new articles
3. Inserts into news_articles table (skip duplicates by source_url)

Schedule it with pg_cron to run every 6 hours:
```sql
select cron.schedule('scrape-news', '0 */6 * * *', $$
  select net.http_post(
    url := 'https://your-vercel-url.vercel.app/api/scrape',
    headers := '{"Authorization": "Bearer YOUR_CRON_SECRET"}'::jsonb
  )
$$);
```

## BUILD ORDER FOR CLAUDE CODE

Build in this exact sequence:
1. Initialize Next.js project with TypeScript + Tailwind
2. Install all dependencies
3. Create Supabase client (lib/supabase.ts)
4. Create TypeScript types (types/index.ts)
5. Create seed data file (lib/seed-data.ts)
6. Create RSS parser utility (lib/scrapers/rss-parser.ts)
7. Build all API routes (app/api/)
8. Build all reusable components (components/)
9. Build all pages (app/)
10. Create admin panel (app/admin/)
11. Add seed data script and run it
12. Test all pages locally
13. Create README with deployment instructions

## IMPORTANT NOTES

- Use `use client` directive only where necessary (filter bar, search, subscribe modal)
- All data fetching in server components where possible (better SEO)
- Handle loading and error states on every page
- Add meta tags for SEO on every page
- Make sure mobile layout works perfectly (most users in India use mobile)
- Add a "Last updated" timestamp on opportunities
- Expired opportunities (past deadline) should be automatically hidden or marked
- The platform should work even with 0 users — seed data should make it look populated from day 1
