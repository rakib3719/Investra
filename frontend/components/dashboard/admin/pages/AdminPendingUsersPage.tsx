"use client";

import { useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  useAdminUsersQuery,
  useAdminUserDetailQuery,
} from "@/lib/admin/admin-hooks";
import { useAdminKycListQuery, useReviewAdminKycMutation } from "@/lib/kyc/kyc-hooks";
import type {
  AdminUserListItem,
  UserRole,
  AccountStatus,
} from "@/lib/admin/admin-users-api";
import { InvestraLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";

const ROLES: { label: string; value: string }[] = [
  { label: "All Stakeholders", value: "ALL" },
  { label: "Investors", value: "INVESTOR" },
  { label: "Entrepreneurs", value: "ENTREPRENEUR" },
  { label: "Consultants", value: "CONSULTANT" },
];

type PendingFilterTab = "ALL" | "SUBMITTED" | "UNSUBMITTED" | "REJECTED";

export function AdminPendingUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [activeTab, setActiveTab] = useState<PendingFilterTab>("ALL");
  const [page, setPage] = useState(1);

  // Quick Action Review Modal (for submitted KYC)
  const [quickReview, setQuickReview] = useState<{
    verificationId: string;
    userName: string;
    action: "VERIFIED" | "REJECTED";
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const reviewMutation = useReviewAdminKycMutation();

  // Query users based on active tab
  // When activeTab === "ALL": kycStatus="PENDING" or unsubmitted users.
  // In our backend, we can set kycStatus and kycSubmission accordingly:
  const queryKycStatus =
    activeTab === "REJECTED"
      ? "REJECTED"
      : activeTab === "SUBMITTED"
        ? "PENDING"
        : undefined;

  const queryKycSubmission =
    activeTab === "SUBMITTED"
      ? "SUBMITTED"
      : activeTab === "UNSUBMITTED"
        ? "UNSUBMITTED"
        : undefined;

  // If tab is "ALL", we filter users whose KYC is not yet VERIFIED (PENDING status or UNSUBMITTED)
  const usersQuery = useAdminUsersQuery({
    search: searchTerm.trim() || undefined,
    role: selectedRole === "ALL" ? undefined : (selectedRole as UserRole),
    kycStatus: queryKycStatus as any,
    kycSubmission: queryKycSubmission as any,
    page,
    limit: 15,
  });

  const users = usersQuery.data?.items || [];
  const meta = usersQuery.data?.meta;

  // Filter clientside if activeTab === "ALL" to ensure we only show non-verified accounts
  const pendingUsers =
    activeTab === "ALL"
      ? users.filter(
          (u) =>
            u.role !== "ADMIN" &&
            u.role !== "SUB_ADMIN" &&
            u.verification?.verificationStatus !== "VERIFIED"
        )
      : users;

  const handleExecuteQuickReview = async () => {
    if (!quickReview) return;
    try {
      await reviewMutation.mutateAsync({
        id: quickReview.verificationId,
        status: quickReview.action,
        rejectionReason: quickReview.action === "REJECTED" ? rejectionReason : undefined,
      });

      toast.success(
        `Application for ${quickReview.userName} marked as ${
          quickReview.action === "VERIFIED" ? "Verified" : "Rejected"
        }.`,
        { title: "KYC Audit Completed" }
      );
      setQuickReview(null);
      setRejectionReason("");
      usersQuery.refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Failed to audit KYC", {
        title: "Audit Error",
      });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "INVESTOR":
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Investor
          </span>
        );
      case "ENTREPRENEUR":
        return (
          <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-600/20">
            Entrepreneur
          </span>
        );
      case "CONSULTANT":
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20">
            Consultant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {role}
          </span>
        );
    }
  };

  const renderVerificationState = (item: AdminUserListItem) => {
    const v = item.verification;
    const isSubmitted = Boolean(v?.frontMediaId);

    if (v?.verificationStatus === "REJECTED") {
      return (
        <div>
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
          {v.rejectionReason && (
            <p className="mt-1 text-[10px] text-rose-600/80 line-clamp-1 italic">
              Reason: {v.rejectionReason}
            </p>
          )}
        </div>
      );
    }

    if (isSubmitted) {
      return (
        <div>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            Submitted · Awaiting Review
          </span>
          <p className="mt-1 text-[10px] text-slate-500">
            {v?.nidNumber ? `NID: ${v.nidNumber}` : v?.passportNumber ? `Passport: ${v.passportNumber}` : "Files uploaded"}
          </p>
        </div>
      );
    }

    return (
      <div>
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
          <ShieldAlert className="w-3 h-3 text-slate-400" />
          Incomplete (Not Submitted)
        </span>
        <p className="mt-1 text-[10px] text-slate-400 italic">
          User has not submitted identity documents yet
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="font-heading font-black text-xl text-slate-900">
                Pending & Incomplete Stakeholder Accounts
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
              Track accounts requiring compliance action. Clearly distinguish between stakeholders who have{" "}
              <strong className="text-amber-800">submitted documents awaiting administrative review</strong> vs{" "}
              <strong className="text-slate-800">incomplete accounts whose KYC hasn&apos;t been submitted yet</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => usersQuery.refetch()}
              disabled={usersQuery.isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${usersQuery.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("ALL");
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Pending & Incomplete
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("SUBMITTED");
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "SUBMITTED"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Submitted (Review Pending)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("UNSUBMITTED");
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "UNSUBMITTED"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Incomplete (KYC Not Submitted)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("REJECTED");
              setPage(1);
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "REJECTED"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejected Submissions
          </button>
        </div>
      </div>

      {/* Search and Role Filter Bar */}
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or username…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Role:
            </span>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  setSelectedRole(r.value);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  selectedRole === r.value
                    ? "bg-[#064e3b] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Pending Table */}
      <Panel className="overflow-hidden">
        {usersQuery.isLoading ? (
          <div className="p-12">
            <InvestraLoader label="Loading pending stakeholder records…" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-heading font-bold text-slate-800 text-sm">
              All caught up! No pending accounts found
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedRole !== "ALL" || activeTab !== "ALL"
                ? "Try clearing filters to view more records."
                : "No stakeholder accounts in this category require review or follow-up at this time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Stakeholder</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Verification State</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map((item) => {
                  const applicantName =
                    `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.email;
                  const isSubmitted = Boolean(item.verification?.frontMediaId);
                  const verificationId = item.verification?.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold grid place-items-center">
                            {applicantName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{applicantName}</p>
                            <p className="text-[11px] text-slate-400">{item.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getRoleBadge(item.role)}</td>

                      <td className="py-3.5 px-4">{renderVerificationState(item)}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.accountStatus === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {item.accountStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isSubmitted && verificationId ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuickReview({
                                    verificationId,
                                    userName: applicantName,
                                    action: "VERIFIED",
                                  })
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-[#064e3b] hover:bg-[#053d2e] text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setQuickReview({
                                    verificationId,
                                    userName: applicantName,
                                    action: "REJECTED",
                                  })
                                }
                                className="px-2 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 italic">
                              Awaiting User Submission
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 font-semibold"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* QUICK AUDIT MODAL */}
      {quickReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  quickReview.action === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {quickReview.action === "VERIFIED" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {quickReview.action === "VERIFIED" ? "Approve KYC Verification" : "Reject KYC Verification"}
                </h4>
                <p className="text-xs text-slate-500">Applicant: {quickReview.userName}</p>
              </div>
            </div>

            {quickReview.action === "REJECTED" && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rejection Reason (Sent to applicant):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the documents were rejected (e.g., blurry photo, expired ID, mismatched name)..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  rows={3}
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQuickReview(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteQuickReview}
                disabled={reviewMutation.isPending || (quickReview.action === "REJECTED" && !rejectionReason.trim())}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition cursor-pointer ${
                  quickReview.action === "VERIFIED"
                    ? "bg-[#064e3b] hover:bg-[#053d2e]"
                    : "bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
                }`}
              >
                {reviewMutation.isPending ? "Auditing…" : `Confirm ${quickReview.action}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
