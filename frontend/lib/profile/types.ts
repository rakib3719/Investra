import type { AccountStatus, AuthenticatedUserRole } from '@/lib/auth/types';

export interface ProfileAccount {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: AuthenticatedUserRole;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  dateOfBirth: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  professionalType: 'EMPLOYEE' | 'BUSINESS_OWNER' | 'FREELANCER' | 'SELF_EMPLOYED' | 'STUDENT' | 'OTHER' | null;
  website: string | null;
  isEmailVerified: boolean;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RoleProfile {
  headline?: string | null;
  companyName?: string | null;
  designation?: string | null;
  yearsOfExperience?: number | null;
  profileVisibility?: boolean | null;
  investmentRangeMin?: number | null;
  investmentRangeMax?: number | null;
  preferredCurrency?: string | null;
  businessName?: string | null;
  businessIndustry?: string | null;
  accreditedInvestor?: boolean | null;
  preferredStage?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  specialization?: string | null;
  consultantLevel?: string | null;
  consultationFee?: number | null;
  sessionFee?: number | null;
  workshopFee?: number | null;
  courseFee?: number | null;
}

export interface MyProfile {
  account: ProfileAccount;
  profile: RoleProfile | null;
}

export type UpdateProfileInput = Partial<Omit<ProfileAccount, 'id' | 'username' | 'email' | 'role' | 'isEmailVerified' | 'accountStatus' | 'createdAt' | 'updatedAt'>> & RoleProfile;
