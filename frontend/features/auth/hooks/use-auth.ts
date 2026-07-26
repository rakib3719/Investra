import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { LoginResponse, RegisterResponse, User, LoginDto, RegisterDto } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginDto>({
    mutationFn: (dto) => authApi.login(dto),
    onSuccess: (data) => {
      // Update TanStack Query cache for 'me'
      queryClient.setQueryData(["me"], data.user);
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterDto>({
    mutationFn: (dto) => authApi.register(dto),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Invalidate and clear all queries
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useMe() {
  return useQuery<User | null, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await authApi.getProfile();
      } catch (err) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes cache before checking server again
  });
}
