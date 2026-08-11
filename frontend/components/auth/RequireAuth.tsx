"use client";

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUserQuery } from '@/lib/auth/auth-hooks';
import type { PublicUserRole } from '@/lib/auth/types';

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
    return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Loading secure workspace…</div>;
  }

  return <>{children}</>;
}
