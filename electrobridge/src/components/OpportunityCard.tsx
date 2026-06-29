"use client";

import Link from "next/link";
import { MapPin, Currency, Bookmark, ExternalLink } from "lucide-react";
import type { Opportunity } from "@/types";
import CategoryBadge from "./CategoryBadge";
import DeadlineCountdown from "./DeadlineCountdown";
import { cn, getDaysAgo, isNew } from "@/lib/utils";
import ShareButtons from "./ShareButtons";
import VerificationBadge from "./VerificationBadge";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function orgSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("electrobridge_bookmarks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function toggleBookmark(id: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(id);
  if (idx === -1) {
    bookmarks.push(id);
    localStorage.setItem("electrobridge_bookmarks", JSON.stringify(bookmarks));
    return true;
  } else {
    bookmarks.splice(idx, 1);
    localStorage.setItem("electrobridge_bookmarks", JSON.stringify(bookmarks));
    return false;
  }
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isBookmarked = getBookmarks().includes(opportunity.id!);
  const linkUnavailable = opportunity.verification_status === "link_unavailable" || opportunity.verification_status === "expired";

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(opportunity.id!);
  };

  return (
    <Link
      href={`/opportunities/${opportunity.slug}`}
      className={`block group ${linkUnavailable ? "opacity-70" : ""}`}
    >
      <div className="bg-navy-light border border-gray-800 rounded-lg p-5 hover:border-cyan/30 transition-all duration-300 hover:translate-y-[-2px] h-full">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
            <span className="text-cyan text-sm font-bold">
              {getInitials(opportunity.organization)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-text-primary font-semibold text-sm leading-snug group-hover:text-cyan transition-colors line-clamp-2">
                  {opportunity.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Link
                    href={`/organizations/${orgSlug(opportunity.organization)}`}
                    className="text-text-muted text-xs hover:text-cyan transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {opportunity.organization}
                  </Link>
                  {opportunity.verification_status && (
                    <VerificationBadge status={opportunity.verification_status} compact />
                  )}
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className={`transition-colors flex-shrink-0 ${
                  isBookmarked ? "text-cyan" : "text-text-muted hover:text-cyan"
                }`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-cyan" : ""}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {opportunity.posted_at && (
                <span className="text-gray-600 text-[10px]">
                  {getDaysAgo(opportunity.posted_at)}
                </span>
              )}
              {opportunity.posted_at && isNew(opportunity.posted_at) && (
                <span className="px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded text-[10px] font-semibold border border-green-500/30">
                  NEW
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <CategoryBadge category={opportunity.category} />
              {opportunity.location && (
                <span className="flex items-center gap-1 text-text-muted text-xs">
                  <MapPin className="w-3 h-3" />
                  {opportunity.location}
                </span>
              )}
              {opportunity.stipend && (
                <span className="flex items-center gap-1 text-text-muted text-xs">
                  <Currency className="w-3 h-3" />
                  {opportunity.stipend}
                </span>
              )}
            </div>
            {opportunity.eligibility && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {opportunity.eligibility.split(",").map((e) => (
                  <span
                    key={e.trim()}
                    className="px-2 py-0.5 bg-gray-800 rounded text-text-muted text-[10px]"
                  >
                    {e.trim()}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              {opportunity.deadline && <DeadlineCountdown deadline={opportunity.deadline} />}
              {linkUnavailable ? (
                <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                  Visit Official Site
                  <ExternalLink className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-cyan text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-800/50" onClick={(e) => e.preventDefault()}>
              <ShareButtons
                title={opportunity.title}
                organization={opportunity.organization}
                deadline={opportunity.deadline}
                opportunityUrl={`https://electrobridge.vercel.app/opportunities/${opportunity.slug}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
