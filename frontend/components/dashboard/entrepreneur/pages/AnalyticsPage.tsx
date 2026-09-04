"use client";

import {
  Download,
  Eye,
  FileText,
  LineChart,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  InvestorLineChart,
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";

export function AnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* Top Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Venture reach & pipeline telemetry</p>
          <div className="mt-1 flex items-end gap-3">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              1,482 Views
            </h2>
            <StatusPill tone="green">+18.6% vs last month</StatusPill>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" /> Export report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Profile impressions"
          value="1,482"
          detail="Past 30 days"
          change="18.6% increase"
          icon={Eye}
        />
        <MetricCard
          label="Pitch deck reads"
          value="246"
          detail="Full deck downloads"
          change="12 downloads this week"
          icon={FileText}
        />
        <MetricCard
          label="Qualified investor CTR"
          value="16.4%"
          detail="Direct interaction rate"
          change="Top 10% on Investra"
          icon={TrendingUp}
        />
        <MetricCard
          label="Average view duration"
          value="3m 42s"
          detail="Time spent on campaign pitch"
          change="48s above benchmark"
          icon={LineChart}
        />
      </div>

      {/* Performance Graph & Audience Breakdown */}
      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-6 xl:col-span-8">
          <SectionHeading
            title="Investor engagement trend"
            description="Daily traffic and verified investor profile visits"
            action={
              <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 outline-none">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            }
          />
          <div className="mt-5">
            <InvestorLineChart />
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400">
            <span>Day 1</span>
            <span>Day 7</span>
            <span>Day 14</span>
            <span>Day 21</span>
            <span>Day 30</span>
          </div>
        </Panel>

        <Panel className="p-6 xl:col-span-4">
          <SectionHeading
            title="Viewer institution type"
            description="Breakdown of entities inspecting your round"
          />
          <div className="mt-6 space-y-4">
            {[
              { label: "Venture Capital Funds", value: 48 },
              { label: "Family Offices & HNWIs", value: 26 },
              { label: "Corporate Strategy Groups", value: 16 },
              { label: "Syndicate Angels", value: 10 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <span className="text-xs font-bold text-emerald-900">Pro Tip</span>
            <p className="mt-1 text-[11px] leading-5 text-emerald-800">
              Founders who update milestones every 14 days experience a 32% increase in institutional diligence requests.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
