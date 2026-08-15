"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { useLogoutMutation } from '@/lib/auth/auth-hooks';
import { getDashboardPath } from '@/lib/auth/role';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';

function DashboardContent() {
  const router = useRouter();
  const params = useParams<{ role: string }>();
  const { user } = useAuth();
  const logout = useLogoutMutation();

  useEffect(() => {
    if (user && params.role !== user.role.toLowerCase()) {
      router.replace(getDashboardPath(user.role));
    }
  }, [params.role, router, user]);

  if (!user || params.role !== user.role.toLowerCase()) {
    return null;
  }

  const signOut = async () => {
    await logout.mutateAsync();
    router.replace('/login');
  };

  return <RoleDashboard user={user} onSignOut={signOut} isSigningOut={logout.isPending} />;
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </RequireAuth>
  );
}
