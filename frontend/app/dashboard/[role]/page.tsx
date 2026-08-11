"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { useLogoutMutation } from '@/lib/auth/auth-hooks';
import { getDashboardPath } from '@/lib/auth/role';

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

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-5">
        <ShieldCheck className="w-10 h-10 text-[#064e3b]" />
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Verified {user.role.toLowerCase()} session</p>
        <h1 className="font-heading text-3xl font-black text-slate-800">Welcome, {user.firstName ?? user.email}</h1>
        <p className="text-slate-600">Your protected {user.role.toLowerCase()} dashboard is ready for the next feature modules.</p>
        <button type="button" onClick={signOut} disabled={logout.isPending} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 disabled:opacity-60"><LogOut className="w-4 h-4" />{logout.isPending ? 'Signing out…' : 'Sign out'}</button>
      </section>
    </main>
  );
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
