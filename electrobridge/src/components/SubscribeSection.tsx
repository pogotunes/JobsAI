"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import SubscribeModal from "./SubscribeModal";

export default function SubscribeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const quickSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, keywords: [], categories: [] }),
      });
      if (res.ok) setStatus("success");
      else setStatus("idle");
    } catch {
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 text-green-400">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Subscribed! Check your inbox.</span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={quickSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="flex-1 relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-gray-800/80 border border-gray-700 text-text-primary text-sm rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan/50 focus:border-cyan outline-none transition-all placeholder:text-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-gradient-to-r from-cyan to-cyan/80 text-navy font-semibold rounded-lg px-6 py-3 text-sm hover:from-cyan/90 hover:to-cyan/70 transition-all whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-text-muted text-xs mt-3 hover:text-cyan transition-colors underline underline-offset-2 decoration-gray-700 hover:decoration-cyan"
      >
        Set preferences (keywords &amp; categories)
      </button>
      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
