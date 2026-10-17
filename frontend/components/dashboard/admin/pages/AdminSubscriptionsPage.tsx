"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  ShieldCheck,
  Check,
  Building2,
  Briefcase,
  UserCheck,
  Lock,
  Receipt,
  Eye,
  X,
  ExternalLink,
  Ban,
  Clock,
  Calendar,
} from "lucide-react";
import {
  Panel,
  MetricCard,
} from "@/components/dashboard/investor/InvestorUI";
import {
  useAdminPlansQuery,
  useAdminFeaturesQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useAdminSubscribersQuery,
  useAdminPaymentsQuery,
  useAdminCancelSubscriberMutation,
} from "@/lib/admin/admin-subscription-hooks";
import type {
  TargetRole,
  PlanTierItem,
  CreatePlanTierPayload,
  SubscriberItem,
} from "@/lib/admin/admin-subscriptions-api";
import { toast } from "@/lib/toast";
import { PlanEditorModal } from "./PlanEditorModal";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

type ActiveTab = "PLANS" | "SUBSCRIBERS" | "PAYMENTS";

export function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("PLANS");
  const [selectedRole, setSelectedRole] = useState<TargetRole>("INVESTOR");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanTierItem | null>(null);
  const [selectedSubscriberSnapshot, setSelectedSubscriberSnapshot] = useState<SubscriberItem | null>(null);

  // Queries
  const plansQuery = useAdminPlansQuery(selectedRole);
  const featuresQuery = useAdminFeaturesQuery(selectedRole);
  const subscribersQuery = useAdminSubscribersQuery(selectedRole);
  const paymentsQuery = useAdminPaymentsQuery();

  // Mutations
  const createPlanMutation = useCreatePlanMutation();
  const updatePlanMutation = useUpdatePlanMutation();
  const deletePlanMutation = useDeletePlanMutation();
  const cancelSubscriberMutation = useAdminCancelSubscriberMutation();

  const plans = plansQuery.data || [];
  const features = featuresQuery.data || [];
  const subscribers = subscribersQuery.data || [];
  const payments = paymentsQuery.data || [];

  const handleCreateNew = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: PlanTierItem) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (plan: PlanTierItem) => {
    if (
      confirm(
        `Are you sure you want to deactivate or remove "${plan.name}"? If users are currently subscribed, it will be marked inactive.`
      )
    ) {
      try {
        await deletePlanMutation.mutateAsync(plan.id);
        toast.success(`Plan "${plan.name}" was deactivated/removed successfully.`);
      } catch (err: any) {
        toast.apiError(err, "Failed to delete plan tier.");
      }
    }
  };

  const handleRevokeSubscriber = async (subscriber: SubscriberItem) => {
    if (
      confirm(
        `Are you sure you want to revoke/cancel active access for subscriber "${subscriber.user.email}"?`
      )
    ) {
      try {
        await cancelSubscriberMutation.mutateAsync(subscriber.id);
        toast.success(`Subscription for ${subscriber.user.email} was cancelled.`);
      } catch (err: any) {
        toast.apiError(err, "Failed to cancel subscriber.");
      }
    }
  };

  const handleFormSubmit = async (payload: CreatePlanTierPayload) => {
    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({
          id: editingPlan.id,
          payload,
        });
        toast.success(`Plan "${payload.name}" updated successfully.`);
      } else {
        await createPlanMutation.mutateAsync(payload);
        toast.success(`Plan "${payload.name}" created successfully.`);
      }
      setIsModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      toast.apiError(err, "Failed to save plan tier.");
    }
  };

  const totalActivePlans = plans.filter((p) => p.isActive).length;
  const totalSubscribersCount = subscribers.filter((s) => s.status === "ACTIVE").length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.status === "PAID" ? p.amount : 0), 0);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Primary Navigation */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              Dynamic Subscriptions, Entitlements & Transactions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage dynamic pricing tiers, audit subscribers with immutable feature snapshots, and track all Stripe/platform payments.
            </p>
          </div>

          {activeTab === "PLANS" && (
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create {selectedRole} Plan
            </button>
          )}
        </div>

        {/* Global Key Metrics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
          <MetricCard
            label="Active Plans"
            value={String(totalActivePlans)}
            detail={`${plans.length} total tiers configured for ${selectedRole}`}
            icon={CreditCard}
          />
          <MetricCard
            label="Active Subscribers"
            value={String(totalSubscribersCount)}
            detail="Grandfathered on immutable feature snapshots"
            icon={Users}
          />
          <MetricCard
            label="Audit Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            detail={`${payments.length} lifetime recorded transactions`}
            icon={Receipt}
          />
        </div>
      </Panel>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("PLANS")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 -mb-[1px] cursor-pointer ${
            activeTab === "PLANS"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Plan Tiers & Entitlements
        </button>

        <button
          onClick={() => setActiveTab("SUBSCRIBERS")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 -mb-[1px] cursor-pointer ${
            activeTab === "SUBSCRIBERS"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="h-4 w-4" />
          Subscribers Roster ({subscribers.length})
        </button>

        <button
          onClick={() => setActiveTab("PAYMENTS")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 -mb-[1px] cursor-pointer ${
            activeTab === "PAYMENTS"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Payment Transactions ({payments.length})
        </button>
      </div>

      {/* Role Sub-Filter (Used in Plans & Subscribers) */}
      {(activeTab === "PLANS" || activeTab === "SUBSCRIBERS") && (
        <div className="flex items-center gap-2">
          {[
            { role: "INVESTOR" as TargetRole, label: "Investors", icon: Building2 },
            { role: "ENTREPRENEUR" as TargetRole, label: "Entrepreneurs", icon: Briefcase },
            { role: "CONSULTANT" as TargetRole, label: "Consultants", icon: UserCheck },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => setSelectedRole(item.role)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                selectedRole === item.role
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1: PLAN TIERS VIEW */}
      {activeTab === "PLANS" && (
        <>
          {plansQuery.isLoading || featuresQuery.isLoading ? (
            <div className="py-20 flex justify-center">
              <InvestraLoader size="md" />
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">
                No {selectedRole.toLowerCase()} plans created yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Get started by adding your first subscription tier with custom feature quotas and pricing.
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                    plan.isPopular
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-slate-200"
                  }`}
                >
                  {/* Badges & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updatePlanMutation.mutateAsync({
                              id: plan.id,
                              payload: { isActive: !plan.isActive },
                            });
                            toast.success(`Plan "${plan.name}" is now ${!plan.isActive ? "Active (visible to users)" : "Inactive"}`);
                          } catch (err: any) {
                            toast.apiError(err, "Failed to toggle plan status.");
                          }
                        }}
                        title="Click to toggle Active / Inactive"
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition hover:opacity-85 ${
                          plan.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {plan.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                      {plan.badge && (
                        <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        title="Delete / Deactivate Plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Pricing */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {plan.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        ${plan.priceMonthly}
                      </span>
                      <span className="text-xs text-slate-500">/mo</span>
                      <span className="text-xs font-semibold text-emerald-600 ml-2">
                        (${plan.priceYearly}/yr)
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 border-t border-slate-100 pt-4 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Plan Entitlements ({plan.features.length})
                    </p>
                    <div className="space-y-2">
                      {plan.features.map((pf) => (
                        <div
                          key={pf.id}
                          className="flex items-start gap-2 text-xs"
                        >
                          {pf.isEnabled ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="text-slate-700">
                                <span className="font-medium">{pf.name}</span>
                                {pf.limitValue !== null && pf.limitValue !== undefined && (
                                  <span className="ml-1 font-bold text-emerald-700">
                                    {pf.limitValue === -1
                                      ? "(Unlimited)"
                                      : `(${pf.limitValue} ${pf.unit || ""})`}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <div className="text-slate-400">
                                <span className="font-normal">{pf.name}</span>
                                <span className="ml-1 text-[10px] text-slate-400">(Not included)</span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="mt-6 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Slug: {plan.slug}</span>
                    <span>Subscribers: {plan.subscribersCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: SUBSCRIBERS ROSTER VIEW */}
      {activeTab === "SUBSCRIBERS" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Active & Enrolled Subscribers ({subscribers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Audit who is subscribed to each tier, review immutable entitlement snapshots, and manage subscription lifecycle.
              </p>
            </div>
          </div>

          {subscribersQuery.isLoading ? (
            <div className="py-16 flex justify-center">
              <InvestraLoader size="md" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No subscribers enrolled under {selectedRole} plans yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 rounded-l-lg">Subscriber</th>
                    <th scope="col" className="px-4 py-3">Tier</th>
                    <th scope="col" className="px-4 py-3">Interval</th>
                    <th scope="col" className="px-4 py-3">Period Range</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Snapshot</th>
                    <th scope="col" className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub) => {
                    const fullName = `${sub.user?.firstName || ""} ${sub.user?.lastName || ""}`.trim() || sub.user?.username || "Unnamed User";
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{fullName}</div>
                          <div className="text-[11px] text-slate-500">{sub.user?.email}</div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">
                          {sub.plan?.name}
                        </td>
                        <td className="px-4 py-3.5 capitalize">
                          {sub.billingInterval.toLowerCase()}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {formatDate(sub.currentPeriodStart)} - {formatDate(sub.currentPeriodEnd)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              sub.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSubscriberSnapshot(sub)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            <Eye className="h-3 w-3 text-emerald-600" />
                            View Entitlements
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {sub.status === "ACTIVE" && (
                            <button
                              type="button"
                              onClick={() => handleRevokeSubscriber(sub)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                              title="Cancel / Revoke active access"
                            >
                              <Ban className="h-3 w-3" />
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT TRANSACTIONS AUDIT VIEW */}
      {activeTab === "PAYMENTS" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Subscription Payments & Invoices ({payments.length})
            </h3>
            <p className="text-xs text-slate-500">
              Comprehensive ledger of all subscription transactions processed through Stripe or platform activation.
            </p>
          </div>

          {paymentsQuery.isLoading ? (
            <div className="py-16 flex justify-center">
              <InvestraLoader size="md" />
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No payments recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 rounded-l-lg">Date</th>
                    <th scope="col" className="px-4 py-3">Subscriber</th>
                    <th scope="col" className="px-4 py-3">Tier</th>
                    <th scope="col" className="px-4 py-3">Interval</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Provider & Tx ID</th>
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
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">
                          {p.user ? `${p.user.firstName || ""} ${p.user.lastName || ""}`.trim() || p.user.email : "Unknown"}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.user?.email}</div>
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
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-800">{p.paymentProvider}</span>:{" "}
                        {p.transactionId ? `${p.transactionId.substring(0, 15)}...` : "N/A"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {p.receiptUrl ? (
                          <a
                            href={p.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            Receipt <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">Paid In-App</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Grandfathered Snapshot Inspection Modal */}
      {selectedSubscriberSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Subscriber Entitlement Snapshot
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSubscriberSnapshot.user?.email} • {selectedSubscriberSnapshot.plan?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubscriberSnapshot(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-3 text-xs text-emerald-800">
                <strong>Immutable Guarantee:</strong> This user retains these exact entitlements even if the plan is modified by admins later.
              </div>

              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                {Object.values(selectedSubscriberSnapshot.featureSnapshot || {}).map((feat: any, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div>
                      <p className="font-semibold text-slate-800">{feat.name || feat.code}</p>
                      <p className="font-mono text-[10px] text-slate-400">{feat.code}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        feat.isEnabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {feat.isEnabled ? "Enabled" : "Locked"}
                      </span>
                      {feat.limitValue !== null && feat.limitValue !== undefined && (
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                          {feat.limitValue === -1 ? "Unlimited" : `${feat.limitValue} ${feat.unit || ""}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubscriberSnapshot(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <PlanEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        plan={editingPlan}
        features={features}
        onSubmit={handleFormSubmit}
        isSubmitting={createPlanMutation.isPending || updatePlanMutation.isPending}
      />
    </div>
  );
}
