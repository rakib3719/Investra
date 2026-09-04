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
  Mail,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
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

const STATUSES: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Suspended", value: "SUSPENDED" },
];

export function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
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
              Stakeholder Directory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Inspect user credentials, verify KYC/AML profiles, and govern account permissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Total Users: {meta?.total || 0}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-5">
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

          {/* Role Filter */}
          <div className="lg:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setSelectedRole(r.value);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  selectedRole === r.value
                    ? "bg-[#078457] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3 flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
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
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No users found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or status filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
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
                      <td className="py-3 px-4">
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

                      <td className="py-3 px-4">{getRoleBadge(item.role)}</td>

                      <td className="py-3 px-4">
                        {getStatusPill(item.accountStatus)}
                      </td>

                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDrawerUserId(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
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
                                className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
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
                                className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
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
                              className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              Activate
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

        {/* Pagination controls */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <span className="text-xs text-slate-500">
              Page {meta.page} of {meta.totalPages} ({meta.total} total items)
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

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                  confirmAction.action === "BLOCKED"
                    ? "bg-rose-50 text-rose-600"
                    : confirmAction.action === "SUSPENDED"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {confirmAction.action === "ACTIVE" ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {confirmAction.action === "ACTIVE"
                    ? "Activate Account"
                    : confirmAction.action === "BLOCKED"
                      ? "Block Account & Terminate Sessions"
                      : "Suspend Account"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Are you sure you want to set status to{" "}
                  <span className="font-bold text-slate-900">
                    {confirmAction.action}
                  </span>{" "}
                  for user{" "}
                  <span className="font-bold text-slate-900">
                    {confirmAction.userName}
                  </span>{" "}
                  ({confirmAction.userEmail})?
                </p>
                {(confirmAction.action === "BLOCKED" ||
                  confirmAction.action === "SUSPENDED") && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-[11px] text-rose-700 font-medium">
                    ⚠️ All active login sessions for this user will be revoked
                    immediately. The user will be logged out and rejected by all
                    auth guards.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={handleExecuteStatusUpdate}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                  confirmAction.action === "BLOCKED"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : confirmAction.action === "SUSPENDED"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-[#078457] hover:bg-[#066e48]"
                }`}
              >
                {updateStatusMutation.isPending ? (
                  <InvestraInlineLoader label="Updating status…" />
                ) : (
                  `Confirm ${confirmAction.action}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Slide-over Drawer */}
      {drawerUserId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-slate-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Stakeholder Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerUserId(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {detailQuery.isLoading ? (
                <div className="py-20 flex justify-center">
                  <InvestraLoader label="Fetching profile record…" />
                </div>
              ) : detailQuery.data ? (
                <div className="mt-6 space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-lg font-bold text-emerald-800">
                      {detailQuery.data.firstName?.[0] || "U"}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {detailQuery.data.firstName} {detailQuery.data.lastName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        @{detailQuery.data.username}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {getRoleBadge(detailQuery.data.role)}
                        {getStatusPill(detailQuery.data.accountStatus)}
                      </div>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{detailQuery.data.email}</span>
                      {detailQuery.data.isEmailVerified ? (
                        <span className="text-[10px] font-bold text-emerald-700">
                          (Verified)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700">
                          (Unverified)
                        </span>
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
                        Joined{" "}
                        {new Date(detailQuery.data.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Role-specific Profiles */}
                  {detailQuery.data.entrepreneurProfile && (
                    <div className="rounded-xl border border-slate-200/80 p-4 space-y-2 text-xs">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-sky-600" />
                        Entrepreneur Profile
                      </h5>
                      <p className="text-slate-700">
                        Company:{" "}
                        <span className="font-semibold">
                          {detailQuery.data.entrepreneurProfile.companyName ||
                            "Not specified"}
                        </span>
                      </p>
                      <p className="text-slate-600">
                        Headline:{" "}
                        {detailQuery.data.entrepreneurProfile.headline ||
                          "No headline"}
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
                          {detailQuery.data.investorProfile.companyName ||
                            "Private"}
                        </span>
                      </p>
                      <p className="text-slate-700">
                        Accredited:{" "}
                        <span className="font-semibold">
                          {detailQuery.data.investorProfile.accreditedInvestor
                            ? "Yes"
                            : "No"}
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
                className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
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
