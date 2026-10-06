"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { getDashboardPath } from "@/lib/auth/role";

function StandaloneProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardHref = getDashboardPath(user.role);
  const dashboardKycHref = `${dashboardHref}/kyc`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href={dashboardHref}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {user.role.toLowerCase()} dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Account: {user.email}</span>
            </span>
          </div>
        </div>

        {/* 1. Profile Workspace Card (Cover, Avatar, Bio, Contact Information) */}
        <section aria-label="Profile and Identity">
          <ProfileWorkspaceCard user={user} />
        </section>

        {/* 2. Notice: KYC Verification is kept strictly private inside the dashboard */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <Lock className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900">
                Regulatory KYC Verification
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Identity documents (NID / Passport) are strictly isolated and verified inside your authenticated role dashboard.
              </p>
            </div>
          </div>

          <Link
            href={dashboardKycHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] text-white text-xs font-bold transition-all shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Open Dashboard KYC</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <StandaloneProfileContent />
    </RequireAuth>
  );
}
