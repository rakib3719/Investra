import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarksApi, type BookmarkItem } from "./bookmarks-api";
import { campaignKeys } from "../campaigns/campaigns-hooks";

export const bookmarkKeys = {
  all: () => ["investor", "bookmarks"] as const,
  list: () => ["investor", "bookmarks", "list"] as const,
  ids: () => ["investor", "bookmarks", "ids"] as const,
};

export function useBookmarksQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: bookmarkKeys.list(),
    queryFn: bookmarksApi.list,
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
}

export function useBookmarkIdsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: bookmarkKeys.ids(),
    queryFn: bookmarksApi.getIds,
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
}

export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessId,
      isBookmarked,
    }: {
      businessId: string;
      isBookmarked: boolean;
    }) => {
      if (isBookmarked) {
        return bookmarksApi.remove(businessId);
      } else {
        return bookmarksApi.add(businessId);
      }
    },
    onMutate: async ({ businessId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.ids() });
      const previousIds = queryClient.getQueryData<string[]>(bookmarkKeys.ids());

      if (previousIds) {
        if (isBookmarked) {
          queryClient.setQueryData<string[]>(
            bookmarkKeys.ids(),
            previousIds.filter((id) => id !== businessId),
          );
        } else {
          queryClient.setQueryData<string[]>(
            bookmarkKeys.ids(),
            [...previousIds, businessId],
          );
        }
      }

      return { previousIds };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(bookmarkKeys.ids(), context.previousIds);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.all() });
    },
  });
}
