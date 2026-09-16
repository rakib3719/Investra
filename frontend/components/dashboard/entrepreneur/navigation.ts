export const entrepreneurSections = [
  "overview",
  "campaigns",
  "matches",
  "analytics",
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
  analytics: {
    title: "Profile & Round Analytics",
    eyebrow: "Performance insights",
    description:
      "Track deck views, pitch deck downloads, and investor interest trends.",
  },
  settings: {
    title: "Company & Account Settings",
    eyebrow: "Account preferences",
    description:
      "Manage your startup profile, verification documents, and team permissions.",
  },
};
