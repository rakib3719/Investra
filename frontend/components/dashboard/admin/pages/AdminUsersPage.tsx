"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Ban,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  Users,
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
  useUpdateUserStatusMutation,
} from "@/lib/admin/admin-hooks";
import type {
  AccountStatus,
  AdminUserListItem,
  UserRole,
} from "@/lib/admin/admin-users-api";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";

const ROLES: { label: string; value: string }[] = [
  { label: "All Roles", value: "ALL" },
  { label: "Investors", value: "INVESTOR" },
  { label: "Entrepreneurs", value: "ENTREPRENEUR" },
  { label: "Consultants", value: "CONSULTANT" },
  { label: "Admins", value: "ADMIN" },
];

const ACCOUNT_STATUSES: { label: string; value: string }[] = [
  { label: "All Account Statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const KYC_STATUSES: { label: string; value: string }[] = [
  { label: "All KYC Statuses", value: "ALL" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Under Review / Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

const SUBMISSION_STATUSES: { label: string; value: string }[] = [
  { label: "All Submissions", value: "ALL" },
  { label: "Documents Submitted", value: "SUBMITTED" },
  { label: "Incomplete / Not Submitted", value: "UNSUBMITTED" },
];

export function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedKycStatus, setSelectedKycStatus] = useState("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState("ALL");
  const [page, setPage] = useState(1);

  // Detail drawer & confirmation modal state
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    userId: string;
    userName: string;
    userEmail: string;
    action: AccountStatus;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const usersQuery = useAdminUsersQuery({
    search: searchTerm.trim() || undefined,
    role: selectedRole === "ALL" ? undefined : (selectedRole as UserRole),
    status: selectedStatus === "ALL" ? undefined : (selectedStatus as AccountStatus),
    kycStatus: selectedKycStatus === "ALL" ? undefined : (selectedKycStatus as any),
    kycSubmission: selectedSubmission === "ALL" ? undefined : (selectedSubmission as any),
    page,
    limit: 15,
  });

  const detailQuery = useAdminUserDetailQuery(drawerUserId || "");
  const updateStatusMutation = useUpdateUserStatusMutation();

  const users = usersQuery.data?.items || [];
  const meta = usersQuery.data?.meta;

  const handleExecuteStatusUpdate = async () => {
    if (!confirmAction) return;

    try {
      const res = await updateStatusMutation.mutateAsync({
        userId: confirmAction.userId,
        status: confirmAction.action,
      });
      setStatusMessage(res.message);
      setConfirmAction(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to update status");
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
      case "ADMIN":
      case "SUB_ADMIN":
        return (
          <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
            Admin
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

  const getStatusPill = (status: AccountStatus) => {
    switch (status) {
      case "ACTIVE":
        return <StatusPill tone="green">Active</StatusPill>;
      case "BLOCKED":
        return <StatusPill tone="rose">Blocked</StatusPill>;
      case "SUSPENDED":
        return <StatusPill tone="amber">Suspended</StatusPill>;
      default:
        return <StatusPill tone="slate">{status}</StatusPill>;
    }
  };

  const getKycCompliancePill = (item: AdminUserListItem) => {
    if (item.role === "ADMIN" || item.role === "SUB_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          Internal Admin
        </span>
      );
    }

    const verification = item.verification;
    const isSubmitted = Boolean(verification?.frontMediaId);

    if (verification?.verificationStatus === "VERIFIED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Verified
        </span>
      );
    }

    if (verification?.verificationStatus === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          Rejected
        </span>
      );
    }

    if (isSubmitted) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Submitted (Review Pending)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 border border-slate-200">
        <ShieldAlert className="w-3 h-3 text-slate-400" />
        Incomplete (Not Submitted)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert toast */}
      {statusMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header and Filter Controls */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Stakeholder Directory & KYC Vetting
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Inspect user credentials by role, audit verification completeness, and filter who has submitted vs unsubmitted KYC documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Total Users: {meta?.total || 0}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-5 space-y-3">
          {/* Top row: Search Box & Role Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="relative lg:col-span-5">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Role Filter Buttons */}
            <div className="lg:col-span-7 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setSelectedRole(r.value);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedRole === r.value
                      ? "bg-[#064e3b] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: KYC & Status Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Account Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {ACCOUNT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                KYC Verification Status
              </label>
              <select
                value={selectedKycStatus}
                onChange={(e) => {
                  setSelectedKycStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {KYC_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                KYC Document Submission
              </label>
              <select
                value={selectedSubmission}
                onChange={(e) => {
                  setSelectedSubmission(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {SUBMISSION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Panel>

      {/* Users Table */}
      <Panel className="overflow-hidden">
        {usersQuery.isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <InvestraLoader label="Loading stakeholder records…" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No users found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">KYC Compliance</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((item) => {
                  const isSelf = currentAdmin?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                            {item.firstName?.[0] || item.email[0].toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900 truncate">
                                {item.firstName} {item.lastName}
                              </p>
                              {isSelf && (
                                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] truncate">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getRoleBadge(item.role)}</td>

                      <td className="py-3.5 px-4">
                        {getKycCompliancePill(item)}
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusPill(item.accountStatus)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDrawerUserId(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#064e3b]" />
                            Inspect
                          </button>

                          {isSelf ? (
                            <span className="text-[11px] italic font-semibold text-slate-400">
                              Locked (Self)
                            </span>
                          ) : item.accountStatus === "ACTIVE" ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({
                                    userId: item.id,
                                    userName: `${item.firstName} ${item.lastName}`,
                                    userEmail: item.email,
                                    action: "SUSPENDED",
                                  })
                                }
                                className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                              >
                                Suspend
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmAction({
                                    userId: item.id,
                                    userName: `${item.firstName} ${item.lastName}`,
                                    userEmail: item.email,
                                    action: "BLOCKED",
                                  })
                                }
                                className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                              >
                                Block
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmAction({
                                  userId: item.id,
                                  userName: `${item.firstName} ${item.lastName}`,
                                  userEmail: item.email,
                                  action: "ACTIVE",
                                })
                              }
                              className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                            >
                              Reactivate
                            </button>
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

        {/* Pagination Bar */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <span className="text-xs text-slate-500">
              Showing page <strong className="text-slate-800">{meta.page}</strong> of{" "}
              <strong className="text-slate-800">{meta.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  confirmAction.action === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Confirm Status Change
                </h4>
                <p className="text-xs text-slate-500">
                  Target: {confirmAction.userName} ({confirmAction.userEmail})
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Are you sure you want to change this user&apos;s account status to{" "}
              <strong className="text-slate-900">{confirmAction.action}</strong>?
              {confirmAction.action === "BLOCKED" && (
                <span className="block mt-1 text-rose-600 font-semibold">
                  This will immediately terminate all active sessions.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusUpdate}
                disabled={updateStatusMutation.isPending}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                  confirmAction.action === "ACTIVE"
                    ? "bg-[#064e3b] hover:bg-[#053d2e]"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {updateStatusMutation.isPending ? "Updating…" : `Confirm ${confirmAction.action}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Inspect Drawer */}
      {drawerUserId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Stakeholder Dossier
                </h3>
                <button
                  type="button"
                  onClick={() => setDrawerUserId(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {detailQuery.isLoading ? (
                <div className="py-20">
                  <InvestraLoader label="Loading user details…" />
                </div>
              ) : detailQuery.data ? (
                <div className="space-y-6 pt-5">
                  {/* Basic Profile */}
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-xl font-bold text-[#064e3b]">
                      {detailQuery.data.firstName?.[0] || detailQuery.data.email[0].toUpperCase()}
                    </span>
                    <div>
                      <h4 className="font-heading font-black text-lg text-slate-900">
                        {detailQuery.data.firstName} {detailQuery.data.lastName}
                      </h4>
                      <p className="text-xs text-slate-500">{detailQuery.data.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {getRoleBadge(detailQuery.data.role)}
                        {getStatusPill(detailQuery.data.accountStatus)}
                      </div>
                    </div>
                  </div>

                  {/* KYC Compliance Status Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#064e3b]" />
                        <span>KYC & Regulatory Compliance</span>
                      </span>
                      {getKycCompliancePill(detailQuery.data)}
                    </div>

                    {(detailQuery.data as any).verification ? (
                      <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200/60">
                        <p className="text-slate-600">
                          Declared ID:{" "}
                          <span className="font-mono font-bold text-slate-800">
                            {(detailQuery.data as any).verification.nidNumber
                              ? `NID: ${(detailQuery.data as any).verification.nidNumber}`
                              : (detailQuery.data as any).verification.passportNumber
                                ? `Passport: ${(detailQuery.data as any).verification.passportNumber}`
                                : "None"}
                          </span>
                        </p>
                        {(detailQuery.data as any).verification.taxIdNumber && (
                          <p className="text-slate-600">
                            TIN:{" "}
                            <span className="font-mono font-semibold text-slate-800">
                              {(detailQuery.data as any).verification.taxIdNumber}
                            </span>
                          </p>
                        )}
                        {(detailQuery.data as any).verification.tradeLicenseNumber && (
                          <p className="text-slate-600">
                            Trade License:{" "}
                            <span className="font-mono font-semibold text-slate-800">
                              {(detailQuery.data as any).verification.tradeLicenseNumber}
                            </span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic pt-1">
                        No government identification or KYC files submitted yet.
                      </p>
                    )}
                  </div>

                  {/* Contact & Registration Meta */}
                  <div className="rounded-xl border border-slate-200/80 p-4 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-900">Account Meta</h5>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{detailQuery.data.email}</span>
                      {detailQuery.data.isEmailVerified ? (
                        <span className="text-[10px] font-bold text-emerald-700">(Verified)</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700">(Unverified)</span>
                      )}
                    </div>
                    {detailQuery.data.phone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{detailQuery.data.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        Joined {new Date(detailQuery.data.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Role Specific profiles */}
                  {detailQuery.data.entrepreneurProfile && (
                    <div className="rounded-xl border border-slate-200/80 p-4 space-y-2 text-xs">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-sky-600" />
                        Entrepreneur Profile
                      </h5>
                      <p className="text-slate-700">
                        Company:{" "}
                        <span className="font-semibold">
                          {detailQuery.data.entrepreneurProfile.companyName || "Not specified"}
                        </span>
                      </p>
                      <p className="text-slate-600">
                        Headline: {detailQuery.data.entrepreneurProfile.headline || "No headline"}
                      </p>
                    </div>
                  )}

                  {detailQuery.data.investorProfile && (
                    <div className="rounded-xl border border-slate-200/80 p-4 space-y-2 text-xs">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Investor Profile
                      </h5>
                      <p className="text-slate-700">
                        Company:{" "}
                        <span className="font-semibold">
                          {detailQuery.data.investorProfile.companyName || "Private"}
                        </span>
                      </p>
                      <p className="text-slate-700">
                        Accredited:{" "}
                        <span className="font-semibold">
                          {detailQuery.data.investorProfile.accreditedInvestor ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setDrawerUserId(null)}
                className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
