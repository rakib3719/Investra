"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  CheckCircle2,
  Filter,
  Handshake,
  Leaf,
  Scale,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Panel, ProgressBar, StatusPill } from "../InvestorUI";
import {
  useCampaignsQuery,
  useCategoriesQuery,
} from "@/lib/campaigns/campaigns-hooks";
import {
  useBookmarkIdsQuery,
  useToggleBookmarkMutation,
} from "@/lib/bookmarks/bookmarks-hooks";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import {
  ConnectFounderModal,
  type ConnectFounderTarget,
} from "@/components/deals/ConnectFounderModal";
import { CompareFloatingDock, type DockDeal } from "@/components/deals/CompareFloatingDock";

export function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeConnectCampaign, setActiveConnectCampaign] =
    useState<ConnectFounderTarget | null>(null);
  const [compareDeals, setCompareDeals] = useState<DockDeal[]>([]);

  const { data: categoriesData } = useCategoriesQuery();
  const { data: bookmarkIds = [] } = useBookmarkIdsQuery();
  const toggleBookmark = useToggleBookmarkMutation();

  const queryParams = useMemo(() => {
    return {
      category: selectedCategory === "All" ? undefined : selectedCategory,
      search: search.trim() || undefined,
      limit: 24,
    };
  }, [selectedCategory, search]);

  const { data: campaignsData, isLoading } = useCampaignsQuery(queryParams);

  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return ["All", ...categoriesData.map((c) => c.name)];
    }
    return ["All", "FinTech", "Clean Energy", "SaaS", "AgriTech", "HealthTech", "AI & Automation"];
  }, [categoriesData]);

  const campaigns = campaignsData?.items || [];

  const handleToggleBookmark = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const isBookmarked = bookmarkIds.includes(businessId);
    toggleBookmark.mutate({ businessId, isBookmarked });
  };

  const handleToggleCompare = (deal: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (compareDeals.some((d) => d.id === deal.id)) {
      setCompareDeals(compareDeals.filter((d) => d.id !== deal.id));
    } else {
      if (compareDeals.length >= 4) {
        alert("You can compare up to 4 deals at a time.");
        return;
      }
      setCompareDeals([
        ...compareDeals,
        {
          id: deal.id,
          title: deal.title,
          slug: deal.slug,
          bannerImage: deal.bannerImage,
        },
      ]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <Panel className="overflow-hidden bg-gradient-to-r from-[#043f31] via-[#065f46] to-[#0c7a59] p-6 text-white sm:p-8">
        <div className="max-w-2xl">
          <StatusPill tone="green">Verified Deal Pipeline</StatusPill>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Discover vetted opportunities shaping high-growth markets.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">
            Every venture round is evaluated for milestone integrity, founder transparency, and market viability. Save rounds to your watchlist or connect directly with founders.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-emerald-50">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Verified due diligence
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Direct founder access
            </span>
            <span className="inline-flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Zero on-platform fees
            </span>
          </div>
        </div>
      </Panel>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search deals, keywords, or founder names..."
          />
        </label>
        <div className="flex gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600">
            <Filter className="h-4 w-4" />
            <span>{campaigns.length} Opportunities</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((filter) => {
          const isActive = selectedCategory === filter;
          return (
            <button
              type="button"
              key={filter}
              onClick={() => setSelectedCategory(filter)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-emerald-800 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Campaign Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <InvestraInlineLoader label="Loading investment opportunities..." />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Leaf className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            No opportunities found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            No active funding rounds match your current filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
            className="mt-4 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {campaigns.map((deal) => {
            const target = Number(deal.targetAmount) || 1;
            const raised = Number(deal.raisedAmount) || 0;
            const fundedPercent = Math.min(
              Math.round((raised / target) * 100),
              100,
            );
            const isBookmarked = bookmarkIds.includes(deal.id);
            const isCompared = compareDeals.some((d) => d.id === deal.id);
            const bookmarkCount =
              (deal.bookmarkCount ?? deal._count?.bookmarks ?? 0) +
              (isBookmarked ? 1 : 0);

            return (
              <article
                key={deal.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
              >
                <div>
                  {/* Header visual banner */}
                  <div className="relative h-36 bg-gradient-to-br from-[#064e3b] via-[#043f31] to-slate-900 p-5 text-white">
                    {deal.bannerImage && (
                      <img
                        src={deal.bannerImage}
                        alt={deal.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-25"
                      />
                    )}
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold backdrop-blur">
                        {deal.stage}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleCompare(deal, e)}
                          className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${
                            isCompared
                              ? "bg-emerald-600 text-white shadow-md ring-2 ring-white"
                              : "bg-white/15 text-white hover:bg-white/25"
                          }`}
                          title={
                            isCompared
                              ? "Remove from compare"
                              : "Add to compare matrix"
                          }
                          aria-label={
                            isCompared
                              ? `Remove ${deal.title} from compare`
                              : `Add ${deal.title} to compare`
                          }
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(deal.id, e)}
                          className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${
                            isBookmarked
                              ? "bg-white text-emerald-800 shadow-md"
                              : "bg-white/15 text-white hover:bg-white/25"
                          }`}
                          title={
                            isBookmarked
                              ? "Remove from watchlist"
                              : "Save to watchlist"
                          }
                          aria-label={
                            isBookmarked
                              ? `Remove ${deal.title} from watchlist`
                              : `Save ${deal.title} to watchlist`
                          }
                        >
                          <Bookmark
                            className={`h-4 w-4 ${
                              isBookmarked ? "fill-emerald-800 text-emerald-800" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5 z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                        {deal.category?.name || "Venture"}
                      </p>
                      <h3 className="mt-1 truncate text-lg font-bold text-white">
                        {deal.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <StatusPill tone="green">
                        {deal.riskLevel} Risk
                      </StatusPill>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Bookmark className="h-3.5 w-3.5 text-emerald-600" />
                        {bookmarkCount} saved
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
                      {deal.tagline || deal.pitchText}
                    </p>

                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-500">
                          {fundedPercent}% funded
                        </span>
                        <strong className="text-slate-800">
                          ${raised.toLocaleString()} / ${target.toLocaleString()}
                        </strong>
                      </div>
                      <ProgressBar value={fundedPercent} />
                    </div>

                    <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5">
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider text-slate-400">
                          Minimum
                        </dt>
                        <dd className="mt-1 text-xs font-bold text-slate-800 truncate">
                          ${Number(deal.minInvestment).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider text-slate-400">
                          Target IRR
                        </dt>
                        <dd className="mt-1 text-xs font-bold text-emerald-700">
                          {Number(deal.projectedIrr) || 0}%
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider text-slate-400">
                          Valuation
                        </dt>
                        <dd className="mt-1 text-xs font-bold text-slate-800 truncate">
                          {deal.valuation ? `$${Number(deal.valuation).toLocaleString()}` : "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveConnectCampaign(deal)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-700/20 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <Handshake className="h-3.5 w-3.5" />
                    Connect
                  </button>
                  <Link
                    href={`/funds/${deal.slug}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#065f46] py-2.5 text-xs font-bold text-white transition hover:bg-[#044c38]"
                  >
                    Review <TrendingUp className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Connect with Founder Modal */}
      <ConnectFounderModal
        isOpen={Boolean(activeConnectCampaign)}
        onClose={() => setActiveConnectCampaign(null)}
        campaign={activeConnectCampaign}
      />

      {/* Floating Compare Dock */}
      <CompareFloatingDock
        selectedDeals={compareDeals}
        onRemoveDeal={(id) => setCompareDeals((d) => d.filter((item) => item.id !== id))}
        onClearAll={() => setCompareDeals([])}
      />
    </div>
  );
}
