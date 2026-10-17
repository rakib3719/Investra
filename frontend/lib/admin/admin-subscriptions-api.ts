import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export type TargetRole = "ENTREPRENEUR" | "INVESTOR" | "CONSULTANT";

export interface PlatformFeatureItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  targetRole: TargetRole;
  featureType: "BOOLEAN" | "NUMERIC_LIMIT";
  unit?: string | null;
  createdAt: string;
}

export interface PlanFeatureAssociation {
  id: string;
  featureId: string;
  code?: string;
  name?: string;
  description?: string | null;
  featureType?: "BOOLEAN" | "NUMERIC_LIMIT";
  unit?: string | null;
  isEnabled: boolean;
  limitValue?: number | null;
}

export interface PlanTierItem {
  id: string;
  slug: string;
  name: string;
  badge?: string | null;
  description?: string | null;
  targetRole: TargetRole;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  stripeMonthlyPriceId?: string | null;
  stripeYearlyPriceId?: string | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  features: PlanFeatureAssociation[];
  subscribersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanTierPayload {
  name: string;
  slug: string;
  badge?: string;
  description?: string;
  targetRole: TargetRole;
  priceMonthly: number;
  priceYearly: number;
  currency?: string;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  features?: {
    featureId: string;
    isEnabled: boolean;
    limitValue?: number;
  }[];
}

export interface UpdatePlanTierPayload extends Partial<CreatePlanTierPayload> {}

export interface SubscriberItem {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    role: TargetRole;
    accountStatus: string;
    createdAt: string;
  };
  planId: string;
  plan: {
    id: string;
    name: string;
    slug: string;
    badge: string | null;
    targetRole: TargetRole;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
  };
  billingInterval: "MONTHLY" | "YEARLY" | "LIFETIME";
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED" | "TRIALING";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  featureSnapshot: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPaymentItem {
  id: string;
  amount: number;
  currency: string;
  billingInterval: "MONTHLY" | "YEARLY" | "LIFETIME";
  status: string;
  paymentProvider: string;
  transactionId: string | null;
  receiptUrl: string | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
  };
  plan: {
    id: string;
    name: string;
    slug: string;
    targetRole: TargetRole;
  };
}

export const adminSubscriptionsApi = {
  getFeatures: async (role?: TargetRole): Promise<PlatformFeatureItem[]> => {
    const params = role ? { role } : undefined;
    const res = await apiClient.get<ApiResponse<PlatformFeatureItem[]>>(
      "/admin/subscriptions/features",
      { params }
    );
    return res.data.data;
  },

  getPlans: async (role?: TargetRole): Promise<PlanTierItem[]> => {
    const params = role ? { role } : undefined;
    const res = await apiClient.get<ApiResponse<PlanTierItem[]>>(
      "/admin/subscriptions/plans",
      { params }
    );
    return res.data.data;
  },

  getSubscribers: async (role?: TargetRole): Promise<SubscriberItem[]> => {
    const params = role ? { role } : undefined;
    const res = await apiClient.get<ApiResponse<SubscriberItem[]>>(
      "/admin/subscriptions/subscribers",
      { params }
    );
    return res.data.data;
  },

  getAdminPayments: async (): Promise<SubscriptionPaymentItem[]> => {
    const res = await apiClient.get<ApiResponse<SubscriptionPaymentItem[]>>(
      "/admin/subscriptions/payments"
    );
    return res.data.data;
  },

  cancelSubscriber: async (subscriptionId: string): Promise<any> => {
    const res = await apiClient.patch<ApiResponse<any>>(
      `/admin/subscriptions/subscribers/${subscriptionId}/cancel`
    );
    return res.data.data;
  },

  getPlanById: async (id: string): Promise<PlanTierItem> => {
    const res = await apiClient.get<ApiResponse<PlanTierItem>>(
      `/admin/subscriptions/plans/${id}`
    );
    return res.data.data;
  },

  createPlan: async (payload: CreatePlanTierPayload): Promise<PlanTierItem> => {
    const res = await apiClient.post<ApiResponse<PlanTierItem>>(
      "/admin/subscriptions/plans",
      payload
    );
    return res.data.data;
  },

  updatePlan: async (
    id: string,
    payload: UpdatePlanTierPayload
  ): Promise<PlanTierItem> => {
    const res = await apiClient.patch<ApiResponse<PlanTierItem>>(
      `/admin/subscriptions/plans/${id}`,
      payload
    );
    return res.data.data;
  },

  deletePlan: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/subscriptions/plans/${id}`);
  },

  // Public & Subscriber endpoint helpers
  getPublicPlans: async (role?: TargetRole): Promise<PlanTierItem[]> => {
    const params = role ? { role } : undefined;
    const res = await apiClient.get<ApiResponse<PlanTierItem[]>>(
      "/subscriptions/plans",
      { params }
    );
    return res.data.data;
  },

  getPublicFeatures: async (role?: TargetRole): Promise<PlatformFeatureItem[]> => {
    const params = role ? { role } : undefined;
    const res = await apiClient.get<ApiResponse<PlatformFeatureItem[]>>(
      "/subscriptions/features",
      { params }
    );
    return res.data.data;
  },

  getMySubscription: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/subscriptions/my-subscription");
    return res.data.data;
  },

  cancelMySubscription: async (): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/subscriptions/cancel");
    return res.data.data;
  },

  getMyPayments: async (): Promise<SubscriptionPaymentItem[]> => {
    const res = await apiClient.get<ApiResponse<SubscriptionPaymentItem[]>>("/subscriptions/my-payments");
    return res.data.data;
  },

  checkoutPlan: async (planId: string, billingInterval?: "MONTHLY" | "YEARLY"): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/subscriptions/checkout", {
      planId,
      billingInterval,
    });
    return res.data.data;
  },

  verifyCheckoutSession: async (sessionId: string): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>("/subscriptions/verify-session", {
      sessionId,
    });
    return res.data.data;
  },

  getMyEntitlements: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>("/subscriptions/my-entitlements");
    return res.data.data;
  },
};
