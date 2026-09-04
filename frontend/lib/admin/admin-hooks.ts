import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUsersApi,
  type AccountStatus,
  type AdminUsersQueryInput,
} from "./admin-users-api";

export const adminKeys = {
  allUsers: () => ["admin", "users"] as const,
  usersList: (query?: AdminUsersQueryInput) =>
    ["admin", "users", "list", query] as const,
  userDetail: (id: string) => ["admin", "users", "detail", id] as const,
  overviewStats: () => ["admin", "overview-stats"] as const,
};

export function useAdminUsersQuery(query?: AdminUsersQueryInput) {
  return useQuery({
    queryKey: adminKeys.usersList(query),
    queryFn: () => adminUsersApi.getUsers(query),
    staleTime: 30 * 1000,
  });
}

export function useAdminUserDetailQuery(id: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => adminUsersApi.getUserById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: AccountStatus;
    }) => adminUsersApi.updateStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.allUsers() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overviewStats() });
    },
  });
}

export function useAdminOverviewStatsQuery() {
  return useQuery({
    queryKey: adminKeys.overviewStats(),
    queryFn: adminUsersApi.getOverviewStats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}
