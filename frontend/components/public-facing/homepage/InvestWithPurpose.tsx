"use client";

import React from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Sign Up & Verify",
    description: "Complete identity verification and accreditation in minutes.",
    icon: (
      <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Discover Ventures",
    description: "Explore audited pitch decks, traction milestones, and financials.",
    icon: (
      <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Commit Capital",
    description: "Participate in rounds with institutional governance and transparency.",
    icon: (
      <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Track Performance",
    description: "Real-time IRR benchmarks, cap table updates, and exit insights.",
    icon: (
      <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function InvestWithPurpose() {
  return (
    <div className="space-y-[21px] bg-slate-50/70 border border-slate-200/80 p-[26px] rounded-[21px]">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-black text-[21px] md:text-[26px] text-[#064e3b]">
          Invest with Purpose
        </h3>
        <span className="text-[10px] font-bold px-[10px] py-[4px] rounded-full bg-emerald-100/70 text-emerald-800 font-heading">
          4-Step Flow
        </span>
      </div>

      <div className="grid grid-cols-2 gap-[21px]">
        {steps.map((step) => (
          <div key={step.id} className="space-y-[8px]">
            <div className="flex items-center gap-[10px]">
              <span className="font-heading font-black text-[21px] text-emerald-800">
                0{step.id}
              </span>
              <div className="w-[34px] h-[34px] rounded-[10px] bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                {step.icon}
              </div>
            </div>
            <h4 className="font-heading font-bold text-[14px] text-slate-900 leading-tight">
              {step.title}
            </h4>
            <p className="text-[12px] text-slate-600 leading-[19px] font-body">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
