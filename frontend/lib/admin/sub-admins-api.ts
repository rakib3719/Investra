import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { AdminPermission } from "@/lib/auth/types";

export interface SubAdminItem {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  accountStatus: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  permissions: AdminPermission[];
  department?: string | null;
  notes?: string | null;
}

export interface CreateSubAdminInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  permissions: AdminPermission[];
  department?: string;
  notes?: string;
}

export interface UpdateSubAdminPermissionsInput {
  permissions: AdminPermission[];
  department?: string;
  notes?: string;
}

async function unwrap<T>(
  request: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  return (await request).data.data;
}

export const subAdminsApi = {
  listSubAdmins: () =>
    unwrap(apiClient.get<ApiResponse<SubAdminItem[]>>("/admin/sub-admins")),

  getSubAdminById: (id: string) =>
    unwrap(apiClient.get<ApiResponse<SubAdminItem>>(`/admin/sub-admins/${id}`)),

  createSubAdmin: (data: CreateSubAdminInput) =>
    unwrap(apiClient.post<ApiResponse<SubAdminItem>>("/admin/sub-admins", data)),

  updatePermissions: (id: string, data: UpdateSubAdminPermissionsInput) =>
    unwrap(
      apiClient.patch<ApiResponse<{ message: string; subAdminId: string }>>(
        `/admin/sub-admins/${id}/permissions`,
        data,
      ),
    ),

  deleteSubAdmin: (id: string) =>
    unwrap(
      apiClient.delete<ApiResponse<{ success: boolean; message: string }>>(
        `/admin/sub-admins/${id}`,
      ),
    ),
};
