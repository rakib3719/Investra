export type UserRole = "INVESTOR" | "ENTREPRENEUR" | "CONSULTANT" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  accountStatus: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  data: {
    verificationToken: string;
    email: string;
  };
}

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

