"use client";

import type { AuthUser } from "@/lib/auth/types";
import type { ReactNode } from "react";
import { ConsultantShell } from "./ConsultantShell";
import {
  getConsultantSection,
  type ConsultantSection,
} from "./navigation";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { KycVerificationCard } from "@/components/dashboard/shared/KycVerificationCard";
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
    content = <ProfileWorkspaceCard user={user} />;
  } else if (activeSection === "kyc") {
    content = <KycVerificationCard user={user} />;
  } else {
    content = <ProfileWorkspaceCard user={user} />;
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
