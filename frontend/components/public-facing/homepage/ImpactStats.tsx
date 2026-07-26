"use client";

import React from "react";

export default function ImpactStats() {
  return (
    <div className="space-y-6 pt-4 border-t border-slate-100">
      <h3 className="font-heading font-black text-2xl text-[#064e3b] text-center lg:text-left">
        Impactful Results
      </h3>

      <div className="flex items-center justify-between gap-4 py-2 text-center">
        {/* Stat 1 */}
        <div className="flex-1 space-y-1">
          <p className="font-heading font-extrabold text-xl md:text-2xl text-[#064e3b] leading-none">
            $1.2B+
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-700">
            Capital Invested
          </p>
        </div>

        <div className="w-px h-10 bg-slate-200" />

        {/* Stat 2 */}
        <div className="flex-1 space-y-1">
          <p className="font-heading font-extrabold text-xl md:text-2xl text-[#064e3b] leading-none">
            15M+
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-700">
            Tons CO2 Averted
          </p>
        </div>

        <div className="w-px h-10 bg-slate-200" />

        {/* Stat 3 */}
        <div className="flex-1 space-y-1">
          <p className="font-heading font-extrabold text-xl md:text-2xl text-[#064e3b] leading-none">
            50k+
          </p>
          <p className="text-[10px] md:text-xs font-bold text-slate-700">
            Hectares Protected
          </p>
        </div>
      </div>
    </div>
  );
}
