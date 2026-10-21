"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { useCampaignDetailQuery } from "@/lib/campaigns/campaigns-hooks";
import { curatedFallbackCampaigns } from "@/lib/deals/compare-utils";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Handshake,
  Layers,
  Leaf,
  LineChart,
  Lock,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useBookmarkIdsQuery, useToggleBookmarkMutation } from "@/lib/bookmarks/bookmarks-hooks";
import { ConnectFounderModal } from "@/components/deals/ConnectFounderModal";
import { useKycGate } from "@/lib/kyc/useKycGate";
import { VerificationRequiredModal } from "@/components/auth/VerificationRequiredModal";
import { useSubscriptionGate } from "@/lib/auth/useSubscriptionGate";
import { SubscriptionRequiredModal } from "@/components/auth/SubscriptionRequiredModal";

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug || "";

  const [isConnectOpen, setIsConnectOpen] = React.useState(false);

  // KYC Verification Gate
  const {
    isModalOpen: isKycGateOpen,
    gateContext: kycGateContext,
    executeWithGate,
    closeModal: closeKycGate,
  } = useKycGate();

  // Subscription Gate
  const {
    isSubscribed,
    isModalOpen: isSubGateOpen,
    gateContext: subGateContext,
    executeWithSubscriptionGate,
    closeModal: closeSubGate,
  } = useSubscriptionGate();

  const handleConnectClick = () => {
    executeWithSubscriptionGate(
      () => {
        executeWithGate(
          () => setIsConnectOpen(true),
          {
            title: "Identity Verification Required",
            actionName: "direct intro calls with startup founders",
            description:
              "Under capital market compliance rules, verified investor status is required before booking introductory pitch sessions or accessing diligence rooms.",
          }
        );
      },
      {
        title: "Investor Subscription Required",
        actionName: "connect with startup founders and open deal rooms",
        description:
          "An active Investor Pro subscription is required to initiate direct conversations with founders and conduct deal negotiations.",
        targetRole: "investor",
      }
    );
  };

  const { data: apiCampaign, isLoading, isError } = useCampaignDetailQuery(slug);
  const fallbackCampaign = React.useMemo(
    () => curatedFallbackCampaigns.find((c) => c.slug === slug),
    [slug],
  );
  const campaign = apiCampaign || fallbackCampaign;

  const { data: bookmarkIds = [] } = useBookmarkIdsQuery();
  const toggleBookmark = useToggleBookmarkMutation();

  const isBookmarked = campaign ? bookmarkIds.includes(campaign.id) : false;
  const bookmarkCount = campaign?._count?.bookmarks || campaign?.bookmarkCount || 0;

  const handleToggleBookmark = () => {
    if (!campaign) return;
    toggleBookmark.mutate({ businessId: campaign.id, isBookmarked });
  };

  if (isLoading && !fallbackCampaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <InvestraInlineLoader label="Loading startup pitch details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-6 py-32 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-800">Campaign Not Found</h2>
          <p className="text-sm text-slate-500 font-body">
            The requested campaign does not exist or is currently in draft moderation.
          </p>
          <Link
            href="/funds"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-sm font-semibold font-heading hover:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const target = Number(campaign.targetAmount) || 1;
  const raised = Number(campaign.raisedAmount) || 0;
  const percent = Math.min(Math.round((raised / target) * 100), 100);
  const founder = campaign.entrepreneur;
  const founderName = founder
    ? `${founder.firstName || ""} ${founder.lastName || ""}`.trim() || "Verified Founder"
    : "Verified Founder";

  const bannerImageUrl = campaign.coverMedia?.url || campaign.bannerImage;
  const hasPitchDecks = Boolean(campaign.pitchDecks && campaign.pitchDecks.length > 0);
  const canAccessConfidential = isSubscribed || campaign.viewerHasSubscription;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-10 space-y-10">
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold font-heading text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to campaigns
          </button>
        </div>

        {/* Header Hero Banner */}
        <section className="bg-[#182B45] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
          {bannerImageUrl && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: `url(${bannerImageUrl})` }}
            />
          )}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-heading px-3 py-1 rounded-full uppercase tracking-wider">
                  {campaign.category?.name || "General"}
                </span>
                <span className="bg-white/10 text-slate-200 text-xs font-bold font-heading px-3 py-1 rounded-full uppercase tracking-wider">
                  Stage: {campaign.stage}
                </span>
                <span className="bg-emerald-600 text-white text-xs font-bold font-heading px-3 py-1 rounded-full uppercase tracking-wider">
                  {campaign.riskLevel} Risk
                </span>
                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-heading transition cursor-pointer ${
                    isBookmarked
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                  title={isBookmarked ? "Remove from watchlist" : "Save to watchlist"}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-emerald-800 text-emerald-800" : ""}`} />
                  <span>{isBookmarked ? "Saved to Watchlist" : "Save to Watchlist"}</span>
                  {bookmarkCount > 0 && <span className="opacity-80">({bookmarkCount})</span>}
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">
                {campaign.title}
              </h1>

              <p className="text-slate-300 text-base md:text-lg font-body leading-relaxed max-w-2xl">
                {campaign.tagline || campaign.pitchText.slice(0, 160)}
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-300 uppercase font-heading font-semibold">Total Round Target</p>
                <p className="text-3xl font-black font-heading text-emerald-400">
                  ${target.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Raised: ${raised.toLocaleString()}</span>
                  <span className="text-emerald-300">{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConnectClick}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-heading text-sm transition-all shadow-md cursor-pointer"
                >
                  <Handshake className="w-4 h-4" /> Connect with Founder
                </button>
                {!isSubscribed && (
                  <p className="text-[11px] text-center text-slate-300/80 mt-1.5 font-body">
                    Active subscription required to message founder
                  </p>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Financial Highlights Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-1">
            <p className="text-xs text-slate-400 font-heading uppercase font-semibold">Projected IRR</p>
            <p className="text-2xl font-black text-emerald-600 font-heading">
              {Number(campaign.projectedIrr) || 0}%
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-1">
            <p className="text-xs text-slate-400 font-heading uppercase font-semibold">Pre-Money Valuation</p>
            <p className="text-2xl font-black text-[#182B45] font-heading">
              {campaign.valuation ? `$${Number(campaign.valuation).toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-1">
            <p className="text-xs text-slate-400 font-heading uppercase font-semibold">Min Ticket Size</p>
            <p className="text-2xl font-black text-slate-800 font-heading">
              ${Number(campaign.minInvestment).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-1">
            <p className="text-xs text-slate-400 font-heading uppercase font-semibold">Impact Metric</p>
            <p className="text-base font-bold text-emerald-700 font-heading truncate">
              {campaign.impactMetric || "ESG Verified"}
            </p>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Pitch Overview, Pitch Decks & Milestones */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Pitch Text Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-xl font-bold font-heading text-[#182B45] flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Executive Pitch Summary
              </h2>
              <div className="text-sm md:text-base text-slate-600 font-body leading-relaxed whitespace-pre-line">
                {campaign.pitchText}
              </div>
            </div>

            {/* Pitch Decks & Due Diligence Presentation */}
            {hasPitchDecks && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xl font-bold font-heading text-[#182B45] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" /> Investor Pitch Deck & Materials
                  </h2>
                  {!canAccessConfidential && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 font-heading">
                      <Lock className="w-3 h-3" /> Subscription Required
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {campaign.pitchDecks!.map((deck) => {
                    const isLocked = deck.isLocked ?? (!canAccessConfidential && deck.isConfidential);

                    return (
                      <div
                        key={deck.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isLocked
                            ? "bg-amber-50/40 border-amber-200/70"
                            : "bg-slate-50 border-slate-200/80 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isLocked ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold font-heading text-slate-900">
                                {deck.title}
                              </h4>
                              {deck.isConfidential && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                                  Confidential
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-body mt-0.5">
                              {isLocked
                                ? "Full deck contains cap table, financial forecasts, and audited milestones."
                                : `Version ${deck.version} · Verified Platform Pitch Deck`}
                            </p>
                          </div>
                        </div>

                        <div>
                          {isLocked ? (
                            <button
                              type="button"
                              onClick={() =>
                                executeWithSubscriptionGate(() => {}, {
                                  title: "Investor Subscription Required",
                                  actionName: "download confidential pitch decks",
                                  description:
                                    "Confidential pitch presentations and due diligence models are protected under platform NDA and require an active Investor subscription.",
                                  targetRole: "investor",
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                            >
                              <Crown className="w-3.5 h-3.5" /> Unlock Deck
                            </button>
                          ) : (
                            <a
                              href={deck.fileUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#053D2E] text-white font-bold text-xs transition shadow-xs"
                            >
                              <Download className="w-3.5 h-3.5" /> Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Milestones Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold font-heading text-[#182B45] flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" /> Execution Roadmap & Milestones
              </h2>

              {!campaign.milestones || campaign.milestones.length === 0 ? (
                <p className="text-sm text-slate-400 font-body">No milestone updates published yet.</p>
              ) : (
                <div className="space-y-4">
                  {campaign.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-colors ${
                        m.isCompleted
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {m.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold font-heading text-[#182B45]">
                            {idx + 1}. {m.title}
                          </h4>
                          {m.description && (
                            <p className="text-xs text-slate-500 font-body mt-1">{m.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold font-heading px-2.5 py-1 rounded-full uppercase ${
                          m.isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {m.isCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Founder Info & Deal Room */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Founder Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-heading text-[#182B45] flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Leadership & Founder
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={founder?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={founderName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="text-base font-bold font-heading text-[#182B45]">{founderName}</h4>
                  <p className="text-xs text-slate-500 font-body">
                    {founder?.entrepreneurProfile?.headline || "Venture Entrepreneur"}
                  </p>
                </div>
              </div>

              {founder?.entrepreneurProfile?.companyName && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-body">Company:</span>
                  <span className="font-bold text-slate-700 font-heading">
                    {founder.entrepreneurProfile.companyName}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleConnectClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold font-heading text-xs transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Message Founder Directly</span>
              </button>
            </div>

            {/* Deal Room Access Card */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold font-heading text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Confidential Data Room
                </div>
                {canAccessConfidential ? (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Pro Only
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold font-heading">Cap Table & Due Diligence</h4>
              <p className="text-xs text-slate-300 font-body leading-relaxed">
                {canAccessConfidential
                  ? "Your accredited subscription gives you full access to startup diligence documents, direct Q&A, and deal comparisons."
                  : "Access audited financials, term sheets, cap table breakdowns, and investor decks by activating an Investor subscription."}
              </p>
              
              <div className="space-y-2 pt-1">
                {!canAccessConfidential ? (
                  <Link
                    href="/subscription?role=investor"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-heading text-xs transition-colors"
                  >
                    <Crown className="w-4 h-4" /> Unlock Diligence Room
                  </Link>
                ) : null}

                <Link
                  href="/compare"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold font-heading text-xs transition-colors border border-white/10"
                >
                  Compare Side-by-Side
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Real Connect Founder Modal */}
        <ConnectFounderModal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          campaign={campaign}
        />

        {/* KYC Gate Modal */}
        <VerificationRequiredModal
          isOpen={isKycGateOpen}
          onClose={closeKycGate}
          title={kycGateContext.title}
          actionName={kycGateContext.actionName}
          description={kycGateContext.description}
        />

        {/* Subscription Gate Modal */}
        <SubscriptionRequiredModal
          isOpen={isSubGateOpen}
          onClose={closeSubGate}
          title={subGateContext.title}
          actionName={subGateContext.actionName}
          description={subGateContext.description}
          targetRole="investor"
        />
      </main>

      <Footer />
    </div>
  );
}
