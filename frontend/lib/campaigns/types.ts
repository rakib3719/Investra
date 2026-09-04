export type BusinessStage = "IDEA" | "MVP" | "EARLY_STAGE" | "GROWTH" | "SCALING";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type CampaignStatus = "DRAFT" | "UNDER_REVIEW" | "ACTIVE" | "REJECTED" | "FUNDED" | "CLOSED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface CampaignMilestone {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  targetDate?: string;
  fundingNeeded?: number;
  isCompleted: boolean;
  completionProof?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PitchDeck {
  id: string;
  businessId: string;
  title: string;
  fileUrl: string;
  fileSize?: number;
  version: number;
  isConfidential: boolean;
  createdAt: string;
}

export interface CampaignEntrepreneur {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  image?: string;
  entrepreneurProfile?: {
    companyName?: string;
    headline?: string;
    yearsOfExperience?: number;
    website?: string;
    linkedin?: string;
    verificationStatus?: string;
  };
}

export interface Campaign {
  id: string;
  entrepreneurId: string;
  title: string;
  slug: string;
  tagline?: string;
  pitchText: string;
  categoryId: string;
  stage: BusinessStage;
  targetAmount: number | string;
  raisedAmount: number | string;
  minInvestment: number | string;
  projectedIrr?: number | string;
  valuation?: number | string;
  riskLevel: RiskLevel;
  esgRating?: string;
  impactMetric?: string;
  bannerImage?: string;
  gallery: string[];
  status: CampaignStatus;
  rejectionReason?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  entrepreneur?: CampaignEntrepreneur;
  milestones?: CampaignMilestone[];
  pitchDecks?: PitchDeck[];
}

export interface CampaignQueryInput {
  search?: string;
  category?: string;
  stage?: BusinessStage;
  riskLevel?: RiskLevel;
  minIrr?: number;
  maxTarget?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedCampaigns {
  items: Campaign[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCampaignInput {
  title: string;
  tagline?: string;
  pitchText: string;
  categoryId: string;
  stage?: BusinessStage;
  targetAmount: number;
  minInvestment: number;
  projectedIrr?: number;
  valuation?: number;
  riskLevel?: RiskLevel;
  esgRating?: string;
  impactMetric?: string;
  bannerImage?: string;
  gallery?: string[];
}

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  targetDate?: string;
  fundingNeeded?: number;
  isCompleted?: boolean;
  completionProof?: string;
  sortOrder?: number;
}
