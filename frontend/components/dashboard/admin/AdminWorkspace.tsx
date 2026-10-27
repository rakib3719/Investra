"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { AdminShell } from "./AdminShell";
import {
  getAdminSection,
  hasSectionAccess,
  type AdminSection,
} from "./navigation";
import { AdminOverviewPage } from "./pages/AdminOverviewPage";
import { AdminCampaignsPage } from "./pages/AdminCampaignsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage";
import { AdminVisitorsPage } from "./pages/AdminVisitorsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { AdminKycPage } from "./pages/AdminKycPage";
import { AdminPendingUsersPage } from "./pages/AdminPendingUsersPage";
import { AdminSubscriptionsPage } from "./pages/AdminSubscriptionsPage";
import { AdminSubAdminsPage } from "./pages/AdminSubAdminsPage";

const sectionComponents: Record<
  Exclude<AdminSection, "settings">,
  ComponentType
> = {
  overview: AdminOverviewPage,
  campaigns: AdminCampaignsPage,
  kyc: AdminKycPage,
  "pending-users": AdminPendingUsersPage,
  users: AdminUsersPage,
  subadmins: AdminSubAdminsPage,
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
  const authorized = hasSectionAccess(user, activeSection);

  let content: ReactNode;

  if (!authorized) {
    content = (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Access Restricted (PBAC Enforced)
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Your Sub-Administrator account does not possess the required module permission to access this section. Please contact a Super Administrator if you require elevated privileges.
        </p>
        <Link
          href="/dashboard/admin"
          className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          Return to Command Center
        </Link>
      </div>
    );
  } else if (activeSection === "settings") {
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
