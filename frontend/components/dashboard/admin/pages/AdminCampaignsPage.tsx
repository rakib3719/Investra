"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Layers,
  ListFilter,
  Milestone,
  RefreshCw,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import {
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import {
  useAdminCampaignsQuery,
  useUpdateCampaignStatusMutation,
} from "@/lib/campaigns/campaigns-hooks";
import type { Campaign } from "@/lib/campaigns/types";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Active", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Drafts", value: "DRAFT" },
  { label: "All Campaigns", value: "ALL" },
];

export function AdminCampaignsPage() {
  const [selectedStatus, setSelectedStatus] = useState("UNDER_REVIEW");
  const [page, setPage] = useState(1);
  const [inspectCampaign, setInspectCampaign] = useState<Campaign | null>(null);
  const [rejectingCampaign, setRejectingCampaign] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const effectiveStatus = selectedStatus === "ALL" ? undefined : selectedStatus;
  const campaignsQuery = useAdminCampaignsQuery(effectiveStatus, page);
  const updateStatusMutation = useUpdateCampaignStatusMutation();

  const campaigns = campaignsQuery.data?.items || [];
  const meta = campaignsQuery.data?.meta;

  const handleApprove = async (campaign: Campaign) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: campaign.id,
        status: "ACTIVE",
      });
      setStatusMessage(`Campaign "${campaign.title}" is now LIVE and active.`);
      if (inspectCampaign?.id === campaign.id) {
        setInspectCampaign(null);
      }
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to approve campaign");
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCampaign) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: rejectingCampaign.id,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim() || undefined,
      });
      setStatusMessage(
        `Campaign "${rejectingCampaign.title}" has been rejected with feedback notes.`,
      );
      setRejectingCampaign(null);
      setRejectionReason("");
      if (inspectCampaign?.id === rejectingCampaign.id) {
        setInspectCampaign(null);
      }
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to reject campaign");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <StatusPill tone="green">Active</StatusPill>;
      case "UNDER_REVIEW":
        return <StatusPill tone="amber">Under Review</StatusPill>;
      case "REJECTED":
        return <StatusPill tone="rose">Rejected</StatusPill>;
      case "COMPLETED":
        return <StatusPill tone="blue">Completed</StatusPill>;
      default:
        return <StatusPill tone="slate">{status}</StatusPill>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Deal Moderation Queue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Audit entrepreneurial pitch submissions, evaluate valuation milestones, and grant market access
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Total Listed: {meta?.total || 0}
            </span>
          </div>
        </div>

        {/* Tab filters */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedStatus(tab.value);
                setPage(1);
              }}
              className={`rounded-t-lg px-4 py-2 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                selectedStatus === tab.value
                  ? "border-emerald-600 text-emerald-800 bg-emerald-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* Campaign List */}
      <Panel className="overflow-hidden">
        {campaignsQuery.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <InvestraLoader label="Loading moderation queue…" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <Rocket className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              No campaigns in this queue
            </p>
            <p className="text-xs text-slate-500 mt-1">
              There are currently no proposals matching status &quot;{selectedStatus}&quot;.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => {
              const target = Number(campaign.targetAmount) || 1;
              const raised = Number(campaign.raisedAmount) || 0;
              const progressPct = Math.min(100, Math.round((raised / target) * 100));

              return (
                <div
                  key={campaign.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {campaign.title}
                        </h3>
                        {getStatusBadge(campaign.status)}
                        {campaign.category && (
                          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                            {campaign.category.name}
                          </span>
                        )}
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {campaign.stage || "EARLY_STAGE"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {campaign.pitchText || "No pitch description submitted."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>
                          Founder:{" "}
                          <span className="font-semibold text-slate-800">
                            {campaign.entrepreneur
                              ? `${campaign.entrepreneur.firstName || ""} ${campaign.entrepreneur.lastName || ""} (${campaign.entrepreneur.entrepreneurProfile?.companyName || "Founder"})`
                              : "Unknown"}
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          Created:{" "}
                          <span className="font-medium text-slate-700">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                        <span>•</span>
                        <span>
                          Milestones:{" "}
                          <span className="font-bold text-slate-800">
                            {campaign.milestones?.length || 0}
                          </span>
                        </span>
                      </div>

                      {/* Rejection notes if any */}
                      {campaign.rejectionReason && (
                        <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                            Administrative Rejection Note:
                          </p>
                          <p className="mt-0.5 text-rose-700">
                            {campaign.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Funding target + Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                      <div className="text-left lg:text-right">
                        <p className="text-xs text-slate-500">Target Capital</p>
                        <p className="text-lg font-bold text-slate-950">
                          ${target.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-semibold">
                          ${raised.toLocaleString()} raised ({progressPct}%)
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectCampaign(campaign)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect Milestones
                        </button>

                        <Link
                          href={`/campaigns/${campaign.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                          title="Open public page in new tab"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {campaign.status !== "ACTIVE" && (
                          <button
                            type="button"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => handleApprove(campaign)}
                            className="rounded-xl bg-[#078457] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#066e48] transition shadow-sm"
                          >
                            Approve
                          </button>
                        )}

                        {campaign.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() =>
                              setRejectingCampaign({
                                id: campaign.id,
                                title: campaign.title,
                              })
                            }
                            className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <span className="text-xs text-slate-500">
              Page {meta.page} of {meta.totalPages} ({meta.total} total deals)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* Rejection Modal */}
      {rejectingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="h-6 w-6" />
                <h3 className="text-base font-bold text-slate-900">
                  Reject Campaign Submission
                </h3>
              </div>
              <button
                onClick={() => setRejectingCampaign(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              You are rejecting &quot;
              <span className="font-bold text-slate-900">
                {rejectingCampaign.title}
              </span>
              &quot;. Please provide specific feedback so the entrepreneur can correct and resubmit their proposal.
            </p>

            <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rejection Reason & Required Changes
                </label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="E.g., Target valuation exceeds stage benchmark; please clarify the revenue milestone breakdown and attach verified audited financial statements..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingCampaign(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition"
                >
                  {updateStatusMutation.isPending ? (
                    <InvestraInlineLoader label="Rejecting…" />
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Milestone Inspection Drawer */}
      {inspectCampaign && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-slate-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Deal Milestones & Pitch Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectCampaign(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {inspectCampaign.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category: {inspectCampaign.category?.name || "General"} • Stage:{" "}
                    {inspectCampaign.stage || "EARLY_STAGE"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Executive Pitch
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {inspectCampaign.pitchText || "No pitch provided."}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Project Milestones ({inspectCampaign.milestones?.length || 0})
                  </h5>
                  {(!inspectCampaign.milestones ||
                    inspectCampaign.milestones.length === 0) ? (
                    <p className="text-xs text-slate-500 italic">
                      No milestones attached to this campaign proposal.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {inspectCampaign.milestones.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className="rounded-xl border border-slate-200 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {idx + 1}. {m.title}
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {m.isCompleted ? "COMPLETED" : "PENDING"}
                            </span>
                          </div>
                          {m.description && (
                            <p className="text-slate-600">{m.description}</p>
                          )}
                          {m.targetDate && (
                            <p className="text-[11px] text-slate-400">
                              Target Date:{" "}
                              {new Date(m.targetDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex gap-2">
              {inspectCampaign.status !== "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => handleApprove(inspectCampaign)}
                  className="flex-1 rounded-xl bg-[#078457] py-2.5 text-xs font-bold text-white hover:bg-[#066e48] transition"
                >
                  Approve Campaign
                </button>
              )}
              {inspectCampaign.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() =>
                    setRejectingCampaign({
                      id: inspectCampaign.id,
                      title: inspectCampaign.title,
                    })
                  }
                  className="flex-1 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  Reject with Notes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
