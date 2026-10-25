export const investorSections = [
  "overview",
  "intros",
  "portfolio",
  "investments",
  "opportunities",
  "impact",
  "reports",
  "watchlist",
  "messages",
  "courses",
  "consultations",
  "subscription",
  "profile",
  "kyc",
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
  intros: {
    title: "Founder Introductions",
    eyebrow: "Deal Inflow Pipeline",
    description: "Review incoming pitch requests, business briefs, and executive summaries from verified entrepreneurs.",
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
  courses: {
    title: "My Courses & Masterclasses",
    eyebrow: "Enrolled Curriculum",
    description: "Access your enrolled video tutorials, track syllabus progress, and resume playback.",
  },
  consultations: {
    title: "1-on-1 Consultations",
    eyebrow: "Live Advisory",
    description: "View your booked 1-on-1 expert advisory sessions and join video meeting rooms.",
  },
  subscription: {
    title: "Subscription & Entitlements",
    eyebrow: "Account Tier & Billing",
    description: "Review your current active tier, manage quotas, upgrade plan, and inspect payment transactions.",
  },
  profile: {
    title: "Investor Profile & Branding",
    eyebrow: "Public Identity",
    description: "Personalize your avatar, cover banner, and accreditation bio visible to verified founders.",
  },
  kyc: {
    title: "Identity & KYC",
    eyebrow: "Account Compliance",
    description: "Verify your identity and regulatory credentials to unlock capital commitments and private deal rooms.",
  },
  settings: {
    title: "Settings",
    eyebrow: "Account preferences",
    description: "Manage your security, investment preferences, and notifications.",
  },
};


// test
