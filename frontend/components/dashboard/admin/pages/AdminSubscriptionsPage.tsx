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
  AlertCircle,
  Building2,
  Briefcase,
  UserCheck,
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
} from "@/lib/admin/admin-subscription-hooks";
import type {
  TargetRole,
  PlanTierItem,
  CreatePlanTierPayload,
} from "@/lib/admin/admin-subscriptions-api";
import { toast } from "@/lib/toast";
import { PlanEditorModal } from "./PlanEditorModal";
import { InvestraLoader } from "@/components/ui/InvestraLoader";

export function AdminSubscriptionsPage() {
  const [selectedRole, setSelectedRole] = useState<TargetRole>("INVESTOR");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanTierItem | null>(null);

  const plansQuery = useAdminPlansQuery(selectedRole);
  const featuresQuery = useAdminFeaturesQuery(selectedRole);

  const createPlanMutation = useCreatePlanMutation();
  const updatePlanMutation = useUpdatePlanMutation();
  const deletePlanMutation = useDeletePlanMutation();

  const plans = plansQuery.data || [];
  const features = featuresQuery.data || [];

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
  const totalSubscribers = plans.reduce(
    (sum, p) => sum + (p.subscribersCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              Dynamic Subscription & Plan Tier Management
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure role-based tier packages, set numeric limits & boolean entitlements with immutable subscriber grandfathering.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
          >
            <Plus className="h-4 w-4" />
            Create {selectedRole} Plan
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
          <MetricCard
            label="Total Tiers"
            value={String(plans.length)}
            detail={`${totalActivePlans} currently active for purchase`}
            icon={CreditCard}
          />
          <MetricCard
            label="Platform Features"
            value={String(features.length)}
            detail={`Available feature catalog for ${selectedRole}`}
            icon={ShieldCheck}
          />
          <MetricCard
            label="Active Subscribers"
            value={String(totalSubscribers)}
            detail="Locked into original feature snapshots"
            icon={Users}
          />
        </div>
      </Panel>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { role: "INVESTOR" as TargetRole, label: "Investors", icon: Building2 },
          { role: "ENTREPRENEUR" as TargetRole, label: "Entrepreneurs", icon: Briefcase },
          { role: "CONSULTANT" as TargetRole, label: "Consultants", icon: UserCheck },
        ].map((item) => (
          <button
            key={item.role}
            onClick={() => setSelectedRole(item.role)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 -mb-[1px] ${
              selectedRole === item.role
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label} Plans
          </button>
        ))}
      </div>

      {/* Plans Grid */}
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
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition"
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
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
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
                  </span>
                  {plan.badge && (
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Edit Plan"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
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
                  Included Entitlements
                </p>
                <div className="space-y-2">
                  {plan.features.map((pf) => (
                    <div
                      key={pf.id}
                      className="flex items-start gap-2 text-xs text-slate-700"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{pf.name}</span>
                        {pf.limitValue !== null && pf.limitValue !== undefined && (
                          <span className="ml-1 font-bold text-emerald-700">
                            {pf.limitValue === -1
                              ? "(Unlimited)"
                              : `(${pf.limitValue} ${pf.unit || ""})`}
                          </span>
                        )}
                      </div>
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
