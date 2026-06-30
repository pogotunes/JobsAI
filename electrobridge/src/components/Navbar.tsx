"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Menu, X, ChevronDown, Home, Briefcase, Newspaper, Crosshair, Bot, Info, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  { href: "/resources/phd-guide", label: "PhD Admission Guide" },
  { href: "/resources/international-fellowships", label: "International Fellowships" },
  { href: "/resources/vlsi-careers", label: "VLSI Career Guide" },
  { href: "/resources/net-vs-gate", label: "NET vs GATE" },
  { href: "/resources", label: "All Resources" },
];

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/match", label: "Find My Match", icon: Crosshair },
  { href: "/chat", label: "Ask AI", icon: Bot },
  { href: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
    }
    return email?.substring(0, 2).toUpperCase() ?? "U";
  };

  const userDisplayName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <nav className="bg-bg-primary/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Zap className="w-6 h-6 text-accent" />
            <span className="font-display text-xl font-bold text-text-primary">
              Electro<span className="text-accent">Bridge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              if (item.label === "Opportunities") {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => showDropdown("opportunities")}
                    onMouseLeave={() => hideDropdown("opportunities")}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        openDropdown === "opportunities"
                          ? "text-accent bg-surface-elevated"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      Opportunities
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === "opportunities" ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === "opportunities" && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-surface border border-border rounded-xl shadow-card-dark py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                        {OPPORTUNITY_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              if (item.label === "Home") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-accent bg-surface-elevated rounded-lg transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              }
              if (item.label === "Resources") {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => showDropdown("resources")}
                    onMouseLeave={() => hideDropdown("resources")}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        openDropdown === "resources"
                          ? "text-accent bg-surface-elevated"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      Resources
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === "resources" ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === "resources" && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-surface border border-border rounded-xl shadow-card-dark py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                        {RESOURCE_LINKS.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-elevated/50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:text-accent hover:border-accent/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-xs font-bold">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </span>
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{userDisplayName}</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-xl shadow-card-dark py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-accent hover:bg-accent/10 transition-all"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-all w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-text-secondary border border-border rounded-lg hover:text-text-primary hover:border-accent/30 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-accent text-bg-primary rounded-lg hover:bg-accent-hover transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              href="/admin"
              className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-accent text-bg-primary rounded-lg hover:bg-accent-hover transition-all"
            >
              Admin
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-bg-primary/98 backdrop-blur-lg z-40 md:hidden overflow-y-auto">
          <div className="px-6 py-6 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-text-primary transition-all text-sm font-medium rounded-lg hover:bg-surface-elevated/50"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-border/50 my-4" />

            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">Opportunities</p>
            {OPPORTUNITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium rounded-lg hover:bg-surface-elevated/50"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border/50 my-4" />

            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">Resources</p>
            {RESOURCE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium rounded-lg hover:bg-surface-elevated/50"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border/50 my-4" />

            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-3 text-text-primary text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent text-sm font-bold">
                      {getInitials(user.user_metadata?.full_name, user.email)}
                    </span>
                  </div>
                  {userDisplayName}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 border border-border text-text-secondary font-semibold rounded-lg px-4 py-3 text-sm hover:text-text-primary transition-all w-full"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-text-secondary font-semibold rounded-lg px-4 py-3 text-sm hover:text-text-primary transition-all w-full"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-danger font-semibold rounded-lg px-4 py-3 text-sm hover:bg-danger/10 transition-all w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 border border-border text-text-secondary font-semibold rounded-lg px-4 py-3 text-sm hover:text-text-primary transition-all w-full"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 bg-accent text-bg-primary font-semibold rounded-lg px-4 py-3 text-sm hover:bg-accent-hover transition-all w-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 bg-accent text-bg-primary font-semibold rounded-lg px-4 py-3 text-sm hover:bg-accent-hover transition-all mt-2"
            >
              <Zap className="w-4 h-4" />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
