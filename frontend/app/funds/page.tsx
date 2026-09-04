"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  Handshake,
} from "lucide-react";
import { useCampaignsQuery, useCategoriesQuery } from "@/lib/campaigns/campaigns-hooks";
import { useBookmarkIdsQuery, useToggleBookmarkMutation } from "@/lib/bookmarks/bookmarks-hooks";
import type { Campaign, RiskLevel } from "@/lib/campaigns/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { ConnectFounderModal, type ConnectFounderTarget } from "@/components/deals/ConnectFounderModal";

const fallbackCampaigns: Campaign[] = [
  {
    id: "1",
    entrepreneurId: "e1",
    title: "Apex FinTech Core Banking API",
    slug: "apex-fintech-core-banking-api",
    category: { id: "c1", name: "FinTech", slug: "fintech" },
    categoryId: "c1",
    stage: "GROWTH",
    riskLevel: "LOW",
    pitchText: "Next-gen banking infrastructure API and transaction processing layer for micro-merchants in emerging markets.",
    entrepreneur: {
      id: "e1",
      firstName: "Tariqul",
      lastName: "Islam",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    bannerImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 1200000,
    raisedAmount: 780000,
    projectedIrr: 18.5,
    minInvestment: 2500,
    impactMetric: "40K Active Merchants",
    status: "ACTIVE",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    entrepreneurId: "e2",
    title: "SolarGrid Bangladesh Ltd",
    slug: "solargrid-bangladesh-ltd",
    category: { id: "c2", name: "Clean Energy", slug: "clean-energy" },
    categoryId: "c2",
    stage: "EARLY_STAGE",
    riskLevel: "MEDIUM",
    pitchText: "Decentralized smart solar microgrids powering rural industrial clusters with zero carbon emissions.",
    entrepreneur: {
      id: "e2",
      firstName: "Mominul",
      lastName: "Haque",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
    bannerImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 2000000,
    raisedAmount: 1450000,
    projectedIrr: 22.0,
    minInvestment: 5000,
    impactMetric: "12MW Clean Power",
    status: "ACTIVE",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function InvestmentFundsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [activeConnectCampaign, setActiveConnectCampaign] = useState<ConnectFounderTarget | null>(null);

  const { data: bookmarkIds = [] } = useBookmarkIdsQuery();
  const toggleBookmark = useToggleBookmarkMutation();

  const handleToggleBookmark = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const isBookmarked = bookmarkIds.includes(businessId);
    toggleBookmark.mutate({ businessId, isBookmarked });
  };

  const queryParams = useMemo(() => ({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    riskLevel: selectedRisk === "All" ? undefined : (selectedRisk.toUpperCase() as RiskLevel),
    search: searchQuery.trim() || undefined,
    page,
    limit: 9,
  }), [selectedCategory, selectedRisk, searchQuery, page]);

  const { data: apiData, isLoading, isError } = useCampaignsQuery(queryParams);

  const displayedCampaigns = useMemo(() => {
    if (apiData?.items && apiData.items.length > 0) {
      return apiData.items;
    }
    // Filter fallback if search/category matches
    if (!isLoading && !isError && apiData?.items && apiData.items.length === 0) {
      return [];
    }
    return fallbackCampaigns;
  }, [apiData, isLoading, isError]);

  const totalPages = apiData?.meta?.totalPages || 1;

  const { data: categoriesData } = useCategoriesQuery();
  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return ["All", ...categoriesData.map((c) => c.name)];
    }
    return ["All", "FinTech", "Clean Energy", "SaaS", "AgriTech", "HealthTech", "AI & Automation"];
  }, [categoriesData]);

  const risks = ["All", "Low", "Medium", "High"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="w-full pb-20 pt-8">
        {/* Hero & Title Banner */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mb-12">
          <div className="bg-[#182B45] rounded-3xl p-8 md:p-12 relative overflow-hidden text-white shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-heading font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Investment Directory</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">
                Explore High-Yield <span className="text-emerald-400">Startup Campaigns</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-body leading-relaxed max-w-2xl">
                Discover accredited ventures, track IRR metrics, inspect transparent milestones, and back early-stage founders shaping tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company name, keywords, or pitch..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-body transition-colors"
              />
            </div>

            {/* Category Pills & Risk Select */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1 font-heading">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-heading ${
                    selectedCategory === cat
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Risk Select */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-500 font-heading">Risk:</span>
              <select
                value={selectedRisk}
                onChange={(e) => {
                  setSelectedRisk(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                {risks.map((r) => (
                  <option key={r} value={r}>
                    {r} {r !== "All" ? "Risk" : ""}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* Campaign Cards Grid */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <InvestraInlineLoader label="Loading verified campaigns..." />
            </div>
          ) : displayedCampaigns.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold font-heading text-slate-700">No campaigns found</h3>
              <p className="text-sm text-slate-400 font-body">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedCampaigns.map((camp) => {
                const target = Number(camp.targetAmount) || 1;
                const raised = Number(camp.raisedAmount) || 0;
                const percent = Math.min(Math.round((raised / target) * 100), 100);
                const categoryName = camp.category?.name || "General";
                const ownerName = camp.entrepreneur
                  ? `${camp.entrepreneur.firstName || ""} ${camp.entrepreneur.lastName || ""}`.trim() || "Verified Founder"
                  : "Verified Founder";

                const isBookmarked = bookmarkIds.includes(camp.id);

                return (
                  <SpotlightCard
                    key={camp.id}
                    spotlightColor="rgba(16, 185, 129, 0.08)"
                    className="bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={camp.bannerImage || "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"}
                          alt={camp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-[#064E3B] text-white text-[10px] font-bold font-heading px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {categoryName}
                          </span>
                          <span className={`text-white text-[10px] font-bold font-heading px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            camp.riskLevel === "LOW" ? "bg-emerald-600" : camp.riskLevel === "MEDIUM" ? "bg-amber-600" : "bg-rose-600"
                          }`}>
                            {camp.riskLevel} Risk
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            type="button"
                            onClick={(e) => handleToggleBookmark(camp.id, e)}
                            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${
                              isBookmarked
                                ? "bg-white text-emerald-800 shadow-md"
                                : "bg-black/40 text-white hover:bg-black/60"
                            }`}
                            title={isBookmarked ? "Remove from watchlist" : "Save to watchlist"}
                            aria-label={isBookmarked ? `Remove ${camp.title} from watchlist` : `Save ${camp.title} to watchlist`}
                          >
                            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-emerald-800 text-emerald-800" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-heading font-bold text-[#182B45] hover:text-emerald-700 transition-colors line-clamp-1">
                          <Link href={`/funds/${camp.slug}`}>{camp.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-body leading-relaxed line-clamp-2">
                          {camp.tagline || camp.pitchText}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Financials */}
                    <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/40">
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold font-heading">
                          <span className="text-slate-500">Funded: {percent}%</span>
                          <span className="text-[#064E3B]">${raised.toLocaleString()} / ${target.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Key Stats Pill */}
                      <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200/60 rounded-xl p-2.5 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-heading font-semibold">Est. IRR</p>
                          <p className="text-xs font-bold text-emerald-600">{Number(camp.projectedIrr) || 0}%</p>
                        </div>
                        <div className="border-x border-slate-100">
                          <p className="text-[9px] text-slate-400 uppercase font-heading font-semibold">Min Ticket</p>
                          <p className="text-xs font-bold text-slate-800">${Number(camp.minInvestment).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-heading font-semibold">Stage</p>
                          <p className="text-xs font-bold text-[#182B45]">{camp.stage}</p>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={camp.entrepreneur?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={ownerName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <p className="text-xs font-bold text-slate-700 font-heading truncate max-w-[100px]">{ownerName}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveConnectCampaign(camp)}
                            className="inline-flex items-center gap-1 text-xs font-bold font-heading text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Handshake className="w-3.5 h-3.5" /> Connect
                          </button>
                          <Link
                            href={`/funds/${camp.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold font-heading text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Pitch <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}

          {/* Connect Modal */}
          <ConnectFounderModal
            isOpen={Boolean(activeConnectCampaign)}
            onClose={() => setActiveConnectCampaign(null)}
            campaign={activeConnectCampaign}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-heading text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
