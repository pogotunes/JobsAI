import Link from "next/link";
import { ArrowRight, TrendingUp, Newspaper, Zap, Bell, CheckCircle2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import type { Opportunity, NewsArticle } from "@/types";
import OpportunityCard from "@/components/OpportunityCard";
import NewsCard from "@/components/NewsCard";
import SubscribeSection from "@/components/SubscribeSection";
import ExpiringSoon from "@/components/ExpiringSoon";

async function getStats() {
  if (!supabaseAdmin?.from) {
    return { total: 0, jrf: 0, phd: 0, govt: 0, addedThisWeek: 0, newsToday: 0, verified: 0 };
  }

  const now = new Date().toISOString();
  const today = now.split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalActive },
    { count: jrfCount },
    { count: phdCount },
    { count: govtCount },
    { count: addedThisWeekCount },
    { count: newsTodayCount },
    { count: verifiedCount },
  ] = await Promise.all([
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).or(`deadline.gte.${now},deadline.is.null`),
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).eq("category", "JRF").or(`deadline.gte.${now},deadline.is.null`),
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).eq("category", "PhD").or(`deadline.gte.${now},deadline.is.null`),
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).eq("category", "Govt Job").or(`deadline.gte.${now},deadline.is.null`),
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).gte("posted_at", weekAgo).or(`deadline.gte.${now},deadline.is.null`),
    supabaseAdmin.from("news_articles").select("*", { count: "exact", head: true }).gte("published_at", yesterday),
    supabaseAdmin.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true).eq("verification_status", "verified").or(`deadline.gte.${now},deadline.is.null`),
  ]);

  return {
    total: totalActive || 0,
    jrf: jrfCount || 0,
    phd: phdCount || 0,
    govt: govtCount || 0,
    addedThisWeek: addedThisWeekCount || 0,
    newsToday: newsTodayCount || 0,
    verified: verifiedCount || 0,
  };
}

async function getLatestOpportunities(): Promise<Opportunity[]> {
  if (!supabaseAdmin?.from) return [];
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .eq("verification_status", "verified")
    .or(`deadline.gte.${today},deadline.is.null`)
    .order("created_at", { ascending: false })
    .limit(6);

  return (data as Opportunity[]) || [];
}

async function getLatestNews(): Promise<NewsArticle[]> {
  if (!supabaseAdmin?.from) return [];
  const { data } = await supabaseAdmin
    .from("news_articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(10);

  return (data as NewsArticle[]) || [];
}

async function getTrendingTags() {
  if (!supabaseAdmin?.from) return [];
  const { data } = await supabaseAdmin
    .from("opportunities")
    .select("tags")
    .eq("is_active", true);

  if (!data) return [];

  const tagCount: Record<string, number> = {};
  data.forEach((item: { tags: string[] }) => {
    item.tags?.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([tag, count]) => ({ tag, count }));
}

export default async function Home() {
  const [stats, opportunities, news, trendingTags] = await Promise.all([
    getStats(),
    getLatestOpportunities(),
    getLatestNews(),
    getTrendingTags(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is JRF in electronics?", acceptedAnswer: { "@type": "Answer", text: "Junior Research Fellowship (JRF) in electronics is a funded research position offered by government organizations like DRDO, CSIR, ISRO and IITs. Eligibility typically requires MSc Electronics or Physics with NET/GATE qualification. Stipend ranges from ₹31,000 to ₹37,000 per month." } },
      { "@type": "Question", name: "How to find JRF positions in electronics in India?", acceptedAnswer: { "@type": "Answer", text: "JRF positions in electronics are posted on official websites of DRDO, CSIR labs, ISRO centers, IITs, and NITs. ElectroBridge aggregates all these opportunities in one place, updated daily." } },
      { "@type": "Question", name: "What is the stipend for JRF in DRDO/ISRO/CSIR?", acceptedAnswer: { "@type": "Answer", text: "JRF stipend at DRDO, ISRO, and CSIR is typically ₹37,000 per month plus HRA. SRF (Senior Research Fellow) receives ₹42,000 per month. These are as per DST/SERB norms." } },
      { "@type": "Question", name: "Do I need NET or GATE for JRF positions?", acceptedAnswer: { "@type": "Answer", text: "Most government JRF positions require either UGC-NET (Electronics Science) or GATE (Electronics & Communication) qualification. Some CSIR labs have walk-in positions that may accept MSc without NET/GATE." } },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ElectroBridge",
    url: "https://electrobridge.vercel.app",
    description: "Electronics and semiconductor opportunity aggregator for Indian researchers",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://electrobridge.vercel.app/opportunities?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-cyan/10 text-cyan text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-cyan/20 shadow-accent-glow">
              <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
              {stats.verified} verified opportunities
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
              Your Gateway to Electronics &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-purple-400">
                Semiconductor
              </span>{" "}
              Opportunities
            </h1>
            <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
              One-stop platform for electronics researchers and professionals.
              Find JRF, PhD positions, government jobs, and the latest tech news
              — all in one place. Updated daily with verified listings.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan to-cyan/80 text-navy font-semibold rounded-lg px-6 py-3 hover:from-cyan/90 hover:to-cyan/70 transition-all shadow-accent-glow"
              >
                Browse Opportunities
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 border border-gray-800 text-text-primary font-medium rounded-lg px-6 py-3 hover:border-cyan/50 hover:shadow-accent-glow transition-all"
              >
                <Newspaper className="w-4 h-4" />
                Read Tech News
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-cyan/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-cyan font-display">{stats.total}</p>
            <p className="text-text-muted text-xs mt-1">Active Opportunities</p>
          </div>
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-cyan/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-cyan font-display">{stats.verified}</p>
            <p className="text-text-muted text-xs mt-1">Verified</p>
          </div>
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-purple/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-purple font-display">{stats.jrf}</p>
            <p className="text-text-muted text-xs mt-1">JRF</p>
          </div>
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-green-500/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-green-400 font-display">{stats.phd}</p>
            <p className="text-text-muted text-xs mt-1">PhD</p>
          </div>
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-amber-400/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-amber-400 font-display">{stats.govt}</p>
            <p className="text-text-muted text-xs mt-1">Govt Jobs</p>
          </div>
          <div className="bg-navy-light border border-gray-800 rounded-xl p-5 text-center hover:border-purple/30 hover:shadow-card-hover transition-all group">
            <p className="text-3xl font-bold text-purple font-display">{stats.addedThisWeek}</p>
            <p className="text-text-muted text-xs mt-1">New This Week</p>
          </div>
        </div>
      </section>

      <ExpiringSoon />

      {opportunities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-text-primary">Latest Opportunities</h2>
            <Link
              href="/opportunities"
              className="text-cyan text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-text-primary">Latest Tech News</h2>
              <Link
                href="/news"
                className="text-cyan text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {trendingTags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-cyan" />
            <h2 className="font-display text-2xl font-bold text-text-primary">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/opportunities?search=${tag}`}
                className="px-3 py-1.5 bg-navy-light border border-gray-800 rounded-full text-text-muted text-xs hover:border-cyan/50 hover:text-cyan transition-colors"
              >
                {tag} ({count})
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
        <div className="bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20 rounded-xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan/20 to-purple/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-cyan" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            Never Miss an Opportunity
          </h2>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
            Get email alerts when new JRF, PhD, or job opportunities matching your interests are posted.
          </p>
          <SubscribeSection />
        </div>
      </section>
    </div>
  );
}
