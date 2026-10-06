export const consultantSections = [
  "overview",
  "clients",
  "advisory",
  "deal-room",
  "reports",
  "calendar",
  "messages",
  "earnings",
  "profile",
  "kyc",
  "settings",
] as const;

export type ConsultantSection = (typeof consultantSections)[number];

export function getConsultantSection(value?: string): ConsultantSection {
  return consultantSections.includes(value as ConsultantSection)
    ? (value as ConsultantSection)
    : "overview";
}

export function consultantSectionPath(section: ConsultantSection): string {
  return section === "overview"
    ? "/dashboard/consultant"
    : `/dashboard/consultant/${section}`;
}

export const consultantPageMeta: Record<
  ConsultantSection,
  { title: string; eyebrow: string; description: string }
> = {
  overview: {
    title: "Consultant Workspace",
    eyebrow: "Advisor Command Center",
    description: "Manage client advisory sessions, mentoring contracts, and deal evaluations.",
  },
  clients: {
    title: "Client Workspace",
    eyebrow: "Advisory Relationships",
    description: "Review active client accounts, engagements, and deliverables.",
  },
  advisory: {
    title: "Advisory Work",
    eyebrow: "Mandates & Deliverables",
    description: "Track your active consulting mandates, reviews, and workshops.",
  },
  "deal-room": {
    title: "Deal Room",
    eyebrow: "Transaction Diligence",
    description: "Access confidential diligence rooms and collaborate on active transactions.",
  },
  reports: {
    title: "Advisory Reports",
    eyebrow: "Deliverables & Analytics",
    description: "Generate and review advisory reports and strategy decks for clients.",
  },
  calendar: {
    title: "Schedule & Calendar",
    eyebrow: "Upcoming Sessions",
    description: "Manage scheduled client strategy sessions and upcoming advisory meetings.",
  },
  messages: {
    title: "Messages",
    eyebrow: "Client Communication",
    description: "Direct messaging with client founders, corporate executives, and fund managers.",
  },
  earnings: {
    title: "Earnings & Payouts",
    eyebrow: "Financial Overview",
    description: "Track logged advisory hours, completed milestones, and projected payouts.",
  },
  profile: {
    title: "Advisor Profile & Public Branding",
    eyebrow: "Public Identity",
    description: "Personalize your avatar, cover banner, and specialization credentials visible to startups and funds.",
  },
  kyc: {
    title: "Identity & KYC",
    eyebrow: "Account Compliance",
    description: "Verify your professional credentials and certifications to unlock paid advisory engagements.",
  },
  settings: {
    title: "Consultant Settings",
    eyebrow: "Account preferences",
    description: "Manage your advisory fee structures, security, and notification channels.",
  },
};
