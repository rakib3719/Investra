import type { AuthUser, AdminPermission } from "@/lib/auth/types";

export const adminSections = [
  "overview",
  "campaigns",
  "kyc",
  "pending-users",
  "users",
  "subadmins",
  "categories",
  "subscriptions",
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
  kyc: {
    title: "Identity & KYC Moderation Vault",
    eyebrow: "Compliance Audit",
    description:
      "Inspect government documents, passports, and selfie liveness proofs stored in encrypted private compliance storage.",
  },
  "pending-users": {
    title: "Pending & Incomplete Users Queue",
    eyebrow: "Verification Backlog",
    description:
      "Audit registered stakeholders with incomplete verifications — clearly distinguish between pending KYC submissions under review and unsubmitted/missing KYC accounts.",
  },
  users: {
    title: "User Management & Moderation",
    eyebrow: "Stakeholder directory",
    description:
      "Inspect registered investors, entrepreneurs, and consultants. Manage account status and revoke suspicious sessions.",
  },
  subadmins: {
    title: "Sub-Admin Permission Matrix",
    eyebrow: "PBAC Governance",
    description:
      "Provision delegate administrators, configure granular module permissions, manage department scopes, and revoke administrative access.",
  },
  categories: {
    title: "Marketplace Taxonomies",
    eyebrow: "Sector & category control",
    description:
      "Review and organize investment verticals, industry categories, and deal tags.",
  },
  subscriptions: {
    title: "Subscription & Tier Management",
    eyebrow: "Monetization & Plans",
    description:
      "Configure role-based pricing plans, manage feature entitlements, and adjust limits for entrepreneurs, investors, and consultants.",
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

/**
 * Mapping of admin sections to their required granular permissions for Sub-Admins.
 * Super Admin (role === 'ADMIN') has unconditional access to every section.
 * An empty array means accessible to all authenticated administrative users.
 */
export const SECTION_PERMISSIONS_MAP: Record<AdminSection, AdminPermission[]> = {
  overview: [],
  campaigns: ["CAMPAIGN_MANAGEMENT"],
  kyc: ["KYC_MODERATION"],
  "pending-users": ["KYC_MODERATION", "USER_MANAGEMENT"],
  users: ["USER_MANAGEMENT"],
  subadmins: [], // Strictly Super Admin only!
  categories: ["CATEGORY_MANAGEMENT", "CAMPAIGN_MANAGEMENT"],
  subscriptions: ["SUBSCRIPTION_MANAGEMENT"],
  visitors: ["ANALYTICS_ACCESS"],
  settings: [], // Strictly Super Admin only!
};

export function hasSectionAccess(
  user: AuthUser | null | undefined,
  section: AdminSection,
): boolean {
  if (!user) return false;

  // Super Admin has master access to everything
  if (user.role === "ADMIN") return true;

  // Sub-Admins cannot access Super Admin governance settings or Sub-Admin manager
  if (section === "subadmins" || section === "settings") {
    return false;
  }

  // Overview is accessible to any sub-admin
  if (section === "overview") return true;

  const required = SECTION_PERMISSIONS_MAP[section];
  if (!required || required.length === 0) return true;

  const userPerms = user.permissions || [];
  return required.some((req) => userPerms.includes(req));
}
