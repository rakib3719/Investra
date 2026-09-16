"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock,
  Layers,
  LineChart,
  Plus,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { useMyCampaignsQuery } from "@/lib/campaigns/campaigns-hooks";
import {
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";

export function EntrepreneurOverviewPage() {
  const { data: campaigns, isLoading } = useMyCampaignsQuery();

  const totalTarget =
    campaigns?.reduce((acc, c) => acc + (Number(c.targetAmount) || 0), 0) || 0;
  const totalRaised =
    campaigns?.reduce((acc, c) => acc + (Number(c.raisedAmount) || 0), 0) || 0;
  const percentFunded =
    totalTarget > 0 ? Math.min(Math.round((totalRaised / totalTarget) * 100), 100) : 0;
  const activeCount =
    campaigns?.filter((c) => c.status === "ACTIVE").length || 0;
  const totalBookmarks =
    campaigns?.reduce((acc, c) => acc + (c._count?.bookmarks || c.bookmarkCount || 0), 0) || 0;
  const avgIrr =
    campaigns && campaigns.length > 0
      ? (
          campaigns.reduce((acc, c) => acc + (Number(c.projectedIrr) || 0), 0) /
          campaigns.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Fundraising summary</p>
          <div className="mt-1 flex items-end gap-3">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              ${totalRaised.toLocaleString()}
            </h2>
            <StatusPill tone="green">
              {percentFunded}% of target
            </StatusPill>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/entrepreneur/campaigns"
            className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#044c38]"
          >
            <Plus className="h-3.5 w-3.5" />
            New campaign
          </Link>
          <Link
            href="/funds"
            target="_blank"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Explore public directory
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Committed capital"
          value={`$${totalRaised.toLocaleString()}`}
          detail={`of $${totalTarget.toLocaleString()} goal`}
          change={`${percentFunded}% funded`}
          icon={WalletCards}
        />
        <MetricCard
          label="Active campaigns"
          value={String(activeCount)}
          detail={`${campaigns?.length || 0} total created`}
          change={`${campaigns?.filter((c) => c.status === "UNDER_REVIEW").length || 0} under review`}
          icon={Rocket}
        />
        <MetricCard
          label="Average projected IRR"
          value={`${avgIrr}%`}
          detail="Across your venture rounds"
          change="Investor benchmark 15%+"
          icon={TrendingUp}
        />
        <MetricCard
          label="Investor Watchlists"
          value={String(totalBookmarks)}
          detail="Accredited investors tracking rounds"
          change={totalBookmarks > 0 ? "Active pipeline traction" : "Public directory traction"}
          icon={Bookmark}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-5 xl:grid-cols-12">
        {/* Active Campaigns Panel */}
        <Panel className="p-5 sm:p-6 xl:col-span-7">
          <SectionHeading
            title="My Fundraising Campaigns"
            description="Active rounds open for accredited investor pledges"
            action={
              <Link
                href="/dashboard/entrepreneur/campaigns"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                View all ({campaigns?.length || 0})
              </Link>
            }
          />

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <InvestraInlineLoader label="Loading active campaigns..." />
            </div>
          ) : !campaigns || campaigns.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <Rocket className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-bold text-slate-800">
                No campaigns launched yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Create your first funding round to start receiving accredited investor interest.
              </p>
              <Link
                href="/dashboard/entrepreneur/campaigns"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#065f46] px-4 py-2 text-xs font-bold text-white hover:bg-[#044c38]"
              >
                <Plus className="h-3.5 w-3.5" /> Start campaign builder
              </Link>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {campaigns.slice(0, 4).map((camp) => {
                const target = Number(camp.targetAmount) || 1;
                const raised = Number(camp.raisedAmount) || 0;
                const percent = Math.min(
                  Math.round((raised / target) * 100),
                  100
                );
                const statusTone =
                  camp.status === "ACTIVE"
                    ? "green"
                    : camp.status === "UNDER_REVIEW"
                    ? "amber"
                    : camp.status === "REJECTED"
                    ? "rose"
                    : "slate";
                const campBookmarks = camp._count?.bookmarks || camp.bookmarkCount || 0;

                return (
                  <div key={camp.id} className="py-4 first:pt-2 last:pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {camp.title}
                          </h4>
                          <StatusPill tone={statusTone}>
                            {camp.status.replace("_", " ")}
                          </StatusPill>
                          {campBookmarks > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <Bookmark className="h-3 w-3 fill-emerald-700" />
                              {campBookmarks} watching
                            </span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {camp.tagline || camp.pitchText}
                        </p>
                      </div>
                      <span className="text-right text-xs font-bold text-slate-800">
                        ${raised.toLocaleString()}{" "}
                        <span className="font-normal text-slate-400">
                          / ${target.toLocaleString()}
                        </span>
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Round progress</span>
                        <span className="font-bold text-emerald-700">{percent}%</span>
                      </div>
                      <ProgressBar value={percent} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Investor Pipeline Panel */}
        <Panel className="p-5 sm:p-6 xl:col-span-5">
          <SectionHeading
            title="Investor Pipeline"
            description="Verified VC and angel fund interest"
            action={
              <Link
                href="/dashboard/entrepreneur/matches"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                Review matches
              </Link>
            }
          />

          <div className="mt-5 space-y-3">
            {[
              {
                name: "Northstar Ventures",
                sector: "Climate & Infrastructure",
                match: 98,
                status: "Ready to meet",
                tone: "green" as const,
              },
              {
                name: "Bluefield Capital",
                sector: "Growth Equity",
                match: 94,
                status: "In due diligence",
                tone: "blue" as const,
              },
              {
                name: "Mango Seed Fund",
                sector: "Early-Stage Tech",
                match: 88,
                status: "Reviewing pitch",
                tone: "amber" as const,
              },
              {
                name: "Apex Impact Partners",
                sector: "Sustainable Agriculture",
                match: 85,
                status: "New match",
                tone: "slate" as const,
              },
            ].map((inv) => (
              <div
                key={inv.name}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{inv.name}</h4>
                  <p className="text-[10px] text-slate-500">{inv.sector}</p>
                </div>
                <div className="text-right">
                  <StatusPill tone={inv.tone}>{inv.status}</StatusPill>
                  <span className="block mt-0.5 text-[10px] font-semibold text-emerald-700">
                    {inv.match}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Bottom CTA Card */}
      <Panel className="flex flex-col gap-4 bg-gradient-to-r from-[#064e3b] to-[#087252] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold">Accelerate your fundraising momentum</h3>
            <p className="mt-1 text-xs text-emerald-100">
              Keep your campaign data room verified to qualify for institutional introductions.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/entrepreneur/campaigns"
          className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 text-center"
        >
          View Campaigns
        </Link>
      </Panel>
    </div>
  );
}
