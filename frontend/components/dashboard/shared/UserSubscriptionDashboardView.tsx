"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  CheckCircle2,
  Lock,
  Layers,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import {
  useMySubscriptionQuery,
  useMyPaymentsQuery,
  useCancelMySubscriptionMutation,
} from "@/lib/admin/admin-subscription-hooks";
import { InvestraLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";

export function UserSubscriptionDashboardView({ user }: { user: AuthUser }) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const subQuery = useMySubscriptionQuery();
  const paymentsQuery = useMyPaymentsQuery();
  const cancelMutation = useCancelMySubscriptionMutation();

  const subscription = subQuery.data;
  const payments = paymentsQuery.data || [];

  const handleCancelSubscription = async () => {
    try {
      await cancelMutation.mutateAsync();
      toast.success("Subscription cancelled successfully. Entitlements have been updated.");
      setIsCancelModalOpen(false);
    } catch (err: any) {
      toast.apiError(err, "Failed to cancel subscription.");
    }
  };

  if (subQuery.isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <InvestraLoader size="md" label="Loading subscription details..." />
      </div>
    );
  }

  const features = subscription?.featureSnapshot
    ? Object.values(subscription.featureSnapshot as Record<string, any>)
    : [];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Overview Banner */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Investment & Advisory Tier</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {subscription ? subscription.planName : "Default Free Tier"}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              {subscription
                ? `Your active plan is governed by an immutable platform snapshot, granting high-throughput deal execution and access rights.`
                : `You are currently on standard free access. Upgrade your account to unlock private deal pipelines, direct investor outreach, and advanced diligence.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              <span>{subscription ? "Change / Upgrade Plan" : "Explore Plans"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            {subscription && subscription.status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
              >
                <span>Cancel Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Metrics Strip */}
        {subscription && (
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-emerald-100/60 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <p className="text-sm font-bold text-emerald-700 capitalize">
                  {subscription.status.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Billing Cycle</p>
                <p className="text-sm font-bold text-slate-800 capitalize">
                  {subscription.billingInterval.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Current Period End</p>
                <p className="text-sm font-bold text-slate-800">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-100 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Role Target</p>
                <p className="text-sm font-bold text-slate-800">
                  {subscription.targetRole}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Active Entitlements & Features Matrix */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-900">
            Active Features & Entitlement Snapshot
          </h2>
          <p className="text-sm text-slate-500">
            These platform capabilities are locked into your account and guaranteed for the duration of your billing cycle.
          </p>
        </div>

        {features.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <Layers className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600">
              No custom plan entitlements found.
            </p>
            <p className="text-xs text-slate-400">
              Standard free platform quotas apply to your account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat: any, idx: number) => {
              const isEnabled = Boolean(feat.isEnabled);
              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all ${
                    isEnabled
                      ? "border-emerald-100 bg-emerald-50/30"
                      : "border-slate-100 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        {feat.name || feat.code}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {feat.code}
                      </p>
                    </div>
                    {isEnabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Quota / Limit:</span>
                    <span className="font-bold text-slate-800">
                      {feat.limitValue === -1 || feat.limitValue === null
                        ? "Unlimited"
                        : `${feat.limitValue} ${feat.unit || "units"}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Transaction & Billing History Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-900">
            Payment & Billing History
          </h2>
          <p className="text-sm text-slate-500">
            Secure records and receipts for all subscription cycles and transactions.
          </p>
        </div>

        {paymentsQuery.isLoading ? (
          <div className="py-10 text-center">
            <InvestraLoader size="sm" label="Fetching invoices..." />
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <Receipt className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600">
              No payments recorded yet.
            </p>
            <p className="text-xs text-slate-400">
              Invoices and receipts will appear here once you initiate or renew a plan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-lg">Date</th>
                  <th scope="col" className="px-4 py-3">Tier / Plan</th>
                  <th scope="col" className="px-4 py-3">Billing Cycle</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Provider / Reference</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 rounded-r-lg text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {p.plan?.name || "Subscription"}
                    </td>
                    <td className="px-4 py-3.5 capitalize">
                      {p.billingInterval.toLowerCase()}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ${p.amount.toFixed(2)} {p.currency}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{p.paymentProvider}</span>:{" "}
                      {p.transactionId ? `${p.transactionId.substring(0, 14)}...` : "N/A"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Paid In-App</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Cancel Active Subscription?
              </h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Are you sure you want to cancel your active <strong>{subscription?.planName}</strong> plan? 
              You will lose access to premium tier quotas at the end of the current billing cycle.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={cancelMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
