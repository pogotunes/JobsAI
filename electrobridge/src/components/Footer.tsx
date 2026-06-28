import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-light/50 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan" />
              <span className="font-display text-lg font-bold text-text-primary">
                Electro<span className="text-cyan">Bridge</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Your gateway to electronics &amp; semiconductor opportunities in India and globally.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/opportunities" className="text-text-muted hover:text-cyan transition-colors text-sm">All Opportunities</Link>
              <Link href="/news" className="text-text-muted hover:text-cyan transition-colors text-sm">Tech News</Link>
              <Link href="/organizations" className="text-text-muted hover:text-cyan transition-colors text-sm">Organizations</Link>
              <Link href="/about" className="text-text-muted hover:text-cyan transition-colors text-sm">About</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Categories</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/opportunities?category=JRF" className="text-text-muted hover:text-cyan transition-colors text-sm">JRF / SRF Positions</Link>
              <Link href="/opportunities?category=PhD" className="text-text-muted hover:text-cyan transition-colors text-sm">PhD Opportunities</Link>
              <Link href="/opportunities?category=Govt+Job" className="text-text-muted hover:text-cyan transition-colors text-sm">Govt Jobs</Link>
              <Link href="/opportunities?category=Private+Job" className="text-text-muted hover:text-cyan transition-colors text-sm">Private Sector</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/resources" className="text-text-muted hover:text-cyan transition-colors text-sm">JRF Guide</Link>
              <Link href="/resources" className="text-text-muted hover:text-cyan transition-colors text-sm">Research Resources</Link>
              <Link href="/opportunities-feed" className="text-text-muted hover:text-cyan transition-colors text-sm" target="_blank">JSON Feed</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800/50 mt-10 pt-6 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} ElectroBridge. Built for the electronics research community.
          </p>
        </div>
      </div>
    </footer>
  );
}
