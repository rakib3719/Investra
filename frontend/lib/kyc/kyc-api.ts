import { apiClient } from '../api/client';
import type { AuthenticatedUserRole } from '../auth/types';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface MyKycResponse {
  verification: {
    id: string;
    nidNumber?: string | null;
    passportNumber?: string | null;
    verificationStatus: VerificationStatus;
    rejectionReason?: string | null;
    reviewedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    frontMediaId?: string | null;
    backMediaId?: string | null;
    selfieMediaId?: string | null;
    hasFront: boolean;
    hasBack: boolean;
    hasSelfie: boolean;
  } | null;
  status: VerificationStatus;
  role: AuthenticatedUserRole;
  accountStatus: string;
}

export interface SubmitKycPayload {
  nidNumber?: string;
  passportNumber?: string;
  frontMediaId: string;
  backMediaId?: string;
  selfieMediaId: string;
}

export interface AdminKycListItem {
  id: string;
  userId: string;
  nidNumber?: string | null;
  passportNumber?: string | null;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    image: string | null;
    role: AuthenticatedUserRole;
    accountStatus: string;
    createdAt: string;
  };
  frontMedia?: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    key: string;
  } | null;
  backMedia?: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    key: string;
  } | null;
  selfieMedia?: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    key: string;
  } | null;
}

export interface AdminKycDetail extends AdminKycListItem {
  user: AdminKycListItem['user'] & {
    entrepreneurProfile?: any;
    investorProfile?: any;
    consultantProfile?: any;
  };
  frontMedia?: (AdminKycListItem['frontMedia'] & { accessUrl?: string | null }) | null;
  backMedia?: (AdminKycListItem['backMedia'] & { accessUrl?: string | null }) | null;
  selfieMedia?: (AdminKycListItem['selfieMedia'] & { accessUrl?: string | null }) | null;
}

export interface KycListQuery {
  status?: VerificationStatus;
  role?: AuthenticatedUserRole;
  search?: string;
  page?: number;
  limit?: number;
}

export async function fetchMyKyc(): Promise<MyKycResponse> {
  const res = await apiClient.get<MyKycResponse>('/api/v1/kyc/me');
  const raw: any = res.data;
  return raw?.data || raw;
}

export async function submitKycApplication(
  payload: SubmitKycPayload,
): Promise<{ message: string; verification: any }> {
  const res = await apiClient.post('/api/v1/kyc/submit', payload);
  const raw: any = res.data;
  return raw?.data || raw;
}

export async function fetchAdminKycSubmissions(
  query: KycListQuery = {},
): Promise<{ items: AdminKycListItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const res = await apiClient.get('/api/v1/kyc/admin/submissions', { params: query });
  const raw: any = res.data;
  return raw?.data || raw;
}

export async function fetchAdminKycDetail(
  id: string,
): Promise<AdminKycDetail> {
  const res = await apiClient.get<AdminKycDetail>(`/api/v1/kyc/admin/submissions/${id}`);
  const raw: any = res.data;
  return raw?.data || raw;
}

export async function reviewAdminKycSubmission(
  id: string,
  payload: { status: 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW'; rejectionReason?: string },
): Promise<{ message: string; verification: any }> {
  const res = await apiClient.patch(`/api/v1/kyc/admin/submissions/${id}/review`, payload);
  const raw: any = res.data;
  return raw?.data || raw;
}
