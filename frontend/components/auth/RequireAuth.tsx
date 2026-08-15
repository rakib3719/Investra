"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUserQuery } from '@/lib/auth/auth-hooks';
import type { PublicUserRole } from '@/lib/auth/types';
import { InvestraLoader } from '@/components/ui/InvestraLoader';

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: PublicUserRole[];
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, router, user]);

  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <main className="min-h-screen grid place-items-center bg-slate-50 px-6"><InvestraLoader label="Securing your workspace" description="Verifying your Investra session." /></main>;
  }

  return <>{children}</>;
}
