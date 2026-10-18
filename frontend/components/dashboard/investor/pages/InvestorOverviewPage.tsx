"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Inbox,
  Leaf,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  WalletCards,
  Zap,
} from "lucide-react";
import {
  InvestorLineChart,
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "../InvestorUI";
import {
  getInvestorIncomingIntros,
  type InvestorIntroRequestItem,
} from "@/lib/api/portfolio";

const allocation = [
  { label: "Private equity", value: "$473,725", percentage: 38, color: "#065f46" },
  { label: "Venture capital", value: "$349,250", percentage: 28, color: "#10b981" },
  { label: "Impact funds", value: "$224,775", percentage: 18, color: "#5ee0bb" },
  { label: "Real assets", value: "$124,875", percentage: 10, color: "#a7f3d0" },
  { label: "Cash", value: "$75,125", percentage: 6, color: "#d1fae5" },
];

const opportunities = [
  { name: "Solstice Energy", sector: "Clean energy storage", returnValue: "24.6%", stage: "Series B", tone: "bg-emerald-900" },
  { name: "AgriNova", sector: "Sustainable agriculture", returnValue: "18.3%", stage: "Series A", tone: "bg-emerald-600" },
  { name: "Neurovia", sector: "AI for mental health", returnValue: "15.7%", stage: "Series B", tone: "bg-slate-800" },
];

export function InvestorOverviewPage() {
  const [incomingIntros, setIncomingIntros] = useState<InvestorIntroRequestItem[]>([]);
  const [loadingIntros, setLoadingIntros] = useState(true);

  useEffect(() => {
    async function loadIntros() {
      try {
        setLoadingIntros(true);
        const res = await getInvestorIncomingIntros();
        const items = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setIncomingIntros(items);
      } catch {
        // ignore error
      } finally {
        setLoadingIntros(false);
      }
    }
    loadIntros();
  }, []);

  const pendingIntros = incomingIntros.filter((i) => i.status === "PENDING");

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & QUICK ACTION SHORTCUTS                         */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-body">Total portfolio balance</p>
          <div className="mt-1 flex items-end gap-3">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl font-heading">
              $1,248,750
            </h2>
            <StatusPill>+12.4%</StatusPill>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Founder Intros button */}
          <Link
            href="/dashboard/investor/intros"
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold font-heading text-emerald-900 hover:bg-emerald-100 flex items-center gap-2 shadow-xs transition-all"
          >
            <Inbox className="w-4 h-4 text-emerald-700" />
            <span>Founder Intros</span>
            {pendingIntros.length > 0 && (
              <span className="rounded-full bg-emerald-700 text-white px-2 py-0.5 text-[10px] font-black animate-pulse">
                {pendingIntros.length} New
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/investor/profile"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold font-heading text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-all"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>My Profile</span>
          </Link>

          <Link
            href="/dashboard/investor/kyc"
            className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold font-heading text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Identity & KYC</span>
          </Link>

          <Link
            href="/dashboard/investor/opportunities"
            className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] hover:bg-[#044c38] px-4 py-2.5 text-xs font-bold font-heading text-white shadow-xs transition-all"
          >
            <span>Explore deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PROMINENT DEALFLOW ALERT BANNER (IF NEW INTROS EXIST)        */}
      {/* ============================================================== */}
      {pendingIntros.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032e24] via-[#064e3b] to-[#182b45] p-5 sm:p-6 text-white shadow-xl border border-emerald-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3 py-0.5 text-xs font-bold font-heading text-emerald-200 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                <span>{pendingIntros.length} New Founder Pitches Awaiting Review</span>
              </div>
              <h3 className="text-lg font-heading font-black text-white">
                Entrepreneurs are pitching your syndicate thesis
              </h3>
              <p className="text-xs text-slate-300 font-body leading-relaxed">
                Verified founders have submitted executive summaries, check size targets, and direct Cloudflare R2 pitch decks for your evaluation.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/investor/intros"
                className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-100 px-5 py-3 text-xs font-black font-heading text-emerald-950 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Inbox className="h-4 w-4 text-emerald-700" />
                <span>Review Inbound Pitches ({pendingIntros.length})</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-700" />
              </Link>
            </div>
          </div>

          {/* Quick Preview Chips of pending startups */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold font-heading text-emerald-300 uppercase tracking-wider">
              Pending Decks:
            </span>
            {pendingIntros.slice(0, 3).map((intro) => (
              <Link
                key={intro.id}
                href="/dashboard/investor/intros"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs text-white backdrop-blur-md transition-all font-body"
              >
                <span className="font-bold text-emerald-300 font-heading">{intro.startupName}</span>
                <span className="text-white/60">•</span>
                <span className="text-[11px] text-slate-200">{intro.raisingAmount || "Seed"}</span>
                {intro.targetSector && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] text-emerald-200 font-medium">
                    {intro.targetSector}
                  </span>
                )}
              </Link>
            ))}
            {pendingIntros.length > 3 && (
              <span className="text-xs text-slate-300 font-body">
                +{pendingIntros.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PROFILE, KYC & INTROS QUICK ACTIONS                         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/investor/intros"
          className="group block p-4 rounded-2xl border border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:scale-105 transition-transform">
                <Inbox className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading">
                    Founder Pitch Introductions
                  </p>
                  {pendingIntros.length > 0 && (
                    <span className="rounded-full bg-emerald-600 text-white px-2 py-0.2 text-[10px] font-black">
                      {pendingIntros.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-body mt-0.5">
                  Review incoming startup decks, accept or decline with notes.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/dashboard/investor/kyc"
          className="group block p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading">
                  Regulatory KYC & Accreditation
                </p>
                <p className="text-[11px] text-slate-500 font-body mt-0.5">
                  Verify your investor credentials for regulatory compliance.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/dashboard/investor/profile"
          className="group block p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading">
                  Public Dossier & Portfolio
                </p>
                <p className="text-[11px] text-slate-500 font-body mt-0.5">
                  Manage track record, investment thesis, and Cloudflare vault files.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* 4. KEY METRICS ROW                                             */}
      {/* ============================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Portfolio value"
          value="$1,248,750"
          detail="Across 12 positions"
          change="12.4% over 12 months"
          icon={LineChart}
        />
        <MetricCard
          label="Inbound Pitches"
          value={`${incomingIntros.length} Deals`}
          detail={pendingIntros.length > 0 ? `${pendingIntros.length} pending your review` : "All pitches reviewed"}
          change={pendingIntros.length > 0 ? "Action needed" : "Up to date"}
          trend={pendingIntros.length > 0 ? "up" : "neutral"}
          icon={Inbox}
        />
        <MetricCard
          label="Active opportunities"
          value="18"
          detail="6 match your preferences"
          change="3 added this week"
          icon={Leaf}
        />
        <MetricCard
          label="Available to invest"
          value="$42,300"
          detail="Cleared cash balance"
          change="Ready to deploy"
          trend="neutral"
          icon={WalletCards}
        />
      </div>

      {/* ============================================================== */}
      {/* 5. INBOUND PITCH DEALS SHOWCASE SECTION                        */}
      {/* ============================================================== */}
      {incomingIntros.length > 0 && (
        <Panel className="p-5 sm:p-6 space-y-4">
          <SectionHeading
            title="Recent Inbound Pitch Introductions"
            description="High-intent deal proposals directly addressed to your investor thesis"
            action={
              <Link
                href="/dashboard/investor/intros"
                className="inline-flex items-center gap-1.5 text-xs font-bold font-heading text-emerald-800 hover:text-emerald-950"
              >
                <span>Open Full Dealflow Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="divide-y divide-slate-100">
            {incomingIntros.slice(0, 4).map((intro) => (
              <div
                key={intro.id}
                className="py-4 first:pt-2 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-2xl transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 font-bold font-heading border border-emerald-100">
                    {intro.entrepreneur?.image ? (
                      <img
                        src={intro.entrepreneur.image}
                        alt={intro.startupName}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      intro.startupName.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold font-heading text-slate-900">
                        {intro.startupName}
                      </h4>
                      {intro.status === "PENDING" ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
                      ) : intro.status === "ACCEPTED" ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Accepted
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {intro.status}
                        </span>
                      )}
                      {intro.roundStage && (
                        <span className="text-[11px] text-slate-400 font-body">
                          • {intro.roundStage}
                        </span>
                      )}
                      {intro.raisingAmount && (
                        <span className="text-[11px] font-bold text-emerald-700 font-heading">
                          • Ask: {intro.raisingAmount}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-body line-clamp-1 max-w-xl">
                      {intro.pitchMessage}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-body pt-0.5">
                      <span>Founder: {intro.entrepreneur?.firstName || "Verified Founder"} {intro.entrepreneur?.lastName || ""}</span>
                      {intro.deckUrl && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <FileText className="h-3 w-3" /> Pitch Deck Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href="/dashboard/investor/intros"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#065f46] hover:bg-[#044c38] px-4 py-2 text-xs font-bold font-heading text-white shadow-xs transition-all"
                  >
                    <span>View Pitch & Deck</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ============================================================== */}
      {/* 6. CHARTS & ALLOCATION SECTION                                 */}
      {/* ============================================================== */}
      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-5 sm:p-6 xl:col-span-7">
          <SectionHeading
            title="Portfolio performance"
            description="Total value across all holdings"
            action={
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none">
                <option>All time</option>
                <option>1 year</option>
                <option>6 months</option>
              </select>
            }
          />
          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-950">$1.25M</span>
            <StatusPill>+$137,650</StatusPill>
          </div>
          <div className="mt-3">
            <InvestorLineChart />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-slate-400">
            <span>May ’23</span>
            <span>Nov ’23</span>
            <span>May ’24</span>
            <span>Nov ’24</span>
            <span>May ’25</span>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-5">
          <SectionHeading
            title="Asset allocation"
            description="Diversification by investment type"
            action={
              <Link href="/dashboard/investor/portfolio" className="text-xs font-bold text-emerald-700">
                Details
              </Link>
            }
          />
          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row xl:flex-col 2xl:flex-row">
            <div
              className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(#065f46 0 38%, #10b981 38% 66%, #5ee0bb 66% 84%, #a7f3d0 84% 94%, #d1fae5 94% 100%)",
              }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
                <span>
                  <strong className="block text-xl text-slate-950">$1.25M</strong>
                  <span className="text-[10px] text-slate-500">Total value</span>
                </span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {allocation.map((item) => (
                <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 text-xs">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <span className="text-right">
                    <strong className="text-slate-700">{item.percentage}%</strong>
                    <span className="ml-2 text-slate-400">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ============================================================== */}
      {/* 7. TRENDING OPPORTUNITIES, RECENT ACTIVITY & IMPACT             */}
      {/* ============================================================== */}
      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-4">
          <SectionHeading
            title="Trending opportunities"
            action={
              <Link href="/dashboard/investor/opportunities" className="text-xs font-bold text-emerald-700">
                View all
              </Link>
            }
          />
          <div className="mt-4 divide-y divide-slate-100">
            {opportunities.map((item) => (
              <div key={item.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${item.tone}`}>
                  <Leaf className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-slate-800 font-heading">{item.name}</strong>
                  <span className="block truncate text-xs text-slate-500 font-body">{item.sector}</span>
                </span>
                <span className="text-right">
                  <strong className="block text-xs text-emerald-700 font-heading">↑ {item.returnValue}</strong>
                  <span className="text-[10px] text-slate-400 font-body">{item.stage}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-5">
          <SectionHeading
            title="Recent activity"
            action={
              <button className="text-xs font-bold text-emerald-700" type="button">
                View all
              </button>
            }
          />
          <div className="mt-4 divide-y divide-slate-100">
            {[
              { icon: ShieldCheck, title: "Investment completed", detail: "Solstice Energy — Series B", value: "−$25,000", date: "May 20" },
              { icon: WalletCards, title: "Distribution received", detail: "Impact Fund II", value: "+$4,320", date: "May 15" },
              { icon: Building2, title: "Funds added", detail: "Verified bank transfer", value: "+$15,000", date: "May 12" },
            ].map(({ icon: Icon, title, detail, value, date }) => (
              <div key={title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-emerald-200 text-emerald-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-slate-800 font-heading">{title}</strong>
                  <span className="block truncate text-xs text-slate-500 font-body">{detail}</span>
                </span>
                <span className="text-right">
                  <strong className="block text-xs text-slate-700 font-heading">{value}</strong>
                  <span className="text-[10px] text-slate-400 font-body">{date}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col p-5 xl:col-span-3">
          <SectionHeading title="Impact score" />
          <div className="mx-auto mt-5 grid h-32 w-32 place-items-center rounded-full border-[9px] border-emerald-500 bg-emerald-50/50 text-center">
            <span>
              <Leaf className="mx-auto h-4 w-4 text-emerald-500" />
              <strong className="mt-1 block text-2xl text-slate-950 font-heading">86</strong>
              <span className="text-[10px] text-slate-500 font-body">Excellent</span>
            </span>
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500 font-body">
            Your capital supports 8 measurable impact outcomes.
          </p>
          <ProgressBar value={86} className="mt-4" />
          <Link
            href="/dashboard/investor/impact"
            className="mt-5 inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 font-heading"
          >
            <span>View impact report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </div>

      <Panel className="flex flex-col gap-4 bg-gradient-to-r from-[#064e3b] to-[#087252] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold font-heading">Quarterly portfolio review</h3>
            <p className="mt-1 text-xs text-emerald-100 font-body">
              Your advisor has prepared a new review for June 28, 2025.
            </p>
          </div>
        </div>
        <button type="button" className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold font-heading text-emerald-900 cursor-pointer">
          Schedule review
        </button>
      </Panel>
    </div>
  );
}
