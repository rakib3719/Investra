"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  CalendarDays,
  WalletCards,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { useMyKycQuery } from "@/lib/kyc/kyc-hooks";
import { coursesApi } from "@/lib/courses/courses-api";

export function ConsultantOverviewPage({ user }: { user: AuthUser }) {
  const { data: kycData } = useMyKycQuery();
  const isKycVerified = kycData?.status === "VERIFIED";

  const [coursesCount, setCoursesCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const courses = await coursesApi.getMyCreatedCourses();
        if (Array.isArray(courses)) {
          setCoursesCount(courses.length);
          const earned = courses.reduce((sum, c) => sum + (c.totalEarnings || 0), 0);
          setTotalEarnings(earned);
        }
      } catch (err) {
        // Silently fail if not verified or error
      }
    };

    fetchQuickStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultant Workspace</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Welcome back, {user.firstName || "Advisor"}!
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your masterclass tutorials, 90% revenue share wallet, and client advisory mandates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/consultant/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-[#078457] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#06734d] transition"
          >
            <BookOpen className="h-4 w-4" />
            Course Studio
          </Link>
          <Link
            href="/dashboard/consultant/earnings"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <WalletCards className="h-4 w-4" />
            Earnings
          </Link>
        </div>
      </div>

      {/* KYC Alert if not verified */}
      {!isKycVerified && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                KYC Verification Required
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Complete your identity &amp; professional verification to unlock paid courses, tutorial publishing, and bank payouts.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/consultant/kyc"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            Submit KYC Documents
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Courses
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-heading">
                {coursesCount}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Video Masterclasses</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/dashboard/consultant/courses"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              Open Course Studio <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Course Revenue (90%)
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-heading">
                ${totalEarnings.toFixed(2)}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Net Creator Yield</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <WalletCards className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/dashboard/consultant/earnings"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
            >
              View Payouts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Clients
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-heading">
                16
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Across 4 sectors</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            2 new this month
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hours Logged
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-2 font-heading">
                84.5h
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Advisory time</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            72% of monthly target
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Shortcuts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">
              Quick Advisor Workspaces
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/consultant/courses"
                className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Course Creator Studio</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Publish video tutorials</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/consultant/earnings"
                className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Earnings &amp; Payouts</h4>
                    <p className="text-xs text-slate-500 mt-0.5">90% revenue &amp; withdrawals</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/consultant/kyc"
                className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Identity &amp; KYC</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Verify credentials</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/consultant/profile"
                className="group rounded-xl border border-slate-200 p-4 hover:border-emerald-500 hover:bg-emerald-50/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Advisor Profile</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Public bio &amp; branding</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Priority Mandates */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">
              Upcoming Schedule
            </h3>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-3 first:pt-0 flex items-start gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Portfolio Strategy Check-in</h4>
                  <p className="text-[11px] text-slate-500">Verdant Labs • Today at 10:00 AM</p>
                </div>
              </div>

              <div className="pt-3 flex items-start gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Founder Diligence Session</h4>
                  <p className="text-[11px] text-slate-500">AgriNova • Tomorrow at 2:00 PM</p>
                </div>
              </div>

              <div className="pt-3 flex items-start gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Cap Table Restructuring</h4>
                  <p className="text-[11px] text-slate-500">Solstice Energy • Thursday at 11:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
