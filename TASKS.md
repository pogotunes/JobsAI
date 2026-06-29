# TASKS.md — ElectroBridge Next Steps
**OpenCode ko ye file + MASTER_CONTEXT.md dono deni hain.**
**Ye tasks priority order mein hain. Ek complete karo, phir agla lo.**

---

## TASK 1 — Toast Notification System (30 min)

**Problem:** Subscribe, report issue, contact form — in sab actions ke baad user ko koi feedback nahi milta.

**What to do:**

Install `sonner` (lightweight toast library):
```bash
npm install sonner
```

1. `src/app/layout.tsx` mein `<Toaster />` component add karo (sonner ka) — layout ke end mein, `</body>` se pehle.

2. `src/components/SubscribeSection.tsx` mein:
   - Import `toast` from `sonner`
   - Success response aane par: `toast.success("Subscribed! You'll get weekly alerts.")`
   - Error par: `toast.error("Something went wrong. Try again.")`

3. `src/components/SubscribeModal.tsx` mein same changes.

4. `src/components/ReportIssueModal.tsx` mein:
   - Success: `toast.success("Issue reported. We'll look into it.")`
   - Error: `toast.error("Couldn't submit report. Try again.")`

5. `src/app/contact/page.tsx` mein:
   - Success: `toast.success("Message sent! We'll get back to you.")`

**Test:** Subscribe with an email → toast should appear. Try again with same email → different toast.

---

## TASK 2 — Error & Not-Found Pages (20 min)

**Problem:** App has no custom error pages. Vercel default is shown on errors and 404s.

**What to do:**

1. Create `src/app/not-found.tsx`:
```
Page title: "Page Not Found"
Show: "404 — This page doesn't exist."
Link back to homepage: "← Back to ElectroBridge"
Keep design consistent with rest of site (same Navbar/Footer).
```

2. Create `src/app/error.tsx`:
```
Must be 'use client' component.
Props: { error: Error, reset: () => void }
Show: "Something went wrong."
Show the error.message in a code block (muted, small text).
Show a "Try again" button that calls reset().
Link back to homepage.
```

3. Create `src/app/opportunities/[slug]/not-found.tsx`:
```
Show: "Opportunity not found or has expired."
Link to: /opportunities
Text: "Browse all opportunities"
```

4. Create `src/app/news/[slug]/not-found.tsx`:
```
Show: "Article not found."
Link to: /news
```

**Test:** Go to `/some-random-url` → should see custom 404. Go to `/opportunities/fake-slug` → should see opportunity-specific 404.

---

## TASK 3 — Loading States (20 min)

**Problem:** Page transitions have no loading indication. Only `LoadingSkeleton` component exists but no `loading.tsx` files.

**What to do:**

1. Create `src/app/opportunities/loading.tsx`:
```
Show 6 instances of LoadingSkeleton component in a grid.
Same grid layout as opportunities page (2 cols desktop, 1 col mobile).
```

2. Create `src/app/news/loading.tsx`:
```
Show 6 instances of LoadingSkeleton in a grid.
```

3. Create `src/app/opportunities/[slug]/loading.tsx`:
```
Show a full-page skeleton matching the detail page layout:
- Wide skeleton for title
- 3 small skeletons for meta (location, stipend, deadline)
- Large skeleton block for description
```

4. Create `src/app/chat/loading.tsx`:
```
Simple: centered spinner or "Loading AI chat..." text.
```

**Note:** `LoadingSkeleton` is already built at `src/components/LoadingSkeleton.tsx`. Import and use it.

---

## TASK 4 — AI Features: Enable Groq (Free Tier) (45 min)

**Problem:** All AI features (chat, search, match, summarize) are built but no AI API key is configured. Features silently fail.

**What to do:**

**Step 1 (manual — you do this, not OpenCode):**
- Go to https://console.groq.com → Sign up free → Create API key
- Add to Vercel: `GROQ_API_KEY=your_key_here`
- Also optionally: https://aistudio.google.com → Get Gemini API key → `GEMINI_API_KEY=your_key`

**Step 2 (OpenCode):**

Check `src/lib/ai/providers.ts` — the provider chain is already built. Just verify:
- `GROQ_API_KEY` env var is read correctly
- Groq provider uses model `llama3-8b-8192` or `mixtral-8x7b-32768` (both free)
- If model name is wrong, update to current Groq free model names

**Step 3:** Test `/chat` page — type a message → should get AI response.

**Step 4:** Test `/opportunities` page → AI search input → should return semantic results.

**If Groq is not working**, check `/api/ai/chat` route — add a console.log to see which provider is being tried and what error comes back.

---

## TASK 5 — Email Digest: Enable Resend (Free Tier) (30 min)

**Problem:** Email digest logic is built but `RESEND_API_KEY` is missing.

**What to do:**

**Step 1 (manual — you do this):**
- Go to https://resend.com → Sign up free (3,000 emails/month free)
- Create API key
- Add to Vercel: `RESEND_API_KEY=your_key`
- Add to Vercel: `FROM_EMAIL=noreply@electrobridge.vercel.app`

**Step 2 (OpenCode):**
- Open `src/lib/email-digest.ts`
- Check if FROM_EMAIL is read from env: `process.env.FROM_EMAIL`
- Check if there's a fallback that might be wrong
- If `FROM_EMAIL` uses a custom domain, change it to use Resend's default: `onboarding@resend.dev` (works on free tier without domain verification)

**Step 3:** Test by manually calling `/api/send-digest` with Postman or curl:
```bash
curl -X POST https://electrobridge.vercel.app/api/send-digest \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
Should send digest to all active subscribers.

---

## TASK 6 — Fix Double Font Loading (10 min)

**Problem:** `globals.css` has Google Fonts `@import` AND `layout.tsx` uses `next/font`. Fonts load twice = performance hit.

**What to do:**

1. Open `src/app/globals.css`
2. Find and remove any `@import url('https://fonts.googleapis.com/...')` lines
3. Keep only the Tailwind directives and custom CSS
4. Fonts are already loaded correctly via `next/font` in `layout.tsx` — that's the right way

**Test:** Run `npm run build` → should still work. Check network tab in browser → fonts should load once, not twice.

---

## TASK 7 — Admin Panel: Add Opportunity Form (60 min)

**Problem:** Admin can see opportunities and mark verified/unverified, but cannot ADD new opportunities from the dashboard.

**What to do:**

Add a new page: `src/app/admin/add-opportunity/page.tsx`

**Form fields (all optional except title, organization, category):**
- title (text, required)
- organization (text, required)
- category (select: JRF / SRF / PhD / Postdoc / Fellowship / Govt Job / Private Job / Internship / Project Associate)
- location (text)
- stipend (text, e.g. "₹37,000/month")
- deadline (date input)
- description (textarea)
- apply_link (URL input)
- official_page_url (URL input — required for verification)
- tags (comma-separated text input, split on save to text[])
- verification_status (select: pending / verified / link_unavailable)

**On submit:**
- INSERT into `opportunities` table using `supabaseAdmin`
- `is_active: true` by default
- `posted_at: new Date().toISOString()`
- After success: show toast "Opportunity added!" and clear form
- On error: show toast with error message

**Add a button in `src/app/admin/page.tsx`:** "Add New Opportunity" → links to `/admin/add-opportunity`

**This page must be inside the admin password check** — verify the admin page already wraps content in auth check and replicate that pattern.

---

## TASK 8 — Admin Panel: Edit & Delete Opportunity (45 min)

**Problem:** Admin can verify/unverify but cannot edit details or delete.

**What to do:**

Add new page: `src/app/admin/edit-opportunity/[id]/page.tsx`

1. On page load: fetch opportunity by ID from Supabase
2. Show same form as TASK 7 but pre-filled with existing data
3. On submit: UPDATE the opportunity in Supabase
4. Add a "Delete" button with a confirm dialog: "Are you sure? This cannot be undone."
5. On delete: set `is_active = false` (soft delete, don't actually remove from DB)

**In `src/app/admin/page.tsx`:** Add "Edit" button next to each opportunity in the list → links to `/admin/edit-opportunity/[id]`

---

## TASK 9 — Add News Manually (Admin) (30 min)

**Problem:** News comes only from RSS scrapers. Admin cannot manually add important news articles.

**What to do:**

Add page: `src/app/admin/add-news/page.tsx`

**Fields:**
- title (required)
- slug (auto-generated from title, editable)
- description (required — 2-3 line summary)
- source_name (e.g. "IEEE Spectrum")
- source_url (URL of original article)
- category (select: Semiconductor / VLSI / Embedded / Research / Policy / Industry)
- tags (comma-separated)
- image_url (optional)
- published_at (datetime, default: now)

**On submit:** INSERT into `news_articles` table.

**Slug generation:** Convert title to lowercase, replace spaces with hyphens, remove special chars.
Example: "TSMC Announces 2nm Process" → "tsmc-announces-2nm-process"

---

## TASK 10 — SEO: Fix Metadata on All Pages (30 min)

**Problem:** Several pages may have generic or missing metadata.

**What to do:**

For each of these pages, add or update `generateMetadata` (server components) or `metadata` export:

1. `src/app/opportunities/[slug]/page.tsx` — already should have this, verify it uses opportunity title + description
2. `src/app/news/[slug]/page.tsx` — verify uses article title + description
3. `src/app/chat/page.tsx` — add: `title: "AI Career Assistant — ElectroBridge"`, `description: "Ask anything about electronics and semiconductor careers, JRF, PhD admissions."`
4. `src/app/match/page.tsx` — add: `title: "AI Opportunity Match — ElectroBridge"`, `description: "Upload your profile and find the best matching opportunities."`
5. `src/app/about/page.tsx` — add proper title + description
6. `src/app/organizations/page.tsx` — add: `title: "Organizations — ElectroBridge"`

Also verify `src/app/sitemap.ts` includes all these pages.

---

## TASK 11 — Fix: No Input Validation on Subscribe (20 min)

**Problem:** `/api/subscribe` accepts any string as email. No validation.

**What to do:**

In `src/app/api/subscribe/route.ts`:

1. Validate email format with regex:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
}
```

2. Trim whitespace from email before saving: `email.trim().toLowerCase()`

3. Check if already subscribed → return friendly message instead of DB error

In `src/app/api/report-issue/route.ts`:
1. Check that `opportunity_id` is a valid UUID before querying
2. Trim and limit `notes` to 500 characters max

---

*Tasks 1-3 are quick wins — do them first.*
*Tasks 4-5 need free account signups (Groq, Resend) — do them yourself, then tell OpenCode.*
*Tasks 7-9 add important missing admin features.*
*Tasks 10-11 are polish.*
