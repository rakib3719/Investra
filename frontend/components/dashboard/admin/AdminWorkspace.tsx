"use client";

import type { ComponentType, ReactNode } from "react";
import type { AuthUser } from "@/lib/auth/types";
import { AdminShell } from "./AdminShell";
import { getAdminSection, type AdminSection } from "./navigation";
import { AdminOverviewPage } from "./pages/AdminOverviewPage";
import { AdminCampaignsPage } from "./pages/AdminCampaignsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage";
import { AdminVisitorsPage } from "./pages/AdminVisitorsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { AdminKycPage } from "./pages/AdminKycPage";
import { AdminPendingUsersPage } from "./pages/AdminPendingUsersPage";
import { AdminSubscriptionsPage } from "./pages/AdminSubscriptionsPage";

const sectionComponents: Record<
  Exclude<AdminSection, "settings">,
  ComponentType
> = {
  overview: AdminOverviewPage,
  campaigns: AdminCampaignsPage,
  kyc: AdminKycPage,
  "pending-users": AdminPendingUsersPage,
  users: AdminUsersPage,
  categories: AdminCategoriesPage,
  subscriptions: AdminSubscriptionsPage,
  visitors: AdminVisitorsPage,
};

export function AdminWorkspace({
  user,
  section,
  onSignOut,
  isSigningOut,
}: {
  user: AuthUser;
  section?: string;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const activeSection = getAdminSection(section);
  let content: ReactNode;

  if (activeSection === "settings") {
    content = <AdminSettingsPage user={user} />;
  } else {
    const SectionComponent = sectionComponents[activeSection];
    content = <SectionComponent />;
  }

  return (
    <AdminShell
      user={user}
      activeSection={activeSection}
      onSignOut={onSignOut}
      isSigningOut={isSigningOut}
    >
      {content}
    </AdminShell>
  );
}
