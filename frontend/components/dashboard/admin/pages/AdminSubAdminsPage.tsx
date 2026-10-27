"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  FolderTree,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";
import type { AdminPermission } from "@/lib/auth/types";
import {
  subAdminsApi,
  type CreateSubAdminInput,
  type SubAdminItem,
} from "@/lib/admin/sub-admins-api";

interface PermissionConfig {
  key: AdminPermission;
  label: string;
  badge: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Users;
}

const PERMISSION_CONFIGS: PermissionConfig[] = [
  {
    key: "USER_MANAGEMENT",
    label: "User Management & Moderation",
    badge: "Users",
    description: "Inspect registered investors, entrepreneurs, and consultants. Manage account statuses and revoke suspicious sessions.",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Users,
  },
  {
    key: "KYC_MODERATION",
    label: "Identity & KYC Moderation Vault",
    badge: "KYC",
    description: "Audit compliance records, government IDs, trade licenses, and selfie biometric submissions.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: ShieldCheck,
  },
  {
    key: "CAMPAIGN_MANAGEMENT",
    label: "Campaign & Deal Moderation",
    badge: "Deals",
    description: "Audit entrepreneur campaign pitches, verify milestones, approve deals, or request revisions.",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Rocket,
  },
  {
    key: "SUBSCRIPTION_MANAGEMENT",
    label: "Subscriptions & Pricing Tiers",
    badge: "Billing",
    description: "Configure role-based tier entitlements, view subscriber lists, and monitor recurring payments.",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: CreditCard,
  },
  {
    key: "ANALYTICS_ACCESS",
    label: "Analytics, Telemetry & Payouts",
    badge: "Insights",
    description: "View visitor traffic telemetry, system overview stats, course payouts, and consultation revenues.",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    icon: Activity,
  },
  {
    key: "CATEGORY_MANAGEMENT",
    label: "Marketplace Verticals & Categories",
    badge: "Taxonomy",
    description: "Curate industry sectors, investment categories, and deal verticals.",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    icon: FolderTree,
  },
];

export function AdminSubAdminsPage() {
  const [subAdmins, setSubAdmins] = useState<SubAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<SubAdminItem | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<SubAdminItem | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateSubAdminInput>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    notes: "",
    permissions: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editPermissions, setEditPermissions] = useState<AdminPermission[]>([]);
  const [editDepartment, setEditDepartment] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchSubAdmins = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await subAdminsApi.listSubAdmins();
      setSubAdmins(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sub-administrators";
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.email || !createForm.password || !createForm.firstName || !createForm.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (createForm.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (createForm.permissions.length === 0) {
      toast.error("Please grant at least one permission");
      return;
    }

    setSubmitting(true);
    try {
      await subAdminsApi.createSubAdmin(createForm);
      toast.success("Sub-administrator created successfully!");
      setIsCreateOpen(false);
      setCreateForm({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        department: "",
        notes: "",
        permissions: [],
      });
      fetchSubAdmins();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create sub-admin";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (admin: SubAdminItem) => {
    setEditingAdmin(admin);
    setEditPermissions([...admin.permissions]);
    setEditDepartment(admin.department || "");
    setEditNotes(admin.notes || "");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (editPermissions.length === 0) {
      toast.error("Sub-administrator must have at least one permission");
      return;
    }

    setEditSubmitting(true);
    try {
      await subAdminsApi.updatePermissions(editingAdmin.id, {
        permissions: editPermissions,
        department: editDepartment.trim() || undefined,
        notes: editNotes.trim() || undefined,
      });
      toast.success("Permissions updated successfully!");
      setEditingAdmin(null);
      fetchSubAdmins();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update permissions";
      toast.error(msg);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAdmin) return;
    try {
      await subAdminsApi.deleteSubAdmin(deletingAdmin.id);
      toast.success("Sub-admin account removed");
      setDeletingAdmin(null);
      fetchSubAdmins();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove sub-admin";
      toast.error(msg);
    }
  };

  const toggleCreatePermission = (perm: AdminPermission) => {
    setCreateForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const toggleEditPermission = (perm: AdminPermission) => {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const selectAllCreate = () => {
    setCreateForm((prev) => ({
      ...prev,
      permissions: PERMISSION_CONFIGS.map((p) => p.key),
    }));
  };

  const deselectAllCreate = () => {
    setCreateForm((prev) => ({ ...prev, permissions: [] }));
  };

  const selectAllEdit = () => {
    setEditPermissions(PERMISSION_CONFIGS.map((p) => p.key));
  };

  const deselectAllEdit = () => {
    setEditPermissions([]);
  };

  const filteredSubAdmins = subAdmins.filter((sa) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${sa.firstName} ${sa.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      sa.email.toLowerCase().includes(q) ||
      (sa.department && sa.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
              <UserCog className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Sub-Administrator PBAC Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Enforce granular Permission-Based Access Control (PBAC). Sub-admins strictly access only their granted modules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchSubAdmins(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Sub-Admin
          </button>
        </div>
      </div>

      {/* Permission Matrix Info Card */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-800">
          <Shield className="h-5 w-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Available PBAC Scopes & Protection Matrix
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERMISSION_CONFIGS.map((cfg) => {
            const Icon = cfg.icon;
            return (
              <div
                key={cfg.key}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${cfg.bgColor} ${cfg.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {cfg.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or department..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredSubAdmins.length} of {subAdmins.length} Sub-Admins
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <InvestraLoader label="Loading sub-administrators..." />
          </div>
        ) : filteredSubAdmins.length === 0 ? (
          <div className="py-16 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-base font-semibold text-slate-800">
              No Sub-Administrators Found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {searchQuery
                ? "No sub-admins match your current filter query."
                : "No sub-administrators have been created yet. Click 'Create Sub-Admin' to provision one."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Sub-Admin</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Active Permissions</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubAdmins.map((admin) => {
                  return (
                    <tr key={admin.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                            {admin.firstName[0]}
                            {admin.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {admin.firstName} {admin.lastName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail className="h-3 w-3" />
                              <span>{admin.email}</span>
                            </div>
                            {admin.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Phone className="h-3 w-3" />
                                <span>{admin.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {admin.department ? (
                          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            {admin.department}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-sm">
                          {admin.permissions.length === 0 ? (
                            <span className="text-xs text-red-500 font-medium">No permissions granted</span>
                          ) : (
                            admin.permissions.map((perm) => {
                              const cfg = PERMISSION_CONFIGS.find((p) => p.key === perm);
                              return (
                                <span
                                  key={perm}
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${cfg ? `${cfg.bgColor} ${cfg.color} ${cfg.borderColor}` : "bg-slate-100 text-slate-700 border-slate-200"}`}
                                >
                                  {cfg ? cfg.badge : perm}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          {admin.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(admin.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(admin)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                          >
                            Edit Permissions
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingAdmin(admin)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition"
                            title="Revoke Sub-Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE SUB-ADMIN MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Provision New Sub-Administrator</h3>
                <p className="text-xs text-slate-500">
                  Assign user details and check off individual module permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    placeholder="e.g. Rahim"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    placeholder="e.g. Chowdhury"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="subadmin@investra.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Password (min 8 chars) *</label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-9 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Phone (Optional)</label>
                  <input
                    type="text"
                    value={createForm.phone || ""}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+8801700000000"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Department / Team</label>
                  <input
                    type="text"
                    value={createForm.department || ""}
                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                    placeholder="e.g. Compliance & Moderation"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Internal Operational Notes</label>
                <input
                  type="text"
                  value={createForm.notes || ""}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="e.g. Assigned to quarterly KYC audit"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* PERMISSION CHECKBOXES */}
              <div className="pt-2">
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Module Access Permissions *
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Select which admin modules this sub-admin is authorized to use.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllCreate}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAllCreate}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {PERMISSION_CONFIGS.map((cfg) => {
                    const isChecked = createForm.permissions.includes(cfg.key);
                    const Icon = cfg.icon;
                    return (
                      <label
                        key={cfg.key}
                        onClick={() => toggleCreatePermission(cfg.key)}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          isChecked
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                            isChecked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                            <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            {cfg.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting && <InvestraInlineLoader label="" />}
                  Provision Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Sub-Admin Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  Update permissions for {editingAdmin.firstName} {editingAdmin.lastName} ({editingAdmin.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  placeholder="e.g. Compliance Team"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Internal Operational Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Updated role scope"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Assigned Permissions
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllEdit}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAllEdit}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {PERMISSION_CONFIGS.map((cfg) => {
                    const isChecked = editPermissions.includes(cfg.key);
                    const Icon = cfg.icon;
                    return (
                      <label
                        key={cfg.key}
                        onClick={() => toggleEditPermission(cfg.key)}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          isChecked
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                            isChecked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                            <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            {cfg.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {editSubmitting && <InvestraInlineLoader label="" />}
                  Save Permission Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Revoke Sub-Administrator?</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to revoke sub-administrator access for{" "}
              <strong className="text-slate-900">
                {deletingAdmin.firstName} {deletingAdmin.lastName}
              </strong>{" "}
              ({deletingAdmin.email})? They will lose access to all Investra administrative modules immediately.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAdmin(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                Yes, Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
