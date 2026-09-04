import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export type UserRole =
  | "INVESTOR"
  | "ENTREPRENEUR"
  | "CONSULTANT"
  | "ADMIN"
  | "SUB_ADMIN";

export type AccountStatus =
  | "ACTIVE"
  | "BLOCKED"
  | "SUSPENDED"
  | "PENDING_VERIFICATION";

export interface AdminUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  entrepreneurProfile?: {
    companyName?: string | null;
    headline?: string | null;
    verificationStatus?: string | null;
  } | null;
  investorProfile?: {
    companyName?: string | null;
    designation?: string | null;
    accreditedInvestor?: boolean | null;
    verificationStatus?: string | null;
  } | null;
  consultantProfile?: {
    specialization?: string | null;
    yearsOfExperience?: number | null;
    verificationStatus?: string | null;
  } | null;
  _count?: {
    businesses: number;
    bookmarks: number;
  };
}

export interface PaginatedAdminUsers {
  items: AdminUserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminUsersQueryInput {
  role?: UserRole | string;
  status?: AccountStatus | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminOverviewStats {
  users: {
    total: number;
    investors: number;
    entrepreneurs: number;
    consultants: number;
    admins: number;
  };
  campaigns: {
    total: number;
    active: number;
    underReview: number;
    totalTargetCapital: number;
    totalRaisedCapital: number;
  };
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  userId: string;
  newStatus: AccountStatus;
}

async function unwrap<T>(
  request: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  return (await request).data.data;
}

export const adminUsersApi = {
  getUsers: (query?: AdminUsersQueryInput) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedAdminUsers>>("/admin/users", {
        params: query,
      }),
    ),

  getUserById: (id: string) =>
    unwrap(apiClient.get<ApiResponse<AdminUserListItem>>(`/admin/users/${id}`)),

  updateStatus: (userId: string, status: AccountStatus) =>
    unwrap(
      apiClient.patch<ApiResponse<UpdateUserStatusResponse>>(
        `/admin/users/${userId}/status`,
        { status },
      ),
    ),

  getOverviewStats: () =>
    unwrap(
      apiClient.get<ApiResponse<AdminOverviewStats>>("/admin/overview-stats"),
    ),
};
