export const adminSections = [
  "overview",
  "campaigns",
  "users",
  "categories",
  "visitors",
  "settings",
] as const;

export type AdminSection = (typeof adminSections)[number];

export function getAdminSection(value?: string): AdminSection {
  return adminSections.includes(value as AdminSection)
    ? (value as AdminSection)
    : "overview";
}

export function adminSectionPath(section: AdminSection): string {
  return section === "overview"
    ? "/dashboard/admin"
    : `/dashboard/admin/${section}`;
}

export const adminPageMeta: Record<
  AdminSection,
  { title: string; eyebrow: string; description: string }
> = {
  overview: {
    title: "Platform Command Center",
    eyebrow: "Admin workspace",
    description:
      "High-level visibility into platform activity, critical moderation queues, and capital aggregates.",
  },
  campaigns: {
    title: "Campaign Moderation",
    eyebrow: "Deal review",
    description:
      "Review entrepreneur submissions, audit funding goals and milestones, approve deals, or return with notes.",
  },
  users: {
    title: "User Management & Moderation",
    eyebrow: "Stakeholder directory",
    description:
      "Inspect registered investors, entrepreneurs, and consultants. Manage account status and revoke suspicious sessions.",
  },
  categories: {
    title: "Marketplace Taxonomies",
    eyebrow: "Sector & category control",
    description:
      "Review and organize investment verticals, industry categories, and deal tags.",
  },
  visitors: {
    title: "Visitor & Audience Insights",
    eyebrow: "Platform traffic",
    description:
      "Telemetry, geolocation, device distributions, and referral sources across public Investra pages.",
  },
  settings: {
    title: "System & Governance Settings",
    eyebrow: "Platform preferences",
    description:
      "Manage global platform parameters, moderation policies, notification rules, and admin credentials.",
  },
};
