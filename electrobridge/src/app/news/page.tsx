"use client";

import { useEffect, useState, useCallback } from "react";
import type { NewsArticle } from "@/types";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";
import { Loader2, RefreshCw } from "lucide-react";

const TABS = [
  { label: "All", value: "" },
  { label: "Chip Design", value: "Chip Design" },
  { label: "Foundry", value: "Foundry" },
  { label: "AI Chips", value: "AI Chips" },
  { label: "India", value: "India" },
  { label: "Markets", value: "Markets" },
  { label: "Policy", value: "Policy" },
  { label: "5G/6G", value: "5G/6G" },
  { label: "EV/Power", value: "EV/Power" },
  { label: "Research", value: "Jobs/Research" },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (search) params.set("search", search);
      if (activeTag) params.set("tag", activeTag);

      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();

      if (data.articles) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeTag]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Tech News
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Latest electronics, semiconductor, and research news.
          </p>
        </div>
        <button
          onClick={fetchNews}
          className="inline-flex items-center gap-2 text-cyan text-sm font-medium hover:underline"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTag(tab.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTag === tab.value
                ? "bg-cyan text-navy"
                : "bg-navy-light text-text-muted border border-gray-700/50 hover:border-cyan/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-8 max-w-md">
        <SearchBar
          onSearch={setSearch}
          placeholder="Search news articles..."
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-cyan animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg mb-2">No news articles yet.</p>
          <p className="text-text-muted text-sm">
            News will appear here once fetched from RSS feeds.
          </p>
          <button
            onClick={fetchNews}
            className="mt-4 inline-flex items-center gap-2 bg-cyan text-navy font-semibold rounded-lg px-4 py-2 text-sm hover:bg-cyan/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
