"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  WalletCards,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  Download,
  ShieldCheck,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { coursesApi } from "@/lib/courses/courses-api";
import type { ConsultantEarningsData, PayoutStatus } from "@/lib/courses/types";
import { useMyKycQuery } from "@/lib/kyc/kyc-hooks";
import { toast } from "@/lib/toast";

export function ConsultantEarningsPage({ user }: { user: AuthUser }) {
  const { data: kycData } = useMyKycQuery();
  const isKycVerified = kycData?.status === "VERIFIED";

  const [data, setData] = useState<ConsultantEarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [payoutMethod, setPayoutMethod] = useState("BANK_TRANSFER");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountHolder: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await coursesApi.getEarnings();
      const payload = (res as any)?.data ?? res;
      setData(payload);
    } catch (err: any) {
      console.error(err);
      toast.apiError(err, "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    if (withdrawAmount > data.stats.availableBalance) {
      toast.error(`Withdrawal amount exceeds your available balance ($${data.stats.availableBalance}).`);
      return;
    }

    if (withdrawAmount < 10) {
      toast.error("Minimum withdrawal amount is $10.00.");
      return;
    }

    try {
      setSubmitting(true);
      await coursesApi.requestWithdrawal({
        amount: Number(withdrawAmount),
        payoutMethod,
        accountDetails: bankDetails,
      });
      toast.success("Withdrawal request submitted! Admin will process your payout.");
      setIsWithdrawModalOpen(false);
      fetchEarnings();
    } catch (err: any) {
      toast.apiError(err, "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Paid Out
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <WalletCards className="w-3.5 h-3.5" />
            <span>Consultant Revenue &amp; Wallet</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Earnings &amp; Payouts
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Transparent 90% creator revenue share. Withdraw earnings to your bank account anytime.
          </p>
        </div>

        <button
          onClick={() => {
            if (data) setWithdrawAmount(Math.min(data.stats.availableBalance, 100));
            setIsWithdrawModalOpen(true);
          }}
          disabled={!isKycVerified || !data || data.stats.availableBalance < 10}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition ${
            isKycVerified && data && data.stats.availableBalance >= 10
              ? "bg-[#078457] text-white hover:bg-[#06734d] shadow-emerald-700/20"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          title={
            !isKycVerified
              ? "KYC verification required to withdraw"
              : data && data.stats.availableBalance < 10
              ? "Minimum balance of $10 required to withdraw"
              : "Request Payout"
          }
        >
          <ArrowUpRight className="h-4 w-4" />
          Request Payout
        </button>
      </div>

      {/* KYC Warning if not verified */}
      {!isKycVerified && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-bold">Payouts Gated by KYC:</span> You must have an approved KYC verification on file before requesting withdrawals to bank accounts.
            <Link href="/dashboard/consultant/kyc" className="ml-2 font-bold underline hover:text-amber-950">
              Complete KYC &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading wallet analytics...
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Available Balance */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 to-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Available Balance
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-black text-[#064e3b]">
                ${data.stats.availableBalance.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Ready for instant withdrawal request
            </p>
          </div>

          {/* Card 2: Net Earnings (90%) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Net Earnings (90%)
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                90% Share
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-black text-slate-900">
                ${data.stats.netEarnings.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Accumulated earnings from course sales
            </p>
          </div>

          {/* Card 3: Platform Fees (10%) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Platform Fees (10%)
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                10% Retained
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-black text-slate-700">
                ${data.stats.platformFees.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Investra infrastructure &amp; processing fee
            </p>
          </div>

          {/* Card 4: Total Paid Out */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Withdrawn
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-black text-slate-900">
                ${data.stats.totalPaidOut.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-semibold">USD</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {data.stats.pendingPayout > 0
                ? `($${data.stats.pendingPayout.toFixed(2)} pending admin review)`
                : "Successfully disbursed to your bank"}
            </p>
          </div>
        </div>
      ) : null}

      {/* Revenue Stream Breakdown (Courses vs 1-on-1 Sessions) */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Courses Stream */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Course Studio Revenue
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                {(data as any)?.breakdown?.courses?.count || data.recentSales?.length || 0} Enrollments
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gross Sales</span>
                <span className="font-bold text-slate-800">
                  ${(data as any)?.breakdown?.courses?.gross !== undefined ? Number((data as any).breakdown.courses.gross).toFixed(2) : "0.00"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admin (10%)</span>
                <span className="font-bold text-slate-500">
                  ${(data as any)?.breakdown?.courses?.platformFee !== undefined ? Number((data as any).breakdown.courses.platformFee).toFixed(2) : "0.00"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Net (90%)</span>
                <span className="font-bold text-emerald-700">
                  ${(data as any)?.breakdown?.courses?.netEarnings !== undefined ? Number((data as any).breakdown.courses.netEarnings).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Sessions Stream */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  1-on-1 Sessions Revenue
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                {(data as any)?.breakdown?.sessions?.count || (data as any)?.recentSessions?.length || 0} Sessions
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gross Sales</span>
                <span className="font-bold text-slate-800">
                  ${(data as any)?.breakdown?.sessions?.gross !== undefined ? Number((data as any).breakdown.sessions.gross).toFixed(2) : "0.00"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admin (10%)</span>
                <span className="font-bold text-slate-500">
                  ${(data as any)?.breakdown?.sessions?.platformFee !== undefined ? Number((data as any).breakdown.sessions.platformFee).toFixed(2) : "0.00"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Net (90%)</span>
                <span className="font-bold text-emerald-700">
                  ${(data as any)?.breakdown?.sessions?.netEarnings !== undefined ? Number((data as any).breakdown.sessions.netEarnings).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout History & Recent Sales Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payout Requests */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Withdrawal Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted payout transactions and approval status.
                </p>
              </div>
              <Receipt className="h-5 w-5 text-slate-400" />
            </div>

            {data && data.payoutRequests.length > 0 ? (
              <div className="space-y-3 divide-y divide-slate-100">
                {data.payoutRequests.map((p) => (
                  <div key={p.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-slate-900 text-base">
                          ${p.amount.toFixed(2)}
                        </span>
                        {getStatusBadge(p.status)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {p.payoutMethod} • {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                      {p.adminNotes && (
                        <div className="text-[11px] text-slate-500 mt-1 italic">
                          Admin: {p.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      {p.accountDetails?.bankName || "Bank Account"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No withdrawal requests submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Course Sales */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Course Enrollment Sales
                </h3>
                <p className="text-xs text-slate-500">
                  Recent student purchases and 90% net earnings breakdown.
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>

            {data && data.recentSales.length > 0 ? (
              <div className="space-y-3 divide-y divide-slate-100">
                {data.recentSales.map((sale) => (
                  <div key={sale.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                        {sale.courseTitle}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Student: {sale.buyerName} • {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-700 text-sm">
                        +${sale.consultantEarnings.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Gross: ${sale.grossAmount.toFixed(2)} (Fee: ${sale.platformFee.toFixed(2)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No course enrollment sales recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1-on-1 Session Earnings Ledger */}
      {(data as any)?.recentSessions && (data as any).recentSessions.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                1-on-1 Session Ledger &amp; Earnings
              </h3>
              <p className="text-xs text-slate-500">
                Individual advisory consultations conducted and paid (90% creator disbursement).
              </p>
            </div>
            <Clock className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="divide-y divide-slate-100">
            {(data as any).recentSessions.map((sess: any) => (
              <div key={sess.id} className="py-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">{sess.topic}</h4>
                  <p className="text-xs text-slate-500">
                    Client: <span className="font-semibold text-slate-700">{sess.clientName}</span> • {sess.time} on {new Date(sess.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-bold text-emerald-700 text-sm">
                    +${Number(sess.consultantEarnings).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Gross: ${Number(sess.grossAmount).toFixed(2)} • 10% Fee (${Number(sess.platformFee).toFixed(2)})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WITHDRAWAL REQUEST MODAL */}
      {isWithdrawModalOpen && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Request Payout Disbursement
                </h3>
                <p className="text-xs text-slate-500">
                  Available Balance: ${data.stats.availableBalance.toFixed(2)} USD
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="10"
                    max={data.stats.availableBalance}
                    step="1"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payout Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="BANK_TRANSFER">Direct Bank Wire / ACH</option>
                  <option value="STRIPE_DIRECT">Stripe Connect Account</option>
                  <option value="PAYPAL">PayPal Transfer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    placeholder="e.g. Chase Bank, BRAC Bank"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                    placeholder="Legal name on account"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account / IBAN Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    placeholder="Account Number"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Routing / SWIFT Code
                  </label>
                  <input
                    type="text"
                    value={bankDetails.routingNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                    placeholder="Routing or SWIFT"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#078457] px-5 py-2 text-xs font-bold text-white hover:bg-[#06734d] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Payout Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
