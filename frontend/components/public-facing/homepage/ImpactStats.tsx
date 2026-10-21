"use client";

import React from "react";

export default function ImpactStats() {
  return (
    <div className="space-y-[16px] bg-white border border-slate-200/80 p-[26px] rounded-[21px] shadow-2xs">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-black text-[18px] md:text-[21px] text-[#064e3b]">
          Verified Impact Benchmarks
        </h3>
        <span className="text-[10px] font-bold px-[8px] py-[3px] rounded-full bg-slate-100 text-slate-600 font-heading">
          Audited
        </span>
      </div>

      <div className="flex items-center justify-between gap-[16px] py-[8px] text-center">
        {/* Stat 1 */}
        <div className="flex-1 space-y-[4px]">
          <p className="font-heading font-black text-[26px] md:text-[34px] text-[#064e3b] leading-none">
            $1.2B+
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
            Capital Deployed
          </p>
        </div>

        <div className="w-px h-[42px] bg-slate-200 shrink-0" />

        {/* Stat 2 */}
        <div className="flex-1 space-y-[4px]">
          <p className="font-heading font-black text-[26px] md:text-[34px] text-[#064e3b] leading-none">
            15M+
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
            CO2 Averted (Tons)
          </p>
        </div>

        <div className="w-px h-[42px] bg-slate-200 shrink-0" />

        {/* Stat 3 */}
        <div className="flex-1 space-y-[4px]">
          <p className="font-heading font-black text-[26px] md:text-[34px] text-[#064e3b] leading-none">
            120+
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
            Vetted Ventures
          </p>
        </div>
      </div>
    </div>
  );
}
