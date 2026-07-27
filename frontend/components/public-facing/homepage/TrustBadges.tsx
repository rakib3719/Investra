"use client";

import React from "react";

export default function TrustBadges() {
  return (
    <section className="w-full bg-slate-50 border-y border-slate-100 py-5">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] flex flex-wrap items-center justify-between gap-6">
        
        {/* Badge 1: Certified B Corp */}
        <div className="flex flex-col items-center justify-center text-[#0f172a] font-sans scale-90">
          <span className="text-[7px] font-black uppercase tracking-wider leading-none mb-1 text-slate-500">Certified</span>
          <div className="w-8 h-8 rounded-full border border-[#0f172a] flex items-center justify-center font-black text-lg relative">
            <span className="mb-0.5">B</span>
            <div className="absolute bottom-1.5 left-2 right-2 h-px bg-[#0f172a]" />
          </div>
          <span className="text-[7px] font-black uppercase tracking-wider leading-none mt-1 text-slate-500">Corporation</span>
        </div>

        <div className="hidden md:block w-px h-6 bg-slate-200" />

        {/* Badge 2: PRI Signatory */}
        <div className="flex items-center gap-1.5 text-[#0f172a]">
          <div className="flex flex-col gap-0.5 justify-center items-end text-[#0f172a]">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
            </div>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
            </div>
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
              <div className="w-1.5 h-1.5 bg-[#0f172a]"></div>
            </div>
          </div>
          <span className="font-heading font-black text-base tracking-tighter pl-1">PRI</span>
          <div className="text-[8px] border-l border-slate-300 pl-1.5 leading-none text-slate-500 font-black uppercase tracking-wider">
            <span>Signatory</span>
            <span className="block mt-0.5">of</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-slate-200" />

        {/* Badge 3: ESG Rated */}
        <div className="flex items-center gap-1.5 text-[#0f172a]">
          <svg className="w-6 h-6 text-[#0f172a]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4c-1 3-3 6-7 8 3-1 5-3 7-8z" />
            <path d="M12 4c1 3 3 6 7 8-3-1-5-3-7-8z" />
            <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="text-left leading-none font-sans">
            <span className="block font-heading font-black text-sm tracking-tighter">ESG</span>
            <span className="block text-[8px] uppercase tracking-wider font-black text-slate-500 mt-0.5">Rated</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-slate-200" />

        {/* Badge 4: Global Impact Award */}
        <div className="flex items-center gap-1.5 text-[#0f172a]">
          <svg className="w-7 h-7 text-[#0f172a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 12a7.5 7.5 0 0 0 15 0" />
            <path d="M6 12a6 6 0 0 1 12 0" strokeDasharray="1,1.5" />
            <circle cx="12" cy="12" r="4.5" strokeWidth="1.2" />
            <path d="M12 7.5v9" />
            <path d="M7.5 12h9" />
          </svg>
          <div className="text-left font-sans leading-none">
            <span className="block font-black text-xs">Global</span>
            <span className="block text-[8px] font-black text-slate-500 mt-0.5">Impact Award</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-slate-200" />

        {/* Badge 5: Trusted Partners */}
        <div className="text-left font-sans leading-none text-[#0f172a]">
          <span className="block font-black text-sm">Trusted</span>
          <span className="block text-[10px] font-black text-slate-500 mt-0.5">Partners</span>
        </div>
      </div>
    </section>
  );
}
