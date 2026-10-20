export const entrepreneurSections = [
  "overview",
  "campaigns",
  "matches",
  "messages",
  "analytics",
  "courses",
  "subscription",
  "profile",
  "kyc",
  "settings",
] as const;

export type EntrepreneurSection = (typeof entrepreneurSections)[number];

export function getEntrepreneurSection(value?: string): EntrepreneurSection {
  return entrepreneurSections.includes(value as EntrepreneurSection)
    ? (value as EntrepreneurSection)
    : "overview";
}

export function entrepreneurSectionPath(section: EntrepreneurSection): string {
  return section === "overview"
    ? "/dashboard/entrepreneur"
    : `/dashboard/entrepreneur/${section}`;
}

export const entrepreneurPageMeta: Record<
  EntrepreneurSection,
  { title: string; eyebrow: string; description: string }
> = {
  overview: {
    title: "Entrepreneur Overview",
    eyebrow: "Entrepreneur workspace",
    description:
      "Real-time visibility into fundraising progress, capital committed, and investor reach.",
  },
  campaigns: {
    title: "Fundraising & Campaigns",
    eyebrow: "Capital management",
    description:
      "Author investment proposals, attach milestones, and submit to verified investors.",
  },
  matches: {
    title: "Investor Pipeline & Matches",
    eyebrow: "Deal flow & outreach",
    description:
      "Manage verified accredited investor conversations and diligence data rooms.",
  },
  messages: {
    title: "Deal Rooms & Messages",
    eyebrow: "Investor Communications",
    description:
      "Direct conversations and diligence rooms with verified investors reviewing your startup.",
  },
  analytics: {
    title: "Profile & Round Analytics",
    eyebrow: "Performance insights",
    description:
      "Track deck views, pitch deck downloads, and investor interest trends.",
  },
  courses: {
    title: "My Courses & Masterclasses",
    eyebrow: "Founder Education",
    description:
      "Watch video masterclasses, learn term sheet negotiations, and track syllabus completion.",
  },
  subscription: {
    title: "Subscription & Limits",
    eyebrow: "Founder Entitlements",
    description:
      "Manage campaign creation limits, active investor unlocks, and billing history.",
  },
  profile: {
    title: "Founder & Company Profile",
    eyebrow: "Public Identity",
    description:
      "Showcase your startup branding with avatar and cover banner photos visible to investors.",
  },
  kyc: {
    title: "Identity & KYC",
    eyebrow: "Account Compliance",
    description:
      "Verify your founder identity and company incorporation documents to unlock fundraising campaigns.",
  },
  settings: {
    title: "Company & Account Settings",
    eyebrow: "Account preferences",
    description:
      "Manage your account preferences, security, and notification rules.",
  },
};
