import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: "https://electrobridge.vercel.app", lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: "https://electrobridge.vercel.app/opportunities", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: "https://electrobridge.vercel.app/news", lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: "https://electrobridge.vercel.app/organizations", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "https://electrobridge.vercel.app/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://electrobridge.vercel.app/resources", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  if (supabaseAdmin?.from) {
    const { data: opportunities } = await supabaseAdmin
      .from("opportunities")
      .select("slug, created_at")
      .eq("is_active", true)
      .eq("verification_status", "verified");

    if (opportunities) {
      for (const opp of opportunities as Array<{ slug: string; created_at?: string }>) {
        urls.push({
          url: `https://electrobridge.vercel.app/opportunities/${opp.slug}`,
          lastModified: new Date(opp.created_at || Date.now()),
          changeFrequency: "daily" as const,
          priority: 0.8,
        });
      }
    }

    const { data: orgs } = await supabaseAdmin
      .from("opportunities")
      .select("org_slug")
      .eq("is_active", true);

    if (orgs) {
      const slugSet = new Set<string>();
      orgs.forEach((o: { org_slug: string }) => { if (o.org_slug) slugSet.add(o.org_slug); });
      const uniqueSlugs = Array.from(slugSet);
      for (const slug of uniqueSlugs) {
        urls.push({
          url: `https://electrobridge.vercel.app/organizations/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        });
      }
    }
  }

  return urls;
}
