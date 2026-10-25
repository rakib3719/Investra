"use client";

import type { AuthUser } from "@/lib/auth/types";
import type { ComponentType, ReactNode } from "react";
import { EntrepreneurShell } from "./EntrepreneurShell";
import {
  getEntrepreneurSection,
  type EntrepreneurSection,
} from "./navigation";
import { EntrepreneurOverviewPage } from "./pages/EntrepreneurOverviewPage";
import { FundraisingPage } from "./pages/FundraisingPage";
import { InvestorMatchesPage } from "./pages/InvestorMatchesPage";
import { EntrepreneurMessagesPage } from "./pages/EntrepreneurMessagesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { EntrepreneurSettingsPage } from "./pages/EntrepreneurSettingsPage";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { KycVerificationCard } from "@/components/dashboard/shared/KycVerificationCard";
import { UserSubscriptionDashboardView } from "@/components/dashboard/shared/UserSubscriptionDashboardView";
import { MyCoursesPage } from "@/components/dashboard/shared/MyCoursesPage";
import { MyConsultationsPage } from "@/components/dashboard/shared/MyConsultationsPage";

const sectionComponents: Record<
  Exclude<EntrepreneurSection, "settings" | "profile" | "kyc" | "subscription" | "courses" | "consultations">,
  ComponentType
> = {
  overview: EntrepreneurOverviewPage,
  campaigns: FundraisingPage,
  matches: InvestorMatchesPage,
  messages: EntrepreneurMessagesPage,
  analytics: AnalyticsPage,
};

export function EntrepreneurWorkspace({
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
  const activeSection = getEntrepreneurSection(section);
  let content: ReactNode;

  if (activeSection === "settings") {
    content = <EntrepreneurSettingsPage user={user} />;
  } else if (activeSection === "profile") {
    content = <ProfileWorkspaceCard user={user} />;
  } else if (activeSection === "kyc") {
    content = <KycVerificationCard user={user} />;
  } else if (activeSection === "subscription") {
    content = <UserSubscriptionDashboardView user={user} />;
  } else if (activeSection === "courses") {
    content = <MyCoursesPage user={user} />;
  } else if (activeSection === "consultations") {
    content = <MyConsultationsPage user={user} />;
  } else {
    const SectionComponent = sectionComponents[activeSection];
    content = <SectionComponent />;
  }

  return (
    <EntrepreneurShell
      user={user}
      activeSection={activeSection}
      onSignOut={onSignOut}
      isSigningOut={isSigningOut}
    >
      {content}
    </EntrepreneurShell>
  );
}
