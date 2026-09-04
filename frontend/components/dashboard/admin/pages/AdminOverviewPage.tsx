"use client";

import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import { useAdminOverviewStatsQuery } from "@/lib/admin/admin-hooks";
import { useAdminCampaignsQuery } from "@/lib/campaigns/campaigns-hooks";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

export function AdminOverviewPage() {
  const statsQuery = useAdminOverviewStatsQuery();
  const pendingCampaignsQuery = useAdminCampaignsQuery("UNDER_REVIEW", 1);

  const stats = statsQuery.data;
  const pendingCampaigns = pendingCampaignsQuery.data?.items || [];
  const totalPending = pendingCampaignsQuery.data?.meta?.total || 0;

  if (statsQuery.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <InvestraLoader label="Loading platform metrics…" />
      </div>
    );
  }

  const usersTotal = stats?.users.total || 0;
  const investorsCount = stats?.users.investors || 0;
  const entrepreneursCount = stats?.users.entrepreneurs || 0;
  const consultantsCount = stats?.users.consultants || 0;
  const adminsCount = stats?.users.admins || 0;

  const investorPct = usersTotal ? Math.round((investorsCount / usersTotal) * 100) : 0;
  const entrepreneurPct = usersTotal ? Math.round((entrepreneursCount / usersTotal) * 100) : 0;
  const consultantPct = usersTotal ? Math.round((consultantsCount / usersTotal) * 100) : 0;

  const totalRaised = stats?.campaigns.totalRaisedCapital || 0;
  const totalTarget = stats?.campaigns.totalTargetCapital || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">System Status</p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Platform Command Center
            </h2>
            <StatusPill tone="green">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
            </StatusPill>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/users"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Manage Users
          </Link>
          <Link
            href="/dashboard/admin/campaigns"
            className="inline-flex items-center gap-2 rounded-xl bg-[#078457] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#066e48] transition shadow-sm"
          >
            Review Queue ({totalPending}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Registered Users"
          value={usersTotal.toLocaleString()}
          detail={`${investorsCount} investors, ${entrepreneursCount} entrepreneurs`}
          change={`${consultantsCount} consultants`}
          trend="neutral"
          icon={Users}
        />
        <MetricCard
          label="Pending Review"
          value={totalPending.toString()}
          detail="Campaigns awaiting compliance audit"
          change={totalPending > 0 ? "Action required" : "Queue clear"}
          trend={totalPending > 0 ? "down" : "up"}
          icon={ShieldAlert}
        />
        <MetricCard
          label="Active Campaigns"
          value={(stats?.campaigns.active || 0).toString()}
          detail={`Out of ${(stats?.campaigns.total || 0)} total campaigns`}
          change="Publicly visible"
          trend="up"
          icon={Rocket}
        />
        <MetricCard
          label="Total Capital Committed"
          value={`$${totalRaised.toLocaleString()}`}
          detail={`Target: $${totalTarget.toLocaleString()}`}
          change={`${totalTarget ? Math.round((totalRaised / totalTarget) * 100) : 0}% aggregate goal`}
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Left Column: Pending Moderation Queue */}
        <Panel className="p-6 xl:col-span-8">
          <SectionHeading
            title="Pending Moderation Queue"
            description="Campaigns recently submitted by entrepreneurs awaiting compliance and verification"
            action={
              <Link
                href="/dashboard/admin/campaigns"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View all campaigns →
              </Link>
            }
          />

          <div className="mt-5">
            {pendingCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  Moderation queue is empty
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  There are no campaigns waiting for administrative approval. All proposals have been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/80">
                {pendingCampaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/60 transition"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-bold text-slate-900">
                          {campaign.title}
                        </h4>
                        <StatusPill tone="amber">Under Review</StatusPill>
                        {campaign.category && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {campaign.category.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Goal:{" "}
                        <span className="font-semibold text-slate-700">
                          ${Number(campaign.targetAmount).toLocaleString()}
                        </span>{" "}
                        • Submitted by:{" "}
                        <span className="font-semibold text-slate-700">
                          {campaign.entrepreneur
                            ? `${campaign.entrepreneur.firstName || ""} ${campaign.entrepreneur.lastName || ""}`
                            : "Founder"}
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/dashboard/admin/campaigns`}
                        className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                      >
                        Review Deal
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {/* Right Column: User Breakdown & System Integrity */}
        <div className="space-y-6 xl:col-span-4">
          <Panel className="p-6">
            <SectionHeading
              title="Stakeholder Distribution"
              description="Platform account allocation by role"
            />
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Investors ({investorsCount})</span>
                  <span>{investorPct}%</span>
                </div>
                <ProgressBar value={investorPct} />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Entrepreneurs ({entrepreneursCount})</span>
                  <span>{entrepreneurPct}%</span>
                </div>
                <ProgressBar value={entrepreneurPct} />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Consultants ({consultantsCount})</span>
                  <span>{consultantPct}%</span>
                </div>
                <ProgressBar value={consultantPct} />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>System Administrators</span>
                <span className="font-bold text-slate-800">{adminsCount}</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <SectionHeading
              title="System Governance"
              description="Real-time security and compliance safeguards"
            />
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Session Guard Active</p>
                  <p className="text-slate-500 mt-0.5">
                    Immediate refresh token invalidation on account blocking or suspension.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Prisma Neon DB Connected</p>
                  <p className="text-slate-500 mt-0.5">
                    Cloud PostgreSQL transactions and integrity constraints verified.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
