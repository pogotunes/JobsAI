# ElectroBridge — Setup Guide (Non-Coder Friendly)
## Bina coding jaane platform launch karo — Step by Step

---

## STEP 1: Accounts Banao (Sabhi FREE)

### 1A. GitHub Account
1. github.com par jao
2. "Sign up" karo — free account banao
3. Username yaad rakh lo (e.g. `amitk-electronics`)

### 1B. Supabase Account (Database)
1. supabase.com par jao
2. "Start your project" → GitHub se login karo
3. "New Project" banao
   - Name: `electrobridge`
   - Database Password: koi bhi strong password (NOTE KAR LO)
   - Region: Southeast Asia (Singapore) — India ke liye fastest
4. Project create hone do (2-3 min lagega)
5. Baad mein yahan se chahiye:
   - Settings → API → "Project URL" (copy karo)
   - Settings → API → "anon public" key (copy karo)
   - Settings → API → "service_role" key (copy karo — SECRET RAKHO)

### 1C. Vercel Account (Deployment)
1. vercel.com par jao
2. "Sign Up" → GitHub se login karo
3. Bus itna kafi hai abhi

---

## STEP 2: Database Setup (Supabase mein)

Supabase dashboard mein jao → SQL Editor tab → New Query

Yeh SQL paste karo aur Run karo:

```sql
-- Opportunities table
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  organization text not null,
  category text not null,
  location text,
  stipend text,
  deadline date,
  eligibility text,
  description text,
  apply_link text,
  source_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  tags text[]
);

-- News table
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

-- Subscribers table
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  keywords text[],
  categories text[],
  created_at timestamp with time zone default now(),
  is_active boolean default true
);

-- RLS (Row Level Security) enable karo
alter table opportunities enable row level security;
alter table news_articles enable row level security;
alter table subscribers enable row level security;

-- Public read access do
create policy "Public can read opportunities" on opportunities for select using (true);
create policy "Public can read news" on news_articles for select using (true);
create policy "Anyone can subscribe" on subscribers for insert with check (true);
```

---

## STEP 3: OpenCode Mein kya karo

### OpenCode kholne ke baad:

**Pehle yeh prompt do:**

```
I want you to work like Claude Code — use agentic loops, create files, run commands, and don't stop until the task is complete. Keep going through errors automatically and fix them.

I am building a web platform called ElectroBridge. I will now paste a complete build specification. Read it carefully, then build the entire project step by step without stopping. After each major step, tell me what you completed and what's next.
```

**Phir 01_MASTER_PROMPT.md ka poora content paste karo.**

**Phir yeh environment variables bhi do:**
```
My environment variables are:
NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
ADMIN_PASSWORD=electrobridge2026
CRON_SECRET=mysecretcron2026
```

---

## STEP 4: GitHub Par Code Daalo

OpenCode mein yeh commands chalao:

```bash
git init
git add .
git commit -m "Initial ElectroBridge platform"
```

Phir GitHub par:
1. github.com → "New repository"
2. Name: `electrobridge`
3. Private rakh sakte ho
4. "Create repository"
5. Wahan dikhaya hua command paste karo OpenCode mein

---

## STEP 5: Vercel Par Deploy Karo

1. vercel.com → "Add New Project"
2. "Import from GitHub" → `electrobridge` select karo
3. Environment Variables section mein yeh add karo:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [tumhara supabase url]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [tumhari anon key]
   SUPABASE_SERVICE_ROLE_KEY = [tumhari service role key]
   ADMIN_PASSWORD = electrobridge2026
   CRON_SECRET = mysecretcron2026
   ```
4. "Deploy" karo
5. 2-3 minute mein live ho jayega!

---

## STEP 6: Pehli Baar Data Daalo

Vercel deploy hone ke baad, browser mein jao:
```
https://tumhara-vercel-url.vercel.app/api/seed
```
(Yeh URL OpenCode se puchh lo ki seed endpoint kahan hai)

Isse 10 real opportunities automatically database mein chali jayengi.

---

## STEP 7: Admin Panel Use Karo

```
https://tumhara-vercel-url.vercel.app/admin
```

Password: `electrobridge2026` (ya jo tumne set kiya)

Yahaan se:
- Nayi opportunities manually add karo
- News sources manage karo
- Purani entries delete karo

---

## ONGOING MAINTENANCE (Weekly 30 min)

**Har hafte karo:**
1. Admin panel kholo
2. In websites check karo for new openings:
   - ursc.gov.in
   - drdo.gov.in/careers
   - csir.res.in
   - nplindia.org
   - ird.iitd.ac.in
3. Nayi opportunities admin panel se add karo
4. Deadline nikal gayi opportunities ko "expire" mark karo

**News automatic update hogi** — Supabase cron har 6 ghante mein RSS feeds se khud pull karega.

---

## TROUBLESHOOTING

**Problem:** Vercel deploy fail ho gayi
**Solution:** OpenCode mein puchho "Fix the Vercel deployment error: [error message paste karo]"

**Problem:** Database mein data nahi aa raha
**Solution:** Supabase dashboard → Table Editor mein check karo ki tables bani hain ya nahi

**Problem:** Admin panel nahi khul raha
**Solution:** Password case-sensitive hai, exactly `electrobridge2026` daalo

---

## FUTURE FEATURES (Phase 2 — free mein)

Jab platform stable ho jaye, yeh add kar sakte ho:
- Google Sheets integration (opportunities update karna aur bhi easy)
- Telegram bot alert (subscribers ko message jayega)
- WhatsApp alert (Twilio free tier)
- Discussion forum (Supabase Realtime use karke)

---

## IMPORTANT: Free Tier Limits

| Service | Free Limit | Kab Upgrade Karna Padega |
|---------|------------|--------------------------|
| Supabase | 500MB DB, 2GB bandwidth/month | Jab 10,000+ users ho |
| Vercel | 100GB bandwidth/month | Jab bahut traffic aaye |
| GitHub | Unlimited public repos | Kabhi nahi (free hi rahega) |

Shuruat ke 1-2 saal free tier mein aaram se kaam chalega.
