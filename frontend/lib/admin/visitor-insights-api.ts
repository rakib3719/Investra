import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

export interface AdminVisitorInsight {
  id: string;
  visitedAt: string;
  browser: string;
  operatingSystem: string;
  device: string;
  language: string;
  timezone: string;
  screen: string;
  viewport: string;
  referrer: string;
  location: {
    latitude: number;
    longitude: number;
    accuracyMeters: number | null;
  } | null;
}

export interface AdminVisitorOverview {
  summary: {
    totalRecordedVisits: number;
    uniqueOptedInVisitors: number;
    visitsWithLocation: number;
  };
  visitors: AdminVisitorInsight[];
}

export async function getAdminVisitorOverview(): Promise<AdminVisitorOverview> {
  const response = await apiClient.get<ApiResponse<AdminVisitorOverview>>('/admin/visitor-insights?limit=100');
  return response.data.data;
}
