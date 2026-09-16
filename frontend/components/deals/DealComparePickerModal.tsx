"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Filter,
  Plus,
  Rocket,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import {
  useCampaignsQuery,
  useCategoriesQuery,
} from "@/lib/campaigns/campaigns-hooks";
import type { Campaign } from "@/lib/campaigns/types";
import { curatedFallbackCampaigns } from "@/lib/deals/compare-utils";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

interface DealComparePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  alreadySelectedIds: string[];
  maxAllowed?: number;
}

export function DealComparePickerModal({
  isOpen,
  onClose,
  onSelectCampaign,
  alreadySelectedIds,
  maxAllowed = 4,
}: DealComparePickerModalProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const { data: campaignsData, isLoading } = useCampaignsQuery({ limit: 50 });
  const { data: categoriesData } = useCategoriesQuery();

  // Merge live campaigns with fallback campaigns without duplicates
  const allAvailableCampaigns = useMemo(() => {
    const live = campaignsData?.items || [];
    const existingSlugs = new Set(live.map((c) => c.slug));
    const supplemental = curatedFallbackCampaigns.filter(
      (c) => !existingSlugs.has(c.slug),
    );
    return [...live, ...supplemental];
  }, [campaignsData]);

  // Categories list
  const categories = useMemo(() => {
    const fromApi = (categoriesData || []).map((c) => c.name);
    return ["ALL", ...Array.from(new Set(fromApi))];
  }, [categoriesData]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return allAvailableCampaigns.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.pitchText.toLowerCase().includes(search.toLowerCase()) ||
        (c.category?.name &&
          c.category.name.toLowerCase().includes(search.toLowerCase()));

      const matchesCat =
        categoryFilter === "ALL" ||
        c.category?.name?.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [allAvailableCampaigns, search, categoryFilter]);

  if (!isOpen) return null;

  const reachedMax = alreadySelectedIds.length >= maxAllowed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              <Rocket className="h-3 w-3" />
              Add Opportunity to Matrix
            </div>
            <h3 className="mt-1.5 text-lg font-bold text-slate-900">
              Select Fund to Compare ({alreadySelectedIds.length}/{maxAllowed})
            </h3>
            <p className="text-xs text-slate-500">
              Pick an active deal to add side-by-side to your active comparison table
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by startup name, sector, or keywords…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? "bg-[#064e3b] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <InvestraLoader label="Loading marketplace deals…" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="py-12 text-center">
              <Rocket className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                No matching opportunities found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search terms or selecting &quot;ALL&quot; categories.
              </p>
            </div>
          ) : (
            filteredCampaigns.map((c) => {
              const isSelected =
                alreadySelectedIds.includes(c.id) ||
                alreadySelectedIds.includes(c.slug);

              const target = Number(c.targetAmount) || 1;
              const raised = Number(c.raisedAmount) || 0;
              const progressPct = Math.min(
                100,
                Math.round((raised / target) * 100),
              );

              return (
                <div
                  key={c.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {c.bannerImage ? (
                      <img
                        src={c.bannerImage}
                        alt={c.title}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs">
                        {c.title.slice(0, 2).toUpperCase()}
                      </span>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {c.title}
                        </h4>
                        {c.category?.name && (
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {c.category.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span>
                          Target:{" "}
                          <strong className="text-slate-800">
                            ${target.toLocaleString()}
                          </strong>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          {progressPct}% raised
                        </span>
                        {c.projectedIrr && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#064e3b]">
                              <TrendingUp className="h-3 w-3" />
                              {Number(c.projectedIrr).toFixed(1)}% IRR
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        In Compare
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={reachedMax}
                        onClick={() => {
                          onSelectCampaign(c);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#043c2e] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {reachedMax ? "Matrix Full" : "Add Deal"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {reachedMax
              ? "You have reached the maximum of 4 active deals. Remove one to add another."
              : `You can select up to ${maxAllowed - alreadySelectedIds.length} more opportunity.`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
