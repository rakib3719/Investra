"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, User } from "lucide-react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { KycVerificationCard } from "@/components/dashboard/shared/KycVerificationCard";
import { getDashboardPath } from "@/lib/auth/role";

function StandaloneProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardHref = getDashboardPath(user.role);

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

        {/* 1. Facebook-style Profile Workspace Card (Cover, Avatar, Bio, Info) */}
        <section aria-label="Profile and Identity">
          <ProfileWorkspaceCard user={user} />
        </section>

        {/* 2. Highlighted KYC Verification Center */}
        <section aria-label="Regulatory KYC Verification">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-xl text-slate-900">
                Identity & Regulatory Compliance (KYC)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your national ID or passport to unlock accredited operations and fund transfers.
              </p>
            </div>
          </div>
          <KycVerificationCard user={user} />
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
