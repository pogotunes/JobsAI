"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X, ChevronDown, MessageSquare } from "lucide-react";

const OPPORTUNITY_LINKS = [
  { href: "/category/jrf", label: "JRF Positions" },
  { href: "/category/srf", label: "SRF Positions" },
  { href: "/category/phd", label: "PhD Opportunities" },
  { href: "/category/govt-job", label: "Government Jobs" },
  { href: "/category/fellowship", label: "Fellowships" },
  { href: "/category/private", label: "Private Sector" },
  { href: "/category/international", label: "International" },
];

const RESOURCE_LINKS = [
  { href: "/resources/jrf-guide", label: "JRF Complete Guide" },
  { href: "/resources/international-fellowships", label: "International Fellowships" },
  { href: "/resources/vlsi-careers", label: "VLSI Career Guide" },
  { href: "/resources/net-vs-gate", label: "NET vs GATE" },
  { href: "/resources", label: "All Resources" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDropdown = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const hideDropdown = (name: string) => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown((prev) => (prev === name ? null : prev));
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="bg-navy/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Zap className="w-6 h-6 text-cyan" />
            <span className="font-display text-xl font-bold text-text-primary">
              Electro<span className="text-cyan">Bridge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {/* Opportunities Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => showDropdown("opportunities")}
              onMouseLeave={() => hideDropdown("opportunities")}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  openDropdown === "opportunities"
                    ? "text-text-primary bg-navy-light"
                    : "text-text-muted hover:text-text-primary hover:bg-navy-light/50"
                }`}
              >
                Opportunities
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "opportunities" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "opportunities" && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-navy-light border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                  {OPPORTUNITY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-navy/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => showDropdown("resources")}
              onMouseLeave={() => hideDropdown("resources")}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  openDropdown === "resources"
                    ? "text-text-primary bg-navy-light"
                    : "text-text-muted hover:text-text-primary hover:bg-navy-light/50"
                }`}
              >
                Resources
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-navy-light border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                  {RESOURCE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-navy/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/news" className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary rounded-lg hover:bg-navy-light/50 transition-colors">
              News
            </Link>
            <Link href="/organizations" className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary rounded-lg hover:bg-navy-light/50 transition-colors">
              Organizations
            </Link>
            <Link href="/match" className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary rounded-lg hover:bg-navy-light/50 transition-colors">
              Find My Match
            </Link>
            <Link href="/chat" className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary rounded-lg hover:bg-navy-light/50 transition-colors">
              Ask AI
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary rounded-lg hover:bg-navy-light/50 transition-colors">
              About
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-muted hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-navy/98 backdrop-blur-lg z-40 md:hidden overflow-y-auto">
          <div className="px-6 py-6 space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">Opportunities</p>
            {OPPORTUNITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-800/50 my-4" />

            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">Resources</p>
            {RESOURCE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-800/50 my-4" />

            <Link
              href="/news"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              News
            </Link>
            <Link
              href="/organizations"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              Organizations
            </Link>
            <Link
              href="/match"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              Find My Match
            </Link>
            <Link
              href="/chat"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              Ask AI
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors text-sm font-medium rounded-lg hover:bg-navy-light/50"
            >
              Contact
            </Link>

            <div className="border-t border-gray-800/50 my-4" />

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 bg-cyan/10 text-cyan font-semibold rounded-lg px-4 py-3 text-sm hover:bg-cyan/20 transition-colors mt-2"
            >
              <MessageSquare className="w-4 h-4" />
              Subscribe & Get Updates
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
