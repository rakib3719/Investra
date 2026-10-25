export const userRoles = ['INVESTOR', 'ENTREPRENEUR', 'CONSULTANT'] as const;
export type PublicUserRole = (typeof userRoles)[number];
export const authenticatedUserRoles = [
  ...userRoles,
  'ADMIN',
  'SUB_ADMIN',
] as const;
export type AuthenticatedUserRole = (typeof authenticatedUserRoles)[number];

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

export type AdminPermission =
  | 'USER_MANAGEMENT'
  | 'KYC_MODERATION'
  | 'CAMPAIGN_MANAGEMENT'
  | 'SUBSCRIPTION_MANAGEMENT'
  | 'ANALYTICS_ACCESS'
  | 'CATEGORY_MANAGEMENT';

export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  image?: string | null;
  coverImage?: string | null;
  role: AuthenticatedUserRole;
  permissions?: AdminPermission[];
  department?: string | null;
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
  image?: string;
  avatarMediaId?: string;
  coverImage?: string;
  coverMediaId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AuthMessage {
  message: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken?: string;
  message?: string;
}

export interface RefreshResponse {
  message: string;
  accessToken?: string;
}
