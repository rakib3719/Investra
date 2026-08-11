export const userRoles = ['INVESTOR', 'ENTREPRENEUR', 'CONSULTANT'] as const;
export type PublicUserRole = (typeof userRoles)[number];

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  role: PublicUserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: PublicUserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface AuthMessage {
  message: string;
}
