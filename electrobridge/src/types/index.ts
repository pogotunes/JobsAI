export interface Opportunity {
  id?: string;
  title: string;
  organization: string;
  category: "JRF" | "SRF" | "PhD" | "Govt Job" | "Private Job" | "Fellowship";
  location: string | null;
  stipend: string | null;
  deadline: string | null;
  eligibility: string | null;
  description: string | null;
  apply_link: string | null;
  source_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  posted_at?: string;
  apply_clicks?: number;
  tags: string[];
  slug?: string;
  org_slug?: string;
  verification_status?: "verified" | "unverified" | "link_unavailable" | "expired";
  verified_at?: string;
  official_page_url?: string;
  apply_link_type?: "direct" | "homepage" | "pdf" | "email" | "portal";
  last_link_checked?: string;
  link_check_status?: number;
  admin_notes?: string;
}

export interface NewsArticle {
  id?: string;
  title: string;
  summary: string | null;
  source: string | null;
  source_url: string | null;
  published_at: string | null;
  image_url: string | null;
  tags: string[];
  created_at?: string;
}

export interface Subscriber {
  id?: string;
  email: string;
  keywords: string[];
  categories: string[];
  created_at?: string;
  is_active: boolean;
}

export interface SavedOpportunity {
  id?: string;
  user_id: string;
  opportunity_id: string;
  created_at?: string;
}

export interface LinkCheckLog {
  id?: string;
  opportunity_id: string;
  checked_at: string;
  http_status: number;
  is_reachable: boolean;
  error_message: string;
}

export interface OpportunityReport {
  id?: string;
  opportunity_id: string;
  report_type: "broken_link" | "wrong_info" | "expired" | "other";
  description: string;
  reported_at: string;
  is_resolved: boolean;
}
