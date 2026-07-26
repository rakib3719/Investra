import { apiClient } from "@/lib/api-client";
import { LoginResponse, RegisterResponse, User, LoginDto, RegisterDto } from "../types";

export const authApi = {
  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>("/auth/register", dto);
    return response.data;
  },

  async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", dto);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/auth/logout");
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>("/auth/verify-email", { token });
    return response.data;
  }
};
