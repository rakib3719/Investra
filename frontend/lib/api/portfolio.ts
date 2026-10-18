import { apiClient } from './client';

export type PortfolioItemType =
  | 'INVESTMENT'
  | 'CERTIFICATION'
  | 'EXPERIENCE'
  | 'VIDEO_PRESENTATION'
  | 'CASE_STUDY';

export interface InvestorPortfolioItem {
  id: string;
  type: PortfolioItemType;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  sector?: string | null;
  stage?: string | null;
  amountInvested?: number | null;
  valuation?: number | null;
  returnMultiple?: string | null;
  status?: string | null;
  year?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  issuer?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  videoProvider?: string | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
  logoUrl?: string | null;
  mediaFileId?: string | null;
  isFeatured?: boolean;
  isPrivate?: boolean;
  sortOrder?: number;
  signedDocumentUrl?: string | null;
  isLocked?: boolean;
}

export interface InvestorPortfolioStats {
  totalInvestments: number;
  totalCapitalDeployed: number;
  totalExits: number;
  certificationsCount: number;
  experienceCount: number;
  videosCount: number;
  caseStudiesCount?: number;
}

export interface InvestorProfileData {
  id: string;
  userId: string;
  headline?: string | null;
  companyName?: string | null;
  designation?: string | null;
  yearsOfExperience?: number | null;
  investmentRangeMin?: number | null;
  investmentRangeMax?: number | null;
  preferredCurrency?: string | null;
  accreditedInvestor?: boolean | null;
  verificationStatus?: string | null;
  preferredStage?: string | null;
  investmentThesis?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  crunchbaseUrl?: string | null;
  websiteUrl?: string | null;
  videoIntroUrl?: string | null;
  videoIntroMediaId?: string | null;
  totalInvestmentsCount?: number | null;
  totalExitsCount?: number | null;
  totalCapitalDeployed?: number | null;
  sectors?: string[];
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
    coverImage?: string | null;
    bio?: string | null;
    country?: string | null;
    city?: string | null;
    website?: string | null;
  };
}

export interface MyPortfolioResponse {
  investor: InvestorProfileData;
  portfolioItems: InvestorPortfolioItem[];
  stats: InvestorPortfolioStats;
}

export interface PublicInvestorResponse {
  isPremiumUnlocked: boolean;
  premiumGate: {
    isLocked: boolean;
    title: string;
    message: string;
    upgradeUrl: string;
  };
  investor: {
    id: string;
    userId: string;
    name: string;
    username?: string | null;
    image?: string | null;
    coverImage?: string | null;
    headline?: string | null;
    companyName?: string | null;
    designation?: string | null;
    yearsOfExperience?: number | null;
    investmentRangeMin?: number | null;
    investmentRangeMax?: number | null;
    preferredCurrency?: string | null;
    accreditedInvestor?: boolean | null;
    verificationStatus?: string | null;
    preferredStage?: string | null;
    investmentThesis?: string | null;
    bio?: string | null;
    country?: string | null;
    city?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    crunchbaseUrl?: string | null;
    websiteUrl?: string | null;
    videoIntroUrl?: string | null;
    sectors?: string[];
    memberSince?: string | null;
  };
  stats: {
    totalInvestmentsCount: number;
    totalExitsCount?: number | null;
    totalCapitalDeployed?: number | null;
    certificationsCount: number;
    experienceCount: number;
  };
  portfolioItems: InvestorPortfolioItem[];
}

export interface UpdatePortfolioMetaPayload {
  headline?: string;
  investmentThesis?: string;
  bio?: string;
  companyName?: string;
  designation?: string;
  yearsOfExperience?: number;
  investmentRangeMin?: number;
  investmentRangeMax?: number;
  preferredCurrency?: string;
  accreditedInvestor?: boolean;
  preferredStage?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  crunchbaseUrl?: string;
  websiteUrl?: string;
  videoIntroUrl?: string;
  videoIntroMediaId?: string;
  sectors?: string[];
  totalInvestmentsCount?: number;
  totalExitsCount?: number;
  totalCapitalDeployed?: number;
}

export interface CreatePortfolioItemPayload {
  type: PortfolioItemType;
  title: string;
  subtitle?: string;
  description?: string;
  sector?: string;
  stage?: string;
  amountInvested?: number;
  valuation?: number;
  returnMultiple?: string;
  status?: string;
  year?: number;
  startDate?: string;
  endDate?: string;
  issuer?: string;
  credentialId?: string;
  credentialUrl?: string;
  videoProvider?: string;
  videoUrl?: string;
  externalUrl?: string;
  logoUrl?: string;
  mediaFileId?: string;
  isFeatured?: boolean;
  isPrivate?: boolean;
  sortOrder?: number;
}

export interface UpdatePortfolioItemPayload extends Partial<CreatePortfolioItemPayload> {}

/**
 * 1. Fetch current investor's portfolio (for dashboard)
 */
export async function getMyPortfolio(): Promise<MyPortfolioResponse> {
  const response = await apiClient.get<MyPortfolioResponse>(
    '/api/v1/investor/portfolio/me',
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 2. Update investor portfolio meta / thesis / links
 */
export async function updateMyPortfolioMeta(
  payload: UpdatePortfolioMetaPayload,
): Promise<{ message: string; investor: any }> {
  const response = await apiClient.put<{ message: string; investor: any }>(
    '/api/v1/investor/portfolio/me/meta',
    payload,
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 3. Add a new portfolio item
 */
export async function createPortfolioItem(
  payload: CreatePortfolioItemPayload,
): Promise<{ message: string; item: InvestorPortfolioItem }> {
  const response = await apiClient.post<{ message: string; item: InvestorPortfolioItem }>(
    '/api/v1/investor/portfolio/items',
    payload,
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 4. Update an existing portfolio item
 */
export async function updatePortfolioItem(
  id: string,
  payload: UpdatePortfolioItemPayload,
): Promise<{ message: string; item: InvestorPortfolioItem }> {
  const response = await apiClient.put<{ message: string; item: InvestorPortfolioItem }>(
    `/api/v1/investor/portfolio/items/${id}`,
    payload,
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 5. Delete a portfolio item
 */
export async function deletePortfolioItem(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/api/v1/investor/portfolio/items/${id}`,
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 6. Public / Entrepreneur view of an investor profile & portfolio (premium gated)
 */
export async function getPublicInvestorPortfolio(
  identifier: string,
): Promise<PublicInvestorResponse> {
  const response = await apiClient.get<PublicInvestorResponse>(
    `/api/v1/investor/portfolio/public/${identifier}`,
  );
  const raw: any = response.data;
  return raw?.data || raw;
}

/**
 * 7. List verified investors directory
 */
export async function listVerifiedInvestors(params?: {
  page?: number;
  limit?: number;
  sector?: string;
  query?: string;
}) {
  const response = await apiClient.get('/api/v1/investor/portfolio/directory', {
    params,
  });
  const raw: any = response.data;
  return raw?.data || raw;
}
