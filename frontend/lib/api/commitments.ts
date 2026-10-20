import { apiClient } from './client';

export type InvestmentInstrument =
  | 'EQUITY'
  | 'SAFE'
  | 'CONVERTIBLE_NOTE'
  | 'DEBT'
  | 'REVENUE_SHARE';

export type CommitmentStatus =
  | 'DRAFT'
  | 'PROPOSED'
  | 'NEGOTIATING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED';

export interface InvestmentCommitmentItem {
  id: string;
  startupName: string;
  amount: number;
  currency: string;
  instrument: InvestmentInstrument;
  valuation?: number | null;
  equityPercentage?: number | null;
  termsSummary: string;
  termSheetDocUrl?: string | null;
  status: CommitmentStatus;
  investorNotes?: string | null;
  entrepreneurNotes?: string | null;
  issuedAt: string;
  respondedAt?: string | null;
  createdAt: string;
  entrepreneur?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    company: string;
    designation: string;
  };
  investor?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    headline?: string | null;
    company: string;
    designation: string;
    isVerified: boolean;
  };
  business?: {
    id: string;
    title: string;
    slug?: string;
    targetAmount?: number;
    raisedAmount?: number;
    stage?: string;
    category?: { name: string };
  } | null;
  introRequest?: {
    id: string;
    startupName: string;
    targetSector?: string | null;
    raisingAmount?: string | null;
  } | null;
}

export interface InvestorCommitmentsResponse {
  stats: {
    totalDeployed: number;
    totalProposed: number;
    activePositionsCount: number;
    proposedOffersCount: number;
    totalOffersCount: number;
  };
  commitments: InvestmentCommitmentItem[];
}

export interface CreateCommitmentDto {
  entrepreneurId: string;
  businessId?: string;
  introRequestId?: string;
  startupName: string;
  amount: number;
  currency?: string;
  instrument: InvestmentInstrument;
  valuation?: number;
  equityPercentage?: number;
  termsSummary: string;
  termSheetDocUrl?: string;
  termSheetMediaId?: string;
  investorNotes?: string;
}

export interface RespondCommitmentDto {
  action: 'ACCEPT' | 'DECLINE' | 'NEGOTIATE';
  notes?: string;
}

export const CommitmentsApi = {
  async createCommitment(dto: CreateCommitmentDto): Promise<InvestmentCommitmentItem> {
    const res = await apiClient.post('/api/v1/commitments', dto);
    return res.data?.data || res.data;
  },

  async getInvestorCommitments(): Promise<InvestorCommitmentsResponse> {
    const res = await apiClient.get('/api/v1/commitments/investor/me');
    return res.data?.data || res.data;
  },

  async getEntrepreneurCommitments(): Promise<InvestmentCommitmentItem[]> {
    const res = await apiClient.get('/api/v1/commitments/entrepreneur/me');
    return res.data?.data || res.data || [];
  },

  async respondToCommitment(
    commitmentId: string,
    dto: RespondCommitmentDto,
  ): Promise<InvestmentCommitmentItem> {
    const res = await apiClient.patch(`/api/v1/commitments/${commitmentId}/respond`, dto);
    return res.data?.data || res.data;
  },
};
