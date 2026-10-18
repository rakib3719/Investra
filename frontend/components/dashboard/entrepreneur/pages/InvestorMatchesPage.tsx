"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Crown,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Handshake,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UploadCloud,
  UserCheck,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  listVerifiedInvestors,
  createIntroRequest,
  getMySentIntros,
  type CreateIntroRequestPayload,
  type InvestorIntroRequestItem,
} from "@/lib/api/portfolio";
import { uploadMediaPipeline } from "@/lib/api/media";
import { useMySubscriptionQuery } from "@/lib/admin/admin-subscription-hooks";
import { toast } from "@/lib/toast";

export function InvestorMatchesPage() {
  const [activeMainTab, setActiveMainTab] = useState<"EXPLORE" | "SENT_INTROS">("EXPLORE");
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<any[]>([]);
  const [sentIntros, setSentIntros] = useState<InvestorIntroRequestItem[]>([]);
  const [loadingSent, setLoadingSent] = useState(false);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");

  // Modals state
  const [selectedInvestor, setSelectedInvestor] = useState<any | null>(null);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [startupName, setStartupName] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [businessOverview, setBusinessOverview] = useState("");
  const [targetSector, setTargetSector] = useState("FinTech");
  const [roundStage, setRoundStage] = useState("Seed");
  const [raisingAmount, setRaisingAmount] = useState("$250,000");
  const [deckUrl, setDeckUrl] = useState("");
  const [deckMode, setDeckMode] = useState<"URL" | "UPLOAD">("URL");
  const [deckUploadedFileName, setDeckUploadedFileName] = useState<string | null>(null);
  const [deckUploadProgress, setDeckUploadProgress] = useState<number | null>(null);
  const [isUploadingDeck, setIsUploadingDeck] = useState(false);
  const [deckDragOver, setDeckDragOver] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleDeckFileUpload = async (file: File) => {
    try {
      setIsUploadingDeck(true);
      setDeckUploadProgress(15);
      setDeckUploadedFileName(file.name);

      const confirmed = await uploadMediaPipeline(
        file,
        "PITCH_DECK",
        (progress) => setDeckUploadProgress(Math.min(95, progress))
      );

      setDeckUploadProgress(100);
      if (confirmed.url) {
        setDeckUrl(confirmed.url);
      } else {
        setDeckUrl(`/api/v1/media/${confirmed.id}/signed-url`);
      }
      toast.success("Pitch deck file uploaded successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload pitch deck file.");
      setDeckUploadedFileName(null);
    } finally {
      setIsUploadingDeck(false);
      setTimeout(() => setDeckUploadProgress(null), 1200);
    }
  };

  // Check subscription query
  const subQuery = useMySubscriptionQuery();
  const subscription = subQuery.data;
  const isSubscriber = subscription?.status === "ACTIVE";

  useEffect(() => {
    fetchInvestors();
    fetchSentIntros();
  }, []);

  useEffect(() => {
    if (activeMainTab === "SENT_INTROS") {
      fetchSentIntros();
    }
  }, [activeMainTab]);

  async function fetchInvestors() {
    try {
      setLoading(true);
      const res = await listVerifiedInvestors({ limit: 50 });
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setInvestors(items);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load investor matches.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSentIntros() {
    try {
      setLoadingSent(true);
      const res = await getMySentIntros();
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setSentIntros(items);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load sent intros.");
    } finally {
      setLoadingSent(false);
    }
  }

  const handleRequestIntroClick = (inv: any) => {
    if (!isSubscriber) {
      setSelectedInvestor(inv);
      setIsSubModalOpen(true);
      return;
    }

    setSelectedInvestor(inv);
    // Preset defaults
    setStartupName("");
    setPitchMessage("");
    setBusinessOverview("");
    setTargetSector(inv.sectors?.[0] || "FinTech");
    setRoundStage("Seed");
    setRaisingAmount("$250,000");
    setDeckUrl("");
    setDeckMode("URL");
    setDeckUploadedFileName(null);
    setDeckUploadProgress(null);
    setWebsiteUrl("");
    setContactEmail("");
    setContactPhone("");
    setIsIntroModalOpen(true);
  };

  const handleSubmitIntro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestor) return;

    if (!startupName.trim() || !pitchMessage.trim()) {
      toast.error("Please fill in your startup name and pitch introduction message.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreateIntroRequestPayload = {
        investorId: selectedInvestor.userId || selectedInvestor.id,
        startupName: startupName.trim(),
        pitchMessage: pitchMessage.trim(),
        businessOverview: businessOverview.trim() || undefined,
        targetSector: targetSector.trim() || undefined,
        roundStage: roundStage || undefined,
        raisingAmount: raisingAmount.trim() || undefined,
        deckUrl: deckUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
      };

      await createIntroRequest(payload);
      toast.success(`Direct pitch introduction submitted to ${selectedInvestor.name}!`);
      setIsIntroModalOpen(false);
      if (activeMainTab === "SENT_INTROS") {
        fetchSentIntros();
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit introduction. You may need an active Pro subscription."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered investors
  const filteredInvestors = investors.filter((inv) => {
    const matchesSearch =
      searchQuery === "" ||
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.companyName && inv.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.headline && inv.headline.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector =
      selectedSector === "ALL" ||
      (inv.sectors && inv.sectors.some((s: string) => s.toLowerCase() === selectedSector.toLowerCase()));

    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 pb-16 font-body text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. TOP HERO & DEAL PIPELINE BANNER                             */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032e24] via-[#064e3b] to-[#182b45] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold font-heading text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span>Accredited Investor Dealflow Matchmaker</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Connect with Verified Angels & Syndicate Leads
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-body">
              Browse verified institutional and angel investors, review their investment thesis and past portfolio holdings,
              and request direct syndicated introductions with your startup pitch.
            </p>
          </div>

          {/* Subscription Status Card */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {isSubscriber ? (
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold font-heading text-amber-300">
                  <Crown className="h-4 w-4" />
                  <span>Entrepreneur Pro Active</span>
                </div>
                <p className="text-[11px] text-emerald-100 font-body">
                  Unlimited direct introductions & signed diligence data room access.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 p-4 text-xs space-y-2 max-w-xs">
                <div className="flex items-center gap-2 font-bold font-heading text-amber-200">
                  <Lock className="h-4 w-4 text-amber-300" />
                  <span>Pro Intros Locked</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 font-body leading-relaxed">
                  Direct introductions to accredited investors require an active Pro subscription.
                </p>
                <Link
                  href="/subscription?role=entrepreneur"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-1.5 text-xs font-black font-heading shadow-md hover:from-amber-300 hover:to-amber-400 transition-all"
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span>Upgrade to Pro</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Deal Updates Notification Alert (if investor accepted or declined) */}
      {sentIntros.some((i) => i.status === "ACCEPTED" || i.status === "DECLINED") && (
        <div className="space-y-3">
          {sentIntros
            .filter((i) => i.status === "ACCEPTED")
            .map((intro) => (
              <div
                key={intro.id}
                className="rounded-3xl bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 p-5 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-400/40"
              >
                <div className="flex items-start gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                    <Handshake className="h-6 w-6 text-emerald-300" />
                  </span>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200 font-heading mb-1 border border-emerald-400/30">
                      <Sparkles className="h-3 w-3" /> Pitch Accepted by Investor!
                    </div>
                    <h4 className="text-base font-black font-heading text-white">
                      {intro.investor?.firstName} {intro.investor?.lastName} has accepted your pitch for {intro.startupName}!
                    </h4>
                    {intro.investorFeedback && (
                      <p className="text-xs text-emerald-100 font-body italic mt-0.5">
                        &ldquo;{intro.investorFeedback}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMainTab("SENT_INTROS")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-950 font-black font-heading text-xs px-4 py-2.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>View Deal Dossier</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-800" />
                  </button>
                </div>
              </div>
            ))}

          {sentIntros
            .filter((i) => i.status === "DECLINED")
            .map((intro) => (
              <div
                key={intro.id}
                className="rounded-3xl bg-rose-50 border border-rose-200/90 p-4 text-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                    <XCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black font-heading text-rose-950">
                      Pitch Update: {intro.investor?.firstName || "Investor"} passed on {intro.startupName}
                    </h4>
                    {intro.investorFeedback ? (
                      <p className="text-[11px] text-slate-600 font-body italic line-clamp-1 mt-0.5">
                        Feedback: &ldquo;{intro.investorFeedback}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 font-body mt-0.5">
                        The investor reviewed your submission and decided to pass at this stage.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMainTab("SENT_INTROS")}
                  className="shrink-0 text-xs font-bold font-heading text-rose-700 hover:text-rose-900 underline cursor-pointer"
                >
                  Read Full Response →
                </button>
              </div>
            ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MAIN TABS SWITCHER (EXPLORE vs SENT INTROS)                 */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveMainTab("EXPLORE")}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold font-heading transition-all cursor-pointer ${
            activeMainTab === "EXPLORE"
              ? "bg-[#064e3b] text-white shadow-md shadow-emerald-950/10"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Verified Investors ({investors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab("SENT_INTROS")}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold font-heading transition-all cursor-pointer ${
            activeMainTab === "SENT_INTROS"
              ? "bg-[#064e3b] text-white shadow-md shadow-emerald-950/10"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Sent Introductions</span>
          {sentIntros.length > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                sentIntros.some((i) => i.status === "ACCEPTED")
                  ? "bg-emerald-600 text-white animate-pulse"
                  : sentIntros.some((i) => i.status === "DECLINED")
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {sentIntros.length}
              {sentIntros.some((i) => i.status === "ACCEPTED") && " • Accepted"}
              {!sentIntros.some((i) => i.status === "ACCEPTED") &&
                sentIntros.some((i) => i.status === "DECLINED") &&
                " • Responded"}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: EXPLORE INVESTORS                                        */}
      {/* ============================================================== */}
      {activeMainTab === "EXPLORE" && (
        <div className="space-y-6">
          {/* Search & Sector Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search investors by partner name, syndicate, or thesis..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all font-body"
              />
            </div>

            {/* Quick Sector Filter Dropdown / Pills */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {["ALL", "FinTech", "CleanTech", "SaaS", "AI & Automation", "AgriTech"].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading whitespace-nowrap transition-all cursor-pointer ${
                    selectedSector === sec
                      ? "bg-[#064e3b] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {sec === "ALL" ? "All Sectors" : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Investors Grid */}
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-700" />
              <p className="text-xs text-slate-500 font-body">Matching verified accredited investors...</p>
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
              <Building2 className="h-10 w-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900 font-heading">
                No verified investors match your filters
              </h4>
              <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
                Try clearing your search query or selecting &quot;All Sectors&quot; to discover more leads.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredInvestors.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 transition-all hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50">
                          {inv.image ? (
                            <img
                              src={inv.image}
                              alt={inv.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-gradient-to-tr from-[#064e3b] to-[#10b981] text-lg font-heading font-black text-white">
                              {inv.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Verified Account" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="text-base font-black text-slate-900 font-heading">
                              {inv.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-500/20">
                              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Verified Investor</span>
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500">
                            {inv.designation ? `${inv.designation} · ` : ""}
                            <span className="text-slate-800 font-bold">{inv.companyName || "Syndicate Lead"}</span>
                          </p>
                          {inv.location && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-emerald-600" />
                              <span>{inv.location}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 font-heading shrink-0">
                        {inv.totalInvestmentsCount || inv.portfolioCount || 8} Holdings
                      </span>
                    </div>

                    {/* Headline / Thesis Preview */}
                    {inv.headline && (
                      <p className="text-xs text-slate-600 font-body line-clamp-2 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                        &ldquo;{inv.headline}&rdquo;
                      </p>
                    )}

                    {/* Focus Sectors */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                        Target Sectors & Stage
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {inv.sectors && inv.sectors.length > 0 ? (
                          inv.sectors.slice(0, 4).map((sec: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 font-heading"
                            >
                              {sec}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400">Sector agnostic</span>
                        )}
                        {inv.preferredStage && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 font-heading">
                            {inv.preferredStage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/investors/${inv.userId || inv.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-bold font-heading text-slate-700 hover:text-emerald-800 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>View Full Profile</span>
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </Link>

                    {(() => {
                      const existingIntro = sentIntros.find(
                        (intro) =>
                          intro.investorId === inv.userId || intro.investorProfileId === inv.id
                      );

                      if (existingIntro?.status === "ACCEPTED") {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 text-xs font-bold font-heading">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                              <span>Pitch Accepted!</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveMainTab("SENT_INTROS")}
                              className="text-xs font-bold font-heading text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                            >
                              View Meeting Note →
                            </button>
                          </div>
                        );
                      }

                      if (existingIntro?.status === "DECLINED") {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-100 text-rose-900 border border-rose-200 px-3 py-1.5 text-xs font-bold font-heading">
                              <XCircle className="h-3.5 w-3.5 text-rose-600" />
                              <span>Pitch Declined</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveMainTab("SENT_INTROS")}
                              className="text-xs font-bold font-heading text-rose-700 hover:text-rose-900 underline cursor-pointer"
                            >
                              View Feedback →
                            </button>
                          </div>
                        );
                      }

                      if (existingIntro?.status === "PENDING" || existingIntro?.status === "REVIEWED") {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 text-xs font-bold font-heading">
                              <Clock className="h-3.5 w-3.5 text-amber-700" />
                              <span>Pitch Under Review</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveMainTab("SENT_INTROS")}
                              className="text-xs font-bold font-heading text-slate-600 hover:text-slate-900 underline cursor-pointer"
                            >
                              View Details →
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          type="button"
                          onClick={() => handleRequestIntroClick(inv)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] px-4 py-2 text-xs font-bold font-heading text-white shadow-md transition-all cursor-pointer"
                        >
                          {isSubscriber ? (
                            <>
                              <Send className="h-3.5 w-3.5 text-emerald-300" />
                              <span>Request Intro</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-amber-300" />
                              <span>Request Intro (Pro)</span>
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SENT INTRODUCTIONS                                      */}
      {/* ============================================================== */}
      {activeMainTab === "SENT_INTROS" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-heading font-black text-slate-900">
                Your Direct Pitch Submissions
              </h3>
              <p className="text-xs text-slate-500 font-body">
                Track status, feedback, and meeting requests from verified investors.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchSentIntros}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`h-4 w-4 ${loadingSent ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loadingSent ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-700" />
              <p className="text-xs text-slate-500 font-body">Loading your submitted intros...</p>
            </div>
          ) : sentIntros.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
              <Send className="h-10 w-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900 font-heading">
                No introductions sent yet
              </h4>
              <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
                Explore the verified investors tab and submit your first pitch teaser to start raising capital.
              </p>
              <button
                type="button"
                onClick={() => setActiveMainTab("EXPLORE")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] text-white px-4 py-2 text-xs font-bold font-heading hover:bg-[#043d2e] shadow-md transition-all cursor-pointer"
              >
                <span>Browse Investors</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sentIntros.map((intro) => (
                <div
                  key={intro.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-heading font-black">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 font-heading">
                          {intro.startupName}
                        </h4>
                        <p className="text-xs text-slate-500 font-body">
                          Pitched to: <span className="font-bold text-slate-800">{intro.investor?.firstName} {intro.investor?.lastName}</span>
                          {intro.investorProfile?.companyName && ` (${intro.investorProfile.companyName})`}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-heading ${
                        intro.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : intro.status === "DECLINED"
                          ? "bg-rose-100 text-rose-900 border border-rose-200"
                          : intro.status === "REVIEWED"
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : "bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{intro.status}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <p className="font-body leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {intro.pitchMessage}
                    </p>

                    {intro.businessOverview && (
                      <p className="text-slate-500 font-body italic text-[11px]">
                        Business Overview: {intro.businessOverview}
                      </p>
                    )}
                  </div>

                  {/* Detailed Investor Decision & Feedback Section */}
                  {intro.status === "ACCEPTED" ? (
                    <div className="rounded-2xl bg-emerald-50/90 p-4 border border-emerald-300 text-xs space-y-2 text-emerald-950 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-heading flex items-center gap-1.5 text-emerald-900 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Pitch Accepted by Investor!</span>
                        </span>
                        {intro.investor?.email && (
                          <a
                            href={`mailto:${intro.investor.email}?subject=Next Steps: ${encodeURIComponent(
                              intro.startupName
                            )} & Syndicate Review`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] text-white px-3 py-1.5 text-[11px] font-bold font-heading shadow-xs transition-all"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email Investor</span>
                          </a>
                        )}
                      </div>
                      <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-body">
                        <p className="text-[11px] font-bold text-emerald-900 font-heading mb-0.5">
                          Investor Meeting & Diligence Note:
                        </p>
                        <p className="italic text-slate-800 leading-relaxed">
                          &ldquo;{intro.investorFeedback || "Your pitch proposal has been accepted! The investor has marked your startup for introductory call scheduling."}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : intro.status === "DECLINED" ? (
                    <div className="rounded-2xl bg-rose-50/90 p-4 border border-rose-200 text-xs space-y-2 text-rose-950 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-heading flex items-center gap-1.5 text-rose-900 text-sm">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          <span>Pitch Declined by Investor</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-heading">
                          Decision Final
                        </span>
                      </div>
                      <div className="bg-white/90 p-3 rounded-xl border border-rose-200 font-body">
                        <p className="text-[11px] font-bold text-rose-900 font-heading mb-0.5">
                          Investor Feedback & Reason:
                        </p>
                        <p className="italic text-slate-800 leading-relaxed">
                          &ldquo;{intro.investorFeedback || "The investor has reviewed your presentation and decided to pass at this stage as it does not align with their active check size or syndicate thesis."}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : intro.status === "REVIEWED" ? (
                    <div className="rounded-2xl bg-blue-50/90 p-3.5 border border-blue-200 text-xs flex items-center gap-2.5 text-blue-900">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                      <div className="space-y-0.5">
                        <span className="font-bold font-heading block text-blue-950">Pitch Deck Under Active Review</span>
                        <p className="text-[11px] text-blue-800 font-body">
                          The investor opened your pitch deck. You will be notified once they accept or deliver constructive feedback.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-amber-50/80 p-3 border border-amber-200/80 text-xs flex items-center gap-2 text-amber-900">
                      <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span className="font-body text-[11px]">
                        Pitch delivered directly to investor's private dealflow queue (72-hour guaranteed SLA).
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 font-body">
                    <div className="flex items-center gap-3">
                      {intro.raisingAmount && (
                        <span className="font-bold text-slate-700 font-heading">
                          Target: {intro.raisingAmount}
                        </span>
                      )}
                      {intro.roundStage && <span>Stage: {intro.roundStage}</span>}
                      {intro.targetSector && <span>Sector: {intro.targetSector}</span>}
                    </div>
                    <span>Submitted: {new Date(intro.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MODAL: REQUEST INTRO & PITCH SUBMISSION FORM                */}
      {/* ============================================================== */}
      {isIntroModalOpen && selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 grid place-items-center font-heading font-black">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Request Introduction
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    Pitch directly to <span className="font-bold text-slate-800">{selectedInvestor.name}</span> ({selectedInvestor.companyName || "Syndicate Lead"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIntroModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIntro} className="space-y-4">
              
              {/* Startup Name */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Startup / Venture Name *
                </label>
                <input
                  type="text"
                  required
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  placeholder="e.g. EcoCharge Technologies, Apex Banking"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                />
              </div>

              {/* Target Sector & Round Stage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                    Sector / Industry
                  </label>
                  <input
                    type="text"
                    value={targetSector}
                    onChange={(e) => setTargetSector(e.target.value)}
                    placeholder="e.g. FinTech, SaaS, CleanTech"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                    Funding Round
                  </label>
                  <select
                    value={roundStage}
                    onChange={(e) => setRoundStage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
              </div>

              {/* Target Raising Amount */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Target Raising Amount
                </label>
                <input
                  type="text"
                  value={raisingAmount}
                  onChange={(e) => setRaisingAmount(e.target.value)}
                  placeholder="e.g. $500,000 or $1.2M"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                />
              </div>

              {/* Pitch Message & Teaser */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Introduction Pitch & Value Proposition *
                </label>
                <textarea
                  required
                  rows={4}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="Summarize your problem, solution, unique moat, current traction (e.g. $25k MRR, 18% MoM growth), and why this investor is an ideal syndicate fit..."
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body leading-relaxed"
                />
              </div>

              {/* Business Overview & Unit Economics */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Business Model & Customers
                </label>
                <textarea
                  rows={2}
                  value={businessOverview}
                  onChange={(e) => setBusinessOverview(e.target.value)}
                  placeholder="Briefly explain your monetization model, customer acquisition cost, or distribution channels..."
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                />
              </div>

              {/* Pitch Deck: URL or File Upload */}
              <div className="space-y-2 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-heading text-slate-800 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-emerald-700" />
                    <span>Pitch Deck (URL or Direct Upload)</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setDeckMode("URL")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-heading transition-all cursor-pointer ${
                        deckMode === "URL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Paste URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeckMode("UPLOAD")}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-heading transition-all cursor-pointer ${
                        deckMode === "UPLOAD" ? "bg-[#064e3b] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Upload File (PDF/PPT)
                    </button>
                  </div>
                </div>

                {deckMode === "URL" ? (
                  <div>
                    <input
                      type="url"
                      value={deckUrl}
                      onChange={(e) => setDeckUrl(e.target.value)}
                      placeholder="https://docsend.com/view/... or Pitch.com or Google Drive link"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-body">
                      Paste a shareable link to your DocSend, Pitch, Notion, or Google Drive deck.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDeckDragOver(true);
                      }}
                      onDragLeave={() => setDeckDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDeckDragOver(false);
                        if (e.dataTransfer.files?.[0]) handleDeckFileUpload(e.dataTransfer.files[0]);
                      }}
                      className={`relative rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
                        deckDragOver ? "border-emerald-600 bg-emerald-50" : "border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold font-heading text-slate-800 mt-1">
                        {isUploadingDeck ? "Uploading to Cloudflare R2 Vault..." : "Drop Pitch Deck PDF/PPTX here"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-body">
                        PDF or PowerPoint up to 50MB. Stored securely and delivered to this investor.
                      </p>
                      <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs font-bold font-heading text-slate-700">
                        <span>Choose Deck File</span>
                        <input
                          type="file"
                          accept=".pdf,.ppt,.pptx,application/pdf"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleDeckFileUpload(e.target.files[0]);
                          }}
                          disabled={isUploadingDeck}
                          className="hidden"
                        />
                      </label>

                      {deckUploadedFileName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 font-heading">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                          <span>{deckUploadedFileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setDeckUrl("");
                              setDeckUploadedFileName(null);
                            }}
                            className="text-emerald-700 hover:text-emerald-950 ml-1 font-bold cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {deckUploadProgress !== null && (
                        <div className="w-full max-w-xs mx-auto bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-emerald-600 h-full transition-all duration-300"
                            style={{ width: `${deckUploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Company Website Link */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Company Website / Demo Link
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://startup.com or interactive demo"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                />
              </div>

              {/* Direct Founder Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIntroModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] px-6 py-2 text-xs font-black font-heading text-white shadow-md disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Pitch...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Send Direct Pitch</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: PRO SUBSCRIPTION REQUIREMENT MODAL                   */}
      {/* ============================================================== */}
      {isSubModalOpen && selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-amber-200 text-center space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200">
              <Crown className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-heading">
                Pro Entitlement Required
              </span>
              <h3 className="text-xl font-heading font-black text-slate-900 mt-2">
                Upgrade to Request Investor Intros
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-body leading-relaxed max-w-xs mx-auto">
              Direct introductions and unredacted pitch submissions to accredited investors like <span className="font-bold text-slate-800">{selectedInvestor.name}</span> are exclusively available on the Entrepreneur Pro plan.
            </p>

            <div className="rounded-2xl bg-slate-50 p-3.5 text-xs text-left space-y-2 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-semibold font-body">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited direct pitch requests to all accredited LPs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold font-body">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Cloudflare Private Vault signed document inspection</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold font-body">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct response SLA guaranteed within 72 hours</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/subscription?role=entrepreneur"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] py-3 text-xs font-bold font-heading text-white shadow-lg transition-all"
              >
                <Crown className="h-4 w-4 text-amber-300" />
                <span>Upgrade to Entrepreneur Pro</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="rounded-2xl border border-slate-200 py-2.5 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
