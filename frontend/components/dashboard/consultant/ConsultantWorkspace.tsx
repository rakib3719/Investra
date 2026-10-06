"use client";

import type { AuthUser } from "@/lib/auth/types";
import type { ReactNode } from "react";
import { ConsultantShell } from "./ConsultantShell";
import {
  getConsultantSection,
  type ConsultantSection,
} from "./navigation";
import { ConsultantProfileKycView } from "./pages/ConsultantProfileKycView";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";

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

  if (activeSection === "overview" && !section) {
    return (
      <RoleDashboard
        user={user}
        onSignOut={onSignOut}
        isSigningOut={isSigningOut}
      />
    );
  }

  let content: ReactNode;

  if (activeSection === "profile") {
    content = <ConsultantProfileKycView user={user} initialTab="profile" />;
  } else if (activeSection === "kyc") {
    content = <ConsultantProfileKycView user={user} initialTab="kyc" />;
  } else {
    content = <ConsultantProfileKycView user={user} initialTab="profile" />;
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
