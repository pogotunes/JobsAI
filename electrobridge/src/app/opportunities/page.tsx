"use client";

import { useEffect, useState, useCallback } from "react";
import type { Opportunity } from "@/types";
import OpportunityCard from "@/components/OpportunityCard";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [eligibility, setEligibility] = useState("All");
  const [location, setLocation] = useState("All");
  const [deadline, setDeadline] = useState("All");
  const [search, setSearch] = useState("");
  const [showUnverified, setShowUnverified] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (eligibility && eligibility !== "All") params.set("eligibility", eligibility);
      if (location && location !== "All") params.set("location", location);
      if (deadline && deadline !== "All") params.set("deadline", deadline);
      if (search) params.set("search", search);
      if (!showUnverified) params.set("verified", "true");

      const res = await fetch(`/api/opportunities?${params}`);
      const data = await res.json();

      if (data.opportunities) {
        setOpportunities(data.opportunities);
      } else {
        setOpportunities([]);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [category, eligibility, location, deadline, search, showUnverified]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          All Opportunities
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Browse JRF, PhD, government, and private sector opportunities.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 max-w-md">
            <SearchBar onSearch={setSearch} />
          </div>
          <button
            onClick={() => setShowUnverified(!showUnverified)}
            className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
              showUnverified
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-gray-800/50 border-gray-700 text-text-muted hover:text-text-primary"
            }`}
          >
            {showUnverified ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            {showUnverified ? "Hiding unverified" : "Show unverified"}
          </button>
        </div>
        <FilterBar
          selectedCategory={category}
          selectedEligibility={eligibility}
          selectedLocation={location}
          selectedDeadline={deadline}
          onCategoryChange={setCategory}
          onEligibilityChange={setEligibility}
          onLocationChange={setLocation}
          onDeadlineChange={setDeadline}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-cyan animate-spin" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-muted text-lg mb-2">No opportunities found.</p>
          <p className="text-text-muted text-sm">
            Try adjusting your filters, enable unverified listings, or check back later.
          </p>
          <button
            onClick={() => {
              setCategory("All");
              setEligibility("All");
              setLocation("All");
              setDeadline("All");
              setSearch("");
              setShowUnverified(true);
            }}
            className="mt-4 inline-flex items-center gap-2 bg-cyan text-navy font-semibold rounded-lg px-4 py-2 text-sm hover:bg-cyan/90 transition-colors"
          >
            Reset & Show All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
