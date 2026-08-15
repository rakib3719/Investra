export const investorSections = [
  "overview",
  "portfolio",
  "investments",
  "opportunities",
  "impact",
  "reports",
  "watchlist",
  "messages",
  "settings",
] as const;

export type InvestorSection = (typeof investorSections)[number];

export function getInvestorSection(value?: string): InvestorSection {
  return investorSections.includes(value as InvestorSection)
    ? (value as InvestorSection)
    : "overview";
}

export function investorSectionPath(section: InvestorSection): string {
  return section === "overview"
    ? "/dashboard/investor"
    : `/dashboard/investor/${section}`;
}

export const investorPageMeta: Record<
  InvestorSection,
  { title: string; eyebrow: string; description: string }
> = {
  overview: {
    title: "Portfolio overview",
    eyebrow: "Investor workspace",
    description: "A clear view of your portfolio, activity, and next opportunities.",
  },
  portfolio: {
    title: "Portfolio",
    eyebrow: "Wealth overview",
    description: "Understand allocation, performance, and concentration across your holdings.",
  },
  investments: {
    title: "Investments",
    eyebrow: "Position management",
    description: "Track every active, exited, and income-generating investment.",
  },
  opportunities: {
    title: "Opportunities",
    eyebrow: "Curated deal flow",
    description: "Discover verified businesses aligned with your return and impact goals.",
  },
  impact: {
    title: "Impact",
    eyebrow: "Measured outcomes",
    description: "See the environmental and social outcomes supported by your capital.",
  },
  reports: {
    title: "Reports",
    eyebrow: "Documents & insights",
    description: "Access statements, performance reports, tax documents, and impact summaries.",
  },
  watchlist: {
    title: "Watchlist",
    eyebrow: "Saved opportunities",
    description: "Monitor the companies and funds you want to revisit before investing.",
  },
  messages: {
    title: "Messages",
    eyebrow: "Private conversations",
    description: "Stay connected with founders, advisors, and your Investra support team.",
  },
  settings: {
    title: "Settings",
    eyebrow: "Account preferences",
    description: "Manage your profile, security, investment preferences, and notifications.",
  },
};
