"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  MessageSquare,
  Plus,
  Scale,
  ShieldCheck,
  TrendingUp,
  User,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  CommitmentsApi,
  InvestmentCommitmentItem,
  InvestorCommitmentsResponse,
} from "@/lib/api/commitments";
import { IssueTermSheetModal } from "@/components/deals/IssueTermSheetModal";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { MetricCard, Panel, SectionHeading, StatusPill } from "../InvestorUI";

export function InvestmentsPage() {
  const [data, setData] = useState<InvestorCommitmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACCEPTED" | "PROPOSED">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchCommitments() {
    setLoading(true);
    try {
      const res = await CommitmentsApi.getInvestorCommitments();
      setData(res);
    } catch (err) {
      console.error("Failed to load investor commitments", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCommitments();
  }, []);

  const commitments = data?.commitments || [];
  const stats = data?.stats || {
    totalDeployed: 0,
    totalProposed: 0,
    activePositionsCount: 0,
    proposedOffersCount: 0,
    totalOffersCount: 0,
  };

  const filteredCommitments = commitments.filter((c) => {
    if (filter === "ACCEPTED") return c.status === "ACCEPTED";
    if (filter === "PROPOSED") return c.status === "PROPOSED" || c.status === "NEGOTIATING";
    return true;
  });

  const formattedDeployed = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(stats.totalDeployed);

  const formattedProposed = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(stats.totalProposed);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Investment Positions & Term Sheets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your committed venture capital, executed SAFE notes, and formal indicative term sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
        >
          <Plus className="h-4 w-4" /> Issue New Term Sheet
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          label="Active Investments"
          value={String(stats.activePositionsCount)}
          detail="Executed deals & SAFEs"
          change={`${stats.totalOffersCount} lifetime issued`}
          icon={WalletCards}
        />
        <MetricCard
          label="Capital Deployed"
          value={formattedDeployed}
          detail="Active portfolio equity"
          change="Cleared due diligence"
          icon={Landmark}
        />
        <MetricCard
          label="Pending Term Sheets"
          value={formattedProposed}
          detail={`${stats.proposedOffersCount} offers awaiting founder`}
          change="Soft-committed pipeline"
          trend="neutral"
          icon={Scale}
        />
        <MetricCard
          label="Total Diligence Flow"
          value={String(stats.totalOffersCount)}
          detail="Across verified startups"
          change="Institutional grade"
          icon={TrendingUp}
        />
      </div>

      {/* Main Table / Cards */}
      <Panel className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <SectionHeading
            title="Portfolio & Dealflow Positions"
            description="Real-time status of capital allocations and term sheet covenants"
          />

          <div className="flex items-center gap-2">
            {(["ALL", "ACCEPTED", "PROPOSED"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  filter === tab
                    ? "bg-[#064e3b] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab === "ALL"
                  ? `All (${commitments.length})`
                  : tab === "ACCEPTED"
                  ? `Active Portfolio (${stats.activePositionsCount})`
                  : `Pending Offers (${stats.proposedOffersCount})`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <InvestraInlineLoader className="text-emerald-700" />
            <p className="mt-3 text-xs text-slate-500">Loading investment positions...</p>
          </div>
        ) : filteredCommitments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No investment commitments found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When you accept a founder&apos;s introduction or issue a formal term sheet, your capital position will be tracked here with milestone progression.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition"
              >
                <Plus className="h-4 w-4" /> Issue Your First Term Sheet
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredCommitments.map((c) => {
              const formattedAmt = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: c.currency || "USD",
                maximumFractionDigits: 0,
              }).format(c.amount);

              const formattedVal = c.valuation
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(c.valuation)
                : null;

              const isAccepted = c.status === "ACCEPTED";
              const isDeclined = c.status === "DECLINED";
              const isNegotiating = c.status === "NEGOTIATING";

              return (
                <article
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-serif">
                            {c.startupName}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            {c.instrument.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Founder: {c.entrepreneur?.name} · Issued{" "}
                          {new Date(c.issuedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="block text-[11px] font-semibold text-slate-400">
                          Committed Ticket
                        </span>
                        <strong className="text-lg font-bold text-slate-900">
                          {formattedAmt}
                        </strong>
                      </div>

                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 text-xs font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Active Investment</span>
                        </span>
                      ) : isDeclined ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold">
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                          <span>Term Sheet Declined</span>
                        </span>
                      ) : isNegotiating ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-bold">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          <span>In Terms Negotiation</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 text-xs font-bold">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          <span>Awaiting Founder Response</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Valuation & Terms row */}
                  <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3 text-xs">
                    {formattedVal && (
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Valuation Cap
                        </span>
                        <span className="font-bold text-slate-800">{formattedVal}</span>
                      </div>
                    )}
                    {c.equityPercentage && (
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Target Ownership
                        </span>
                        <span className="font-bold text-slate-800">{c.equityPercentage}%</span>
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-xl p-2.5 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Due Diligence Status
                      </span>
                      <span className="font-semibold text-emerald-800">
                        {isAccepted ? "Executed · Legal Closing" : "Indicative Offer"}
                      </span>
                    </div>
                  </div>

                  {/* Terms Summary */}
                  <div className="mt-3 rounded-xl bg-emerald-50/40 border border-emerald-100 p-3 text-xs text-slate-700">
                    <strong className="block text-[11px] font-bold text-emerald-900 mb-0.5">
                      Terms Summary:
                    </strong>
                    <p className="leading-5">{c.termsSummary}</p>
                  </div>

                  {/* Founder Feedback if responded */}
                  {c.entrepreneurNotes && (
                    <div className="mt-2.5 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 italic">
                      <strong className="font-bold text-slate-800 not-italic mr-1.5">Founder Note:</strong>
                      &ldquo;{c.entrepreneurNotes}&rdquo;
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Encrypted term sheet & non-binding commitment</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.termSheetDocUrl && (
                        <a
                          href={c.termSheetDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Download className="h-3.5 w-3.5" /> Term Sheet PDF
                        </a>
                      )}

                      <Link
                        href="/dashboard/investor/messages"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] px-3.5 py-1.5 text-xs font-bold text-white transition shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Open Deal Room Chat
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      {/* Modal to Issue New Term Sheet */}
      <IssueTermSheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchCommitments();
        }}
      />
    </div>
  );
}
