"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  Compass,
  Handshake,
  Leaf,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import {
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "../InvestorUI";
import {
  useBookmarksQuery,
  useToggleBookmarkMutation,
} from "@/lib/bookmarks/bookmarks-hooks";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import {
  ConnectFounderModal,
  type ConnectFounderTarget,
} from "@/components/deals/ConnectFounderModal";

export function WatchlistPage() {
  const [activeConnectCampaign, setActiveConnectCampaign] =
    useState<ConnectFounderTarget | null>(null);

  const { data: bookmarks = [], isLoading } = useBookmarksQuery();
  const toggleBookmark = useToggleBookmarkMutation();

  const handleRemoveBookmark = (businessId: string) => {
    toggleBookmark.mutate({ businessId, isBookmarked: true });
  };

  const totalSaved = bookmarks.length;

  const totalTargetCapital = useMemo(() => {
    return bookmarks.reduce(
      (acc, item) => acc + (Number(item.business?.targetAmount) || 0),
      0,
    );
  }, [bookmarks]);

  const avgIrr = useMemo(() => {
    if (bookmarks.length === 0) return "0.0";
    const sum = bookmarks.reduce(
      (acc, item) => acc + (Number(item.business?.projectedIrr) || 0),
      0,
    );
    return (sum / bookmarks.length).toFixed(1);
  }, [bookmarks]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Saved opportunities</h2>
          <p className="mt-1 text-sm text-slate-500">
            Follow funding progress, milestone updates, and connect with venture founders.
          </p>
        </div>
        <Link
          href="/dashboard/investor/opportunities"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          <Compass className="h-4 w-4" /> Discover more deals
        </Link>
      </div>

      {/* Telemetry Summary Panels */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-xs font-semibold text-slate-500">Saved opportunities</p>
          <strong className="mt-2 block text-3xl text-slate-950">
            {totalSaved}
          </strong>
          <p className="mt-1 text-xs text-emerald-700">In your private watchlist</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-semibold text-slate-500">Total Round Capital</p>
          <strong className="mt-2 block text-3xl text-slate-950">
            ${totalTargetCapital.toLocaleString()}
          </strong>
          <p className="mt-1 text-xs text-slate-500">Combined target valuation</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-semibold text-slate-500">Average target IRR</p>
          <strong className="mt-2 block text-3xl text-emerald-700">
            {avgIrr}%
          </strong>
          <p className="mt-1 text-xs text-slate-500">Across saved opportunities</p>
        </Panel>
      </div>

      {/* Watchlist Main Container */}
      <Panel className="overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <SectionHeading
            title="Your Watchlist"
            description="Campaigns you are actively tracking"
            action={
              <span className="text-xs font-bold text-slate-500">
                {totalSaved} {totalSaved === 1 ? "campaign" : "campaigns"}
              </span>
            }
          />
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <InvestraInlineLoader label="Loading your saved watchlist..." />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Bookmark className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              Your watchlist is empty
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Browse through curated opportunities and bookmark the campaigns you want to track or connect with.
            </p>
            <Link
              href="/dashboard/investor/opportunities"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#065f46] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#044c38] transition"
            >
              <Compass className="h-4 w-4" /> Explore opportunities
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookmarks.map((item) => {
              const camp = item.business;
              if (!camp) return null;

              const target = Number(camp.targetAmount) || 1;
              const raised = Number(camp.raisedAmount) || 0;
              const funded = Math.min(Math.round((raised / target) * 100), 100);
              const founderName = camp.entrepreneur
                ? `${camp.entrepreneur.firstName || ""} ${camp.entrepreneur.lastName || ""}`.trim() || "Verified Founder"
                : "Verified Founder";

              return (
                <article
                  key={item.id}
                  className="p-5 transition hover:bg-emerald-50/20 sm:p-6"
                >
                  <div className="grid gap-5 xl:grid-cols-[minmax(260px,1.4fr)_1fr_1fr_auto] items-center">
                    {/* Venture & Founder info */}
                    <div className="flex items-start gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Leaf className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {camp.title}
                          </h3>
                          <StatusPill tone="green">
                            {camp.riskLevel} Risk
                          </StatusPill>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {camp.category?.name || "Venture"} · {camp.stage}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Lead founder: {founderName}
                        </p>
                      </div>
                    </div>

                    {/* Funding progress */}
                    <div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Funding progress</span>
                        <strong className="text-slate-800">
                          {funded}% (${raised.toLocaleString()})
                        </strong>
                      </div>
                      <ProgressBar value={funded} className="mt-2" />
                    </div>

                    {/* Financial details */}
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-slate-400">
                          Target IRR
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-emerald-700">
                          {Number(camp.projectedIrr) || 0}%
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-slate-400">
                          Minimum
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-slate-800">
                          ${Number(camp.minInvestment).toLocaleString()}
                        </dd>
                      </div>
                    </dl>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveConnectCampaign(camp)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700/20 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                      >
                        <Handshake className="h-3.5 w-3.5" />
                        Connect
                      </button>
                      <Link
                        href={`/funds/${camp.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#065f46] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#044c38] transition"
                      >
                        Review <TrendingUp className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(camp.id)}
                        aria-label="Remove from watchlist"
                        title="Remove from watchlist"
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <BookmarkX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      {/* Connect with Founder Modal */}
      <ConnectFounderModal
        isOpen={Boolean(activeConnectCampaign)}
        onClose={() => setActiveConnectCampaign(null)}
        campaign={activeConnectCampaign}
      />
    </div>
  );
}
