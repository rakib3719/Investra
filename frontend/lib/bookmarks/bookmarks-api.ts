import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Campaign } from "@/lib/campaigns/types";

export interface BookmarkItem {
  id: string;
  userId: string;
  businessId: string;
  createdAt: string;
  business: Campaign;
}

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  return (await request).data.data;
}

export const bookmarksApi = {
  list: () =>
    unwrap(apiClient.get<ApiResponse<BookmarkItem[]>>("/investor/bookmarks")),

  getIds: () =>
    unwrap(apiClient.get<ApiResponse<string[]>>("/investor/bookmarks/ids")),

  add: (businessId: string) =>
    unwrap(
      apiClient.post<ApiResponse<{ success: boolean; bookmark: BookmarkItem }>>(
        `/investor/bookmarks/${businessId}`,
      ),
    ),

  remove: (businessId: string) =>
    unwrap(
      apiClient.delete<ApiResponse<{ success: boolean }>>(
        `/investor/bookmarks/${businessId}`,
      ),
    ),
};
