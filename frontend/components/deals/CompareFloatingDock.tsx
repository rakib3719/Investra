"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Scale, Trash2, X } from "lucide-react";

export interface DockDeal {
  id: string;
  title: string;
  slug: string;
  bannerImage?: string;
}

interface CompareFloatingDockProps {
  selectedDeals: DockDeal[];
  onRemoveDeal: (id: string) => void;
  onClearAll: () => void;
}

export function CompareFloatingDock({
  selectedDeals,
  onRemoveDeal,
  onClearAll,
}: CompareFloatingDockProps) {
  if (selectedDeals.length === 0) return null;

  const compareUrl = `/compare?funds=${selectedDeals.map((d) => d.slug).join(",")}`;
  const canCompare = selectedDeals.length >= 2;

  return (
    <aside
      aria-label="Active deal comparison dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 transition-all duration-300"
    >
      {/* Left: Indicator & Thumbnails */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <Scale className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {selectedDeals.map((deal) => (
            <div
              key={deal.id}
              className="relative group shrink-0"
              title={deal.title}
            >
              {deal.bannerImage ? (
                <img
                  src={deal.bannerImage}
                  alt={deal.title}
                  className="h-9 w-9 rounded-lg object-cover border border-slate-700"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
                  {deal.title.slice(0, 2).toUpperCase()}
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemoveDeal(deal.id)}
                className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-rose-600 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition shadow-xs"
                title={`Remove ${deal.title}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}

          <span className="text-xs font-bold text-slate-300 whitespace-nowrap pl-1">
            {selectedDeals.length}/4
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 transition"
        >
          Clear
        </button>

        {canCompare ? (
          <Link
            href={compareUrl}
            className="inline-flex items-center gap-1.5 bg-[#078457] hover:bg-[#066e48] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <span>Compare Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="text-[11px] font-semibold text-amber-400 px-2 py-1">
            Pick 1 more deal
          </span>
        )}
      </div>
    </aside>
  );
}
