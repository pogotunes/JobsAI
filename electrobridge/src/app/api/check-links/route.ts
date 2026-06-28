import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function checkUrl(url: string): Promise<{ status: number; reachable: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    return { status: response.status, reachable: response.ok };
  } catch {
    return { status: 0, reachable: false };
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET || "mysecretcron2026";
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin?.from) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const { data: opportunities } = await supabaseAdmin
      .from("opportunities")
      .select("id, apply_link, verification_status, last_link_checked")
      .eq("verification_status", "verified")
      .or(`last_link_checked.is.null,last_link_checked.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`);

    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json({ checked: 0, ok: 0, broken: 0, broken_urls: [] });
    }

    const results = await Promise.all(
      opportunities.map(async (opp: { id: string; apply_link: string | null; verification_status: string | null; last_link_checked: string | null }) => {
        if (!opp.apply_link) {
          return { id: opp.id, status: 0, reachable: false, url: opp.apply_link };
        }
        return { id: opp.id, ...(await checkUrl(opp.apply_link)), url: opp.apply_link };
      })
    );

    const brokenUrls: { id: string; url: string; status: number }[] = [];
    for (const result of results) {
      const { error: _logErr } = await supabaseAdmin.from("link_check_logs").insert([
        {
          opportunity_id: result.id,
          http_status: result.status,
          is_reachable: result.reachable,
        },
      ]);

      if (!result.reachable) {
        brokenUrls.push({ id: result.id, url: result.url, status: result.status });
        await supabaseAdmin
          .from("opportunities")
          .update({
            verification_status: "link_unavailable",
            last_link_checked: new Date().toISOString(),
            link_check_status: result.status,
          })
          .eq("id", result.id);
      } else {
        await supabaseAdmin
          .from("opportunities")
          .update({
            last_link_checked: new Date().toISOString(),
            link_check_status: result.status,
          })
          .eq("id", result.id);
      }
    }

    return NextResponse.json({
      checked: results.length,
      ok: results.filter((r) => r.reachable).length,
      broken: brokenUrls.length,
      broken_urls: brokenUrls,
    });
  } catch (error) {
    console.error("Link check error:", error);
    return NextResponse.json({ error: "Link check failed" }, { status: 500 });
  }
}
