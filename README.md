# ElectroBridge — Electronics & Semiconductor Opportunities Platform

A one-stop aggregator for electronics and semiconductor research opportunities in India and globally. Built with Next.js 14, Supabase, and Tailwind CSS.

## Quick Start

```bash
cd electrobridge
npm install
# Create .env.local with Supabase credentials (see electrobridge/README.md)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- [`electrobridge/`](./electrobridge/) — Next.js 14 application (App Router)
- [`docs/`](./docs/) — Build specifications, API key guides, maintenance docs

## Features

- **Opportunities** — JRF, SRF, PhD, Govt Jobs, Private Sector, International (7 categories)
- **Tech News** — RSS scraper with AI-powered filtering from 18 electronics sources
- **Organizations** — Browse by organization
- **Resource Guides** — JRF guide, VLSI careers, International fellowships, NET vs GATE
- **AI Integration** — Smart search, opportunity matcher, chat assistant, summarizer, weekly digest
- **Match** — Find opportunities matching your profile
- **Email Digests** — Weekly newsletter with personalized recommendations

## Tech Stack

- **Next.js 14** (App Router, Server Components)
- **Supabase** (PostgreSQL, Row Level Security)
- **Tailwind CSS** (Dark theme)
- **Vercel** (Deployment)
- **AI** — Groq, Gemini, OpenRouter, Cloudflare Workers AI, HuggingFace

## Deploy

1. Push to GitHub
2. Import in [Vercel](https://vercel.com) (root: `electrobridge/`)
3. Add environment variables
4. Deploy

---

Built for the electronics research community. **100% free tier.**
