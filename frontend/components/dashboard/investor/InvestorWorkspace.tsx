import type { AuthUser } from "@/lib/auth/types";
import type { ComponentType, ReactNode } from "react";
import { InvestorShell } from "./InvestorShell";
import { getInvestorSection, type InvestorSection } from "./navigation";
import { ImpactPage } from "./pages/ImpactPage";
import { InvestmentsPage } from "./pages/InvestmentsPage";
import { InvestorOverviewPage } from "./pages/InvestorOverviewPage";
import { InvestorIntrosPage } from "./pages/InvestorIntrosPage";
import { MessagesPage } from "./pages/MessagesPage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { KycVerificationCard } from "@/components/dashboard/shared/KycVerificationCard";
import { UserSubscriptionDashboardView } from "@/components/dashboard/shared/UserSubscriptionDashboardView";
import { MyCoursesPage } from "@/components/dashboard/shared/MyCoursesPage";
import { MyConsultationsPage } from "@/components/dashboard/shared/MyConsultationsPage";

const sectionComponents: Record<
  Exclude<InvestorSection, "settings" | "profile" | "kyc" | "subscription" | "courses" | "consultations">,
  ComponentType
> = {
  overview: InvestorOverviewPage,
  intros: InvestorIntrosPage,
  portfolio: PortfolioPage,
  investments: InvestmentsPage,
  opportunities: OpportunitiesPage,
  impact: ImpactPage,
  reports: ReportsPage,
  watchlist: WatchlistPage,
  messages: MessagesPage,
};

export function InvestorWorkspace({
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
  const activeSection = getInvestorSection(section);
  let content: ReactNode;

  if (activeSection === "settings") {
    content = <SettingsPage user={user} />;
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
    <InvestorShell
      user={user}
      activeSection={activeSection}
      onSignOut={onSignOut}
      isSigningOut={isSigningOut}
    >
      {content}
    </InvestorShell>
  );
}
