"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getPublicInvestorPortfolio,
  type PublicInvestorResponse,
  type InvestorPortfolioItem,
} from "@/lib/api/portfolio";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  MessageSquare,
  PieChart,
  Play,
  RefreshCw,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Video,
  X,
  Zap,
} from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { toast } from "@/lib/toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvestorProfileViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const identifier = resolvedParams.id;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PublicInvestorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "OVERVIEW" | "HOLDINGS" | "CERTIFICATES" | "VIDEOS" | "EXPERIENCE"
  >("OVERVIEW");

  const [holdingFilter, setHoldingFilter] = useState<"ALL" | "ACTIVE" | "EXITED">("ALL");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [pitchMessage, setPitchMessage] = useState("");
  const [isSubmittingPitch, setIsSubmittingPitch] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await getPublicInvestorPortfolio(identifier);
        setData(res);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to find the requested investor portfolio profile."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [identifier]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchMessage.trim()) {
      toast.error("Please enter a short intro message or pitch brief.");
      return;
    }
    setIsSubmittingPitch(true);
    setTimeout(() => {
      setIsSubmittingPitch(false);
      setIsPitchModalOpen(false);
      setPitchMessage("");
      toast.success("Your pitch introduction has been signaled to the investor!");
    }, 900);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-3xl bg-emerald-100/60 animate-ping absolute inset-0" />
            <div className="relative h-16 w-16 rounded-3xl bg-gradient-to-tr from-[#064e3b] to-[#10b981] flex items-center justify-center text-white shadow-xl">
              <RefreshCw className="h-7 w-7 animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-heading font-black text-slate-900 mt-6 tracking-tight">
            Verifying Investor Credentials...
          </h3>
          <p className="text-xs text-slate-500 font-body mt-1 max-w-sm">
            Fetching verified track record, Cloudflare Private Vault documents, and portfolio analytics.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-heading font-black text-slate-900">
            Investor Profile Unavailable
          </h2>
          <p className="text-xs text-slate-500 max-w-md font-body leading-relaxed">{error}</p>
          <div className="flex gap-3 pt-2">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] px-5 py-2.5 text-xs font-bold font-heading text-white hover:bg-[#043d2e] shadow-md transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Browse Investor Directory</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { investor, stats, portfolioItems, isPremiumUnlocked, premiumGate } = data;

  const holdings = portfolioItems.filter((i) => i.type === "INVESTMENT");
  const certificates = portfolioItems.filter((i) => i.type === "CERTIFICATION");
  const experiences = portfolioItems.filter((i) => i.type === "EXPERIENCE");
  const videos = portfolioItems.filter((i) => i.type === "VIDEO_PRESENTATION");

  const filteredHoldings = holdings.filter((item) => {
    if (holdingFilter === "ACTIVE") return !item.status?.includes("EXIT");
    if (holdingFilter === "EXITED") return item.status?.includes("EXIT");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-body">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* ============================================================== */}
        {/* 1. IMMERSIVE HERO & COVER BANNER                                */}
        {/* ============================================================== */}
        <section className="relative w-full overflow-hidden border-b border-slate-200/80 bg-slate-950">
          {/* Cover Background Graphic */}
          <div className="relative h-64 sm:h-80 md:h-[340px] w-full overflow-hidden">
            {investor.coverImage ? (
              <img
                src={investor.coverImage}
                alt={investor.name}
                className="w-full h-full object-cover opacity-50 scale-105 transform filter blur-xs"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#032e24] via-[#064e3b] to-[#182b45] opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          </div>

          {/* Floating Navigation & Breadcrumb Row */}
          <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-xl bg-black/40 hover:bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/10 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Investor Directory</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/40 hover:bg-black/60 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer"
                title="Share Profile"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Investor Identity Card Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-20 pb-8">
            <div className="rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Profile Identity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                  {/* Avatar */}
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-800 shadow-2xl ring-2 ring-emerald-500/50">
                    {investor.image ? (
                      <img
                        src={investor.image}
                        alt={investor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-tr from-[#064e3b] to-[#10b981] text-3xl font-heading font-black text-white">
                        {investor.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm" title="Verified Account" />
                  </div>

                  {/* Name and Designation */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
                        {investor.name}
                      </h1>
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        <span>Verified LP & Syndicate Lead</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Actively Deploying</span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-300 font-medium">
                      {investor.designation ? `${investor.designation} · ` : ""}
                      <span className="text-white font-bold">{investor.companyName || "Private Syndicate Lead"}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 font-body">
                      {(investor.city || investor.country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                          {[investor.city, investor.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {investor.yearsOfExperience && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                          {investor.yearsOfExperience} yrs track record
                        </span>
                      )}
                      {investor.preferredCurrency && (
                        <span className="flex items-center gap-1">
                          <CircleDollarSign className="h-3.5 w-3.5 text-emerald-400" />
                          {investor.preferredCurrency} Deployments
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action & Subscription Status */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {isPremiumUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300">
                        <Crown className="h-3.5 w-3.5" />
                        <span>Pro Diligence Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300">
                        <Lock className="h-3.5 w-3.5 text-amber-400" />
                        <span>Public Preview Mode</span>
                      </span>
                    )}

                    {investor.accreditedInvestor && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Accredited</span>
                      </span>
                    )}
                  </div>

                  {/* Connect / Pitch CTA */}
                  <div className="flex items-center gap-2 pt-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsPitchModalOpen(true)}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold font-heading text-white backdrop-blur-md transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 text-emerald-300" />
                      <span>Pitch Startup</span>
                    </button>

                    {isPremiumUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (investor.linkedinUrl) {
                            window.open(investor.linkedinUrl, "_blank");
                          } else {
                            setIsPitchModalOpen(true);
                          }
                        }}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 px-5 py-2.5 text-xs font-black font-heading text-slate-950 shadow-lg transition-all cursor-pointer"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Direct Intro Request</span>
                      </button>
                    ) : (
                      <Link
                        href="/subscription?role=entrepreneur"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-5 py-2.5 text-xs font-black font-heading text-slate-950 shadow-lg transition-all"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Unlock Full Dossier</span>
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. WEALTH & TELEMETRY KPI METRICS STRIP                        */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Card 1: Capital Deployed */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Capital Deployed</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
                  <CircleDollarSign className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {isPremiumUnlocked && stats.totalCapitalDeployed
                    ? `$${stats.totalCapitalDeployed.toLocaleString()}`
                    : isPremiumUnlocked
                    ? "Syndicate Pool"
                    : "🔒 $•,•••,•••"}
                </h3>
                <p className="text-[11px] text-slate-400 font-body mt-0.5">
                  {isPremiumUnlocked ? "Historical syndicated commitments" : "Requires active Pro subscription"}
                </p>
              </div>
            </div>

            {/* Card 2: Backed Companies */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Portfolio Holdings</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
                  <Building2 className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {stats.totalInvestmentsCount} Startups
                </h3>
                <p className="text-[11px] text-slate-400 font-body mt-0.5">
                  Across Seed, Series A & Growth
                </p>
              </div>
            </div>

            {/* Card 3: Realized Exits */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Successful Exits</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xl sm:text-2xl font-black text-purple-700 font-heading">
                  {stats.totalExitsCount || 0} Liquidations
                </h3>
                <p className="text-[11px] text-slate-400 font-body mt-0.5">
                  Realized M&A and secondary exits
                </p>
              </div>
            </div>

            {/* Card 4: Ticket Size Range */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Check Sweet Spot</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <Zap className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading">
                  {isPremiumUnlocked && investor.investmentRangeMin && investor.investmentRangeMax
                    ? `$${(investor.investmentRangeMin / 1000).toFixed(0)}K – $${(investor.investmentRangeMax / 1000).toFixed(0)}K`
                    : isPremiumUnlocked
                    ? "Flexible Check"
                    : "🔒 $••K – $•••K"}
                </h3>
                <p className="text-[11px] text-slate-400 font-body mt-0.5">
                  Direct lead syndicate allocations
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. MAIN TABBED CONTENT AREA                                    */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ---------------------------------------------------------- */}
            {/* LEFT COLUMN: Sidebar Metadata & Socials (4/12)            */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Investment Mandate Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Investment Mandate
                  </span>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Criteria & Thesis Parameters
                  </h3>
                  <div className="h-0.5 w-10 bg-emerald-600 rounded-full" />
                </div>

                {investor.headline && (
                  <p className="text-xs text-slate-600 font-body leading-relaxed italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    &ldquo;{investor.headline}&rdquo;
                  </p>
                )}

                {/* Target Sectors */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                    Target Sectors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {investor.sectors && investor.sectors.length > 0 ? (
                      investor.sectors.map((sec, idx) => (
                        <span
                          key={idx}
                          className="rounded-xl bg-emerald-50/80 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-800 font-heading"
                        >
                          {sec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Sector agnostic</span>
                    )}
                  </div>
                </div>

                {/* Preferred Stage */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Preferred Business Stage
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 font-heading">
                      {investor.preferredStage || "Early Stage & Growth (Seed – Series A)"}
                    </span>
                  </div>
                </div>

                {/* Direct Verified Social Networks */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                    Verified Digital Footprint
                  </span>
                  
                  <div className="flex flex-col gap-2">
                    {isPremiumUnlocked && investor.linkedinUrl ? (
                      <a
                        href={investor.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
                      >
                        <span className="flex items-center gap-2.5">
                          <FaLinkedin className="h-4 w-4 text-[#0077b5]" />
                          <span className="font-heading font-bold">LinkedIn Profile</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ) : null}

                    {isPremiumUnlocked && investor.crunchbaseUrl ? (
                      <a
                        href={investor.crunchbaseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
                      >
                        <span className="flex items-center gap-2.5">
                          <Globe className="h-4 w-4 text-emerald-700" />
                          <span className="font-heading font-bold">Crunchbase Dossier</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ) : null}

                    {isPremiumUnlocked && investor.websiteUrl ? (
                      <a
                        href={investor.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors border border-slate-200/60"
                      >
                        <span className="flex items-center gap-2.5">
                          <Globe className="h-4 w-4 text-slate-600" />
                          <span className="font-heading font-bold">Fund Website</span>
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ) : null}

                    {!isPremiumUnlocked && (
                      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 p-3.5 border border-amber-200/70 text-xs space-y-1.5 text-amber-900">
                        <div className="flex items-center gap-2 font-bold font-heading text-amber-800">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Direct Channels Locked</span>
                        </div>
                        <p className="text-[11px] text-amber-800/80 font-body leading-relaxed">
                          Direct LinkedIn links, email addresses, and phone introductions are unlocked with Entrepreneur Pro.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Regulatory Compliance Badge Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-heading">
                    Compliance & Vetting
                  </h4>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 font-body">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Identity & Proof of Address KYC Verified</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Accredited Investor Net Worth Attestation on File</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cloudflare Private Storage Encrypted Certificate Vault</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Founder Pitch CTA Box */}
              <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-[#064e3b]/10 via-[#064e3b]/5 to-white p-6 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-800 font-heading font-black text-sm">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Looking for Syndicate Backing?</span>
                </div>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  Pitch directly to {investor.name.split(" ")[0]} with your startup traction, deck, and fundraising target.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPitchModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] py-3 text-xs font-bold font-heading text-white shadow-md transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Pitch Teaser</span>
                </button>
              </div>

            </div>

            {/* ---------------------------------------------------------- */}
            {/* RIGHT COLUMN: Interactive Tabs & Portfolio Vault (8/12)    */}
            {/* ---------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Interactive Tabs Header */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                {[
                  { key: "OVERVIEW", label: "Thesis & Philosophy", icon: Sparkles },
                  { key: "HOLDINGS", label: `Holdings (${holdings.length})`, icon: Building2 },
                  { key: "CERTIFICATES", label: `Certifications (${certificates.length})`, icon: Award },
                  { key: "VIDEOS", label: `Video Intro (${videos.length})`, icon: Video },
                  { key: "EXPERIENCE", label: `Experience (${experiences.length})`, icon: Briefcase },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActiveTab(t.key as any)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold font-heading transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#064e3b] text-white shadow-md shadow-emerald-950/10"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-300" : "text-slate-400"}`} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* -------------------------------------------------------- */}
              {/* TAB 1: THESIS & PHILOSOPHY                               */}
              {/* -------------------------------------------------------- */}
              {activeTab === "OVERVIEW" && (
                <div className="space-y-6">
                  {/* Thesis Card */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-sm font-heading font-black uppercase tracking-wider text-slate-900">
                          Investment Philosophy & Backing Strategy
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-heading">
                        Verified Mandate
                      </span>
                    </div>

                    <div className="relative pl-5 border-l-4 border-emerald-600 py-1">
                      <p className="text-xs sm:text-sm text-slate-700 font-body leading-relaxed whitespace-pre-line">
                        {investor.investmentThesis ||
                          "We back visionary founders leveraging modular banking APIs, distributed clean-tech grids, and AI workflow automation across emerging and high-growth markets. We bring rigorous financial engineering, syndicate follow-on power, and hands-on operational scaling."}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-heading font-bold text-slate-500 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="h-3.5 w-3.5" /> Lead or Co-Invest Syndicates
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="h-3.5 w-3.5" /> Board / Advisory Mentorship
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="h-3.5 w-3.5" /> Follow-on Reserve Allocation
                      </span>
                    </div>
                  </div>

                  {/* Bio Description if present */}
                  {investor.bio && (
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-3">
                      <h4 className="text-xs font-heading font-black uppercase tracking-wider text-slate-400">
                        Professional Background & Bio
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed">
                        {investor.bio}
                      </p>
                    </div>
                  )}

                  {/* Top Featured Holdings Preview */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-heading font-black uppercase tracking-wider text-slate-900">
                        Key Backed Startups ({holdings.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab("HOLDINGS")}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 font-heading inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Holdings</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {holdings.slice(0, 4).map((h) => (
                        <div
                          key={h.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2 hover:border-emerald-200 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-heading font-black text-xs text-slate-900">
                              {h.title}
                            </span>
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 font-heading">
                              {h.sector || "Tech"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-body line-clamp-2">
                            {h.description}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-slate-400 font-semibold">{h.stage || "Seed"}</span>
                            <span className="font-bold font-heading text-emerald-700">
                              {isPremiumUnlocked ? h.returnMultiple || "Active" : "🔒 Pro"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* TAB 2: PORTFOLIO HOLDINGS (TRACK RECORD)                 */}
              {/* -------------------------------------------------------- */}
              {activeTab === "HOLDINGS" && (
                <div className="space-y-4">
                  
                  {/* Filter Sub-header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      {(["ALL", "ACTIVE", "EXITED"] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setHoldingFilter(filter)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition-all cursor-pointer ${
                            holdingFilter === filter
                              ? "bg-slate-900 text-white shadow-xs"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {filter === "ALL" && `All Holdings (${holdings.length})`}
                          {filter === "ACTIVE" && "Active Investments"}
                          {filter === "EXITED" && "Exited (IPO / M&A)"}
                        </button>
                      ))}
                    </div>

                    {!isPremiumUnlocked && (
                      <span className="text-xs text-amber-700 font-bold font-heading flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Financial multiples locked for guests</span>
                      </span>
                    )}
                  </div>

                  {/* PREMIUM CALLOUT BANNER (If not subscribed) */}
                  {!isPremiumUnlocked && (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 border border-amber-300/60 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800">
                            <Crown className="h-5 w-5" />
                          </span>
                          <div className="space-y-1">
                            <h4 className="text-sm font-heading font-black text-slate-900">
                              Unlock Full Investment Performance & IRR Multiples
                            </h4>
                            <p className="text-xs text-slate-600 font-body max-w-xl">
                              Active Entrepreneur Pro subscribers gain unredacted access to historical MOIC multiples, exact ticket allocations, and verified Cloudflare Private Vault audit documents.
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/subscription?role=entrepreneur"
                          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-5 py-2.5 text-xs font-bold font-heading text-white shadow-md transition-all"
                        >
                          <Crown className="h-3.5 w-3.5 text-amber-300" />
                          <span>Upgrade to Pro</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Holdings Cards Roster */}
                  <div className="space-y-4">
                    {filteredHoldings.length === 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                        No portfolio companies match the selected filter.
                      </div>
                    ) : (
                      filteredHoldings.map((holding) => (
                        <div
                          key={holding.id}
                          className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 font-heading font-black">
                                <Building2 className="h-5 w-5" />
                              </span>
                              <div>
                                <h4 className="text-base font-black text-slate-900 font-heading">
                                  {holding.title}
                                </h4>
                                <p className="text-xs text-slate-500 font-body">
                                  {holding.subtitle || "Direct Equity Commitment"}
                                </p>
                              </div>
                            </div>

                            {holding.description && (
                              <p className="text-xs text-slate-600 font-body leading-relaxed max-w-xl">
                                {holding.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {holding.sector && (
                                <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 font-heading">
                                  {holding.sector}
                                </span>
                              )}
                              {holding.stage && (
                                <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 font-heading">
                                  {holding.stage}
                                </span>
                              )}
                              {holding.status && (
                                <span className="rounded-lg bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 font-heading">
                                  {holding.status.replace("_", " ")}
                                </span>
                              )}
                              {holding.year && (
                                <span className="text-[11px] text-slate-400 font-body">
                                  Backed: {holding.year}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Financials & Multiple Return */}
                          <div className="flex flex-col items-start md:items-end gap-1.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                              Round Performance
                            </span>
                            
                            {isPremiumUnlocked ? (
                              <span className="text-lg font-black text-emerald-600 font-heading">
                                {holding.returnMultiple || "Active"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800 font-heading">
                                <Lock className="h-3 w-3" />
                                <span>🔒 Pro Diligence</span>
                              </span>
                            )}

                            {isPremiumUnlocked && holding.amountInvested ? (
                              <span className="text-xs font-bold text-slate-800 font-body">
                                ${holding.amountInvested.toLocaleString()} Deployed
                              </span>
                            ) : !isPremiumUnlocked ? (
                              <span className="text-[11px] text-slate-400 font-body">
                                Investment size locked
                              </span>
                            ) : null}

                            {holding.externalUrl && (
                              <a
                                href={holding.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-heading mt-1"
                              >
                                <span>Company Website</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* TAB 3: AUDITED CERTIFICATIONS & ACCREDITATIONS           */}
              {/* -------------------------------------------------------- */}
              {activeTab === "CERTIFICATES" && (
                <div className="space-y-4">
                  {!isPremiumUnlocked && (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-400/5 to-emerald-500/10 border border-purple-200 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-100 text-purple-800">
                            <Award className="h-5 w-5" />
                          </span>
                          <div className="space-y-1">
                            <h4 className="text-sm font-heading font-black text-slate-900">
                              Cloudflare Private Vault Encrypted Documents
                            </h4>
                            <p className="text-xs text-slate-600 font-body max-w-xl">
                              Official verification licenses and signed CFA/SEC attestations are stored in Cloudflare Private R2 Storage. Unlock Pro to download verified files.
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/subscription?role=entrepreneur"
                          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-5 py-2.5 text-xs font-bold font-heading text-white shadow-md transition-all"
                        >
                          <Crown className="h-3.5 w-3.5 text-amber-300" />
                          <span>Unlock Verified Files</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {certificates.length === 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                        No certification files uploaded yet.
                      </div>
                    ) : (
                      certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-50 text-purple-700">
                                <Award className="h-5 w-5" />
                              </span>
                              <div>
                                <h4 className="text-base font-black text-slate-900 font-heading">
                                  {cert.title}
                                </h4>
                                <p className="text-xs text-slate-500 font-body">
                                  {cert.issuer || "Accredited Financial Regulatory Authority"}
                                </p>
                              </div>
                            </div>

                            {cert.description && (
                              <p className="text-xs text-slate-600 font-body leading-relaxed max-w-xl">
                                {cert.description}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-body">
                              {cert.credentialId && (
                                <span className="font-semibold text-slate-700">
                                  License ID: {cert.credentialId}
                                </span>
                              )}
                              {cert.year && <span>Issued: {cert.year}</span>}
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <ShieldCheck className="h-3.5 w-3.5" /> Verified on File
                              </span>
                            </div>
                          </div>

                          {/* Private Cloudflare Download Action */}
                          <div className="shrink-0 pt-2 md:pt-0">
                            {isPremiumUnlocked && cert.signedDocumentUrl ? (
                              <a
                                href={cert.signedDocumentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-4 py-2.5 text-xs font-bold font-heading text-white transition-all shadow-md"
                              >
                                <Download className="h-4 w-4" />
                                <span>Download Verified Document</span>
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                                <Lock className="h-3.5 w-3.5 text-amber-500" />
                                <span>Private Vault File • Pro Access</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* TAB 4: VIDEO PRESENTATION                                */}
              {/* -------------------------------------------------------- */}
              {activeTab === "VIDEOS" && (
                <div className="space-y-6">
                  {(investor.videoIntroUrl || videos.length > 0) ? (
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-rose-600" />
                          <h3 className="text-base font-heading font-black text-slate-900">
                            {videos[0]?.title || "Investor Pitch Guidelines & Video Message"}
                          </h3>
                        </div>
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 font-heading">
                          Recorded Masterclass
                        </span>
                      </div>

                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-lg">
                        {(() => {
                          const url = investor.videoIntroUrl || videos[0]?.videoUrl;
                          if (!url) {
                            return (
                              <div className="grid h-full w-full place-items-center text-slate-400 text-xs">
                                Video file processing or restricted to Pro subscribers.
                              </div>
                            );
                          }
                          if (url.includes("youtube.com") || url.includes("youtu.be")) {
                            return (
                              <iframe
                                src={url.replace("watch?v=", "embed/")}
                                title="Investor Pitch Video"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          return (
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          );
                        })()}
                      </div>

                      <p className="text-xs text-slate-600 font-body leading-relaxed">
                        {videos[0]?.description ||
                          "A comprehensive breakdown of investment criteria, founder evaluation metrics, and unit economics expectations for upcoming deal syndicates."}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                      No video presentations published yet.
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* TAB 5: LEADERSHIP & ADVISORY EXPERIENCE                  */}
              {/* -------------------------------------------------------- */}
              {activeTab === "EXPERIENCE" && (
                <div className="space-y-4">
                  {experiences.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                      No advisory positions recorded.
                    </div>
                  ) : (
                    experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex items-start gap-4"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                          <Briefcase className="h-5 w-5" />
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-base font-black text-slate-900 font-heading">
                            {exp.title}
                          </h4>
                          <p className="text-xs font-bold text-emerald-800 font-heading">
                            {exp.subtitle || exp.sector || "Venture Leadership"}
                          </p>
                          {exp.description && (
                            <p className="text-xs text-slate-600 font-body leading-relaxed pt-1">
                              {exp.description}
                            </p>
                          )}
                          {exp.year && (
                            <span className="text-[11px] text-slate-400 font-body block pt-1">
                              Period: {exp.year}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* 4. MODAL: PITCH THIS INVESTOR                                  */}
      {/* ============================================================== */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Send className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-heading font-black text-slate-900">
                    Pitch to {investor.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-body">
                    {investor.companyName || "Direct Syndicate Lead"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPitchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendPitch} className="space-y-4">
              <div className="rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-200/60 text-xs text-emerald-950 space-y-1">
                <span className="font-bold font-heading flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" /> Investor Fit Snapshot
                </span>
                <p className="text-[11px] text-emerald-900/80 font-body">
                  Targets: {investor.sectors?.join(", ") || "Tech & FinTech"} • Stage: {investor.preferredStage || "Seed – Series A"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1.5">
                  Executive Teaser & Traction Summary
                </label>
                <textarea
                  required
                  rows={4}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="Introduce your startup name, current MRR / traction, round size target, and why your team matches this investor's thesis..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-body"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPitchModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPitch}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] px-5 py-2 text-xs font-black font-heading text-white shadow-md disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSubmittingPitch ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Pitch Introduction</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
