"use client";

import React from "react";
import Link from "next/link";

export default function CTASection() {
  return (
    <div className="bg-[#064e3b] text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-sm">
        <h4 className="font-heading font-extrabold text-lg md:text-xl">
          Join the Future of Investing
        </h4>
        <p className="text-xs text-emerald-100 font-light">
          Ready to grow your wealth sustainably?
        </p>
      </div>

      <div>
        <Link 
          href="/register" 
          className="inline-block bg-white hover:bg-slate-50 text-[#064e3b] text-xs font-bold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Start Your Journey Today
        </Link>
      </div>
    </div>
  );
}
