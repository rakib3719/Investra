import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  Campaign,
  CampaignMilestone,
  CampaignQueryInput,
  Category,
  CreateCampaignInput,
  CreateMilestoneInput,
  PaginatedCampaigns,
} from "./types";

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  return (await request).data.data;
}

export const campaignsApi = {
  getPublicList: (query?: CampaignQueryInput) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedCampaigns>>("/campaigns", {
        params: query,
      }),
    ),

  getBySlug: (slug: string) =>
    unwrap(apiClient.get<ApiResponse<Campaign>>(`/campaigns/${slug}`)),

  getMyCampaigns: () =>
    unwrap(apiClient.get<ApiResponse<Campaign[]>>("/entrepreneur/my-campaigns")),

  create: (input: CreateCampaignInput) =>
    unwrap(apiClient.post<ApiResponse<Campaign>>("/campaigns", input)),

  update: (id: string, input: Partial<CreateCampaignInput>) =>
    unwrap(apiClient.patch<ApiResponse<Campaign>>(`/campaigns/${id}`, input)),

  submitForReview: (id: string) =>
    unwrap(apiClient.post<ApiResponse<Campaign>>(`/campaigns/${id}/submit-review`)),

  addMilestone: (campaignId: string, input: CreateMilestoneInput) =>
    unwrap(
      apiClient.post<ApiResponse<CampaignMilestone>>(
        `/campaigns/${campaignId}/milestones`,
        input,
      ),
    ),

  getCategories: () =>
    unwrap(apiClient.get<ApiResponse<Category[]>>("/campaigns/categories")),

  getAdminCampaigns: (status?: string, page = 1, limit = 20) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedCampaigns>>("/admin/campaigns", {
        params: { status, page, limit },
      }),
    ),

  updateStatus: (id: string, status: string, rejectionReason?: string) =>
    unwrap(
      apiClient.patch<ApiResponse<Campaign>>(`/admin/campaigns/${id}/status`, {
        status,
        rejectionReason,
      }),
    ),
};
