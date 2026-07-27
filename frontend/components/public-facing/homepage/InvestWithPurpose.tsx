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
    description: "Sign up your verify atien and corrains.",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Discover Funds",
    description: "Discover funds and contents.",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Make Your Impact",
    description: "Make your impact on somer process.",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Track Performance",
    description: "Track performance results and investment.",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function InvestWithPurpose() {
  return (
    <div className="space-y-6">
      <h3 className="font-heading font-black text-2xl text-[#064e3b] text-center lg:text-left">
        Invest with Purpose
      </h3>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {steps.map((step) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl text-[#064e3b]">
                {step.id}
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                {step.icon}
              </div>
            </div>
            <h4 className="font-heading font-bold text-sm text-[#064e3b] leading-tight">
              {step.title}
            </h4>
            <p className="text-[11px] text-slate-700 leading-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
