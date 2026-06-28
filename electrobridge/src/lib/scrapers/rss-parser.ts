import Parser from "rss-parser";
import type { ScrapedOpportunity } from "./types";
import { isRelevantNews, cleanTitle } from "./utils";

export interface NewsSourceConfig {
  name: string;
  url: string;
  tags: string[];
  type?: "news" | "opportunity";
}

export const NEWS_SOURCES: NewsSourceConfig[] = [
  {
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feeds/feed.rss",
    tags: ["IEEE", "electronics"],
  },
  {
    name: "EE Times",
    url: "https://www.eetimes.com/feed/",
    tags: ["semiconductor", "industry"],
  },
  {
    name: "Semiconductor Engineering",
    url: "https://semiengineering.com/feed/",
    tags: ["semiconductor", "design"],
  },
  {
    name: "Electronics Weekly",
    url: "https://www.electronicsweekly.com/feed/",
    tags: ["electronics", "news"],
  },
  {
    name: "The Hindu Science",
    url: "https://www.thehindu.com/sci-tech/science/feeder/default.rss",
    tags: ["India", "science"],
  },
  {
    name: "Physics World",
    url: "https://physicsworld.com/feed/",
    tags: ["physics", "research", "science"],
  },
  {
    name: "Nature Electronics",
    url: "https://www.nature.com/natelectron.rss",
    tags: ["electronics", "research", "nature"],
  },
  {
    name: "FindAPhD - Semiconductor",
    url: "https://www.findaphd.com/phds/rss/?Keywords=semiconductor&StartDate=7",
    tags: ["PhD", "semiconductor", "international"],
    type: "opportunity",
  },
  {
    name: "FindAPhD - Electronics Thin Film",
    url: "https://www.findaphd.com/phds/rss/?Keywords=thin+film+electronics",
    tags: ["PhD", "thin film", "international"],
    type: "opportunity",
  },
  {
    name: "FindAPhD - Spintronics",
    url: "https://www.findaphd.com/phds/rss/?Keywords=spintronics",
    tags: ["PhD", "spintronics", "international"],
    type: "opportunity",
  },
];

export interface ParsedArticle {
  title: string;
  summary: string | null;
  source: string;
  source_url: string | null;
  published_at: string | null;
  image_url: string | null;
  tags: string[];
}

async function fetchRSSFeed(
  source: string,
  feedUrl: string,
  defaultTags: string[]
): Promise<ParsedArticle[]> {
  try {
    const parser = new Parser({
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ElectroBridge/1.0)",
      },
    });
    const feed = await parser.parseURL(feedUrl);
    const results: ParsedArticle[] = [];
    for (const item of feed.items) {
      const title = item.title || "Untitled";
      const summary = item.contentSnippet?.substring(0, 300) || null;
      if (!isRelevantNews(title, summary)) continue;
      results.push({
        title,
        summary,
        source,
        source_url: item.link || null,
        published_at: item.pubDate || item.isoDate || null,
        image_url:
          item.enclosure?.url ||
          (item["media:content"] as any)?.$.url ||
          null,
        tags: defaultTags,
      });
    }
    return results;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}

export async function fetchAllNews(): Promise<ParsedArticle[]> {
  const results: ParsedArticle[] = [];
  for (const source of NEWS_SOURCES) {
    if (source.type === "opportunity") continue;
    try {
      const articles = await fetchRSSFeed(source.name, source.url, source.tags);
      results.push(...articles);
    } catch {
      // per-feed error already logged
    }
  }
  return results;
}

function extractDeadlineFromDescription(description: string): string | null {
  const dateMatch = description.match(
    /(?:application\s+deadline|deadline|closing\s+date)[:\s]+(\d{1,2}\s+\w+\s+\d{4}|\d{4}-\d{2}-\d{2})/i
  );
  if (dateMatch) {
    try {
      const d = new Date(dateMatch[1]);
      if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
    } catch {
      // ignore parse errors
    }
  }
  return null;
}

function extractStipendFromDescription(description: string): string | null {
  const stipendMatch = description.match(
    /(?:stipend|salary|funding)[:\s]+([^.\n]+)/i
  );
  return stipendMatch ? stipendMatch[1].trim() : null;
}

function extractEligibilityFromDescription(description: string): string | null {
  const eligMatch = description.match(
    /(?:eligibility|requirements?|qualifications?|entry\s+requirements?)[:\s]+([^.\n]+)/i
  );
  return eligMatch ? eligMatch[1].trim() : null;
}

export async function fetchOpportunitiesFromRSS(): Promise<
  ScrapedOpportunity[]
> {
  const results: ScrapedOpportunity[] = [];
  for (const source of NEWS_SOURCES) {
    if (source.type !== "opportunity") continue;
    try {
      const parser = new Parser({
        timeout: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ElectroBridge/1.0)",
        },
      });
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items) {
        const description = item.contentSnippet || item.content || "";
        const deadline = extractDeadlineFromDescription(description);
        const stipend = extractStipendFromDescription(description);
        const eligibility = extractEligibilityFromDescription(description);

        results.push({
          title: item.title || "Untitled",
          organization: item.creator || item.publisher || source.name,
          category: "PhD",
          location: "International",
          stipend,
          deadline,
          eligibility,
          description: description.substring(0, 500),
          apply_link: item.link || "",
          source_url: item.link || "",
          tags: source.tags,
        });
      }
    } catch (error) {
      console.error(`Error fetching RSS feed ${source.url}:`, error);
    }
  }
  return results;
}
