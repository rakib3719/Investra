import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth-api";
import type {
  AuthUser,
  LoginInput,
  ChangePasswordInput,
  RegisterInput,
  ResetPasswordInput,
} from "./types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ user }) =>
      queryClient.setQueryData<AuthUser>(authKeys.me(), user),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: authKeys.me() });
      queryClient.setQueryData<AuthUser | null>(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: ['profile'] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      // Keep the active AuthProvider query in place, but immediately replace its
      // data so every consumer (especially the navbar) re-renders as signed out.
      await queryClient.cancelQueries({ queryKey: authKeys.me() });
      queryClient.setQueryData<AuthUser | null>(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: ["profile"] });
    },
  });
}
