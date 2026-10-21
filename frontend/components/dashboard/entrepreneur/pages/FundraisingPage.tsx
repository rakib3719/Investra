"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  DollarSign,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Image as ImageIcon,
  Layers,
  Lock,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useMyCampaignsQuery,
  useCategoriesQuery,
  useCreateCampaignMutation,
  useSubmitCampaignForReviewMutation,
  useAddMilestoneMutation,
} from "@/lib/campaigns/campaigns-hooks";
import type { BusinessStage, RiskLevel } from "@/lib/campaigns/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import {
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import { FileUploadDropzone } from "@/components/ui/FileUploadDropzone";
import { ConfirmedMediaResponse } from "@/lib/api/media";
import { toast } from "@/lib/toast";

export function FundraisingPage() {
  const { data: campaigns, isLoading } = useMyCampaignsQuery();
  const { data: categories } = useCategoriesQuery();
  const createMutation = useCreateCampaignMutation();
  const submitMutation = useSubmitCampaignForReviewMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"basics" | "financials" | "media">("basics");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // Form State - Basics
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [pitchText, setPitchText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stage, setStage] = useState<BusinessStage>("EARLY_STAGE");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("MEDIUM");
  const [impactMetric, setImpactMetric] = useState("");

  // Form State - Financials
  const [targetAmount, setTargetAmount] = useState(500000);
  const [minInvestment, setMinInvestment] = useState(5000);
  const [projectedIrr, setProjectedIrr] = useState(22);
  const [valuation, setValuation] = useState(2500000);

  // Form State - Media & Pitch Deck
  const [bannerImage, setBannerImage] = useState("");
  const [coverMediaId, setCoverMediaId] = useState<string | undefined>(undefined);
  const [pitchDeckUrl, setPitchDeckUrl] = useState("");
  const [pitchDeckTitle, setPitchDeckTitle] = useState("");
  const [pitchDeckMediaId, setPitchDeckMediaId] = useState<string | undefined>(undefined);
  const [isPitchDeckConfidential, setIsPitchDeckConfidential] = useState(true);

  // Milestone Form State
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [milestoneFunding, setMilestoneFunding] = useState(100000);
  const [milestoneDate, setMilestoneDate] = useState("");

  const addMilestoneMutation = useAddMilestoneMutation(selectedCampaignId || "");

  const effectiveCategoryId = categoryId || (categories && categories[0]?.id) || "";

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCat = effectiveCategoryId;
      if (!selectedCat) {
        toast.error("Please select a valid industry category.");
        return;
      }

      if (!title.trim()) {
        toast.error("Company / Campaign title is required.");
        return;
      }

      if (!pitchText.trim()) {
        toast.error("Executive pitch summary is required.");
        return;
      }

      await createMutation.mutateAsync({
        title: title.trim(),
        tagline: tagline.trim() || undefined,
        pitchText: pitchText.trim(),
        categoryId: selectedCat,
        stage,
        targetAmount: Number(targetAmount),
        minInvestment: Number(minInvestment),
        projectedIrr: Number(projectedIrr) || undefined,
        valuation: Number(valuation) || undefined,
        riskLevel,
        impactMetric: impactMetric.trim() || undefined,
        bannerImage: bannerImage.trim() || undefined,
        coverMediaId,
        pitchDeckUrl: pitchDeckUrl.trim() || undefined,
        pitchDeckTitle: pitchDeckTitle.trim() || (pitchDeckUrl ? `${title} Pitch Deck` : undefined),
        pitchDeckMediaId,
        isPitchDeckConfidential,
      });

      toast.success("Fundraising campaign created successfully as DRAFT!");
      setIsCreating(false);
      resetForm();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(errorObj?.response?.data?.message || errorObj?.message || "Failed to create campaign");
    }
  };

  const resetForm = () => {
    setTitle("");
    setTagline("");
    setPitchText("");
    setBannerImage("");
    setCoverMediaId(undefined);
    setPitchDeckUrl("");
    setPitchDeckTitle("");
    setPitchDeckMediaId(undefined);
    setIsPitchDeckConfidential(true);
    setImpactMetric("");
    setActiveTab("basics");
  };

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return;

    try {
      await addMilestoneMutation.mutateAsync({
        title: milestoneTitle,
        description: milestoneDesc || undefined,
        fundingNeeded: Number(milestoneFunding) || undefined,
        targetDate: milestoneDate || undefined,
      });
      toast.success("Milestone added to roadmap!");
      setIsAddingMilestone(false);
      setMilestoneTitle("");
      setMilestoneDesc("");
      setMilestoneDate("");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(errorObj?.response?.data?.message || errorObj?.message || "Failed to add milestone");
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await submitMutation.mutateAsync(id);
      toast.success("Campaign submitted for compliance & admin review!");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(errorObj?.response?.data?.message || errorObj?.message || "Failed to submit for review");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <InvestraInlineLoader label="Loading fundraising campaigns..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Rocket className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
              Fundraising & Pitch Campaigns
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-body">
            Author verified investment rounds, attach pitch decks and execution milestones, and connect with accredited investors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#044c38] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaigns Listing */}
      {!campaigns || campaigns.length === 0 ? (
        <Panel className="p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-800 grid place-items-center mx-auto">
            <Rocket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-heading">No active fundraising campaigns yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-body">
            Ready to raise capital? Launch your first investment proposal, upload your pitch deck, define your execution milestones, and connect with verified angel and institutional investors.
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#065f46] text-white font-bold text-xs hover:bg-[#044c38] transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Start Campaign Builder
          </button>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((camp) => {
            const target = Number(camp.targetAmount) || 1;
            const raised = Number(camp.raisedAmount) || 0;
            const percent = Math.min(Math.round((raised / target) * 100), 100);

            const statusTone: "green" | "amber" | "rose" | "slate" =
              camp.status === "ACTIVE"
                ? "green"
                : camp.status === "UNDER_REVIEW"
                ? "amber"
                : camp.status === "REJECTED"
                ? "rose"
                : "slate";

            const coverUrl = camp.coverMedia?.url || camp.bannerImage;
            const pitchDeckCount = camp.pitchDecks?.length || 0;

            return (
              <Panel key={camp.id} className="p-6 space-y-5 overflow-hidden">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={camp.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 font-heading">{camp.title}</h3>
                        <StatusPill tone={statusTone}>
                          {camp.status.replace("_", " ")}
                        </StatusPill>
                        {camp.category?.name && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/60 font-heading">
                            {camp.category.name}
                          </span>
                        )}
                        {(camp._count?.bookmarks || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-full font-heading">
                            <Bookmark className="w-3 h-3 fill-emerald-800" />
                            {camp._count?.bookmarks} {camp._count?.bookmarks === 1 ? "Investor Watching" : "Investors Watching"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 font-body">
                        {camp.tagline || camp.pitchText}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {camp.status === "ACTIVE" && (
                      <Link
                        href={`/funds/${camp.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition font-heading"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                      </Link>
                    )}

                    {camp.status === "DRAFT" && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCampaignId(camp.id);
                            setIsAddingMilestone(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer font-heading"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Milestone
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitForReview(camp.id)}
                          disabled={submitMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white font-bold text-xs transition cursor-pointer font-heading disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit for Review
                        </button>
                      </>
                    )}

                    {camp.status === "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => handleSubmitForReview(camp.id)}
                        disabled={submitMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer font-heading"
                      >
                        <Send className="w-3.5 h-3.5" /> Resubmit for Review
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 font-body">
                      Raised: <strong className="text-slate-800">${raised.toLocaleString()}</strong> of ${target.toLocaleString()} target
                    </span>
                    <span className="text-emerald-700 font-bold font-heading">{percent}%</span>
                  </div>
                  <ProgressBar value={percent} />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                      Pre-Money Valuation
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 font-heading">
                      {camp.valuation ? `$${Number(camp.valuation).toLocaleString()}` : "Not Disclosed"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                      Min Ticket Size
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 font-heading">
                      ${Number(camp.minInvestment).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                      Projected IRR
                    </p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5 font-heading">
                      {Number(camp.projectedIrr) || 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-heading">
                      Venture Stage
                    </p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5 font-heading">{camp.stage}</p>
                  </div>
                </div>

                {/* Pitch Decks Status */}
                {camp.pitchDecks && camp.pitchDecks.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 grid place-items-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 font-heading">
                          {camp.pitchDecks[0].title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-body">
                          {camp.pitchDecks[0].isConfidential
                            ? "Confidential deck (Subscriber only)"
                            : "Public pitch deck"}
                        </p>
                      </div>
                    </div>
                    {camp.pitchDecks[0].fileUrl && (
                      <a
                        href={camp.pitchDecks[0].fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold font-heading hover:bg-slate-50 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> View Deck
                      </a>
                    )}
                  </div>
                )}

                {/* Milestones Preview */}
                {camp.milestones && camp.milestones.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-heading">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Milestones (
                      {camp.milestones.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {camp.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs"
                        >
                          <p className="font-bold text-slate-900 truncate font-heading">{m.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-body">
                            {m.isCompleted ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Completed
                              </span>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> In progress
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      {/* Comprehensive Professional Create Campaign Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 font-heading">
                  <Sparkles className="w-4 h-4" /> Venture Capital Builder
                </div>
                <h3 className="text-xl font-black text-slate-900 font-heading mt-1">
                  Author Fundraising Campaign
                </h3>
                <p className="text-xs text-slate-500 font-body mt-0.5">
                  Package your startup proposal, upload your investor pitch deck, and set investment parameters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepped Tab Navigation */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab("basics")}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
                  activeTab === "basics"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> 1. Venture Basics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("financials")}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
                  activeTab === "financials"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> 2. Financial Terms
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-heading ${
                  activeTab === "media"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" /> 3. Media & Pitch Deck
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              
              {/* TAB 1: BASICS */}
              {activeTab === "basics" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Company / Venture Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex FinTech Core Banking API"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Tagline / One-Liner
                    </label>
                    <input
                      type="text"
                      placeholder="Brief one-sentence value proposition for investors..."
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Industry Category *
                      </label>
                      <select
                        value={effectiveCategoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        {categories && categories.length > 0 ? (
                          categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))
                        ) : (
                          <option value="">Loading categories...</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Stage
                      </label>
                      <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value as BusinessStage)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="IDEA">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="EARLY_STAGE">Early Stage</option>
                        <option value="GROWTH">Growth</option>
                        <option value="SCALING">Scaling</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Risk Rating
                      </label>
                      <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="LOW">Low Risk</option>
                        <option value="MEDIUM">Medium Risk</option>
                        <option value="HIGH">High Risk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Impact / ESG Metric
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50,000 Micro-merchants Supported or 10MW Clean Energy Generated"
                      value={impactMetric}
                      onChange={(e) => setImpactMetric(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Executive Pitch Summary *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Detail your venture's market opportunity, problem, solution, business model, and planned capital allocation..."
                      value={pitchText}
                      onChange={(e) => setPitchText(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-body leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("financials")}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer"
                    >
                      <span>Next: Financial Terms</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: FINANCIALS */}
              {activeTab === "financials" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Target Capital Needed ($) *
                      </label>
                      <input
                        type="number"
                        min="1000"
                        required
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Minimum Investment Ticket ($) *
                      </label>
                      <input
                        type="number"
                        min="100"
                        required
                        value={minInvestment}
                        onChange={(e) => setMinInvestment(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Pre-Money Valuation ($)
                      </label>
                      <input
                        type="number"
                        value={valuation}
                        onChange={(e) => setValuation(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Estimated IRR (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={projectedIrr}
                        onChange={(e) => setProjectedIrr(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Financial Transparency Guarantee:</p>
                    <p className="font-body text-[11px] leading-relaxed text-slate-500">
                      These parameters guide accredited investors during automated discovery and comparison matrix analysis. You can refine valuation and instruments in direct deal room discussions.
                    </p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("basics")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("media")}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer"
                    >
                      <span>Next: Media & Pitch Deck</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & PITCH DECK */}
              {activeTab === "media" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Campaign Cover Image */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Campaign Cover Image
                    </label>
                    <div className="space-y-3">
                      <FileUploadDropzone
                        category="CAMPAIGN_COVER"
                        label="Drop campaign banner image or click to browse (JPEG, PNG, WebP up to 10MB)"
                        onUploadSuccess={(media: ConfirmedMediaResponse) => {
                          setCoverMediaId(media.id);
                          if (media.url) setBannerImage(media.url);
                          toast.success("Cover image uploaded to Cloudflare vault!");
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Or Image URL:</span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={bannerImage}
                          onChange={(e) => setBannerImage(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                        />
                      </div>
                      {bannerImage && (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-28 max-w-sm">
                          <img src={bannerImage} alt="Cover preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setBannerImage("");
                              setCoverMediaId(undefined);
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Investor Pitch Deck */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                        Investor Pitch Deck (PDF)
                      </label>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Pitch Deck Title (e.g. Series Seed Presentation)"
                          value={pitchDeckTitle}
                          onChange={(e) => setPitchDeckTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 mb-2"
                        />
                      </div>

                      <FileUploadDropzone
                        category="PITCH_DECK"
                        label="Upload Pitch Deck Presentation (PDF up to 50MB)"
                        onUploadSuccess={(media: ConfirmedMediaResponse) => {
                          setPitchDeckMediaId(media.id);
                          if (media.url) setPitchDeckUrl(media.url);
                          if (!pitchDeckTitle && media.originalName) {
                            setPitchDeckTitle(media.originalName.replace(/\.pdf$/i, ""));
                          }
                          toast.success("Pitch deck securely uploaded!");
                        }}
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-bold uppercase">Or PDF URL:</span>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={pitchDeckUrl}
                          onChange={(e) => setPitchDeckUrl(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Confidentiality Toggle */}
                      <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPitchDeckConfidential}
                          onChange={(e) => setIsPitchDeckConfidential(e.target.checked)}
                          className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-amber-950 font-heading">
                            Confidential Pitch Deck (Require Active Investor Subscription)
                          </p>
                          <p className="text-[11px] text-amber-900/80 font-body">
                            When enabled, public visitors cannot download your presentation. Only verified subscribers who accept your confidentiality terms can view it.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("financials")}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Back
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="px-6 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                      >
                        {createMutation.isPending ? "Creating..." : "Save Campaign Draft"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {isAddingMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Add Campaign Milestone
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingMilestone(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600 uppercase tracking-wider font-heading">
                  Milestone Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beta Platform Launch or 10K Active Users"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600 uppercase tracking-wider font-heading">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key deliverables and verification criteria..."
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600 uppercase tracking-wider font-heading">
                    Funding Needed ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={milestoneFunding}
                    onChange={(e) => setMilestoneFunding(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600 uppercase tracking-wider font-heading">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={milestoneDate}
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingMilestone(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMilestoneMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {addMilestoneMutation.isPending ? "Adding..." : "Add Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
