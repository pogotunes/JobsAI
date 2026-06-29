"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const SUGGESTION_TYPES = [
  { value: "missing_opportunity", label: "Missing Opportunity" },
  { value: "broken_link", label: "Broken Link Report" },
  { value: "feature_request", label: "Feature Request" },
  { value: "general", label: "General Feedback" },
];

export default function ContactPage() {
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from("suggestions").insert({
        type: type || null,
        url: url || null,
        notes: notes || null,
        contact_email: email || null,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-cyan mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Thank You!</h1>
        <p className="text-text-muted text-sm">
          Your suggestion has been submitted. We review all feedback and will get back to you if needed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Contact & Suggestions</h1>
      <p className="text-text-muted text-sm mb-8">
        Found a missing opportunity? Want to suggest a new feature? Let us know.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-1.5">
            Type <span className="text-cyan">*</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full bg-navy-light border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50"
          >
            <option value="">Select a type...</option>
            {SUGGESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-text-primary mb-1.5">
            URL (optional)
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/opportunity"
            className="w-full bg-navy-light border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-primary mb-1.5">
            Notes <span className="text-cyan">*</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows={4}
            placeholder="Describe your suggestion, issue, or feedback..."
            className="w-full bg-navy-light border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50 resize-y"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-navy-light border border-gray-700 rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50"
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-cyan text-navy font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-cyan/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? "Submitting..." : "Submit Suggestion"}
        </button>
      </form>
    </div>
  );
}
