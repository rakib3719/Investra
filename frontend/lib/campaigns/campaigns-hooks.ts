import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "./campaigns-api";
import type {
  CampaignQueryInput,
  CreateCampaignInput,
  CreateMilestoneInput,
} from "./types";

export const campaignKeys = {
  all: () => ["campaigns"] as const,
  list: (query?: CampaignQueryInput) => ["campaigns", "list", query] as const,
  detail: (slug: string) => ["campaigns", "detail", slug] as const,
  myCampaigns: () => ["campaigns", "my-campaigns"] as const,
  categories: () => ["campaigns", "categories"] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: campaignKeys.categories(),
    queryFn: campaignsApi.getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCampaignsQuery(query?: CampaignQueryInput) {
  return useQuery({
    queryKey: campaignKeys.list(query),
    queryFn: () => campaignsApi.getPublicList(query),
    staleTime: 60 * 1000,
  });
}

export function useCampaignDetailQuery(slug: string) {
  return useQuery({
    queryKey: campaignKeys.detail(slug),
    queryFn: () => campaignsApi.getBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  });
}

export function useMyCampaignsQuery() {
  return useQuery({
    queryKey: campaignKeys.myCampaigns(),
    queryFn: campaignsApi.getMyCampaigns,
  });
}

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.myCampaigns() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.all() });
    },
  });
}

export function useSubmitCampaignForReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignsApi.submitForReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.myCampaigns() });
    },
  });
}

export function useAddMilestoneMutation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMilestoneInput) =>
      campaignsApi.addMilestone(campaignId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.myCampaigns() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.all() });
    },
  });
}
