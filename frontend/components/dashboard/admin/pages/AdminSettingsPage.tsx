"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  Database,
  KeyRound,
  Lock,
  Save,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  User,
} from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import type { AuthUser } from "@/lib/auth/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";

export function AdminSettingsPage({ user }: { user: AuthUser }) {
  const [minGoal, setMinGoal] = useState("5000");
  const [maxGoal, setMaxGoal] = useState("10000000");
  const [slaHours, setSlaHours] = useState("48");
  const [autoRevokeSessions, setAutoRevokeSessions] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          Administrative governance preferences saved successfully.
        </div>
      )}

      {/* Header */}
      <Panel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Platform Governance & Admin Preferences
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure marketplace thresholds, moderation audit policies, and administrator credentials
            </p>
          </div>

          <StatusPill tone="green">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role: System Administrator
            </span>
          </StatusPill>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Admin Identity & System Health */}
        <div className="space-y-6 lg:col-span-5">
          <Panel className="p-6 space-y-4">
            <SectionHeading
              title="Administrator Profile"
              description="Authenticated superuser credentials"
            />

            <div className="flex items-center gap-4 pt-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-base font-bold text-emerald-800">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {user.firstName} {user.lastName || "(Admin)"}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                  ID: {user.id}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-200/60">
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="font-bold text-emerald-700">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Email Verified:</span>
                <span className="font-bold text-emerald-700">Yes</span>
              </div>
              <div className="flex justify-between">
                <span>Role Scope:</span>
                <span className="font-bold text-slate-800">ADMIN (Superuser)</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-6 space-y-4">
            <SectionHeading
              title="Infrastructure Telemetry"
              description="Database and runtime parameters"
            />

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Database className="h-4 w-4 text-emerald-600" />
                  Database Engine
                </span>
                <span className="font-bold text-slate-900">Neon Cloud Postgres</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Server className="h-4 w-4 text-sky-600" />
                  Backend Framework
                </span>
                <span className="font-bold text-slate-900">NestJS 10 + Prisma ORM</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <Lock className="h-4 w-4 text-purple-600" />
                  Auth Security
                </span>
                <span className="font-bold text-emerald-700">JWT + HttpOnly Cookies</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: Governance Form */}
        <Panel className="p-6 lg:col-span-7">
          <SectionHeading
            title="Moderation & Governance Rules"
            description="Operational parameters applied to incoming entrepreneur campaigns"
          />

          <form onSubmit={handleSavePreferences} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Minimum Campaign Goal ($)
                </label>
                <input
                  type="number"
                  value={minGoal}
                  onChange={(e) => setMinGoal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maximum Campaign Goal ($)
                </label>
                <input
                  type="number"
                  value={maxGoal}
                  onChange={(e) => setMaxGoal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Moderation Turnaround Target (Hours)
              </label>
              <input
                type="number"
                value={slaHours}
                onChange={(e) => setSlaHours(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Founders will be notified of this expected SLA when submitting deals for review.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRevokeSessions}
                  onChange={(e) => setAutoRevokeSessions(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    Immediate Session Revocation on Account Suspension
                  </p>
                  <p className="text-slate-500">
                    Deletes all active refresh tokens in a database transaction whenever an admin marks a user BLOCKED or SUSPENDED.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-800">
                    Admin Notification Feed
                  </p>
                  <p className="text-slate-500">
                    Receive immediate dashboard alerts when new campaigns are submitted for review.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#078457] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#066e48] transition shadow-sm"
              >
                <Save className="h-4 w-4" />
                Save Platform Preferences
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
