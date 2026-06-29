import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, BookmarkPlus, Share2, ChevronDown, ChevronRight, Star,
  Zap, MapPin, Clock, CheckCircle, AlertTriangle, TrendingUp, Users,
  Briefcase, GraduationCap, FlaskConical, Cpu, CircuitBoard, Radio,
  BarChart3, FileText, MessageSquare, Settings, LogOut, Menu, X,
  ArrowRight, Sparkles, Bot, ThumbsUp, MessageCircle, ExternalLink,
  Filter, SlidersHorizontal, Grid3X3, List, Bookmark, Flag, Award,
  UploadCloud, Eye, Trash2, Link, Activity, AlertCircle, Shield,
  ChevronUp, Send, Plus, Download, User, Home, Newspaper, Building2,
  Calendar, Hash, Globe, Phone, Mail, Edit3, MoreHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "landing" | "opportunities" | "detail" | "news"
  | "ai" | "dashboard" | "community" | "resume" | "admin";

// ─── Fake Data ────────────────────────────────────────────────────────────────
const OPPORTUNITIES = [
  {
    id: 1,
    title: "VLSI Design Engineer Internship",
    org: "ISRO — Indian Space Research Organisation",
    verified: true,
    location: "Bengaluru, Karnataka",
    stipend: "₹35,000/mo",
    deadline: "Aug 15, 2025",
    daysLeft: 47,
    tags: ["VLSI", "Cadence", "RTL Design", "Gate-level"],
    type: "Internship",
    degree: "B.Tech / M.Tech",
    saved: false,
    logo: "IS",
    color: "#F59E0B",
    description: "Work on cutting-edge ASIC design flows for satellite payloads. Hands-on with industry EDA tools.",
  },
  {
    id: 2,
    title: "Semiconductor Process R&D Fellowship",
    org: "IISc — Indian Institute of Science",
    verified: true,
    location: "Bengaluru, Karnataka",
    stipend: "₹42,000/mo",
    deadline: "Jul 30, 2025",
    daysLeft: 31,
    tags: ["Semiconductor", "CVD", "Cleanroom", "Photolithography"],
    type: "Research Fellowship",
    degree: "M.Tech / PhD",
    saved: true,
    logo: "II",
    color: "#3B82F6",
    description: "Join the nano-fabrication lab for advanced process development in 5nm node technologies.",
  },
  {
    id: 3,
    title: "AI Chip Architecture Research Intern",
    org: "Intel India R&D",
    verified: true,
    location: "Hyderabad, Telangana",
    stipend: "₹60,000/mo",
    deadline: "Sep 1, 2025",
    daysLeft: 64,
    tags: ["AI Accelerator", "SystemVerilog", "Arch sim", "ML"],
    type: "Internship",
    degree: "M.Tech / PhD",
    saved: false,
    logo: "IN",
    color: "#00E5FF",
    description: "Research on next-gen neural processing units. Collaborate with global teams on micro-architectural innovations.",
  },
  {
    id: 4,
    title: "PhD Scholarship — Spintronics & Quantum Devices",
    org: "TIFR — Tata Institute of Fundamental Research",
    verified: true,
    location: "Mumbai, Maharashtra",
    stipend: "₹37,000/mo",
    deadline: "Aug 10, 2025",
    daysLeft: 42,
    tags: ["Spintronics", "Quantum", "MBE", "Research"],
    type: "PhD Scholarship",
    degree: "B.Tech / M.Tech",
    saved: false,
    logo: "TI",
    color: "#8B5CF6",
    description: "Fully funded PhD program exploring quantum coherence in spintronic devices for next-gen memory.",
  },
  {
    id: 5,
    title: "Embedded Systems Engineer — EV Division",
    org: "Tata Motors Ltd.",
    verified: true,
    location: "Pune, Maharashtra",
    stipend: "₹8.5 LPA",
    deadline: "Jul 20, 2025",
    daysLeft: 21,
    tags: ["Embedded C", "CAN Bus", "AUTOSAR", "RTOS"],
    type: "Full-time",
    degree: "B.Tech",
    saved: false,
    logo: "TM",
    color: "#10B981",
    description: "Design and validate embedded firmware for EV battery management systems and motor controllers.",
  },
  {
    id: 6,
    title: "RF & Microwave Engineer Trainee",
    org: "DRDO — DLRL Laboratory",
    verified: false,
    location: "Hyderabad, Telangana",
    stipend: "₹25,000/mo",
    deadline: "Aug 5, 2025",
    daysLeft: 37,
    tags: ["RF", "Microwave", "Radar", "Signal Processing"],
    type: "Trainee",
    degree: "B.Tech / M.Tech",
    saved: false,
    logo: "DR",
    color: "#EF4444",
    description: "Develop and test RF subsystems for defense radar applications. Work in state-of-the-art facilities.",
  },
];

const NEWS_ITEMS = [
  {
    id: 1,
    source: "IEEE Spectrum",
    sourceColor: "#00E5FF",
    time: "2h ago",
    headline: "TSMC Announces 2nm Node Production Ramp with Backside Power Delivery",
    summary: "TSMC confirms volume production of N2 node begins Q4 2025, featuring industry-first backside power delivery and nanosheet transistors for 10–15% performance uplift.",
    tags: ["TSMC", "2nm", "Semiconductor", "Foundry"],
    category: "Semiconductor",
  },
  {
    id: 2,
    source: "EE Times",
    sourceColor: "#3B82F6",
    time: "4h ago",
    headline: "NVIDIA Blackwell Ultra B300 Delivers 1.5x AI Training Speed Over B200",
    summary: "New benchmarks from MLCommons show NVIDIA's Blackwell Ultra architecture outperforms its predecessor with 288GB HBM3e and 10 PetaFLOPS of FP8 compute.",
    tags: ["NVIDIA", "AI Chips", "HPC", "GPU"],
    category: "AI Chips",
  },
  {
    id: 3,
    source: "Semiconductor Today",
    sourceColor: "#10B981",
    time: "6h ago",
    headline: "IIT Bombay Researchers Demonstrate Room-Temperature Quantum Dot Single Photon Emitter",
    summary: "A team from IIT Bombay's CRNTS has fabricated colloidal InP quantum dots capable of on-demand single photon emission at 300K, a breakthrough for integrated photonics.",
    tags: ["Quantum Dots", "Photonics", "IIT Bombay", "Research"],
    category: "Research",
  },
  {
    id: 4,
    source: "Digit India",
    sourceColor: "#F59E0B",
    time: "8h ago",
    headline: "India's Semiconductor Mission Approves ₹76,000 Cr Fab in Dholera SEZ",
    summary: "The Union Cabinet has greenlit TATA Electronics' proposed 28nm fab in Gujarat's Dholera SEZ, expected to generate over 20,000 direct jobs by 2028.",
    tags: ["India", "Fab", "Policy", "TATA"],
    category: "India",
  },
  {
    id: 5,
    source: "EDN Network",
    sourceColor: "#8B5CF6",
    time: "12h ago",
    headline: "VLSI Design Jobs Surge 34% YoY in India as Global Chip Giants Expand R&D",
    summary: "Hiring data from NASSCOM shows a 34% jump in VLSI/ASIC design roles in India in H1 2025, driven by expansions from Qualcomm, Intel, and Samsung semiconductors.",
    tags: ["VLSI", "Jobs", "India", "Industry"],
    category: "Jobs",
  },
];

const CHAT_HISTORY = [
  { role: "user" as const, text: "What are the best VLSI internships for final year B.Tech students in 2025?" },
  {
    role: "ai" as const, text: "Great question! For final-year B.Tech students in 2025, here are the **top VLSI internship opportunities**:\n\n**1. ISRO VSSC/ISAC Internship** — ₹35k/mo stipend, work on satellite ASIC design. Deadline: Aug 15.\n\n**2. Intel India R&D** — AI chip architecture, ₹60k/mo. Requires strong SystemVerilog.\n\n**3. Qualcomm University Program** — Bangalore/Hyderabad. Competitive, strong PPO chance.\n\n**4. IISc Nano-fabrication Lab** — Excellent for those interested in process engineering over design.\n\nI also notice your profile shows proficiency in Cadence Virtuoso. I'd recommend **applying to ISRO and IISc first** as they weight that tool heavily. Want me to draft a cover letter for ISRO?",
  },
];

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: "Priya Krishnamurthy",
    role: "PhD Candidate, IISc",
    avatar: "PK",
    time: "3h ago",
    title: "My journey from B.Tech ECE to a spintronics PhD at TIFR — AMA",
    body: "After 2 years of failed gate attempts and one industry job, I finally cracked the TIFR interview. Happy to share my preparation strategy, interview tips, and what a day in the nano-fab lab actually looks like.",
    upvotes: 247,
    comments: 83,
    tags: ["PhD", "TIFR", "Spintronics", "Career"],
  },
  {
    id: 2,
    author: "Arjun Mehta",
    role: "VLSI Engineer, Qualcomm",
    avatar: "AM",
    time: "6h ago",
    title: "RTL coding style that got me through Qualcomm's design interview",
    body: "Sharing the exact coding patterns, FSM templates, and synthesis-aware Verilog tricks that I practiced for 3 months before the interview. PDF + code repo attached.",
    upvotes: 189,
    comments: 61,
    tags: ["VLSI", "Qualcomm", "RTL", "Interview"],
  },
  {
    id: 3,
    author: "Sneha Agarwal",
    role: "M.Tech Student, IIT Delhi",
    avatar: "SA",
    time: "1d ago",
    title: "Comparison of GATE vs JEST vs BARC for semiconductor research aspirants",
    body: "I appeared for all three this year. Here's my honest take on syllabus overlap, cutoff trends, and which exam actually matters more for different research lab pathways.",
    upvotes: 312,
    comments: 104,
    tags: ["GATE", "JEST", "Research", "Strategy"],
  },
];

// ─── Reusable Components ───────────────────────────────────────────────────────
function Badge({ children, color = "cyan", size = "sm" }: { children: React.ReactNode; color?: string; size?: "xs" | "sm" }) {
  const colorMap: Record<string, string> = {
    cyan: "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20",
    blue: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20",
    green: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20",
    yellow: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
    red: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20",
    purple: "bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20",
    gray: "bg-[#1F2937] text-[#94A3B8] border border-[#1F2937]",
  };
  const sizeMap = { xs: "px-1.5 py-0.5 text-[10px]", sm: "px-2.5 py-1 text-[11px]" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide ${colorMap[color] || colorMap.gray} ${sizeMap[size]}`}>
      {children}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 uppercase tracking-widest">
      <CheckCircle size={10} /> Verified
    </span>
  );
}

function AvatarCircle({ initials, color }: { initials: string; color: string }) {
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: color + "33", border: `1.5px solid ${color}50` }}>
      <span style={{ color }}>{initials}</span>
    </div>
  );
}

function StatCard({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta?: string }) {
  return (
    <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">{icon}</div>
        {delta && <span className="text-[11px] text-[#10B981] font-semibold">+{delta}</span>}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function OpportunityCard({ opp, onClick }: { opp: typeof OPPORTUNITIES[0]; onClick: () => void }) {
  const [saved, setSaved] = useState(opp.saved);
  return (
    <div
      onClick={onClick}
      className="group bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-[#00E5FF]/30 hover:shadow-[0_0_24px_rgba(0,229,255,0.08)] hover:-translate-y-0.5 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start gap-3 mb-3">
        <AvatarCircle initials={opp.logo} color={opp.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-[15px] leading-tight line-clamp-2">{opp.title}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={e => { e.stopPropagation(); setSaved(!saved); }} className={`p-1.5 rounded-lg transition-colors ${saved ? "text-[#00E5FF]" : "text-[#94A3B8] hover:text-white"}`}>
                <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
              </button>
              <button onClick={e => e.stopPropagation()} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors">
                <Share2 size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm text-[#94A3B8] mt-0.5">{opp.org}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {opp.verified && <VerifiedBadge />}
        <Badge color="gray">{opp.type}</Badge>
        <Badge color="gray">{opp.degree}</Badge>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-[#94A3B8] mb-3">
        <span className="flex items-center gap-1"><MapPin size={11} />{opp.location}</span>
        <span className="flex items-center gap-1"><Zap size={11} className="text-[#00E5FF]" />{opp.stipend}</span>
        <span className="flex items-center gap-1"><Clock size={11} className={opp.daysLeft < 30 ? "text-[#F59E0B]" : "text-[#94A3B8]"} />{opp.daysLeft}d left</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {opp.tags.slice(0, 3).map(t => <Badge key={t} color="cyan" size="xs">{t}</Badge>)}
        {opp.tags.length > 3 && <Badge color="gray" size="xs">+{opp.tags.length - 3}</Badge>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#1F2937]" />
        <div className="flex-1">
          <div className="h-4 bg-[#1F2937] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#1F2937] rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-[#1F2937] rounded-full w-16" />
        <div className="h-5 bg-[#1F2937] rounded-full w-20" />
      </div>
      <div className="flex gap-3 mb-3">
        <div className="h-3 bg-[#1F2937] rounded w-24" />
        <div className="h-3 bg-[#1F2937] rounded w-16" />
      </div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navbar({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems: { label: string; id: Screen; icon: React.ReactNode }[] = [
    { label: "Home", id: "landing", icon: <Home size={15} /> },
    { label: "Opportunities", id: "opportunities", icon: <Briefcase size={15} /> },
    { label: "News", id: "news", icon: <Newspaper size={15} /> },
    { label: "AI Assistant", id: "ai", icon: <Bot size={15} /> },
    { label: "Community", id: "community", icon: <Users size={15} /> },
    { label: "Resume", id: "resume", icon: <FileText size={15} /> },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-[#0B1120]/90 backdrop-blur-xl border-b border-[#1F2937]">
      <div className="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between gap-6">
        <button onClick={() => setScreen("landing")} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
            <CircuitBoard size={14} className="text-[#00E5FF]" />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">Electro<span className="text-[#00E5FF]">Bridge</span></span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setScreen(item.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${screen === item.id ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-[#94A3B8] hover:text-white hover:bg-[#1A2438]"}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden md:flex p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1A2438] transition-colors">
            <Bell size={16} />
          </button>
          <button onClick={() => setScreen("dashboard")} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A2438] border border-[#1F2937] text-sm text-white hover:border-[#00E5FF]/30 transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#00E5FF]/20 flex items-center justify-center"><User size={11} className="text-[#00E5FF]" /></div>
            Dashboard
          </button>
          <button onClick={() => setScreen("admin")} className="hidden md:flex px-3 py-1.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-sm text-[#00E5FF] font-medium hover:bg-[#00E5FF]/15 transition-colors">Admin</button>
          <button className="md:hidden p-2 text-[#94A3B8]" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#1F2937] px-4 py-3 flex flex-col gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setScreen(item.id); setMobileOpen(false); }} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${screen === item.id ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-[#94A3B8]"}`}>
              {item.icon}{item.label}
            </button>
          ))}
          <button onClick={() => { setScreen("dashboard"); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8]"><User size={15} />Dashboard</button>
        </div>
      )}
    </header>
  );
}

// ─── Screen 1: Landing ────────────────────────────────────────────────────────
function LandingScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const categories = [
    { icon: <Cpu size={22} />, label: "VLSI & ASIC", count: 142, color: "#00E5FF" },
    { icon: <CircuitBoard size={22} />, label: "Semiconductor Process", count: 89, color: "#3B82F6" },
    { icon: <Zap size={22} />, label: "Embedded Systems", count: 213, color: "#F59E0B" },
    { icon: <Radio size={22} />, label: "RF & Microwave", count: 67, color: "#10B981" },
    { icon: <FlaskConical size={22} />, label: "Research & PhD", count: 54, color: "#8B5CF6" },
    { icon: <BarChart3 size={22} />, label: "Signal Processing", count: 98, color: "#EF4444" },
    { icon: <Bot size={22} />, label: "AI Hardware", count: 76, color: "#00E5FF" },
    { icon: <GraduationCap size={22} />, label: "Fellowships", count: 45, color: "#3B82F6" },
  ];
  const stats = [
    { val: "4,200+", label: "Verified Opportunities" },
    { val: "98%", label: "Accuracy Rate" },
    { val: "1.2L+", label: "Active Users" },
    { val: "340+", label: "Partner Orgs" },
  ];
  const testimonials = [
    { name: "Rohan Verma", role: "VLSI Engineer @ Qualcomm", text: "ElectroBridge's AI matched me to an internship I'd never have found on my own. The verification system saved me from applying to fake listings.", avatar: "RV" },
    { name: "Ananya Iyer", role: "PhD Scholar @ IISc", text: "The best resource for semiconductor research opportunities in India. The AI insights are genuinely helpful for PhD applications.", avatar: "AI" },
    { name: "Karthik Sundaram", role: "Embedded Engineer @ DRDO", text: "Found my current role through ElectroBridge. The deadline tracking and AI resume review were game-changers.", avatar: "KS" },
  ];
  return (
    <div className="min-h-screen bg-[#0B1120]">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* BG radial */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-[#3B82F6]/8 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-[1100px] mx-auto text-center">
          {/* Chip illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 animate-pulse" />
              <div className="absolute inset-3 rounded-xl bg-[#111827] border border-[#1F2937] flex items-center justify-center">
                <CircuitBoard size={32} className="text-[#00E5FF]" />
              </div>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="absolute w-8 h-px bg-gradient-to-r from-[#00E5FF]/60 to-transparent"
                  style={{ top: `${25 + i * 17}%`, left: i % 2 === 0 ? "-2rem" : "auto", right: i % 2 !== 0 ? "-2rem" : "auto", transform: i % 2 !== 0 ? "rotate(180deg)" : undefined }} />
              ))}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium mb-6">
            <Sparkles size={12} /> AI-Powered Career Intelligence for Electronics & Semiconductors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Discover Your Path in<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]">Semiconductors & Electronics</span>
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Verified internships, research fellowships, PhD scholarships, and industry roles — curated for electronics engineers and semiconductor professionals. AI-matched to your skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button onClick={() => setScreen("opportunities")} className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all duration-150 shadow-[0_0_32px_rgba(0,229,255,0.25)]">
              Explore Opportunities <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => setScreen("ai")} className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[#1F2937] bg-[#111827] text-white font-semibold text-sm hover:border-[#00E5FF]/30 transition-colors">
              <Bot size={16} className="text-[#00E5FF]" /> Ask AI
            </button>
          </div>
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center gap-3 px-4 py-3.5 bg-[#111827] border border-[#1F2937] rounded-2xl focus-within:border-[#00E5FF]/40 transition-colors">
              <Search size={18} className="text-[#94A3B8] shrink-0" />
              <input placeholder="Search by role, organization, skill, or location…" className="flex-1 bg-transparent text-white placeholder:text-[#94A3B8] text-sm outline-none" />
              <button className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#0B1120] text-sm font-semibold hover:bg-[#00E5FF]/90 transition-colors">Search</button>
            </div>
            <p className="text-xs text-[#94A3B8] mt-2">Popular: VLSI Internship · PhD Spintronics · Embedded Systems Pune · GATE research</p>
          </div>
        </div>
      </section>
      {/* Stats Strip */}
      <section className="py-8 px-4 border-y border-[#1F2937] bg-[#111827]/50">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-[#00E5FF]">{s.val}</p>
              <p className="text-xs text-[#94A3B8] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Browse by Category</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Find opportunities tailored to your specialization</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <button key={cat.label} onClick={() => setScreen("opportunities")} className="group bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5 text-left hover:border-[#00E5FF]/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.06)] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: cat.color + "18", border: `1.5px solid ${cat.color}30` }}>
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                </div>
                <p className="font-semibold text-white text-sm">{cat.label}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{cat.count} openings</p>
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Opportunities */}
      <section className="py-16 px-4 bg-[#111827]/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Opportunities</h2>
              <p className="text-[#94A3B8] text-sm mt-1">Handpicked, verified, and expiring soon</p>
            </div>
            <button onClick={() => setScreen("opportunities")} className="text-sm text-[#00E5FF] hover:text-[#00E5FF]/80 flex items-center gap-1">View all <ChevronRight size={14} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {OPPORTUNITIES.slice(0, 3).map(opp => <OpportunityCard key={opp.id} opp={opp} onClick={() => setScreen("detail")} />)}
          </div>
        </div>
      </section>
      {/* News */}
      <section className="py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Latest Semiconductor News</h2>
              <p className="text-[#94A3B8] text-sm mt-1">Curated from trusted industry sources</p>
            </div>
            <button onClick={() => setScreen("news")} className="text-sm text-[#00E5FF] flex items-center gap-1">All news <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-3">
            {NEWS_ITEMS.slice(0, 3).map(n => (
              <div key={n.id} className="bg-[#1A2438] border border-[#1F2937] rounded-xl p-4 hover:border-[#00E5FF]/20 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.sourceColor }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: n.sourceColor }}>{n.source}</span>
                      <span className="text-xs text-[#94A3B8]">{n.time}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{n.headline}</h4>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{n.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* AI CTA */}
      <section className="py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="relative bg-[#111827] border border-[#00E5FF]/20 rounded-3xl p-10 overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-[#3B82F6]/5 pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 flex items-center justify-center mx-auto mb-5">
                <Bot size={26} className="text-[#00E5FF]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">AI-Powered Career Guidance</h2>
              <p className="text-[#94A3B8] max-w-xl mx-auto text-sm leading-relaxed mb-7">Get personalized opportunity matching, resume scoring, skill gap analysis, and complete career roadmaps — powered by advanced AI trained on semiconductor industry data.</p>
              <button onClick={() => setScreen("ai")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_32px_rgba(0,229,255,0.2)]">
                <Sparkles size={16} /> Try AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 px-4 bg-[#111827]/30">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Trusted by Electronics Professionals</h2>
          <p className="text-[#94A3B8] text-sm text-center mb-10">What our community says</p>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#94A3B8]">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed italic">&quot;{t.text}&quot;</p>
                <div className="flex gap-0.5 mt-3">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-[#F59E0B]" fill="currentColor" />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-[#1F2937] py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CircuitBoard size={16} className="text-[#00E5FF]" />
                <span className="font-bold text-white text-sm">Electro<span className="text-[#00E5FF]">Bridge</span></span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">AI-powered career platform for the semiconductor and electronics engineering community.</p>
            </div>
            {[["Platform", ["Opportunities", "News", "AI Assistant", "Community"]], ["Resources", ["Resume Builder", "GATE Prep", "Interview Tips", "Salary Guide"]], ["Company", ["About", "Blog", "Careers", "Contact"]]].map(([title, links]) => (
              <div key={title as string}>
                <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">{title}</p>
                <ul className="space-y-2">{(links as string[]).map(l => <li key={l}><a href="#" className="text-xs text-[#94A3B8] hover:text-white transition-colors">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1F2937] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#94A3B8]">© 2025 ElectroBridge. All rights reserved.</p>
            <p className="text-xs text-[#94A3B8]">Built for India's semiconductor revolution</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Screen 2: Opportunities ──────────────────────────────────────────────────
function OpportunitiesScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const filtered = OPPORTUNITIES.filter(o => {
    if (verifiedOnly && !o.verified) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.org.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const filters = {
    "Job Type": ["Internship", "Full-time", "Research Fellowship", "PhD Scholarship", "Trainee"],
    "Degree": ["B.Tech", "M.Tech", "PhD"],
    "Location": ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Delhi"],
    "Stipend": ["< ₹25k", "₹25k–₹50k", "> ₹50k"],
  };
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1440px] mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-[#1F2937] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2"><SlidersHorizontal size={14} className="text-[#00E5FF]" /> Filters</h3>
            <button className="text-xs text-[#94A3B8] hover:text-white">Clear all</button>
          </div>
          {Object.entries(filters).map(([group, opts]) => (
            <div key={group} className="mb-5">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{group}</p>
              <div className="space-y-1.5">
                {opts.map(opt => {
                  const active = activeFilters.includes(opt);
                  return (
                    <button key={opt} onClick={() => setActiveFilters(active ? activeFilters.filter(f => f !== opt) : [...activeFilters, opt])}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" : "text-[#94A3B8] hover:text-white hover:bg-[#1A2438]"}`}>
                      {opt}
                      {active && <CheckCircle size={13} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>
        {/* Main */}
        <main className="flex-1 p-5 lg:p-7">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl focus-within:border-[#00E5FF]/40 transition-colors">
              <Search size={15} className="text-[#94A3B8]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities…" className="bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${verifiedOnly ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25" : "text-[#94A3B8] border-[#1F2937] hover:text-white"}`}>
                <CheckCircle size={13} /> Verified Only
              </button>
              <div className="flex items-center border border-[#1F2937] rounded-xl overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-[#1A2438] text-white" : "text-[#94A3B8]"}`}><Grid3X3 size={14} /></button>
                <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-[#1A2438] text-white" : "text-[#94A3B8]"}`}><List size={14} /></button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#94A3B8]"><span className="text-white font-semibold">{filtered.length}</span> opportunities found</p>
            <select className="text-sm bg-[#111827] border border-[#1F2937] text-[#94A3B8] rounded-lg px-3 py-1.5 outline-none">
              <option>Sort: Deadline (Soonest)</option>
              <option>Sort: Stipend (Highest)</option>
              <option>Sort: Newest First</option>
            </select>
          </div>
          <div className={view === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
            {filtered.map(opp => <OpportunityCard key={opp.id} opp={opp} onClick={() => setScreen("detail")} />)}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-20">
                <AlertCircle size={40} className="text-[#1F2937] mx-auto mb-3" />
                <p className="text-[#94A3B8] text-sm">No opportunities match your filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Screen 3: Opportunity Detail ─────────────────────────────────────────────
function DetailScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const opp = OPPORTUNITIES[2];
  const [saved, setSaved] = useState(false);
  const daysLeft = 64;
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <button onClick={() => setScreen("opportunities")} className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white mb-6 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to Opportunities
        </button>
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-7 mb-5">
              <div className="flex items-start gap-4 mb-5">
                <AvatarCircle initials={opp.logo} color={opp.color} />
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{opp.title}</h1>
                  <p className="text-[#94A3B8]">{opp.org}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <VerifiedBadge />
                    <Badge color="cyan">{opp.type}</Badge>
                    <Badge color="gray">{opp.degree}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-[#94A3B8] pb-5 border-b border-[#1F2937]">
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#00E5FF]" />{opp.location}</span>
                <span className="flex items-center gap-1.5"><Zap size={13} className="text-[#00E5FF]" />{opp.stipend}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#F59E0B]" /> Deadline: {opp.deadline} ({daysLeft} days)</span>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-[#94A3B8]">Deadline in</p>
                  <p className="text-xs text-[#F59E0B] font-semibold">{daysLeft} days</p>
                </div>
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-full" style={{ width: `${(1 - daysLeft / 90) * 100}%` }} />
                </div>
              </div>
            </div>
            {[
              { title: "Description", content: "Join Intel India R&D's AI Architecture team to research next-generation neural processing units. You will collaborate with global hardware teams on micro-architectural innovations for inference acceleration.\n\nThis position offers exposure to the full AI chip design pipeline — from workload characterization to RTL implementation and silicon validation. You will use industry-standard simulation and modeling tools to evaluate architectural trade-offs." },
              { title: "Eligibility", content: "• Final year M.Tech or registered PhD students in ECE, EEE, or CSE\n• Strong proficiency in SystemVerilog or Verilog\n• Knowledge of computer architecture fundamentals (pipeline, cache, memory hierarchy)\n• Familiarity with ML frameworks (PyTorch/TensorFlow) preferred\n• CGPA ≥ 8.0 from a recognized institute" },
              { title: "Required Documents", content: "1. Updated CV/Resume (PDF, max 2MB)\n2. Statement of Purpose (500 words)\n3. Transcripts from current institution\n4. One letter of recommendation from advisor/professor\n5. Sample project report or published paper (optional but preferred)" },
              { title: "Application Steps", content: "Step 1: Register on the Intel University Program portal\nStep 2: Complete the online technical assessment (SystemVerilog + Architecture MCQs — 60 min)\nStep 3: Submit all required documents through the portal\nStep 4: Shortlisted candidates will be invited for a 45-min video interview\nStep 5: Offer letters sent within 7 business days of final interview" },
            ].map(s => (
              <div key={s.title} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 mb-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 rounded-full bg-[#00E5FF]" /> {s.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#00E5FF]/5 to-[#3B82F6]/5 border border-[#00E5FF]/15 rounded-2xl p-6 mb-4">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Bot size={16} className="text-[#00E5FF]" /> AI Insights
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "🎯", title: "Match Score", val: "87%", sub: "Based on your profile skills and experience" },
                  { icon: "📈", title: "Competition Level", val: "High", sub: "~340 applicants expected based on historical data" },
                  { icon: "⚡", title: "Key Skill Gap", val: "Arch Sim", sub: "Add gem5 or MachSuite to your resume to improve match" },
                ].map(i => (
                  <div key={i.title} className="flex items-start gap-3 p-3 bg-[#0B1120]/50 rounded-xl border border-[#1F2937]">
                    <span className="text-lg">{i.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{i.title}: <span className="text-[#00E5FF]">{i.val}</span></p>
                      <p className="text-xs text-[#94A3B8]">{i.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right panel */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20 space-y-4">
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <a href="#" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_24px_rgba(0,229,255,0.2)] mb-3">
                  <ExternalLink size={15} /> Apply Now
                </a>
                <div className="flex gap-2">
                  <button onClick={() => setSaved(!saved)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${saved ? "bg-[#00E5FF]/10 border-[#00E5FF]/25 text-[#00E5FF]" : "border-[#1F2937] text-[#94A3B8] hover:text-white"}`}>
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#1F2937] text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
                    <Share2 size={14} /> Share
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#EF4444] transition-colors mt-2">
                  <Flag size={12} /> Report Issue
                </button>
              </div>
              {/* Quick Facts */}
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-4">Quick Facts</h4>
                <div className="space-y-3">
                  {[
                    { label: "Org Type", val: "Private R&D" },
                    { label: "Position Type", val: "Research Internship" },
                    { label: "Duration", val: "6 months" },
                    { label: "Location", val: "Hyderabad, WFO" },
                    { label: "Age Limit", val: "No bar" },
                    { label: "GATE Required", val: "Preferred, not mandatory" },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between text-sm">
                      <span className="text-[#94A3B8]">{f.label}</span>
                      <span className="text-white font-medium">{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Related */}
              <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-white mb-3">Related Opportunities</h4>
                <div className="space-y-3">
                  {OPPORTUNITIES.slice(0, 3).filter(o => o.id !== opp.id).map(o => (
                    <div key={o.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => setScreen("detail")}>
                      <AvatarCircle initials={o.logo} color={o.color} />
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">{o.title}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{o.daysLeft}d left · {o.stipend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 4: News ───────────────────────────────────────────────────────────
function NewsScreen() {
  const tabs = ["All", "Semiconductor", "VLSI", "AI Chips", "Research", "India", "Industry", "Jobs"];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? NEWS_ITEMS : NEWS_ITEMS.filter(n => n.category === active || n.tags.includes(active));
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1100px] mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Semiconductor & Electronics News</h1>
          <p className="text-[#94A3B8] text-sm">Curated from IEEE Spectrum, EE Times, Semiconductor Today, and more</p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active === tab ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25" : "text-[#94A3B8] border border-[#1F2937] hover:text-white"}`}>{tab}</button>
          ))}
        </div>
        <div className="space-y-4">
          {(filtered.length ? filtered : NEWS_ITEMS).map(n => (
            <div key={n.id} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 hover:border-[#00E5FF]/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full mt-2 shrink-0" style={{ background: n.sourceColor }} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold" style={{ color: n.sourceColor }}>{n.source}</span>
                    <span className="text-xs text-[#94A3B8]">{n.time}</span>
                    <Badge color="gray" size="xs">{n.category}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2 leading-snug">{n.headline}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-3">{n.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {n.tags.map(t => <Badge key={t} color="cyan" size="xs">#{t}</Badge>)}
                  </div>
                </div>
                <ExternalLink size={14} className="text-[#94A3B8] shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen 5: AI Assistant ───────────────────────────────────────────────────
function AIScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const suggestions = ["Best VLSI jobs for freshers 2025", "PhD opportunities in spintronics", "Review my resume for ISRO application", "Career roadmap: B.Tech ECE to chip architect"];
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user" as const, text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai" as const, text: "I found **12 matching opportunities** based on your query. The top picks are ISRO VSSC VLSI internship (deadline Aug 15, ₹35k/mo) and IISc nano-fab fellowship (deadline Jul 30, ₹42k/mo). Would you like me to analyze your profile fit for either of these?" }]);
      setTyping(false);
    }, 1800);
  };
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  const features = [
    { icon: <Search size={16} />, label: "Opportunity Matching", color: "#00E5FF" },
    { icon: <FileText size={16} />, label: "Resume Scoring", color: "#3B82F6" },
    { icon: <TrendingUp size={16} />, label: "Skill Gap Analysis", color: "#10B981" },
    { icon: <BarChart3 size={16} />, label: "Career Roadmap", color: "#F59E0B" },
  ];
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14 flex">
      {/* Left: history */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#1F2937] bg-[#111827]">
        <div className="p-4 border-b border-[#1F2937]">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/15 transition-colors">
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-2">Recent</p>
          {["VLSI jobs for freshers", "PhD spintronics TIFR", "Embedded systems Pune", "Resume review ISRO"].map(h => (
            <button key={h} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:bg-[#1A2438] hover:text-white transition-colors truncate">{h}</button>
          ))}
        </div>
        <div className="p-3 border-t border-[#1F2937]">
          <div className="flex flex-wrap gap-1.5">
            {features.map(f => (
              <div key={f.label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium" style={{ background: f.color + "15", color: f.color }}>
                {f.icon} {f.label}
              </div>
            ))}
          </div>
        </div>
      </aside>
      {/* Right: chat */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-[#1F2937] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
            <Bot size={16} className="text-[#00E5FF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ElectroBridge AI</p>
            <p className="text-xs text-[#10B981] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />Online · Semiconductor specialist</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={14} className="text-[#00E5FF]" />
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-[#00E5FF]/10 border border-[#00E5FF]/15 text-white rounded-tr-sm" : "bg-[#1A2438] border border-[#1F2937] text-[#E2E8F0] rounded-tl-sm"}`}>
                {m.text.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1.5" : ""} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                ))}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                <Bot size={14} className="text-[#00E5FF]" />
              </div>
              <div className="px-4 py-3 bg-[#1A2438] border border-[#1F2937] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 rounded-xl bg-[#1A2438] border border-[#1F2937] text-xs text-[#94A3B8] hover:text-white hover:border-[#00E5FF]/30 transition-colors">{s}</button>
            ))}
          </div>
        )}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-2xl focus-within:border-[#00E5FF]/40 transition-colors">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about opportunities, career advice, resume help…" className="flex-1 bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none" />
            <button onClick={sendMessage} disabled={!input.trim()} className="p-2 rounded-lg bg-[#00E5FF] text-[#0B1120] disabled:opacity-40 hover:bg-[#00E5FF]/90 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 6: Dashboard ──────────────────────────────────────────────────────
function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const apps = [
    { org: "ISRO VSSC", role: "VLSI Intern", status: "Under Review", color: "#F59E0B" },
    { org: "IISc", role: "Nano-fab Fellow", status: "Shortlisted", color: "#10B981" },
    { org: "Intel India", role: "AI Chip Intern", status: "Applied", color: "#00E5FF" },
    { org: "DRDO DLRL", role: "RF Trainee", status: "Rejected", color: "#EF4444" },
  ];
  const statusColor: Record<string, string> = { "Under Review": "yellow", Shortlisted: "green", Applied: "cyan", Rejected: "red" };
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">Track your applications and career progress</p>
          </div>
          <button onClick={() => setScreen("resume")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/15 transition-colors">
            <FileText size={14} /> Build Resume
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Bookmark size={16} />} label="Saved Opportunities" value="14" delta="3" />
          <StatCard icon={<Briefcase size={16} />} label="Applications" value="4" />
          <StatCard icon={<Award size={16} />} label="Resume ATS Score" value="74/100" delta="12" />
          <StatCard icon={<Bell size={16} />} label="Active Alerts" value="6" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Briefcase size={15} className="text-[#00E5FF]" /> Application Tracker</h3>
            <div className="space-y-3">
              {apps.map(a => (
                <div key={a.org} className="flex items-center gap-3 p-3 bg-[#0B1120] rounded-xl border border-[#1F2937]">
                  <AvatarCircle initials={a.org.slice(0, 2)} color={a.color} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{a.role}</p>
                    <p className="text-xs text-[#94A3B8]">{a.org}</p>
                  </div>
                  <Badge color={statusColor[a.status] || "gray"}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Award size={15} className="text-[#00E5FF]" /> Resume Score</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1F2937" strokeWidth="8" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#00E5FF" strokeWidth="8" strokeDasharray="213.6" strokeDashoffset={`${213.6 * (1 - 0.74)}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">74</span>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] mb-2">Areas to improve:</p>
                  {["Add publications", "Quantify achievements", "Improve keywords"].map(tip => (
                    <p key={tip} className="text-xs text-[#94A3B8] flex items-center gap-1"><ChevronRight size={10} className="text-[#F59E0B]" />{tip}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Clock size={15} className="text-[#F59E0B]" /> Upcoming Deadlines</h3>
              <div className="space-y-2.5">
                {OPPORTUNITIES.slice(0, 4).map(o => (
                  <div key={o.id} className="flex items-center justify-between text-sm">
                    <p className="text-white truncate flex-1 mr-2 text-xs">{o.org.split("—")[0].trim()}</p>
                    <Badge color={o.daysLeft < 30 ? "red" : "yellow"} size="xs">{o.daysLeft}d</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 7: Community ──────────────────────────────────────────────────────
function CommunityScreen() {
  const contributors = [
    { name: "Rohan Mehta", posts: 142, rep: 2400, avatar: "RM" },
    { name: "Divya Nair", posts: 98, rep: 1870, avatar: "DN" },
    { name: "Ashwin Kumar", posts: 87, rep: 1650, avatar: "AK" },
  ];
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1440px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#0B1120] text-sm font-semibold hover:bg-[#00E5FF]/90 transition-colors">
              <Edit3 size={13} /> New Post
            </button>
          </div>
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
            {["Trending", "Latest", "Top Discussions", "Q&A", "Showcase"].map((t, i) => (
              <button key={t} className={`shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${i === 0 ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25" : "text-[#94A3B8] border border-[#1F2937] hover:text-white"}`}>{t}</button>
            ))}
          </div>
          <div className="space-y-4">
            {COMMUNITY_POSTS.map(post => (
              <div key={post.id} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5 hover:border-[#00E5FF]/20 cursor-pointer transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] text-xs font-bold shrink-0">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{post.author}</p>
                      <span className="text-xs text-[#94A3B8]">·</span>
                      <p className="text-xs text-[#94A3B8]">{post.role}</p>
                      <span className="ml-auto text-xs text-[#94A3B8]">{post.time}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-2">{post.title}</h3>
                    <p className="text-sm text-[#94A3B8] line-clamp-2 mb-3">{post.body}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map(t => <Badge key={t} color="cyan" size="xs">#{t}</Badge>)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                      <button className="flex items-center gap-1 hover:text-[#00E5FF] transition-colors"><ThumbsUp size={12} />{post.upvotes}</button>
                      <button className="flex items-center gap-1 hover:text-[#00E5FF] transition-colors"><MessageCircle size={12} />{post.comments}</button>
                      <button className="flex items-center gap-1 hover:text-[#00E5FF] transition-colors"><Share2 size={12} />Share</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <aside className="lg:w-64 shrink-0 space-y-5">
          <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2"><Award size={13} className="text-[#F59E0B]" /> Top Contributors</h3>
            <div className="space-y-3">
              {contributors.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#94A3B8] w-4">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] text-xs font-bold">{c.avatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-[#94A3B8]">{c.rep} rep · {c.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-5">
            <h3 className="font-semibold text-white text-sm mb-3">Trending Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {["#VLSI", "#GATE2026", "#IISc", "#InternshipHunt", "#ISRO", "#Spintronics", "#EmbeddedSys", "#AI-Chips"].map(t => (
                <Badge key={t} color="cyan" size="xs">{t}</Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Screen 8: Resume Builder ─────────────────────────────────────────────────
function ResumeScreen() {
  const [step, setStep] = useState(0);
  const steps = ["Personal", "Education", "Skills", "Experience", "Projects", "Publications"];
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">AI Resume Builder</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Steps + Form */}
          <div className="flex-1 min-w-0">
            {/* Progress */}
            <div className="flex items-center gap-0 mb-7 overflow-x-auto pb-1">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center shrink-0">
                  <button onClick={() => setStep(i)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${step === i ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25" : i < step ? "text-[#10B981]" : "text-[#94A3B8]"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === i ? "bg-[#00E5FF] text-[#0B1120]" : i < step ? "bg-[#10B981] text-white" : "bg-[#1F2937] text-[#94A3B8]"}`}>{i < step ? "✓" : i + 1}</div>
                    {s}
                  </button>
                  {i < steps.length - 1 && <ChevronRight size={14} className="text-[#1F2937] mx-0.5" />}
                </div>
              ))}
            </div>
            <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6">
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                  {[["Full Name", "Arjun Sharma"], ["Email", "arjun@iitbombay.ac.in"], ["Phone", "+91 98765 43210"], ["LinkedIn", "linkedin.com/in/arjunsharma"], ["GitHub", "github.com/arjunsharma-vlsi"]].map(([label, placeholder]) => (
                    <div key={label}>
                      <label className="text-xs font-medium text-[#94A3B8] mb-1 block">{label}</label>
                      <input defaultValue={placeholder} className="w-full px-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-sm text-white placeholder:text-[#94A3B8] outline-none focus:border-[#00E5FF]/40 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-2">Education</h3>
                  {[["Institution", "IIT Bombay"], ["Degree", "B.Tech — Electronics Engineering"], ["Graduation Year", "2025"], ["CGPA", "8.6 / 10"]].map(([label, placeholder]) => (
                    <div key={label}>
                      <label className="text-xs font-medium text-[#94A3B8] mb-1 block">{label}</label>
                      <input defaultValue={placeholder} className="w-full px-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-sm text-white outline-none focus:border-[#00E5FF]/40 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2 p-3 bg-[#111827] border border-[#1F2937] rounded-xl min-h-[80px]">
                    {["Verilog", "SystemVerilog", "Cadence Virtuoso", "MATLAB", "Python", "RTL Design", "FPGA", "Embedded C"].map(skill => (
                      <Badge key={skill} color="cyan">{skill} <X size={9} className="ml-0.5 cursor-pointer" /></Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Add a skill…" className="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-sm text-white placeholder:text-[#94A3B8] outline-none focus:border-[#00E5FF]/40 transition-colors" />
                    <button className="px-4 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/25 rounded-xl text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/15 transition-colors"><Plus size={14} /></button>
                  </div>
                </div>
              )}
              {step >= 3 && (
                <div className="text-center py-10">
                  <UploadCloud size={36} className="text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-sm text-[#94A3B8]">Complete step {step + 1}: {steps[step]}</p>
                  <p className="text-xs text-[#94A3B8]/60 mt-1">Fill in the previous steps to unlock</p>
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-5 py-2.5 rounded-xl border border-[#1F2937] text-sm text-[#94A3B8] disabled:opacity-40 hover:text-white transition-colors">Previous</button>
                <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B1120] text-sm font-semibold hover:bg-[#00E5FF]/90 transition-colors">
                  {step === steps.length - 1 ? "Generate Resume" : "Next"}
                </button>
              </div>
            </div>
          </div>
          {/* Live Preview */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 flex items-center gap-2"><Eye size={12} /> Live ATS Preview</p>
              <div className="bg-white rounded-2xl p-6 text-[#0B1120] text-xs font-['Inter'] min-h-[500px] shadow-2xl">
                <div className="border-b-2 border-[#0B1120] pb-3 mb-3">
                  <h2 className="text-lg font-bold">Arjun Sharma</h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">arjun@iitbombay.ac.in · +91 98765 43210</p>
                  <p className="text-[10px] text-gray-500">linkedin.com/in/arjunsharma · github.com/arjunsharma-vlsi</p>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Education</p>
                  <p className="font-semibold text-[11px]">IIT Bombay — B.Tech Electronics Engineering</p>
                  <p className="text-[10px] text-gray-500">2021–2025 · CGPA: 8.6/10</p>
                </div>
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Skills</p>
                  <p className="text-[10px] leading-relaxed">Verilog · SystemVerilog · Cadence Virtuoso · MATLAB · Python · RTL Design · FPGA · Embedded C</p>
                </div>
                <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-[9px] text-gray-400 text-center">ATS Score: 74/100 · 3 improvements suggested</p>
                </div>
              </div>
              <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#1F2937] text-sm text-[#94A3B8] hover:text-white hover:border-[#00E5FF]/30 transition-colors">
                <Download size={14} /> Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 9: Admin Panel ────────────────────────────────────────────────────
function AdminScreen() {
  const modules = ["Opportunities", "Verification Queue", "News", "Reports", "Analytics", "AI Usage", "Broken Links"];
  const [activeModule, setActiveModule] = useState("Opportunities");
  const adminStats = [
    { icon: <Briefcase size={15} />, label: "New Opportunities", value: "12", delta: "today", color: "#00E5FF" },
    { icon: <Link size={15} />, label: "Broken Links", value: "3", color: "#EF4444" },
    { icon: <Flag size={15} />, label: "User Reports", value: "7", color: "#F59E0B" },
    { icon: <Bot size={15} />, label: "AI Requests (24h)", value: "1,847", delta: "+12%", color: "#10B981" },
  ];
  return (
    <div className="min-h-screen bg-[#0B1120] pt-14 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#1F2937] bg-[#111827] hidden md:flex flex-col">
        <div className="p-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#00E5FF]" />
            <span className="text-sm font-semibold text-white">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {modules.map(m => (
            <button key={m} onClick={() => setActiveModule(m)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${activeModule === m ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-[#94A3B8] hover:bg-[#1A2438] hover:text-white"}`}>
              {m}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">{activeModule}</h1>
          <div className="flex items-center gap-2">
            <Badge color="green"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" /> System Normal</Badge>
            <button className="px-3 py-1.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] text-sm font-medium hover:bg-[#00E5FF]/15 transition-colors"><Plus size={13} className="inline mr-1" />Add New</button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {adminStats.map(s => (
            <div key={s.label} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
                {s.delta && <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.delta}</span>}
              </div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Table */}
        <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F2937]">
            <h3 className="text-sm font-semibold text-white">Recent Submissions</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#1F2937] rounded-lg">
                <Search size={12} className="text-[#94A3B8]" />
                <input placeholder="Search…" className="bg-transparent text-xs text-white placeholder:text-[#94A3B8] outline-none w-32" />
              </div>
              <button className="p-1.5 rounded-lg border border-[#1F2937] text-[#94A3B8] hover:text-white"><Filter size={13} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#1F2937]">
                <tr className="text-[#94A3B8] text-xs uppercase tracking-wider">
                  {["Title", "Organization", "Type", "Submitted", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {OPPORTUNITIES.map(opp => (
                  <tr key={opp.id} className="hover:bg-[#111827] transition-colors">
                    <td className="px-5 py-3 text-white font-medium text-xs max-w-[180px] truncate">{opp.title}</td>
                    <td className="px-5 py-3 text-[#94A3B8] text-xs">{opp.org.split("—")[0].trim()}</td>
                    <td className="px-5 py-3"><Badge color="gray" size="xs">{opp.type}</Badge></td>
                    <td className="px-5 py-3 text-[#94A3B8] text-xs">{opp.deadline}</td>
                    <td className="px-5 py-3"><Badge color={opp.verified ? "green" : "yellow"} size="xs">{opp.verified ? "Verified" : "Pending"}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded text-[#94A3B8] hover:text-[#00E5FF] transition-colors"><Eye size={13} /></button>
                        <button className="p-1 rounded text-[#94A3B8] hover:text-[#10B981] transition-colors"><CheckCircle size={13} /></button>
                        <button className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1F2937]">
            <p className="text-xs text-[#94A3B8]">Showing 6 of 4,200+ records</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 420].map((p, i) => (
                <button key={i} className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${p === 1 ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25" : "text-[#94A3B8] hover:text-white"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);
  return (
    <div className="font-['Inter',sans-serif] bg-[#0B1120] text-white min-h-screen">
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .animate-bounce { animation: bounce 1.2s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        * { scrollbar-width: thin; scrollbar-color: #1F2937 transparent; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
      `}</style>
      <Navbar screen={screen} setScreen={setScreen} />
      {screen === "landing" && <LandingScreen setScreen={setScreen} />}
      {screen === "opportunities" && <OpportunitiesScreen setScreen={setScreen} />}
      {screen === "detail" && <DetailScreen setScreen={setScreen} />}
      {screen === "news" && <NewsScreen />}
      {screen === "ai" && <AIScreen />}
      {screen === "dashboard" && <DashboardScreen setScreen={setScreen} />}
      {screen === "community" && <CommunityScreen />}
      {screen === "resume" && <ResumeScreen />}
      {screen === "admin" && <AdminScreen />}
    </div>
  );
}
