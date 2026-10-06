export const consultantSections = [
  "overview",
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
  profile: {
    title: "Advisor Profile & Public Branding",
    eyebrow: "Public Identity",
    description: "Personalize your avatar, cover banner, and specialization credentials visible to startups and funds.",
  },
  kyc: {
    title: "Professional Identity & KYC Verification",
    eyebrow: "Regulatory Compliance",
    description: "Upload government identity documents and certifications into our private vault to unlock paid advisory engagements.",
  },
  settings: {
    title: "Consultant Settings",
    eyebrow: "Account preferences",
    description: "Manage your advisory fee structures, security, and notification channels.",
  },
};
