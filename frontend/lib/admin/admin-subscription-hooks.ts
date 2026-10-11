import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminSubscriptionsApi,
  type TargetRole,
  type CreatePlanTierPayload,
  type UpdatePlanTierPayload,
} from "./admin-subscriptions-api";

export const subscriptionKeys = {
  allPlans: () => ["admin", "subscriptions", "plans"] as const,
  plansList: (role?: TargetRole) =>
    ["admin", "subscriptions", "plans", role] as const,
  planDetail: (id: string) =>
    ["admin", "subscriptions", "plans", "detail", id] as const,
  allFeatures: () => ["admin", "subscriptions", "features"] as const,
  featuresList: (role?: TargetRole) =>
    ["admin", "subscriptions", "features", role] as const,
  publicPlans: (role?: TargetRole) =>
    ["public", "subscriptions", "plans", role] as const,
};

export function useAdminPlansQuery(role?: TargetRole) {
  return useQuery({
    queryKey: subscriptionKeys.plansList(role),
    queryFn: () => adminSubscriptionsApi.getPlans(role),
    staleTime: 30 * 1000,
  });
}

export function useAdminFeaturesQuery(role?: TargetRole) {
  return useQuery({
    queryKey: subscriptionKeys.featuresList(role),
    queryFn: () => adminSubscriptionsApi.getFeatures(role),
    staleTime: 60 * 1000,
  });
}

export function useCreatePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanTierPayload) =>
      adminSubscriptionsApi.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.allPlans(),
      });
    },
  });
}

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePlanTierPayload;
    }) => adminSubscriptionsApi.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.allPlans(),
      });
    },
  });
}

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSubscriptionsApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.allPlans(),
      });
    },
  });
}

export function usePublicPlansQuery(role?: TargetRole) {
  return useQuery({
    queryKey: subscriptionKeys.publicPlans(role),
    queryFn: () => adminSubscriptionsApi.getPublicPlans(role),
    staleTime: 60 * 1000,
  });
}
