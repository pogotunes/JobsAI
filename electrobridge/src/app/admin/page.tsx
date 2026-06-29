"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Opportunity, Subscriber } from "@/types";
import { CATEGORIES } from "@/lib/utils";
import { NEWS_SOURCES } from "@/lib/scrapers/rss-parser";
import { Loader2, Trash2, Plus, RefreshCw, Check, List, History, ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, Edit3, RotateCcw, Sparkles } from "lucide-react";
import AIAnalyticsPanel from "@/components/AIAnalyticsPanel";
import { isConfigured } from "@/lib/supabase";

interface ScrapeLog {
  id: number;
  timestamp: string;
  status: "success" | "error";
  message: string;
  total_fetched?: number;
  inserted?: number;
  skipped?: number;
}

let logIdCounter = 0;

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"opportunities" | "verification" | "add" | "subscribers" | "sources" | "logs" | "popular" | "ai">(
    "opportunities"
  );

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    organization: "",
    category: "JRF",
    location: "",
    stipend: "",
    deadline: "",
    eligibility: "",
    description: "",
    apply_link: "",
    official_page_url: "",
    apply_link_type: "homepage",
    admin_notes: "",
    tags: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [aiFilling, setAiFilling] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState("");
  const [scrapeLogs, setScrapeLogs] = useState<ScrapeLog[]>([]);
  const [sourcesEnabled, setSourcesEnabled] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NEWS_SOURCES.forEach((s) => (initial[s.name] = true));
    return initial;
  });
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ apply_link: "", official_page_url: "" });
  const [rechecking, setRechecking] = useState<string | null>(null);

  const addLog = useCallback((log: Omit<ScrapeLog, "id" | "timestamp">) => {
    logIdCounter++;
    setScrapeLogs((prev) => [{ id: logIdCounter, timestamp: new Date().toLocaleString(), ...log }, ...prev]);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "electrobridge2026";
    if (password === adminPassword) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    if (!isConfigured) { setOpportunities([]); setLoading(false); return; }
    const { data } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
    setOpportunities(data || []);
    setLoading(false);
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    if (!isConfigured) { setSubscribers([]); setLoading(false); return; }
    const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    setSubscribers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) { fetchOpportunities(); fetchSubscribers(); }
  }, [authenticated]);

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          is_active: true,
          verification_status: form.apply_link ? "verified" : "unverified",
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMessage("Opportunity added successfully!");
        setForm({ title: "", organization: "", category: "JRF", location: "", stipend: "", deadline: "", eligibility: "", description: "", apply_link: "", official_page_url: "", apply_link_type: "homepage", admin_notes: "", tags: "" });
        fetchOpportunities();
      } else {
        const data = await res.json();
        setFormStatus("error");
        setFormMessage(data.error || "Failed to add opportunity");
      }
    } catch { setFormStatus("error"); setFormMessage("Something went wrong"); }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm("Delete this opportunity?")) return;
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (!error) { fetchOpportunities(); }
  };

  const handleMarkExpired = async (id: string) => {
    const { error } = await supabase.from("opportunities").update({ is_active: false }).eq("id", id);
    if (!error) { fetchOpportunities(); }
  };

  const handleVerify = async (id: string) => {
    await supabase.from("opportunities").update({ verification_status: "verified", verified_at: new Date().toISOString() }).eq("id", id);
    fetchOpportunities();
  };

  const handleMarkUnavailable = async (id: string) => {
    await supabase.from("opportunities").update({ verification_status: "link_unavailable" }).eq("id", id);
    fetchOpportunities();
  };

  const handleRecheck = async (id: string) => {
    setRechecking(id);
    try {
      await fetch("/api/admin/recheck-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity_id: id }),
      });
    } catch {}
    setRechecking(null);
    fetchOpportunities();
  };

  const startEditLink = (opp: Opportunity) => {
    setEditingLink(opp.id!);
    setEditForm({ apply_link: opp.apply_link || "", official_page_url: opp.official_page_url || "" });
  };

  const saveEditLink = async (id: string) => {
    await supabase.from("opportunities").update({ apply_link: editForm.apply_link, official_page_url: editForm.official_page_url }).eq("id", id);
    setEditingLink(null);
    fetchOpportunities();
  };

  const handleScrape = async () => {
    setScrapeStatus("Scraping...");
    addLog({ status: "success", message: "Scraping started..." });
    try {
      const res = await fetch("/api/scrape");
      const data = await res.json();
      const msg = `Done: ${data.inserted} new, ${data.skipped} duplicates`;
      setScrapeStatus(msg);
      addLog({ status: "success", message: msg, total_fetched: data.total_fetched, inserted: data.inserted, skipped: data.skipped });
    } catch { setScrapeStatus("Scrape failed"); addLog({ status: "error", message: "Scrape failed" }); }
  };

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="font-display text-2xl font-bold text-text-primary text-center mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-4 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-cyan text-navy font-semibold rounded-lg py-2.5 text-sm">Login</button>
        </form>
      </div>
    );
  }

  const verificationQueue = [...opportunities].sort((a, b) => {
    const order: Record<string, number> = { unverified: 0, link_unavailable: 1, expired: 2, verified: 3 };
    return (order[a.verification_status || "unverified"] || 0) - (order[b.verification_status || "unverified"] || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-text-primary">Admin Panel</h1>
        <Link href="/admin/add-news" className="flex items-center gap-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-500/30 transition-colors">
          <Plus className="w-4 h-4" /> Add News
        </Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4 overflow-x-auto">
        {(["opportunities", "verification", "add", "subscribers", "sources", "logs", "popular", "ai"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? "bg-cyan/20 text-cyan" : "text-text-muted hover:text-text-primary"}`}
          >
            {tab === "opportunities" ? "Opportunities" : tab === "verification" ? "Verification Queue" : tab === "add" ? "Add New" : tab === "subscribers" ? "Subscribers" : tab === "sources" ? "News Sources" : tab === "popular" ? "Most Popular" : tab === "ai" ? "AI Usage" : "Scrape Logs"}
          </button>
        ))}
      </div>

      {activeTab === "opportunities" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-text-primary">All Opportunities ({opportunities.length})</h2>
            <button onClick={handleScrape} className="flex items-center gap-2 text-cyan text-sm font-medium hover:underline"><RefreshCw className="w-4 h-4" />Scrape News</button>
          </div>
          {scrapeStatus && <p className="text-text-muted text-sm mb-4">{scrapeStatus}</p>}
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-cyan animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-text-muted">
                    <th className="text-left py-3 px-2">Title</th>
                    <th className="text-left py-3 px-2">Organization</th>
                    <th className="text-left py-3 px-2">Category</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Deadline</th>
                    <th className="text-left py-3 px-2">Active</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 px-2 text-text-primary max-w-[200px] truncate">{opp.title}</td>
                      <td className="py-3 px-2 text-text-muted">{opp.organization}</td>
                      <td className="py-3 px-2">{opp.category}</td>
                      <td className="py-3 px-2">
                        {opp.verification_status === "verified" ? <span className="text-green-400 text-xs">Verified</span>
                        : opp.verification_status === "link_unavailable" ? <span className="text-amber-400 text-xs">Unavailable</span>
                        : opp.verification_status === "expired" ? <span className="text-red-400 text-xs">Expired</span>
                        : <span className="text-gray-400 text-xs">Unverified</span>}
                      </td>
                      <td className="py-3 px-2 text-text-muted text-xs">{opp.deadline || "-"}</td>
                      <td className="py-3 px-2">{opp.is_active ? <span className="text-success text-xs">Active</span> : <span className="text-red-400 text-xs">Expired</span>}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {opp.is_active && <button onClick={() => handleMarkExpired(opp.id!)} className="text-xs text-warning hover:underline">Expire</button>}
                          <button onClick={() => router.push(`/admin/edit-opportunity/${opp.id}`)} className="text-cyan hover:text-cyan/80"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteOpportunity(opp.id!)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "verification" && (
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Verification Queue</h2>
          <p className="text-text-muted text-sm mb-4">Unverified opportunities appear first. Verify each listing after checking the application link.</p>
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-cyan animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              {verificationQueue.map((opp) => (
                <div key={opp.id} className="bg-navy-light border border-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-text-primary font-semibold text-sm">{opp.title}</h3>
                        {opp.verification_status === "verified" ? <ShieldCheck className="w-4 h-4 text-green-400" />
                        : opp.verification_status === "link_unavailable" ? <ShieldQuestion className="w-4 h-4 text-amber-400" />
                        : <ShieldAlert className="w-4 h-4 text-gray-400" />}
                      </div>
                      <p className="text-text-muted text-xs">{opp.organization} • {opp.category}</p>
                      <p className="text-text-muted text-xs mt-1 truncate max-w-md">
                        Apply: {opp.apply_link || "N/A"}
                        {opp.official_page_url ? ` | Official: ${opp.official_page_url}` : ""}
                      </p>
                      {opp.last_link_checked && (
                        <p className="text-text-muted text-[10px] mt-1">
                          Last checked: {new Date(opp.last_link_checked).toLocaleString()}
                          {opp.link_check_status ? ` (HTTP ${opp.link_check_status})` : ""}
                        </p>
                      )}
                      {opp.admin_notes && <p className="text-cyan/60 text-[10px] mt-1 italic">{opp.admin_notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editingLink === opp.id ? (
                        <div className="flex flex-col gap-2">
                          <input value={editForm.apply_link} onChange={(e) => setEditForm({ ...editForm, apply_link: e.target.value })} placeholder="Apply link" className="bg-gray-800 border border-gray-700 text-text-primary text-xs rounded px-2 py-1 w-48" />
                          <input value={editForm.official_page_url} onChange={(e) => setEditForm({ ...editForm, official_page_url: e.target.value })} placeholder="Official URL" className="bg-gray-800 border border-gray-700 text-text-primary text-xs rounded px-2 py-1 w-48" />
                          <div className="flex gap-1">
                            <button onClick={() => saveEditLink(opp.id!)} className="text-xs text-green-400 hover:underline">Save</button>
                            <button onClick={() => setEditingLink(null)} className="text-xs text-text-muted hover:underline">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <button onClick={() => handleVerify(opp.id!)} className="text-xs flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded px-2 py-1 hover:bg-green-500/20"><Check className="w-3 h-3" /> Verify</button>
                          <button onClick={() => handleMarkUnavailable(opp.id!)} className="text-xs flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded px-2 py-1 hover:bg-amber-500/20"><ShieldQuestion className="w-3 h-3" /> Unavailable</button>
                          <button onClick={() => startEditLink(opp)} className="text-xs flex items-center gap-1 bg-gray-800 text-text-muted border border-gray-700 rounded px-2 py-1 hover:text-text-primary"><Edit3 className="w-3 h-3" /> Edit Link</button>
                          <button onClick={() => handleRecheck(opp.id!)} disabled={rechecking === opp.id} className="text-xs flex items-center gap-1 bg-gray-800 text-text-muted border border-gray-700 rounded px-2 py-1 hover:text-text-primary"><RotateCcw className={`w-3 h-3 ${rechecking === opp.id ? "animate-spin" : ""}`} /> Recheck</button>
                          <button onClick={() => handleDeleteOpportunity(opp.id!)} className="text-xs flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded px-2 py-1 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Add New Opportunity</h2>
          <form onSubmit={handleAddOpportunity} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Organization</label>
                <input required value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none">
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Stipend</label>
                <input value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="₹37,000/month" className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-xs font-medium mb-1">Eligibility</label>
              <input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} placeholder="NET/GATE, MSc Electronics" className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
            </div>
            <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Description</label>
                <div className="flex gap-2">
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!form.description || !form.title) return;
                      setAiFilling(true);
                      try {
                        const res = await fetch("/api/ai/summarize", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ rawDescription: form.description, title: form.title, org: form.organization }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setForm((prev) => ({
                            ...prev,
                            title: data.clean_title || prev.title,
                            eligibility: data.eligibility_points?.join("; ") || prev.eligibility,
                            tags: data.suggested_tags?.join(", ") || prev.tags,
                            stipend: data.stipend_extracted || prev.stipend,
                            deadline: data.deadline_extracted || prev.deadline,
                          }));
                        }
                      } catch {}
                      setAiFilling(false);
                    }}
                    disabled={aiFilling || !form.description || !form.title}
                    className="flex items-center gap-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 text-xs font-medium hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex-shrink-0"
                    title="AI Auto-Fill: extracts tags, eligibility, stipend, deadline from description"
                  >
                    {aiFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI
                  </button>
                </div>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Apply Link</label>
                <input value={form.apply_link} onChange={(e) => setForm({ ...form, apply_link: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Official Page URL</label>
                <input value={form.official_page_url} onChange={(e) => setForm({ ...form, official_page_url: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Apply Link Type</label>
                <select value={form.apply_link_type} onChange={(e) => setForm({ ...form, apply_link_type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none">
                  <option value="homepage">Homepage</option>
                  <option value="direct">Direct</option>
                  <option value="pdf">PDF</option>
                  <option value="email">Email</option>
                  <option value="portal">Portal</option>
                </select>
              </div>
              <div>
                <label className="block text-text-muted text-xs font-medium mb-1">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VLSI, thin film, JRF" className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-text-muted text-xs font-medium mb-1">Admin Notes</label>
              <textarea value={form.admin_notes} onChange={(e) => setForm({ ...form, admin_notes: e.target.value })} rows={2} className="w-full bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-3 py-2.5 focus:ring-cyan focus:border-cyan outline-none" />
            </div>
            {formStatus === "success" && <p className="flex items-center gap-2 text-success text-sm"><Check className="w-4 h-4" />{formMessage}</p>}
            {formStatus === "error" && <p className="text-red-400 text-sm">{formMessage}</p>}
            <button type="submit" disabled={formStatus === "loading"} className="flex items-center gap-2 bg-cyan text-navy font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-cyan/90 transition-colors disabled:opacity-50">
              {formStatus === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Plus className="w-4 h-4" /> Add Opportunity</>}
            </button>
          </form>
        </div>
      )}

      {activeTab === "sources" && (
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">News Sources</h2>
          <p className="text-text-muted text-sm mb-4">RSS feeds used for news aggregation. Toggle sources on/off.</p>
          <div className="space-y-3">
            {NEWS_SOURCES.map((source) => (
              <div key={source.name} className="bg-navy-light border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary text-sm font-medium">{source.name}</h3>
                  <p className="text-text-muted text-xs mt-0.5 break-all">{source.url}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    {(source as any).type === "opportunity" && <span className="px-2 py-0.5 bg-purple-900/40 text-purple-400 rounded text-[10px] border border-purple-500/30">Opportunities</span>}
                    {(!(source as any).type || (source as any).type === "news") && <span className="px-2 py-0.5 bg-cyan-900/40 text-cyan-400 rounded text-[10px] border border-cyan-500/30">News</span>}
                    {source.tags.map((tag) => (<span key={tag} className="px-2 py-0.5 bg-gray-800 rounded text-text-muted text-[10px]">{tag}</span>))}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={sourcesEnabled[source.name]} onChange={() => setSourcesEnabled((prev) => ({ ...prev, [source.name]: !prev[source.name] }))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan" />
                  <span className="ms-2 text-xs text-text-muted">{sourcesEnabled[source.name] ? "Active" : "Disabled"}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "popular" && (
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Most Popular Opportunities</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-cyan animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-text-muted">
                    <th className="text-left py-3 px-2">Title</th>
                    <th className="text-left py-3 px-2">Organization</th>
                    <th className="text-left py-3 px-2">Clicks</th>
                    <th className="text-left py-3 px-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {[...opportunities].sort((a, b) => (b.apply_clicks || 0) - (a.apply_clicks || 0)).filter((o) => (o.apply_clicks || 0) > 0).map((opp) => (
                    <tr key={opp.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 px-2 text-text-primary max-w-[200px] truncate">{opp.title}</td>
                      <td className="py-3 px-2 text-text-muted">{opp.organization}</td>
                      <td className="py-3 px-2"><span className="text-cyan font-semibold">{opp.apply_clicks || 0}</span></td>
                      <td className="py-3 px-2">{opp.category}</td>
                    </tr>
                  ))}
                  {opportunities.filter((o) => (o.apply_clicks || 0) > 0).length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-text-muted">No click data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "logs" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-text-primary">Scrape Logs</h2>
            {scrapeLogs.length > 0 && <button onClick={() => setScrapeLogs([])} className="text-text-muted text-xs hover:text-text-primary transition-colors">Clear logs</button>}
          </div>
          {scrapeLogs.length === 0 ? (
            <p className="text-text-muted text-sm">No scrape logs yet. Run a scrape from the Opportunities tab.</p>
          ) : (
            <div className="space-y-2">
              {scrapeLogs.map((log) => (
                <div key={log.id} className={`bg-navy-light border rounded-lg p-3 ${log.status === "success" ? "border-gray-800" : "border-red-500/30"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-xs">{log.timestamp}</span>
                    <span className={`text-xs font-medium ${log.status === "success" ? "text-success" : "text-red-400"}`}>{log.status === "success" ? "Success" : "Error"}</span>
                  </div>
                  <p className="text-text-primary text-sm mt-1">{log.message}</p>
                  {log.total_fetched !== undefined && (
                    <div className="flex gap-4 mt-2 text-xs text-text-muted">
                      <span>Fetched: {log.total_fetched}</span>
                      <span>Inserted: {log.inserted}</span>
                      <span>Skipped: {log.skipped}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "ai" && (
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">AI Usage Monitor</h2>
          <AIAnalyticsPanel />
        </div>
      )}

      {activeTab === "subscribers" && (
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Subscribers ({subscribers.length})</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-cyan animate-spin" /></div>
          ) : subscribers.length === 0 ? (
            <p className="text-text-muted">No subscribers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-text-muted">
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Categories</th>
                    <th className="text-left py-3 px-2">Keywords</th>
                    <th className="text-left py-3 px-2">Active</th>
                    <th className="text-left py-3 px-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 px-2 text-text-primary">{sub.email}</td>
                      <td className="py-3 px-2 text-text-muted text-xs">{sub.categories?.join(", ") || "-"}</td>
                      <td className="py-3 px-2 text-text-muted text-xs">{sub.keywords?.join(", ") || "-"}</td>
                      <td className="py-3 px-2">{sub.is_active ? <span className="text-success text-xs">Active</span> : <span className="text-red-400 text-xs">Inactive</span>}</td>
                      <td className="py-3 px-2 text-text-muted text-xs">{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
