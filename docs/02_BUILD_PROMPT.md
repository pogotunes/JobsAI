# ElectroBridge — Complete Build Prompt v2.0
## Paste this in OpenCode to build all new pages and features

---

You are an agentic coding assistant working exactly like Claude Code.
Loop until everything is complete. Fix all errors automatically. Never stop and ask permission.
Only stop when ALL tasks are 100% done.

Platform: ElectroBridge at https://electrobridge.vercel.app
Stack: Next.js 14 App Router + Supabase + Vercel

I need to build multiple new pages and features to make ElectroBridge a comprehensive,
SEO+AEO+GEO optimized platform. Build everything below in order.

═══════════════════════════════════════════════════
PHASE 1: CATEGORY PAGES (SEO Priority)
═══════════════════════════════════════════════════

Create these category pages. Each follows identical structure.

Create app/category/[category]/page.tsx:

The [category] param maps to:
- jrf → "JRF / Junior Research Fellowship Positions"
- srf → "SRF / Senior Research Fellowship Positions"  
- phd → "PhD Opportunities in Electronics"
- govt-job → "Government Research Jobs"
- fellowship → "Research Fellowships & Scholarships"
- private → "Private Sector Electronics Jobs"
- international → "International Opportunities"

Each category page:

SECTION 1 — SEO Header:
- H1: "[Category Name] in Electronics & Semiconductor — [current year]"
- Subline specific to category (e.g., for JRF: "Verified JRF positions at DRDO, ISRO, CSIR, IITs — updated daily")
- Live count: "X active [category] positions"

SECTION 2 — Category Description (150 words, SEO content):
Write unique content per category. Example for JRF:
"Junior Research Fellowship (JRF) positions in electronics and semiconductor science offer
MSc and NET/GATE qualified researchers an opportunity to pursue funded PhD research at premier
institutions. JRF stipend in 2026 is ₹37,000 per month for the first two years, upgradeable
to SRF at ₹42,000 per month. Organizations like DRDO, ISRO, CSIR labs, IITs, and NITs
regularly advertise JRF positions. Eligibility typically requires UGC-NET (Electronic Science)
or GATE (ECE) qualification with MSc in Electronics, Physics, or related field."

SECTION 3 — Filter Bar (same as main opportunities page but pre-filtered to this category)

SECTION 4 — Opportunities Grid (filtered to this category)

SECTION 5 — Related Resources links

SECTION 6 — FAQ specific to this category (4 questions with schema markup)
JRF FAQ: stipend, eligibility, age limit, how to apply
PhD FAQ: admission process, funding, top institutes, timeline
Govt Job FAQ: exam needed, age limit, service conditions, salary

META for each category page:
- title: "[Category] Electronics & Semiconductor Jobs 2026 | ElectroBridge"
- description: category-specific 150 char description
- canonical: https://electrobridge.vercel.app/category/[category]

Add category links to footer and navbar dropdown.

═══════════════════════════════════════════════════
PHASE 2: RESOURCE PAGES (AEO Priority)
═══════════════════════════════════════════════════

Create app/resources/page.tsx — Resources hub page:

SECTION 1 — Header:
H1: "Electronics Research Career Resources"
Subline: "Complete guides for JRF, PhD, VLSI careers, and international fellowships"

SECTION 2 — Guide Cards Grid (2×3):
Each card: icon, title, description, "Read Guide →"
1. Complete JRF Guide 2026
2. PhD in Electronics — Complete Guide
3. VLSI Career Roadmap India
4. International Fellowship Guide
5. UGC-NET vs GATE for Research
6. India Semiconductor Industry 2026

SECTION 3 — Quick Reference:
JRF Stipend Table:
| Fellowship Type | Stipend (JRF) | Stipend (SRF) | Conducting Body |
|----------------|---------------|---------------|-----------------|
| UGC-NET JRF | ₹37,000/month | ₹42,000/month | UGC / NTA |
| CSIR-JRF (GATE) | ₹37,000/month | ₹42,000/month | CSIR HRDG |
| DST-INSPIRE | ₹31,000/month | ₹35,000/month | DST |
| DRDO JRF | ₹37,000/month | ₹42,000/month | DRDO |
| ISRO JRF | ₹37,000/month | varies | ISRO |

Add this table with proper HTML table tags (NOT markdown) for schema parsing.

SECTION 4 — Current Openings (live from DB, all categories)

---

Create app/resources/jrf-guide/page.tsx:

META:
- title: "Complete JRF Guide 2026 — Electronics Science | ElectroBridge"
- description: "Everything about Junior Research Fellowship for electronics researchers: eligibility, stipend ₹37,000-42,000/month, age limit, how to apply, documents needed, DRDO ISRO CSIR openings."

H1: "Junior Research Fellowship (JRF) Complete Guide 2026 — Electronics Science"

CONTENT SECTIONS (write full content, 2000+ words total):

H2: "What is JRF in Electronics?"
Content: Define JRF, types (UGC-JRF, CSIR-JRF, institution JRF), purpose, duration

H2: "JRF Eligibility Criteria 2026"
Content: 
- Educational: MSc Electronics/Physics/Materials Science with 55% (50% for SC/ST/OBC/PwD)
- Age: Max 28 years for general, 33 years for SC/ST/PwD/women
- Qualifying exam: UGC-NET Electronic Science OR GATE ECE
- Nationality: Indian citizen

H2: "JRF Stipend 2026 — How Much Will You Earn?"
Content:
- JRF: ₹37,000/month for first 2 years
- SRF: ₹42,000/month for years 3-5
- Annual contingency: ₹20,000 (science)
- HRA: 10-30% depending on city
- Medical benefits at host institution
- Total package breakdown

H2: "Types of JRF in Electronics"
Content table:
- UGC-JRF (via NET): tenable anywhere, most flexible
- CSIR-JRF (via GATE): only at CSIR labs, path to AcSIR PhD
- Institution JRF: offered by IITs, NITs, ISRO, DRDO under specific projects
- DST-INSPIRE: separate scheme, different process

H2: "How to Find JRF Positions in Electronics"
Content: Which websites to check, how often, what to search for
List of sources: ursc.gov.in, drdo.gov.in/careers, csirhrdg.res.in, nplindia.org, 
sspl.drdo.gov.in, and most importantly: electrobridge.vercel.app

H2: "Documents Required for JRF Application"
Checklist format:
□ Updated CV (2-4 pages)
□ MSc marksheets (semester-wise)
□ MSc degree certificate
□ NET scorecard / GATE scorecard
□ Date of birth proof (10th certificate)
□ Category certificate (if applicable)
□ Research experience certificate (if any)
□ Publications list (if any)
□ Passport size photographs
□ Aadhaar card (for some applications)

H2: "JRF Interview Process — What to Expect"
Content: Selection stages, typical questions, how to prepare

H2: "JRF to PhD — The Career Path"
Content: How JRF converts to PhD, which institutions, timeline

H2: "Common Mistakes in JRF Applications"
Content: 5-6 practical mistakes to avoid

H2: "Current Open JRF Positions"
LIVE FEED: Show top 10 JRF opportunities from database (server-side fetch)
"Updated daily — [timestamp]"
Link to "View all JRF positions →"

SCHEMA: Add Article JSON-LD + FAQPage JSON-LD with these 8 questions:
1. What is the JRF stipend in 2026?
2. What is the age limit for JRF?
3. Do I need NET or GATE for JRF?
4. How to apply for DRDO JRF?
5. What is the difference between JRF and SRF?
6. How long does JRF last?
7. Can I do JRF without NET?
8. What is the difference between CSIR JRF and UGC JRF?

---

Create app/resources/international-fellowships/page.tsx:

H1: "International Fellowship Programs for Indian Electronics Researchers 2026"

META:
- title: "International Fellowships for Electronics Researchers India 2026 | ElectroBridge"
- description: "Complete guide to DAAD Germany, SINGA Singapore, MEXT Japan, Marie Curie fellowships for Indian MSc electronics researchers. Eligibility, stipends, application deadlines."

CONTENT SECTIONS:

H2: "Why Consider International Research Fellowship?"
Content: Global exposure, higher stipends, world-class labs, career value

H2: "DAAD Fellowship — Germany"
Content: What DAAD is, electronics research in Germany, eligibility for Indians,
stipend (€861-1200/month + travel), application window (Sep-Nov for next year),
top German universities for electronics research (TU Dresden, RWTH Aachen, TU Munich)

H2: "SINGA Fellowship — Singapore"
Content: Singapore International Graduate Award, A*STAR + NUS + NTU + SUTD,
stipend SGD 2,000/month, eligibility, application deadline (March-May),
focus areas (semiconductor, materials science, photonics)

H2: "MEXT Research Student — Japan"
Content: Japanese government scholarship, research student route,
stipend ¥143,000/month, eligibility, how to find Japanese professors,
application through Indian Embassy (April-June)

H2: "Marie Curie / Erasmus Mundus — Europe"
Content: EU fellowship programs, eligibility, where to find calls,
stipend varies, duration 1-3 years

H2: "Comparison Table"
| Fellowship | Country | Stipend | Duration | Deadline Season | Eligibility |
|------------|---------|---------|----------|-----------------|-------------|
| DAAD | Germany | €861-1200/mo | 1-2 years | Oct-Nov | MSc, under 32 |
| SINGA | Singapore | SGD 2000/mo | 4 years (PhD) | Mar-May | MSc/BE, strong academics |
| MEXT | Japan | ¥143,000/mo | 1.5-2 years | Apr-Jun | MSc, under 35 |
| Marie Curie | EU | €2,700/mo | 2-3 years | varies | PhD or post-PhD |

H2: "How Indian Researchers Get International Fellowships — Tips"
Content: Language requirements, research proposal writing, professor contact strategy,
GRE/TOEFL requirements, common mistakes

H2: "Current International Openings"
LIVE FEED: opportunities where location='International' OR tags includes 'international'

---

Create app/resources/vlsi-careers/page.tsx:

H1: "VLSI Career Roadmap India 2026 — Complete Guide for Electronics Engineers"

META:
- title: "VLSI Career India 2026 — Jobs, Salaries, Skills & Companies | ElectroBridge"  
- description: "Complete VLSI career guide for India 2026. RTL design, physical design, verification jobs. Companies: Intel, Qualcomm, AMD, TI. Salaries ₹5-50 LPA. Skills: Verilog, SystemVerilog, Cadence."

CONTENT SECTIONS:

H2: "VLSI Industry in India 2026"
Content: India's position (20% of world chip designers), Bangalore hub,
Tata Electronics, Micron India, Intel India, Qualcomm India, upcoming fabs

H2: "VLSI Job Roles — Which Path is Right for You?"
Content:
RTL Design: writing hardware in Verilog/SystemVerilog, salary ₹6-15 LPA fresh
Physical Design: floorplan, place & route, timing, salary ₹7-18 LPA fresh
Verification: UVM, coverage, salary ₹6-14 LPA fresh
DFT: scan insertion, ATPG, salary ₹7-15 LPA
Analog/Mixed Signal: circuit design, salary ₹8-20 LPA
Process Engineering: fab-side, Tata/Micron openings

H2: "Skills Required for VLSI Jobs 2026"
For each role, list tools + languages + concepts

H2: "Top Companies Hiring VLSI Engineers in India"
Table: Company | Role | Location | Salary Range | How to Apply
Intel, Qualcomm, AMD, MediaTek, Texas Instruments, Analog Devices, Synopsys, Cadence,
Siemens EDA, ARM, MARVELL, Nvidia India, Samsung R&D

H2: "Salary Guide — VLSI India 2026"
Table by experience:
| Experience | Role | Salary Range |
|-----------|------|-------------|
| 0-1 year (fresher) | RTL/Verification | ₹5-12 LPA |
| 2-4 years | RTL/PD | ₹12-25 LPA |
| 5-8 years | Senior | ₹25-45 LPA |
| 10+ years | Lead/Principal | ₹45-80 LPA |

H2: "How to Get Into VLSI — Learning Path"
NPTEL courses, Udemy, VSD courses, internships, projects

H2: "Current VLSI Job Openings"
LIVE FEED: private jobs with tags including 'VLSI', 'RTL', 'embedded', 'chip design'

---

Create app/resources/net-vs-gate/page.tsx:

H1: "UGC-NET vs GATE for Electronics Research Career — Which Should You Choose?"

Full comparison article, 1500 words, with:
- Comparison table
- Use case scenarios
- Recommendation by career goal
- FAQ schema

═══════════════════════════════════════════════════
PHASE 3: NEWS ARTICLE DETAIL PAGES
═══════════════════════════════════════════════════

Currently news articles open external links directly.
Add internal news detail pages.

Add slug column to news_articles:
```sql
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS slug text;
UPDATE news_articles SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
UPDATE news_articles SET slug = trim(both '-' from slug);
UPDATE news_articles SET slug = left(slug, 80);
ALTER TABLE news_articles ADD CONSTRAINT unique_news_slug UNIQUE (slug);
```

Create app/news/[slug]/page.tsx:

SECTION 1 — Breadcrumb: Home > News > [Title]
SECTION 2 — Article Header:
- Source badge (colored) + source name + published date
- H1: Article title
- Tags: [semiconductor] [TSMC] etc.
- Share: WhatsApp + Twitter + Copy Link

SECTION 3 — Article Content:
- Summary (2-3 paragraphs from scraped summary, rewritten)
- "Read full article at [Source name] →" prominent button
- Note: "ElectroBridge provides summaries. For full coverage, visit the original source."

SECTION 4 — Related News (3 articles, same tags)
SECTION 5 — Related Opportunities (3 opportunities, same tags as article)

META (dynamic):
- title: "[Article Title] | ElectroBridge News"
- description: first 150 chars of summary
- og:image: source favicon or default news OG image

Schema: NewsArticle JSON-LD

Update news cards on /news page to link to /news/[slug] instead of external URL directly.
Keep "Read original →" button on the detail page for the external link.

═══════════════════════════════════════════════════
PHASE 4: ABOUT PAGE
═══════════════════════════════════════════════════

Create app/about/page.tsx:

H1: "About ElectroBridge"

SECTION 1 — Mission:
"ElectroBridge was built by an electronics researcher, for electronics researchers.
We know how frustrating it is to check 15 different websites every day looking for JRF
positions, PhD opportunities, and semiconductor job openings. ElectroBridge solves this
by aggregating, verifying, and presenting all opportunities in one place — updated daily."

SECTION 2 — What We Cover:
- 6 cards for each category with description

SECTION 3 — Our Verification Process:
How we verify, what verified means, how to report issues

SECTION 4 — Frequently Asked Questions about the Platform:
(Different from content FAQs — these are platform-specific)
- Is ElectroBridge free?
- How often is it updated?
- How do I suggest a new source?
- How do I report wrong information?
- Can my organization post on ElectroBridge?

SECTION 5 — Contact:
Email, Telegram link, suggest opportunity form (simple: URL + notes textarea)

SCHEMA: WebSite + Organization JSON-LD

═══════════════════════════════════════════════════
PHASE 5: MOBILE HAMBURGER MENU
═══════════════════════════════════════════════════

Update components/Navbar.tsx:

Mobile (<768px):
- Hide all nav links
- Show hamburger icon (☰) on right side
- Clicking opens fullscreen overlay:
  - Close button (×) top right
  - Logo top left
  - Nav items in large text, vertically stacked:
    Opportunities | News | Organizations | Resources | Find My Match | Ask AI | About
  - Subscribe CTA at bottom of mobile menu
- Closes on: link click, outside tap, Escape key

Use React state (useState) for open/close — no external library needed.

═══════════════════════════════════════════════════
PHASE 6: NAVBAR UPDATES
═══════════════════════════════════════════════════

Update Navbar with dropdown menus:

Desktop navbar:
- Logo (left)
- Opportunities (link + dropdown on hover):
  - All Opportunities
  - JRF Positions
  - PhD Opportunities  
  - Govt Research Jobs
  - Fellowships
  - Private Jobs
- News
- Organizations
- Resources (link + dropdown):
  - JRF Complete Guide
  - PhD Guide
  - VLSI Careers
  - International Fellowships
  - NET vs GATE
- 🎯 Find My Match (cyan accent)
- 💬 Ask AI

═══════════════════════════════════════════════════
PHASE 7: CONTACT PAGE
═══════════════════════════════════════════════════

Create app/contact/page.tsx:

Simple, clean contact page:
- H1: "Contact ElectroBridge"
- Email: admin@electrobridge.vercel.app
- Telegram: [link]
- "Suggest an opportunity source" form: URL input + notes + submit
  (Saves to a suggestions table in Supabase)
- "Report wrong information": opportunity URL + description of issue + submit

Create suggestions table:
```sql
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text, -- 'source' or 'report'
  url text,
  notes text,
  submitted_at timestamp with time zone DEFAULT now(),
  is_reviewed boolean DEFAULT false
);
```

═══════════════════════════════════════════════════
PHASE 8: TECHNICAL SEO COMPLETIONS
═══════════════════════════════════════════════════

8A — Update app/layout.tsx with complete metadata:
(As specified in previous SEO prompt — ensure it's complete)

8B — Verify sitemap includes all new pages:
Update app/sitemap.ts to include:
- /category/jrf, /category/phd, /category/govt-job, /category/fellowship, /category/private
- /resources, /resources/jrf-guide, /resources/international-fellowships, /resources/vlsi-careers, /resources/net-vs-gate
- /news/[slug] for all news articles
- /about, /contact, /match, /ask

8C — Add structured data to all new pages (as specified above)

8D — Update footer with all new page links

8E — Internal linking:
- Every opportunity detail page → links to relevant resource page
  (JRF opportunity → links to /resources/jrf-guide)
- Every resource page → links to relevant category page
- Every org page → links back to /organizations
- Homepage → links to all major pages

═══════════════════════════════════════════════════
BUILD ORDER — FOLLOW EXACTLY
═══════════════════════════════════════════════════

1. SQL migrations (slug for news, suggestions table)
2. Phase 1: Category pages (6 pages)
3. Phase 2: Resources hub + 4 resource detail pages
4. Phase 3: News article detail pages
5. Phase 4: About page
6. Phase 5: Mobile hamburger menu
7. Phase 6: Navbar updates with dropdowns
8. Phase 7: Contact page
9. Phase 8: Technical SEO completions

After all done:
- List all files created
- Confirm all pages have proper H1, meta title, meta description
- Confirm all resource pages have live opportunity feeds at the bottom
- Confirm sitemap.xml includes all new pages
- Give me the list of pages to submit to Google Search Console
- Give me the list of pages to test on Google Rich Results Test

NEVER STOP. FIX ALL ERRORS. COMPLETE ALL 8 PHASES.
```