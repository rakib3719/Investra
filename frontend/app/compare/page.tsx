"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ShinyText from "@/components/ui/ShinyText";
import {
  Scale,
  Check,
  X,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Building2,
  BarChart3,
  Bookmark,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  Handshake,
  Layers,
  Award,
  Milestone,
  ExternalLink,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useCampaignsQuery } from "@/lib/campaigns/campaigns-hooks";
import type { Campaign } from "@/lib/campaigns/types";
import {
  getMetricHighlights,
  formatCurrency,
  formatPercent,
  curatedFallbackCampaigns,
} from "@/lib/deals/compare-utils";
import { DealComparePickerModal } from "@/components/deals/DealComparePickerModal";
import {
  ConnectFounderModal,
  type ConnectFounderTarget,
} from "@/components/deals/ConnectFounderModal";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load live campaigns
  const { data: campaignsData, isLoading } = useCampaignsQuery({ limit: 50 });

  // Merge live campaigns with curated fallbacks
  const availablePool = useMemo(() => {
    const live = campaignsData?.items || [];
    const liveSlugs = new Set(live.map((c) => c.slug));
    const supplemental = curatedFallbackCampaigns.filter(
      (c) => !liveSlugs.has(c.slug),
    );
    return [...live, ...supplemental];
  }, [campaignsData]);

  // Selected campaigns state (2 to 4 items)
  const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeConnectCampaign, setActiveConnectCampaign] =
    useState<ConnectFounderTarget | null>(null);

  // Initialize from searchParams (?funds=slug1,slug2...) or default
  useEffect(() => {
    if (availablePool.length === 0) return;

    const fundsParam = searchParams.get("funds");
    if (fundsParam) {
      const requestedSlugs = fundsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const matched = availablePool.filter(
        (c) => requestedSlugs.includes(c.slug) || requestedSlugs.includes(c.id),
      );

      if (matched.length >= 2) {
        setSelectedCampaigns(matched.slice(0, 4));
        return;
      }
    }

    // Default to first 3 items from pool
    if (selectedCampaigns.length === 0) {
      setSelectedCampaigns(availablePool.slice(0, 3));
    }
  }, [availablePool, searchParams]);

  // Keep URL query synchronized
  const updateUrlParam = (campaigns: Campaign[]) => {
    const slugs = campaigns.map((c) => c.slug).join(",");
    const url = slugs ? `/compare?funds=${slugs}` : "/compare";
    window.history.replaceState(null, "", url);
  };

  // Add campaign to comparison
  const handleAddCampaign = (campaign: Campaign) => {
    if (selectedCampaigns.length >= 4) return;
    if (selectedCampaigns.some((c) => c.id === campaign.id)) return;

    const updated = [...selectedCampaigns, campaign];
    setSelectedCampaigns(updated);
    updateUrlParam(updated);
  };

  // Remove campaign from comparison (minimum 2 maintained)
  const handleRemoveCampaign = (id: string) => {
    if (selectedCampaigns.length <= 2) {
      alert("A minimum of 2 campaigns are required for side-by-side comparison.");
      return;
    }
    const updated = selectedCampaigns.filter((c) => c.id !== id);
    setSelectedCampaigns(updated);
    updateUrlParam(updated);
  };

  // Compute best in metric highlights
  const highlights = useMemo(
    () => getMetricHighlights(selectedCampaigns),
    [selectedCampaigns],
  );

  const selectedIds = useMemo(
    () => selectedCampaigns.map((c) => c.id),
    [selectedCampaigns],
  );

  // Total columns in table: 1 (metrics header) + N (selected deals) + (hasSlot ? 1 : 0)
  const hasEmptySlot = selectedCampaigns.length < 4;
  const colCount = 1 + selectedCampaigns.length + (hasEmptySlot ? 1 : 0);

  // Column widths dynamically
  const colWidthClass =
    colCount === 3
      ? "w-1/3"
      : colCount === 4
        ? "w-1/4"
        : "w-1/5 min-w-[240px]";

  const tableMinWidthClass =
    colCount === 3
      ? "min-w-[800px]"
      : colCount === 4
        ? "min-w-[1050px]"
        : "min-w-[1250px]";

  return (
    <div className="min-h-screen bg-[#f9fbfa] flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Header Hero Banner */}
      <section className="w-full bg-white py-10 md:py-14 border-b border-slate-200/80">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                <span>Side-by-Side Venture Matrix</span>
              </div>

              <h1 className="font-heading font-black text-3xl md:text-4xl lg:text-[44px] text-[#064e3b] leading-[1.15] tracking-tight">
                Compare Opportunities.<br />
                Analyze Financial Yields, <ShinyText text="Invest With Confidence." speed={4.5} />
              </h1>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Benchmark 2, 3, or 4 investment rounds head-to-head across valuation, projected IRR yield, minimum ticket, ESG audit ratings, and operational milestones.
              </p>
            </div>

            {/* Quick Actions / Active Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-700" />
                <span>Comparing {selectedCampaigns.length} of 4 Deals</span>
              </div>

              {selectedCampaigns.length < 4 && (
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#078457] hover:bg-[#066e48] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Deal ({selectedCampaigns.length}/4)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Matrix */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-10 flex-1 space-y-8">
        {isLoading && selectedCampaigns.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <InvestraLoader label="Loading comparison matrix…" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className={`w-full text-left border-collapse ${tableMinWidthClass}`}>
                {/* TABLE HEADER: DEAL CARDS + OPTIONAL ADD SLOT */}
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80">
                    <th className="p-5 text-xs font-black uppercase tracking-wider text-slate-500 w-1/5 min-w-[200px] align-bottom">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Benchmark Matrix
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          Comparison Dimensions
                        </h3>
                        <p className="text-[11px] font-normal text-slate-500">
                          Green markers highlight benchmark leaders.
                        </p>
                      </div>
                    </th>

                    {/* DEAL COLUMNS */}
                    {selectedCampaigns.map((campaign) => (
                      <th
                        key={campaign.id}
                        className={`p-5 ${colWidthClass} border-l border-slate-200/80 align-top bg-white`}
                      >
                        <div className="space-y-3">
                          {/* Image and stage */}
                          <div className="h-32 rounded-xl overflow-hidden relative border border-slate-100 shadow-xs">
                            <img
                              src={
                                campaign.bannerImage ||
                                "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
                              }
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/90 text-white text-[9px] font-bold rounded-md uppercase tracking-wider backdrop-blur-xs">
                              {campaign.stage || "EARLY_STAGE"}
                            </span>
                          </div>

                          {/* Title & Category */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              {campaign.category?.name || "General Sector"}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mt-0.5">
                              {campaign.title}
                            </h4>
                          </div>

                          {/* Top Card Action: Remove / Connect */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setActiveConnectCampaign(campaign)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                            >
                              <Handshake className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </button>

                            {selectedCampaigns.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCampaign(campaign.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition"
                                title="Remove from comparison"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* EMPTY ADD SLOT CARD */}
                    {hasEmptySlot && (
                      <th
                        className={`p-5 ${colWidthClass} border-l border-slate-200/80 align-middle bg-slate-50/50`}
                      >
                        <button
                          type="button"
                          onClick={() => setIsPickerOpen(true)}
                          className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition p-4 flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                        >
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 transition">
                            <Plus className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            + Add Fund {selectedCampaigns.length + 1}
                          </span>
                          <span className="text-[11px] text-slate-500 max-w-[140px]">
                            Compare up to 4 deals side-by-side
                          </span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {/* ================= SECTION 1: FINANCIAL & VALUATION ================= */}
                  <tr className="bg-slate-100/70">
                    <td
                      colSpan={colCount}
                      className="px-5 py-2.5 font-bold uppercase tracking-wider text-[11px] text-slate-700"
                    >
                      1. Financial Terms & Return Potential
                    </td>
                  </tr>

                  {/* Target Capital & Progress */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-700" />
                        <span>Target Fund Raise</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const target = Number(c.targetAmount) || 1;
                      const raised = Number(c.raisedAmount) || 0;
                      const pct = Math.min(100, Math.round((raised / target) * 100));
                      const isProgressLeader = c.id === highlights.highestProgressId;

                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-sm">
                                {formatCurrency(target)}
                              </span>
                              {isProgressLeader && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                  <Flame className="w-3 h-3 text-emerald-600" />
                                  Top Progress
                                </span>
                              )}
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#078457] h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>Raised: {formatCurrency(raised)}</span>
                              <span className="font-bold text-emerald-800">{pct}%</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Post-Money Valuation */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span>Post-Money Valuation</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td
                        key={c.id}
                        className="p-5 border-l border-slate-100 font-bold text-slate-900 text-sm"
                      >
                        {c.valuation ? formatCurrency(c.valuation) : "Undisclosed"}
                      </td>
                    ))}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Projected IRR */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-700" />
                        <span>Projected Target IRR</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const isTopYield = c.id === highlights.highestIrrId;
                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-[#064e3b]">
                              {c.projectedIrr ? formatPercent(c.projectedIrr) : "N/A"}
                            </span>
                            {isTopYield && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                                <Award className="w-3 h-3 text-emerald-600" />
                                Highest Yield
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Minimum Ticket Size */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-700" />
                        <span>Minimum Ticket Size</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const isLowestEntry = c.id === highlights.lowestMinTicketId;
                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(c.minInvestment)}</span>
                            {isLowestEntry && (
                              <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                Lowest Entry
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* ================= SECTION 2: BUSINESS & SECTOR ================= */}
                  <tr className="bg-slate-100/70">
                    <td
                      colSpan={colCount}
                      className="px-5 py-2.5 font-bold uppercase tracking-wider text-[11px] text-slate-700"
                    >
                      2. Sector, Stage & Operational Footprint
                    </td>
                  </tr>

                  {/* Sector / Category */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <span>Marketplace Category</span>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td key={c.id} className="p-5 border-l border-slate-100 font-semibold text-slate-800">
                        {c.category?.name || "General"}
                      </td>
                    ))}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Development Stage */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <span>Venture Stage</span>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td key={c.id} className="p-5 border-l border-slate-100">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800">
                          {c.stage || "EARLY_STAGE"}
                        </span>
                      </td>
                    ))}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Risk Level */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <span>Risk Assessment</span>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const tone =
                        c.riskLevel === "LOW"
                          ? "bg-emerald-50 text-emerald-800"
                          : c.riskLevel === "HIGH"
                            ? "bg-rose-50 text-rose-800"
                            : "bg-amber-50 text-amber-800";

                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${tone}`}>
                            {c.riskLevel || "MEDIUM"}
                          </span>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* ESG Sustainability */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>ESG Sustainability Audit</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const isTopEsg = c.id === highlights.topEsgId;
                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Rating {c.esgRating || "Not Rated"}
                            </span>
                            {isTopEsg && c.esgRating && (
                              <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                ESG Leader
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Impact Metric */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <span>Stated Impact Metric</span>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td key={c.id} className="p-5 border-l border-slate-100 text-slate-600 font-medium">
                        {c.impactMetric || "No stated ESG metric"}
                      </td>
                    ))}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* ================= SECTION 3: DUE DILIGENCE & TRACTION ================= */}
                  <tr className="bg-slate-100/70">
                    <td
                      colSpan={colCount}
                      className="px-5 py-2.5 font-bold uppercase tracking-wider text-[11px] text-slate-700"
                    >
                      3. Diligence, Milestones & Social Proof
                    </td>
                  </tr>

                  {/* Milestones count */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <Milestone className="w-4 h-4 text-emerald-700" />
                        <span>Execution Milestones</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => {
                      const totalM = c.milestones?.length || 0;
                      const completedM =
                        c.milestones?.filter((m) => m.isCompleted).length || 0;

                      return (
                        <td key={c.id} className="p-5 border-l border-slate-100">
                          <span className="font-bold text-slate-900">{completedM}</span>
                          <span className="text-slate-500"> of {totalM} completed</span>
                        </td>
                      );
                    })}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* Investor Interest Bookmarks */}
                  <tr>
                    <td className="p-5 font-bold text-slate-800 bg-slate-50/40">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-emerald-700" />
                        <span>Investor Watchlist Adds</span>
                      </div>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td key={c.id} className="p-5 border-l border-slate-100 text-slate-700">
                        <span className="font-bold text-slate-950">
                          {c._count?.bookmarks || c.bookmarkCount || 0}
                        </span>{" "}
                        accredited investors
                      </td>
                    ))}
                    {hasEmptySlot && <td className="p-5 border-l border-slate-100 bg-slate-50/20" />}
                  </tr>

                  {/* ================= SECTION 4: ACTIONS ================= */}
                  <tr className="bg-slate-50/50">
                    <td className="p-5 bg-slate-50/80 font-bold text-slate-800">
                      <span>Outreach & Diligence</span>
                    </td>
                    {selectedCampaigns.map((c) => (
                      <td key={c.id} className="p-5 border-l border-slate-100">
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setActiveConnectCampaign(c)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#078457] text-white text-xs font-bold hover:bg-[#066e48] transition shadow-xs"
                          >
                            <Handshake className="w-3.5 h-3.5" />
                            <span>Connect Founder</span>
                          </button>

                          <Link
                            href={`/funds/${c.slug}`}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                          >
                            <span>View Full Pitch</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    ))}
                    {hasEmptySlot && (
                      <td className="p-5 border-l border-slate-100 bg-slate-50/30 text-center">
                        <button
                          type="button"
                          onClick={() => setIsPickerOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Select another deal
                        </button>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscription Upgrade Callout */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#10b981] font-extrabold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Unlimited Deals Comparison</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Want deep due diligence & custom CSV exports?
            </h3>
            <p className="text-xs md:text-sm text-slate-200 max-w-xl">
              Upgrade to the Investor Pro subscription tier to unlock unlimited business comparisons, direct chat with entrepreneur founders, and downloadable financial audit sheets.
            </p>
          </div>

          <Link
            href="/subscription"
            className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Explore Subscription Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />

      {/* Modal Pickers */}
      <DealComparePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectCampaign={handleAddCampaign}
        alreadySelectedIds={selectedIds}
        maxAllowed={4}
      />

      <ConnectFounderModal
        isOpen={Boolean(activeConnectCampaign)}
        onClose={() => setActiveConnectCampaign(null)}
        campaign={activeConnectCampaign}
      />
    </div>
  );
}

export default function BusinessComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <InvestraLoader label="Loading comparison matrix…" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
