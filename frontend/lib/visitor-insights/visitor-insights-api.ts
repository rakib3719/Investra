import { apiClient } from '@/lib/api/client';

export interface VisitorLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface VisitorInsightInput {
  anonymousId: string;
  pagePath: string;
  language?: string;
  timezone?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  referrer?: string;
  locationConsent: boolean;
  location?: VisitorLocation;
}

export async function recordVisitorInsight(input: VisitorInsightInput) {
  await apiClient.post('/visitor-insights/collect', {
    ...input,
    latitude: input.location?.latitude,
    longitude: input.location?.longitude,
    locationAccuracy: input.location?.accuracy,
  });
}
