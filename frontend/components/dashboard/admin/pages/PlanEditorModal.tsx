"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, Check } from "lucide-react";
import type {
  TargetRole,
  PlatformFeatureItem,
  PlanTierItem,
  CreatePlanTierPayload,
} from "@/lib/admin/admin-subscriptions-api";

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: TargetRole;
  plan: PlanTierItem | null;
  features: PlatformFeatureItem[];
  onSubmit: (payload: CreatePlanTierPayload) => Promise<void>;
  isSubmitting: boolean;
}

export function PlanEditorModal({
  isOpen,
  onClose,
  role,
  plan,
  features,
  onSubmit,
  isSubmitting,
}: PlanEditorModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [priceMonthly, setPriceMonthly] = useState(0);
  const [priceYearly, setPriceYearly] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [stripeMonthlyPriceId, setStripeMonthlyPriceId] = useState("");
  const [stripeYearlyPriceId, setStripeYearlyPriceId] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Features state: featureId -> { isEnabled: boolean, limitValue: number | null, isUnlimited: boolean }
  const [featuresState, setFeaturesState] = useState<
    Record<
      string,
      { isEnabled: boolean; limitValue: number | null; isUnlimited: boolean }
    >
  >({});

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setSlug(plan.slug);
      setBadge(plan.badge || "");
      setDescription(plan.description || "");
      setPriceMonthly(plan.priceMonthly);
      setPriceYearly(plan.priceYearly);
      setCurrency(plan.currency || "USD");
      setStripeMonthlyPriceId(plan.stripeMonthlyPriceId || "");
      setStripeYearlyPriceId(plan.stripeYearlyPriceId || "");
      setIsPopular(plan.isPopular);
      setIsActive(plan.isActive);
      setSortOrder(plan.sortOrder);

      const fState: Record<
        string,
        { isEnabled: boolean; limitValue: number | null; isUnlimited: boolean }
      > = {};

      features.forEach((feat) => {
        const found = plan.features.find((pf) => pf.featureId === feat.id);
        if (found) {
          fState[feat.id] = {
            isEnabled: found.isEnabled,
            limitValue: found.limitValue !== null && found.limitValue !== undefined ? found.limitValue : 1,
            isUnlimited: found.limitValue === -1,
          };
        } else {
          fState[feat.id] = {
            isEnabled: false,
            limitValue: feat.featureType === "NUMERIC_LIMIT" ? 5 : null,
            isUnlimited: false,
          };
        }
      });
      setFeaturesState(fState);
    } else {
      setName("");
      setSlug("");
      setBadge("");
      setDescription("");
      setPriceMonthly(0);
      setPriceYearly(0);
      setCurrency("USD");
      setStripeMonthlyPriceId("");
      setStripeYearlyPriceId("");
      setIsPopular(false);
      setIsActive(true);
      setSortOrder(1);

      const fState: Record<
        string,
        { isEnabled: boolean; limitValue: number | null; isUnlimited: boolean }
      > = {};
      features.forEach((feat) => {
        fState[feat.id] = {
          isEnabled: true,
          limitValue: feat.featureType === "NUMERIC_LIMIT" ? 5 : null,
          isUnlimited: false,
        };
      });
      setFeaturesState(fState);
    }
  }, [plan, features, isOpen]);

  if (!isOpen) return null;

  const handleSlugify = (val: string) => {
    setName(val);
    if (!plan) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFeaturesState((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        isEnabled: !prev[featureId]?.isEnabled,
      },
    }));
  };

  const handleLimitChange = (featureId: string, val: number) => {
    setFeaturesState((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        limitValue: val,
        isUnlimited: false,
      },
    }));
  };

  const handleUnlimitedToggle = (featureId: string) => {
    setFeaturesState((prev) => {
      const current = prev[featureId];
      const nextUnlimited = !current?.isUnlimited;
      return {
        ...prev,
        [featureId]: {
          ...current,
          isUnlimited: nextUnlimited,
          limitValue: nextUnlimited ? -1 : 1,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedFeatures = Object.entries(featuresState).map(
      ([featureId, state]) => ({
        featureId,
        isEnabled: state.isEnabled,
        limitValue: state.isEnabled
          ? state.isUnlimited
            ? -1
            : state.limitValue !== null
            ? Number(state.limitValue)
            : undefined
          : undefined,
      })
    );

    const payload: CreatePlanTierPayload = {
      name,
      slug,
      badge: badge.trim() || undefined,
      description: description.trim() || undefined,
      targetRole: role,
      priceMonthly: Number(priceMonthly),
      priceYearly: Number(priceYearly),
      currency,
      stripeMonthlyPriceId: stripeMonthlyPriceId.trim() || undefined,
      stripeYearlyPriceId: stripeYearlyPriceId.trim() || undefined,
      isPopular,
      isActive,
      sortOrder: Number(sortOrder),
      features: formattedFeatures,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              {plan ? `Edit Plan: ${plan.name}` : `Create New ${role} Plan`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set plan pricing, display settings, and feature entitlements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Grandfathering Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs text-emerald-900">
              <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-950">
                  Grandfathering Protection Active:
                </strong>{" "}
                Modifying limits or pricing here applies only to new purchases. Existing subscribers retain their original feature snapshot.
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleSlugify(e.target.value)}
                  placeholder="e.g. Pro Accelerator"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. pro-accelerator"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Most Popular, Recommended"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview displayed on pricing card"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pricing & Payment IDs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Monthly Price ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceMonthly}
                    onChange={(e) => setPriceMonthly(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Yearly Price ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={priceYearly}
                    onChange={(e) => setPriceYearly(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Stripe Monthly Price ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={stripeMonthlyPriceId}
                    onChange={(e) => setStripeMonthlyPriceId(e.target.value)}
                    placeholder="price_1N..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Stripe Yearly Price ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={stripeYearlyPriceId}
                    onChange={(e) => setStripeYearlyPriceId(e.target.value)}
                    placeholder="price_1N..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Highlight as Popular
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Active & Available for Purchase
                </label>
              </div>
            </div>

            {/* Features Checklist & Limiter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Feature Entitlements & Numeric Limits
                </h4>
                <span className="text-[11px] text-slate-400">
                  {features.length} catalog features
                </span>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                {features.map((feat) => {
                  const state = featuresState[feat.id] || {
                    isEnabled: false,
                    limitValue: 0,
                    isUnlimited: false,
                  };

                  return (
                    <div
                      key={feat.id}
                      className={`p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                        state.isEnabled ? "bg-white" : "bg-slate-50/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={state.isEnabled}
                          onChange={() => handleFeatureToggle(feat.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {feat.name}
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {feat.code}
                            </span>
                          </p>
                          {feat.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {feat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Limit Control for Numeric features */}
                      {feat.featureType === "NUMERIC_LIMIT" && state.isEnabled && (
                        <div className="flex items-center gap-3 shrink-0 pl-7 md:pl-0">
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={state.isUnlimited}
                              onChange={() => handleUnlimitedToggle(feat.id)}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Unlimited (-1)
                          </label>

                          {!state.isUnlimited && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500 font-medium">
                                Limit:
                              </span>
                              <input
                                type="number"
                                min={0}
                                value={state.limitValue ?? 0}
                                onChange={(e) =>
                                  handleLimitChange(feat.id, Number(e.target.value))
                                }
                                className="w-16 rounded border border-slate-200 px-2 py-1 text-xs text-right font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                              />
                              {feat.unit && (
                                <span className="text-[11px] text-slate-400">
                                  {feat.unit}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {plan ? "Update Plan Tier" : "Create Plan Tier"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
