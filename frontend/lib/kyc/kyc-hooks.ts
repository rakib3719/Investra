import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMyKyc,
  submitKycApplication,
  fetchAdminKycSubmissions,
  fetchAdminKycDetail,
  reviewAdminKycSubmission,
  type KycListQuery,
  type SubmitKycPayload,
} from './kyc-api';

export const KYC_QUERY_KEYS = {
  myKyc: ['kyc', 'me'] as const,
  adminList: (query: KycListQuery) => ['kyc', 'admin', 'list', query] as const,
  adminDetail: (id: string) => ['kyc', 'admin', 'detail', id] as const,
};

export function useMyKycQuery() {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.myKyc,
    queryFn: fetchMyKyc,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSubmitKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitKycPayload) => submitKycApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.myKyc });
    },
  });
}

export function useAdminKycListQuery(query: KycListQuery = {}) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.adminList(query),
    queryFn: () => fetchAdminKycSubmissions(query),
  });
}

export function useAdminKycDetailQuery(id: string) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.adminDetail(id),
    queryFn: () => fetchAdminKycDetail(id),
    enabled: Boolean(id),
  });
}

export function useReviewAdminKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: 'VERIFIED' | 'REJECTED' | 'UNDER_REVIEW';
      rejectionReason?: string;
    }) => reviewAdminKycSubmission(id, { status, rejectionReason }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kyc', 'admin'] });
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.adminDetail(variables.id) });
    },
  });
}
