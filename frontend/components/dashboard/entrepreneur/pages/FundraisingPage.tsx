"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Layers,
  Plus,
  Rocket,
  Send,
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

export function FundraisingPage() {
  const { data: campaigns, isLoading } = useMyCampaignsQuery();
  const { data: categories } = useCategoriesQuery();
  const createMutation = useCreateCampaignMutation();
  const submitMutation = useSubmitCampaignForReviewMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [pitchText, setPitchText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stage, setStage] = useState<BusinessStage>("EARLY_STAGE");
  const [targetAmount, setTargetAmount] = useState(500000);
  const [minInvestment, setMinInvestment] = useState(2500);
  const [projectedIrr, setProjectedIrr] = useState(20);
  const [valuation, setValuation] = useState(2500000);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("MEDIUM");
  const [impactMetric, setImpactMetric] = useState("");
  const [bannerImage, setBannerImage] = useState("");

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
        alert("Please select a valid industry category.");
        return;
      }

      await createMutation.mutateAsync({
        title,
        tagline: tagline || undefined,
        pitchText,
        categoryId: selectedCat,
        stage,
        targetAmount: Number(targetAmount),
        minInvestment: Number(minInvestment),
        projectedIrr: Number(projectedIrr) || undefined,
        valuation: Number(valuation) || undefined,
        riskLevel,
        impactMetric: impactMetric || undefined,
        bannerImage: bannerImage || undefined,
      });

      setIsCreating(false);
      setTitle("");
      setTagline("");
      setPitchText("");
      setBannerImage("");
      setImpactMetric("");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj?.response?.data?.message || errorObj?.message || "Failed to create campaign");
    }
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
      setIsAddingMilestone(false);
      setMilestoneTitle("");
      setMilestoneDesc("");
      setMilestoneDate("");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj?.response?.data?.message || errorObj?.message || "Failed to add milestone");
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await submitMutation.mutateAsync(id);
      alert("Campaign submitted for admin review successfully!");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj?.response?.data?.message || errorObj?.message || "Failed to submit for review");
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Fundraising & Pitch Campaigns
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Author investment proposals, attach milestones, and submit to verified investors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#044c38] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaigns Listing */}
      {!campaigns || campaigns.length === 0 ? (
        <Panel className="p-16 text-center space-y-4">
          <Rocket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No active campaigns yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Ready to raise capital? Launch your first investment round, define your milestones, and showcase your business to accredited investors.
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#065f46] text-white font-bold text-xs hover:bg-[#044c38] transition cursor-pointer"
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

            return (
              <Panel key={camp.id} className="p-6 space-y-5">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                      <StatusPill tone={statusTone}>
                        {camp.status.replace("_", " ")}
                      </StatusPill>
                      {camp.category?.name && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/60">
                          {camp.category.name}
                        </span>
                      )}
                      {(camp._count?.bookmarks || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 bg-emerald-100/70 text-emerald-800 rounded-full">
                          <Bookmark className="w-3 h-3 fill-emerald-800" />
                          {camp._count?.bookmarks} {camp._count?.bookmarks === 1 ? "Investor Watching" : "Investors Watching"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {camp.tagline || camp.pitchText}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {camp.status === "ACTIVE" && (
                      <Link
                        href={`/funds/${camp.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
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
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Milestone
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitForReview(camp.id)}
                          disabled={submitMutation.isPending}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white font-bold text-xs transition cursor-pointer disabled:opacity-60"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit for Review
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Financial Summary */}
                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600">Fundraising progress: {percent}%</span>
                    <span className="text-slate-900 font-bold">
                      ${raised.toLocaleString()} / ${target.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar value={percent} />
                </div>

                {/* Financial KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Target Round
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      ${target.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Min Investment
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      ${Number(camp.minInvestment).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Projected IRR
                    </p>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">
                      {Number(camp.projectedIrr) || 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Venture Stage
                    </p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{camp.stage}</p>
                  </div>
                </div>

                {/* Milestones Preview */}
                {camp.milestones && camp.milestones.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Milestones (
                      {camp.milestones.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {camp.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs"
                        >
                          <p className="font-bold text-slate-900 truncate">{m.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
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

      {/* Create Campaign Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Create Fundraising Campaign
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Prepare your investment proposal for accredited investor discovery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Company / Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex FinTech Core Banking API"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="Brief one-sentence value proposition..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Category *
                  </label>
                  <select
                    value={effectiveCategoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as BusinessStage)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="IDEA">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="EARLY_STAGE">Early Stage</option>
                    <option value="GROWTH">Growth</option>
                    <option value="SCALING">Scaling</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Risk Level
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Target ($) *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Min Ticket ($) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Est. IRR (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={projectedIrr}
                    onChange={(e) => setProjectedIrr(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Valuation ($)
                  </label>
                  <input
                    type="number"
                    value={valuation}
                    onChange={(e) => setValuation(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Impact Metric
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50K Farmers Supported or 10MW Clean Power"
                  value={impactMetric}
                  onChange={(e) => setImpactMetric(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Pitch Summary *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your market problem, technology, unit economics, and growth plan..."
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  className="px-5 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? "Creating..." : "Save Campaign Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {isAddingMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
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
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                  Milestone Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beta Platform Launch"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
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
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                    Funding Allocation ($)
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
                  <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
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
