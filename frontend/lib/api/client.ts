import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from './types';

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

function requireApiUrl() {
  if (!baseURL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. Set it in your deployment environment before making API requests.',
    );
  }
}

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// A separate client prevents an interceptor loop when refresh itself returns 401.
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// Do not validate at module evaluation time: Next.js imports this module while
// prerendering pages that do not make API requests (including the 404 page).
// Checking immediately before a request keeps those builds independent of the
// API while still giving a clear error if the app is used without its API URL.
for (const client of [apiClient, refreshClient]) {
  client.interceptors.request.use((config) => {
    requireApiUrl();
    return config;
  });
}

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as AuthRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = request?.url?.includes('/auth/refresh');

    if (
      !request ||
      !isUnauthorized ||
      request._retry ||
      request.skipAuthRefresh ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshPromise ??= refreshClient
        .post('/auth/refresh')
        .then(() => undefined)
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;
      return apiClient(request);
    } catch {
      return Promise.reject(error);
    }
  },
);

export function getApiError(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;
    return {
      message: response?.message ?? 'Something went wrong. Please try again.',
      statusCode: response?.statusCode,
      fieldErrors: response?.errors,
    };
  }

  return { message: 'Something went wrong. Please try again.' };
}
