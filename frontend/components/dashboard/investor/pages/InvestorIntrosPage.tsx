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
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Handshake,
  Inbox,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import {
  getInvestorIncomingIntros,
  updateIntroStatus,
  type InvestorIntroRequestItem,
} from "@/lib/api/portfolio";
import { toast } from "@/lib/toast";

export function InvestorIntrosPage() {
  const [loading, setLoading] = useState(true);
  const [intros, setIntros] = useState<InvestorIntroRequestItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "ACCEPTED" | "DECLINED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Action modal
  const [activeIntro, setActiveIntro] = useState<InvestorIntroRequestItem | null>(null);
  const [modalAction, setModalAction] = useState<"ACCEPT" | "DECLINE" | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchIncomingIntros();
  }, []);

  async function fetchIncomingIntros() {
    try {
      setLoading(true);
      const res = await getInvestorIncomingIntros();
      const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setIntros(items);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load incoming pitch introductions.");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenActionModal = (intro: InvestorIntroRequestItem, action: "ACCEPT" | "DECLINE") => {
    setActiveIntro(intro);
    setModalAction(action);
    setFeedbackNote(
      action === "ACCEPT"
        ? "We reviewed your materials and would love to schedule a 30-minute discovery intro call."
        : "Thank you for sharing your deck. While the business is impressive, this does not fit our current thesis focus."
    );
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIntro || !modalAction) return;

    try {
      setIsUpdating(true);
      const targetStatus = modalAction === "ACCEPT" ? "ACCEPTED" : "DECLINED";
      await updateIntroStatus(activeIntro.id, {
        status: targetStatus,
        investorFeedback: feedbackNote.trim() || undefined,
      });

      toast.success(
        modalAction === "ACCEPT"
          ? "Introduction accepted! Founder notified."
          : "Introduction declined with feedback note."
      );
      setModalAction(null);
      setActiveIntro(null);
      fetchIncomingIntros();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update intro status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick mark as reviewed
  const handleMarkReviewed = async (introId: string) => {
    try {
      await updateIntroStatus(introId, { status: "REVIEWED" });
      toast.success("Marked pitch as reviewed.");
      fetchIncomingIntros();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to mark as reviewed.");
    }
  };

  // Counts
  const totalCount = intros.length;
  const pendingCount = intros.filter((i) => i.status === "PENDING").length;
  const acceptedCount = intros.filter((i) => i.status === "ACCEPTED").length;
  const declinedCount = intros.filter((i) => i.status === "DECLINED").length;

  // Filtered list
  const filteredIntros = intros.filter((intro) => {
    const matchesFilter = filterStatus === "ALL" || intro.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      intro.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intro.pitchMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (intro.entrepreneur?.firstName &&
        intro.entrepreneur.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (intro.entrepreneur?.lastName &&
        intro.entrepreneur.lastName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 font-body text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & TELEMETRY BANNER                               */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032e24] via-[#064e3b] to-[#182b45] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold font-heading text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <Inbox className="h-4 w-4 text-emerald-300" />
              <span>Deal Inflow Pipeline</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              Founder Introductions & Pitches
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-body">
              Review investment proposals, company briefs, and pitch decks submitted directly by verified founders
              aiming for your syndicate allocations.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchIncomingIntros}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold font-heading text-white transition-all backdrop-blur-md cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Dealflow</span>
          </button>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. KPI METRICS STRIP                                           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
            Total Inflow
          </span>
          <h4 className="text-2xl font-black text-slate-900 font-heading mt-1">
            {totalCount}
          </h4>
          <p className="text-[11px] text-slate-400 font-body mt-0.5">
            Founder pitch submissions
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
            Awaiting Review
          </span>
          <h4 className="text-2xl font-black text-amber-600 font-heading mt-1">
            {pendingCount}
          </h4>
          <p className="text-[11px] text-slate-400 font-body mt-0.5">
            Requires initial review
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
            Accepted / In Diligence
          </span>
          <h4 className="text-2xl font-black text-emerald-600 font-heading mt-1">
            {acceptedCount}
          </h4>
          <p className="text-[11px] text-slate-400 font-body mt-0.5">
            Meetings or diligence initiated
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
            Passed / Declined
          </span>
          <h4 className="text-2xl font-black text-slate-500 font-heading mt-1">
            {declinedCount}
          </h4>
          <p className="text-[11px] text-slate-400 font-body mt-0.5">
            Feedback delivered to founders
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. FILTER TABS & SEARCH BAR                                    */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "ALL", label: `All Deals (${totalCount})` },
            { key: "PENDING", label: `Pending (${pendingCount})` },
            { key: "ACCEPTED", label: `Accepted (${acceptedCount})` },
            { key: "DECLINED", label: `Declined (${declinedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key as any)}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold font-heading transition-all cursor-pointer ${
                filterStatus === tab.key
                  ? "bg-[#064e3b] text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by startup, founder name, or pitch..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all font-body"
          />
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. INTRODUCTIONS LIST                                          */}
      {/* ============================================================== */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-700" />
          <p className="text-xs text-slate-500 font-body">Fetching incoming founder pitches...</p>
        </div>
      ) : filteredIntros.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-black text-slate-900 font-heading">
            No founder pitches found
          </h4>
          <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
            When entrepreneurs submit direct deal introductions to your profile, they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIntros.map((intro) => (
            <div
              key={intro.id}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              {/* Top Row: Founder Identity & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {intro.entrepreneur?.image ? (
                      <img
                        src={intro.entrepreneur.image}
                        alt="Founder"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-emerald-50 text-emerald-700 font-heading font-black">
                        {(intro.entrepreneur?.firstName?.[0] || "F").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 font-heading">
                        {intro.startupName}
                      </h4>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 font-heading">
                        {intro.targetSector || "Technology"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-body">
                      Founder: <span className="font-bold text-slate-800">{intro.entrepreneur?.firstName} {intro.entrepreneur?.lastName}</span>
                      {intro.entrepreneur?.city && ` · ${intro.entrepreneur.city}, ${intro.entrepreneur.country}`}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
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
                  <span className="text-[11px] text-slate-400 font-body">
                    {new Date(intro.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Pitch Message Teaser */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading block">
                  Pitch Teaser & Proposition
                </span>
                <p className="font-body text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                  {intro.pitchMessage}
                </p>

                {intro.businessOverview && (
                  <p className="text-slate-500 font-body italic text-[11px] pt-1">
                    Business Model & Overview: {intro.businessOverview}
                  </p>
                )}
              </div>

              {/* Metadata Badges & Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {intro.raisingAmount && (
                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 font-heading">
                      Seeking: {intro.raisingAmount}
                    </span>
                  )}
                  {intro.roundStage && (
                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Stage: {intro.roundStage}
                    </span>
                  )}
                  {intro.contactEmail && (
                    <a
                      href={`mailto:${intro.contactEmail}`}
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-700"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{intro.contactEmail}</span>
                    </a>
                  )}
                  {intro.contactPhone && (
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{intro.contactPhone}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {intro.deckUrl && (
                    <a
                      href={intro.deckUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 text-xs font-bold font-heading border border-emerald-200 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Review Pitch Deck</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {intro.websiteUrl && (
                    <a
                      href={intro.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold font-heading transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Investor Response Note if already answered */}
              {intro.investorFeedback && (
                <div
                  className={`rounded-2xl p-3.5 border text-xs space-y-1 ${
                    intro.status === "DECLINED"
                      ? "bg-rose-50/70 border-rose-200/60 text-rose-950"
                      : "bg-emerald-50/70 border-emerald-200/60 text-emerald-950"
                  }`}
                >
                  <span
                    className={`font-bold font-heading flex items-center gap-1.5 ${
                      intro.status === "DECLINED" ? "text-rose-800" : "text-emerald-800"
                    }`}
                  >
                    {intro.status === "DECLINED" ? (
                      <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {intro.status === "DECLINED"
                      ? "Your Sent Decline Feedback / Notes:"
                      : "Your Sent Invitation & Next Steps:"}
                  </span>
                  <p className="font-body italic">&ldquo;{intro.investorFeedback}&rdquo;</p>
                </div>
              )}

              {/* Action Buttons: Only active for PENDING or REVIEWED */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
                {intro.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(intro.id)}
                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Mark as Reviewed
                  </button>
                )}

                {intro.status === "PENDING" || intro.status === "REVIEWED" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(intro, "DECLINE")}
                      className="rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-1.5 text-xs font-bold font-heading transition-colors cursor-pointer"
                    >
                      Decline / Pass
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(intro, "ACCEPT")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] text-white px-5 py-1.5 text-xs font-bold font-heading shadow-sm transition-all cursor-pointer"
                    >
                      <Handshake className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Accept & Invite to Call</span>
                    </button>
                  </>
                ) : intro.status === "DECLINED" ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 text-xs font-bold font-heading">
                      <XCircle className="h-3.5 w-3.5 text-rose-600" />
                      <span>Pitch Declined</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(intro, "ACCEPT")}
                      className="text-[11px] font-bold font-heading text-slate-400 hover:text-emerald-700 hover:underline px-2 py-1 transition-colors cursor-pointer"
                    >
                      Reconsider & Accept
                    </button>
                  </div>
                ) : intro.status === "ACCEPTED" ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold font-heading">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Pitch Accepted · Diligence Active</span>
                    </span>
                    {intro.contactEmail && (
                      <a
                        href={`mailto:${intro.contactEmail}?subject=Next Steps: ${encodeURIComponent(
                          intro.startupName
                        )} & Investra Syndicate`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] text-white px-3.5 py-1.5 text-xs font-bold font-heading shadow-xs transition-all"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Email Founder</span>
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: ACCEPT / DECLINE INTRO RESPONSE                      */}
      {/* ============================================================== */}
      {modalAction && activeIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    modalAction === "ACCEPT"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {modalAction === "ACCEPT" ? <Handshake className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    {modalAction === "ACCEPT" ? "Accept Pitch Introduction" : "Pass on Deal / Decline"}
                  </h3>
                  <p className="text-xs text-slate-500 font-body">
                    {activeIntro.startupName} · Founder: {activeIntro.entrepreneur?.firstName} {activeIntro.entrepreneur?.lastName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  {modalAction === "ACCEPT" ? "Intro Message / Meeting Invitation" : "Constructive Founder Feedback Note"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder={
                    modalAction === "ACCEPT"
                      ? "Share your Calendly link, next steps, or specific questions..."
                      : "Provide a brief reason for passing..."
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAction(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-black font-heading text-white shadow-md disabled:opacity-50 cursor-pointer transition-all ${
                    modalAction === "ACCEPT"
                      ? "bg-[#064e3b] hover:bg-[#043d2e]"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{modalAction === "ACCEPT" ? "Confirm & Send Acceptance" : "Confirm & Send Feedback"}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
