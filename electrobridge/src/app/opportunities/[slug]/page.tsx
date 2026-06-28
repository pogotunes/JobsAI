import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Currency, Calendar, ExternalLink, Clock, Briefcase, GraduationCap, CalendarDays, User } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate, isExpired } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import DeadlineCountdown from "@/components/DeadlineCountdown";
import ApplyButton from "@/components/ApplyButton";
import ShareButtons from "@/components/ShareButtons";
import SimilarOpportunities from "@/components/SimilarOpportunities";
import CopyLinkButton from "@/components/CopyLinkButton";
import VerificationBadge from "@/components/VerificationBadge";
import LinkTypeIndicator from "@/components/LinkTypeIndicator";
import OpportunityDisclaimer from "@/components/OpportunityDisclaimer";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  if (!supabaseAdmin?.from) return { title: "Opportunity | ElectroBridge" };

  const { data: opportunity } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!opportunity) return { title: "Opportunity Not Found" };

  const deadlineStr = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Check website";

  return {
    title: `${opportunity.title} — ${opportunity.organization}`,
    description: `${opportunity.category} position at ${opportunity.organization}${opportunity.location ? ` in ${opportunity.location}` : ""}.${opportunity.eligibility ? ` Eligibility: ${opportunity.eligibility}.` : ""}${opportunity.stipend ? ` Stipend: ${opportunity.stipend}.` : ""} Apply by ${deadlineStr}.`,
    keywords: [...(opportunity.tags || []), opportunity.organization, opportunity.category, opportunity.location, "ElectroBridge"].filter(Boolean),
    openGraph: {
      title: `${opportunity.title} | ${opportunity.organization}`,
      description: `${opportunity.category} • ${opportunity.location || "India"} • Deadline: ${deadlineStr} • ${opportunity.eligibility || ""}`,
      url: `https://electrobridge.vercel.app/opportunities/${params.slug}`,
      images: [{ url: `https://electrobridge.vercel.app/api/og/opportunity/${params.slug}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${opportunity.title} | ${opportunity.organization}`,
      images: [`https://electrobridge.vercel.app/api/og/opportunity/${params.slug}`],
    },
    alternates: { canonical: `https://electrobridge.vercel.app/opportunities/${params.slug}` },
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  if (!supabaseAdmin?.from) notFound();

  const { data: opportunity, error } = await supabaseAdmin
    .from("opportunities")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !opportunity) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opportunity.title,
    description: opportunity.description,
    hiringOrganization: {
      "@type": "Organization",
      name: opportunity.organization,
      sameAs: opportunity.official_page_url || opportunity.apply_link,
    },
    jobLocation: opportunity.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: opportunity.location,
            addressCountry: opportunity.location.match(/India|Delhi|Bangalore|Mumbai/i) ? "IN" : opportunity.location === "Germany" ? "DE" : "SG",
          },
        }
      : undefined,
    employmentType: opportunity.category === "Private Job" ? "FULL_TIME" : opportunity.category === "JRF" || opportunity.category === "SRF" ? "CONTRACTOR" : undefined,
    validThrough: opportunity.deadline,
    baseSalary: opportunity.stipend
      ? {
          "@type": "MonetaryAmount",
          currency: opportunity.location === "Germany" ? "EUR" : opportunity.location === "Singapore" ? "SGD" : "INR",
          value: { "@type": "QuantitativeValue", value: opportunity.stipend },
        }
      : undefined,
    datePosted: opportunity.posted_at,
    url: `https://electrobridge.vercel.app/opportunities/${opportunity.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://electrobridge.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Opportunities", item: "https://electrobridge.vercel.app/opportunities" },
      { "@type": "ListItem", position: 3, name: opportunity.title, item: `https://electrobridge.vercel.app/opportunities/${opportunity.slug}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunities
      </Link>

      {opportunity.deadline && isExpired(opportunity.deadline) && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-red-400 text-sm font-medium">
            This opportunity has expired. The deadline was {formatDate(opportunity.deadline)}.
          </p>
        </div>
      )}

      {/* Verification status banner */}
      {opportunity.verification_status === "unverified" && (
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-4 mb-4">
          <p className="text-amber-400 text-xs">
            ⚠️ This opportunity was auto-scraped and is pending manual verification. Always confirm details on the official website before applying.
          </p>
        </div>
      )}
      {opportunity.verification_status === "link_unavailable" && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-xs">
            ⚠️ The apply link appears to be temporarily unavailable. Use the official website link below to find this opportunity.
          </p>
        </div>
      )}

      <div className="bg-navy-light border border-gray-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <CategoryBadge category={opportunity.category} />
              {opportunity.deadline && <DeadlineCountdown deadline={opportunity.deadline} />}
              {opportunity.verification_status && <VerificationBadge status={opportunity.verification_status} />}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              {opportunity.title}
            </h1>
            <p className="text-text-muted mt-1">{opportunity.organization}</p>
            {opportunity.verified_at && (
              <p className="flex items-center gap-1 text-green-400/70 text-xs mt-2">
                ✓ Link verified {formatDate(opportunity.verified_at)}
              </p>
            )}
            {opportunity.created_at && (
              <p className="flex items-center gap-1 text-text-muted text-xs mt-1">
                <Clock className="w-3 h-3" />
                Last updated: {formatDate(opportunity.created_at)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg mb-6">
          {opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Location</p>
                <p className="text-text-primary text-sm font-medium">{opportunity.location}</p>
              </div>
            </div>
          )}
          {opportunity.stipend && (
            <div className="flex items-center gap-2">
              <Currency className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Stipend/Salary</p>
                <p className="text-text-primary text-sm font-medium">{opportunity.stipend}</p>
              </div>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Deadline</p>
                <p className="text-text-primary text-sm font-medium">{formatDate(opportunity.deadline)}</p>
              </div>
            </div>
          )}
          {opportunity.eligibility && (
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-text-muted text-xs">Eligibility</p>
                <p className="text-text-primary text-sm font-medium">{opportunity.eligibility}</p>
              </div>
            </div>
          )}
        </div>

        {opportunity.description && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-text-primary mb-3">Description</h2>
            <p className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
          </div>
        )}

        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-sm font-bold text-text-primary mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/opportunities?search=${tag}`}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-text-muted text-xs hover:border-cyan/50 hover:text-cyan transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Link type indicator */}
        {opportunity.apply_link_type && (
          <div className="mb-6">
            <LinkTypeIndicator type={opportunity.apply_link_type} />
          </div>
        )}

        {/* Apply buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {opportunity.apply_link && (
            <ApplyButton
              applyLink={opportunity.apply_link}
              opportunityId={opportunity.id!}
              verificationStatus={opportunity.verification_status}
              officialPageUrl={opportunity.official_page_url}
            />
          )}
          {opportunity.official_page_url && opportunity.apply_link !== opportunity.official_page_url && (
            <a
              href={opportunity.official_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-700 text-text-primary font-medium rounded-lg px-4 py-2.5 text-sm hover:border-cyan/50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Official Website
            </a>
          )}
          {opportunity.id && (
            <a
              href={`/api/calendar-export/${opportunity.id}`}
              className="inline-flex items-center gap-2 border border-gray-700 text-text-primary font-medium rounded-lg px-4 py-2.5 text-sm hover:border-cyan/50 transition-colors"
              download
            >
              📅 Add to Calendar
            </a>
          )}
        </div>

        {/* Quick Facts */}
        <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
          <h3 className="font-display text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan" />
            Quick Facts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-text-muted">Position Type</span>
              <p className="text-text-primary font-medium">{opportunity.category}</p>
            </div>
            <div>
              <span className="text-text-muted">Organization Type</span>
              <p className="text-text-primary font-medium">
                {opportunity.organization.match(/ISRO|DRDO|CSIR|IIT|NIT|Govt/i) ? "Government" : opportunity.organization.match(/TI|Texas|Intel|Qualcomm|Samsung|IBM/i) ? "Private" : "Research"}
              </p>
            </div>
            <div>
              <span className="text-text-muted">Work Location</span>
              <p className="text-text-primary font-medium">On-site</p>
            </div>
            {opportunity.eligibility?.match(/NET|GATE/i) && (
              <div>
                <span className="text-text-muted">NET/GATE Required</span>
                <p className="text-green-400 font-medium">Yes</p>
              </div>
            )}
            {opportunity.stipend && (
              <div>
                <span className="text-text-muted">Compensation</span>
                <p className="text-text-primary font-medium">{opportunity.stipend}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <ShareButtons
            title={opportunity.title}
            organization={opportunity.organization}
            deadline={opportunity.deadline}
            opportunityUrl={`https://electrobridge.vercel.app/opportunities/${opportunity.slug}`}
          />
          <CopyLinkButton url={`https://electrobridge.vercel.app/opportunities/${opportunity.slug}`} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6">
        <OpportunityDisclaimer
          opportunityId={opportunity.id!}
          officialPageUrl={opportunity.official_page_url}
        />
      </div>

      <SimilarOpportunities
        currentId={opportunity.id}
        tags={opportunity.tags || []}
      />
    </div>
  );
}
