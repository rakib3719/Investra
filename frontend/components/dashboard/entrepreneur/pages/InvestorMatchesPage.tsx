"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Filter,
  Handshake,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  MetricCard,
  Panel,
  PrimaryButton,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";

const matches = [
  {
    id: "1",
    firm: "Northstar Climate Ventures",
    leadPartner: "Evelyn Reed",
    checkSize: "$250K – $1.5M",
    sectors: ["Clean Energy", "Mobility"],
    matchScore: 98,
    status: "Ready to meet",
    statusTone: "green" as const,
    location: "London, UK",
    introSummary: "Actively deploying Series Seed and Series A capital into decarbonization and clean-tech startups.",
  },
  {
    id: "2",
    firm: "Bluefield Growth Equity",
    leadPartner: "Marcus Vance",
    checkSize: "$500K – $2.0M",
    sectors: ["FinTech", "SaaS"],
    matchScore: 94,
    status: "In due diligence",
    statusTone: "blue" as const,
    location: "Singapore",
    introSummary: "Focuses on emerging market financial inclusion and high-margin B2B business infrastructure.",
  },
  {
    id: "3",
    firm: "Mango Seed Accelerator Fund",
    leadPartner: "Amina Al-Mansoor",
    checkSize: "$100K – $500K",
    sectors: ["AgriTech", "Supply Chain"],
    matchScore: 88,
    status: "Reviewing pitch",
    statusTone: "amber" as const,
    location: "Dubai, UAE",
    introSummary: "Backs early-stage founders with strong regional operational distribution and sustainable unit economics.",
  },
  {
    id: "4",
    firm: "Apex Impact Partners",
    leadPartner: "Julian Thorne",
    checkSize: "$300K – $1.0M",
    sectors: ["Circular Economy", "Real Assets"],
    matchScore: 85,
    status: "New match",
    statusTone: "slate" as const,
    location: "San Francisco, CA",
    introSummary: "Mandated to invest in ESG-compliant technologies with tangible community and ecological yields.",
  },
];

export function InvestorMatchesPage() {
  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <Panel className="overflow-hidden bg-gradient-to-r from-[#043f31] via-[#065f46] to-[#0c7a59] p-6 text-white sm:p-8">
        <div className="max-w-2xl">
          <StatusPill tone="green">8 verified investor matches</StatusPill>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Connect with accredited investors aligned with your thesis.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">
            Investors here have reviewed your sector, business stage, and projected returns, signaling direct interest in your active campaigns.
          </p>
        </div>
      </Panel>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Qualified matches"
          value="42"
          detail="Within 80%+ thesis score"
          icon={Users}
        />
        <MetricCard
          label="Intro requests"
          value="6"
          detail="2 meetings scheduled this week"
          icon={Handshake}
        />
        <MetricCard
          label="Avg. ticket size"
          value="$500K"
          detail="Typical check per investor"
          icon={Building2}
        />
        <MetricCard
          label="Response SLA"
          value="< 48h"
          detail="Investra concierge guarantee"
          icon={CheckCircle2}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search investors by fund name, partner, or sector focus..."
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Highest Match
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {matches.map((inv) => (
          <Panel key={inv.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{inv.firm}</h3>
                  <StatusPill tone={inv.statusTone}>{inv.status}</StatusPill>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lead Partner: <span className="font-semibold text-slate-700">{inv.leadPartner}</span> · {inv.location}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                {inv.matchScore}% Match
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              {inv.introSummary}
            </p>

            <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Check</span>
                <p className="font-semibold text-slate-800">{inv.checkSize}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Focus Areas</span>
                <p className="font-semibold text-slate-800">{inv.sectors.join(", ")}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Verified institutional accredited</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  View Profile
                </button>
                <PrimaryButton>
                  <Calendar className="h-3.5 w-3.5" /> Request Intro
                </PrimaryButton>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
