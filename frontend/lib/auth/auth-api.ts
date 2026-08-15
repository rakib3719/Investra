import type { AxiosRequestConfig } from 'axios';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type {
  AuthMessage,
  AuthUser,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './types';

const noRefresh: AxiosRequestConfig = { skipAuthRefresh: true } as AxiosRequestConfig;

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  return (await request).data.data;
}

export const authApi = {
  register: (input: RegisterInput) =>
    unwrap(apiClient.post<ApiResponse<{ user: AuthUser }>>('/auth/register', input, noRefresh)),
  login: (input: LoginInput) =>
    unwrap(apiClient.post<ApiResponse<{ user: AuthUser }>>('/auth/login', input, noRefresh)),
  me: () => unwrap(apiClient.get<ApiResponse<AuthUser>>('/auth/me')),
  refresh: () => unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/refresh', undefined, noRefresh)),
  logout: () => unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/logout', undefined, noRefresh)),
  verifyEmail: (token: string) =>
    unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/verify-email', { token }, noRefresh)),
  resendVerification: (email: string) =>
    unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/resend-verification', { email }, noRefresh)),
  forgotPassword: (email: string) =>
    unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/forgot-password', { email }, noRefresh)),
  resetPassword: (input: ResetPasswordInput) =>
    unwrap(apiClient.post<ApiResponse<AuthMessage>>('/auth/reset-password', input, noRefresh)),
};
