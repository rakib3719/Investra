"use client";

import type { AuthUser } from "@/lib/auth/types";
import type { ReactNode } from "react";
import { ConsultantShell } from "./ConsultantShell";
import {
  getConsultantSection,
  type ConsultantSection,
} from "./navigation";
import { ConsultantProfileKycView } from "./pages/ConsultantProfileKycView";
import { ConsultantOverviewPage } from "./pages/ConsultantOverviewPage";
import { ConsultantCoursesPage } from "./pages/ConsultantCoursesPage";
import { ConsultantEarningsPage } from "./pages/ConsultantEarningsPage";

export function ConsultantWorkspace({
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
  const activeSection = getConsultantSection(section);

  let content: ReactNode;

  if (activeSection === "courses") {
    content = <ConsultantCoursesPage user={user} />;
  } else if (activeSection === "earnings") {
    content = <ConsultantEarningsPage user={user} />;
  } else if (activeSection === "profile") {
    content = <ConsultantProfileKycView user={user} initialTab="profile" />;
  } else if (activeSection === "kyc") {
    content = <ConsultantProfileKycView user={user} initialTab="kyc" />;
  } else {
    content = <ConsultantOverviewPage user={user} />;
  }

  return (
    <ConsultantShell
      user={user}
      activeSection={activeSection}
      onSignOut={onSignOut}
      isSigningOut={isSigningOut}
    >
      {content}
    </ConsultantShell>
  );
}
