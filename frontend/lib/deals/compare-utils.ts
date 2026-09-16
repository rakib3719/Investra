import type { Campaign } from "@/lib/campaigns/types";

export interface MetricHighlights {
  highestIrrId?: string;
  lowestMinTicketId?: string;
  highestProgressId?: string;
  topEsgId?: string;
}

const ESG_RANKS: Record<string, number> = {
  AAA: 6,
  AA: 5,
  A: 4,
  BBB: 3,
  BB: 2,
  B: 1,
};

export function getMetricHighlights(campaigns: Campaign[]): MetricHighlights {
  if (!campaigns || campaigns.length < 2) {
    return {};
  }

  let highestIrr = -Infinity;
  let highestIrrId: string | undefined;

  let lowestMinTicket = Infinity;
  let lowestMinTicketId: string | undefined;

  let highestProgress = -Infinity;
  let highestProgressId: string | undefined;

  let topEsgScore = 0;
  let topEsgId: string | undefined;

  campaigns.forEach((c) => {
    // 1. Projected IRR
    const irr = Number(c.projectedIrr) || 0;
    if (irr > highestIrr && irr > 0) {
      highestIrr = irr;
      highestIrrId = c.id;
    }

    // 2. Minimum Investment Ticket
    const minTicket = Number(c.minInvestment) || 0;
    if (minTicket < lowestMinTicket && minTicket > 0) {
      lowestMinTicket = minTicket;
      lowestMinTicketId = c.id;
    }

    // 3. Raised Progress %
    const target = Number(c.targetAmount) || 0;
    const raised = Number(c.raisedAmount) || 0;
    if (target > 0) {
      const progress = raised / target;
      if (progress > highestProgress) {
        highestProgress = progress;
        highestProgressId = c.id;
      }
    }

    // 4. ESG Rating
    if (c.esgRating) {
      const score = ESG_RANKS[c.esgRating.toUpperCase()] || 0;
      if (score > topEsgScore) {
        topEsgScore = score;
        topEsgId = c.id;
      }
    }
  });

  return {
    highestIrrId,
    lowestMinTicketId,
    highestProgressId,
    topEsgId,
  };
}

export function formatCurrency(amount: number | string | undefined): string {
  const num = Number(amount) || 0;
  return `$${num.toLocaleString()}`;
}

export function formatPercent(value: number | string | undefined): string {
  const num = Number(value) || 0;
  return `${num.toFixed(1)}%`;
}

export const curatedFallbackCampaigns: Campaign[] = [
  {
    id: "fb-1",
    entrepreneurId: "e1",
    title: "SolarGrid Bangladesh Ltd",
    slug: "solargrid-bangladesh-ltd",
    category: { id: "c1", name: "Clean Energy", slug: "clean-energy" },
    categoryId: "c1",
    stage: "GROWTH",
    riskLevel: "LOW",
    pitchText:
      "Decentralized microgrid infrastructure delivering clean, dependable electricity to agricultural factories and rural hubs.",
    entrepreneur: {
      id: "e1",
      firstName: "Tariqul",
      lastName: "Islam",
      entrepreneurProfile: { companyName: "SolarGrid Tech" },
    },
    bannerImage:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 1200000,
    raisedAmount: 840000,
    projectedIrr: 22.5,
    minInvestment: 5000,
    valuation: 5500000,
    esgRating: "AAA",
    impactMetric: "12MW Clean Capacity",
    status: "ACTIVE",
    isFeatured: true,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
    milestones: [
      {
        id: "m1",
        businessId: "fb-1",
        title: "Phase 1 Microgrid Grid Interconnect",
        isCompleted: true,
        sortOrder: 1,
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      },
      {
        id: "m2",
        businessId: "fb-1",
        title: "Commercial Battery Storage Deployment",
        isCompleted: false,
        sortOrder: 2,
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      },
    ],
    _count: { bookmarks: 142 },
  },
  {
    id: "fb-2",
    entrepreneurId: "e2",
    title: "Apex FinTech Core Banking API",
    slug: "apex-fintech-core-banking-api",
    category: { id: "c2", name: "FinTech", slug: "fintech" },
    categoryId: "c2",
    stage: "EARLY_STAGE",
    riskLevel: "MEDIUM",
    pitchText:
      "Modular transaction orchestration and micro-credit rails serving underserved merchants across South Asia.",
    entrepreneur: {
      id: "e2",
      firstName: "Ayesha",
      lastName: "Siddiqua",
      entrepreneurProfile: { companyName: "Apex FinTech Labs" },
    },
    bannerImage:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 600000,
    raisedAmount: 480000,
    projectedIrr: 26.0,
    minInvestment: 2500,
    valuation: 3200000,
    esgRating: "AA",
    impactMetric: "85K Micro-Merchants",
    status: "ACTIVE",
    isFeatured: true,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
    milestones: [
      {
        id: "m3",
        businessId: "fb-2",
        title: "Central Bank Sandbox Compliance Clearance",
        isCompleted: true,
        sortOrder: 1,
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
      },
    ],
    _count: { bookmarks: 98 },
  },
  {
    id: "fb-3",
    entrepreneurId: "e3",
    title: "AgriTech Cold-Chain Logistics Hub",
    slug: "agritech-cold-chain-logistics-hub",
    category: { id: "c3", name: "AgriTech", slug: "agritech" },
    categoryId: "c3",
    stage: "EARLY_STAGE",
    riskLevel: "MEDIUM",
    pitchText:
      "Temperature-controlled rural supply chain network reducing post-harvest wastage and connecting smallholders to wholesale buyers.",
    entrepreneur: {
      id: "e3",
      firstName: "Kamal",
      lastName: "Hossain",
      entrepreneurProfile: { companyName: "AgriChain Global" },
    },
    bannerImage:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 1800000,
    raisedAmount: 950000,
    projectedIrr: 19.5,
    minInvestment: 7500,
    valuation: 6800000,
    esgRating: "AAA",
    impactMetric: "45% Spoilage Reduction",
    status: "ACTIVE",
    isFeatured: true,
    createdAt: "2026-02-10T00:00:00Z",
    updatedAt: "2026-02-10T00:00:00Z",
    milestones: [
      {
        id: "m4",
        businessId: "fb-3",
        title: "Cold Warehouse 1 & Fleet Acquisition",
        isCompleted: true,
        sortOrder: 1,
        createdAt: "2026-02-10T00:00:00Z",
        updatedAt: "2026-02-10T00:00:00Z",
      },
    ],
    _count: { bookmarks: 184 },
  },
  {
    id: "fb-4",
    entrepreneurId: "e4",
    title: "NeuroCare AI Health Diagnostics",
    slug: "neurocare-ai-health-diagnostics",
    category: { id: "c4", name: "HealthTech", slug: "healthtech" },
    categoryId: "c4",
    stage: "MVP",
    riskLevel: "HIGH",
    pitchText:
      "Edge-AI diagnostic imaging device for early detection of neurological impairment in regional clinics.",
    entrepreneur: {
      id: "e4",
      firstName: "Dr. Farhana",
      lastName: "Rahman",
      entrepreneurProfile: { companyName: "NeuroCare Solutions" },
    },
    bannerImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    gallery: [],
    targetAmount: 900000,
    raisedAmount: 350000,
    projectedIrr: 28.5,
    minInvestment: 10000,
    valuation: 4500000,
    esgRating: "AA",
    impactMetric: "12K Patient Scans",
    status: "ACTIVE",
    isFeatured: false,
    createdAt: "2026-02-15T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z",
    milestones: [],
    _count: { bookmarks: 64 },
  },
];
