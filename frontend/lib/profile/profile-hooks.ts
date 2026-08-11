import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/lib/auth/auth-hooks';
import type { AuthUser } from '@/lib/auth/types';
import { profileApi } from './profile-api';
import type { MyProfile, UpdateProfileInput } from './types';

export const profileKeys = {
  me: () => ['profile', 'me'] as const,
};

export function useMyProfileQuery() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: profileApi.me,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileApi.update(input),
    onSuccess: (profile) => {
      queryClient.setQueryData<MyProfile>(profileKeys.me(), profile);
      queryClient.setQueryData<AuthUser>(authKeys.me(), (currentUser) =>
        currentUser
          ? {
              ...currentUser,
              firstName: profile.account.firstName,
              lastName: profile.account.lastName,
              phone: profile.account.phone,
            }
          : currentUser,
      );
    },
  });
}
