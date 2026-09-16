"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Globe2,
  Laptop,
  MapPin,
  MonitorSmartphone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import {
  MetricCard,
  Panel,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import { getAdminVisitorOverview } from "@/lib/admin/visitor-insights-api";
import { getApiError } from "@/lib/api/client";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

export function AdminVisitorsPage() {
  const insightsQuery = useQuery({
    queryKey: ["admin", "visitor-insights"],
    queryFn: getAdminVisitorOverview,
    refetchOnWindowFocus: false,
  });

  const overview = insightsQuery.data;
  const error = insightsQuery.error
    ? getApiError(insightsQuery.error).message
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Traffic & Audience Telemetry
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Anonymous platform traffic monitoring, visitor locale distribution, and referrer diagnostics
            </p>
          </div>

          <button
            type="button"
            onClick={() => insightsQuery.refetch()}
            disabled={insightsQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                insightsQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh Feed
          </button>
        </div>
      </Panel>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Total Recorded Visits"
          value={(overview?.summary.totalRecordedVisits || 0).toLocaleString()}
          detail="Total platform hits captured"
          icon={Activity}
        />
        <MetricCard
          label="Unique Visitors"
          value={(overview?.summary.uniqueVisitors || 0).toLocaleString()}
          detail="Distinct visitor sessions"
          icon={Users}
        />
      </div>

      {/* Log Feed */}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Recent Visitor Activity
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Privacy-first telemetry. Raw IPs and personally identifiable device strings are anonymized.
            </p>
          </div>
          <StatusPill tone="green">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Privacy Compliant
            </span>
          </StatusPill>
        </div>

        {insightsQuery.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <InvestraLoader label="Loading visitor logs…" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-600 font-semibold">
            {error}
          </div>
        ) : !overview || overview.visitors.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No visits recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              Homepage visits will be logged here anonymously.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Visited At</th>
                  <th className="px-4 py-3">Browser / OS</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Locale / Timezone</th>
                  <th className="px-4 py-3">Screen / Viewport</th>
                  <th className="px-5 py-3">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overview.visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600 font-medium">
                      {new Date(v.visitedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800">{v.browser}</p>
                      <p className="text-[11px] text-slate-500">
                        {v.operatingSystem}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                        <MonitorSmartphone className="h-3.5 w-3.5 text-emerald-700" />
                        {v.device}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-700">{v.language}</p>
                      <p className="text-[11px] text-slate-400">{v.timezone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {v.screen} ({v.viewport})
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 truncate max-w-[200px]">
                      {v.referrer || "Direct"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
