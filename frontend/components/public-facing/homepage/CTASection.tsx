"use client";

import React from "react";
import Link from "next/link";

export default function CTASection() {
  return (
    <div className="bg-gradient-to-br from-[#064e3b] to-[#043c2e] text-white p-[26px] md:p-[34px] rounded-[21px] flex flex-col sm:flex-row sm:items-center justify-between gap-[21px] shadow-md">
      <div className="space-y-[6px] max-w-sm">
        <div className="inline-flex items-center gap-[6px] text-[10px] font-bold uppercase tracking-wider text-emerald-300 font-heading">
          <span> Immediate Access</span>
        </div>
        <h4 className="font-heading font-black text-[18px] md:text-[21px] leading-tight">
          Join the Future of Venture Investing
        </h4>
        <p className="text-[13px] text-emerald-100/90 font-body leading-[21px]">
          Ready to back audited, high-growth startups with proven traction?
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href="/register"
          className="inline-block bg-white hover:bg-slate-50 text-[#064e3b] text-[13px] font-bold px-[26px] py-[13px] rounded-[10px] transition-all shadow-xs hover:shadow-md whitespace-nowrap cursor-pointer font-heading"
        >
          Start Your Journey Today →
        </Link>
      </div>
    </div>
  );
}
