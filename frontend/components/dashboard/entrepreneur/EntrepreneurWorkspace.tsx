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
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { EntrepreneurSettingsPage } from "./pages/EntrepreneurSettingsPage";

const sectionComponents: Record<
  Exclude<EntrepreneurSection, "settings">,
  ComponentType
> = {
  overview: EntrepreneurOverviewPage,
  campaigns: FundraisingPage,
  matches: InvestorMatchesPage,
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
