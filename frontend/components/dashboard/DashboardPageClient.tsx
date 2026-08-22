"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLogoutMutation } from "@/lib/auth/auth-hooks";
import { getDashboardPath } from "@/lib/auth/role";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { InvestorWorkspace } from "@/components/dashboard/investor/InvestorWorkspace";
import { investorSections, type InvestorSection } from "@/components/dashboard/investor/navigation";
import { AdminWorkspace } from '@/components/dashboard/admin/AdminWorkspace';

function DashboardContent() {
  const router = useRouter();
  const params = useParams<{ role: string; section?: string }>();
  const { user } = useAuth();
  const logout = useLogoutMutation();
  const section = params.section;
  const validInvestorSection =
    !section || investorSections.includes(section as InvestorSection);

  useEffect(() => {
    if (!user) return;

    const correctRole = params.role === user.role.toLowerCase();
    const sectionAllowed =
      user.role === "INVESTOR" ? validInvestorSection : !section;

    if (!correctRole || !sectionAllowed) {
      router.replace(getDashboardPath(user.role));
    }
  }, [params.role, router, section, user, validInvestorSection]);

  if (
    !user ||
    params.role !== user.role.toLowerCase() ||
    (user.role === "INVESTOR" && !validInvestorSection) ||
    (user.role !== "INVESTOR" && section)
  ) {
    return null;
  }

  const signOut = async () => {
    await logout.mutateAsync();
    router.replace("/login");
  };

  if (user.role === "INVESTOR") {
    return (
      <InvestorWorkspace
        user={user}
        section={section}
        onSignOut={signOut}
        isSigningOut={logout.isPending}
      />
    );
  }

  if (user.role === 'ADMIN') {
    return <AdminWorkspace user={user} onSignOut={signOut} isSigningOut={logout.isPending} />;
  }

  return (
    <RoleDashboard
      user={user}
      onSignOut={signOut}
      isSigningOut={logout.isPending}
    />
  );
}

export function DashboardPageClient() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
