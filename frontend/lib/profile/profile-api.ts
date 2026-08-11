import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { MyProfile, UpdateProfileInput } from './types';

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  return (await request).data.data;
}

export const profileApi = {
  me: () => unwrap(apiClient.get<ApiResponse<MyProfile>>('/profile/me')),
  update: (input: UpdateProfileInput) =>
    unwrap(apiClient.patch<ApiResponse<MyProfile>>('/profile/me', input)),
};
