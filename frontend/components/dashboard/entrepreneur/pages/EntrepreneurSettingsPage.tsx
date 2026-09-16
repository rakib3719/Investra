"use client";

import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  FileText,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import {
  Panel,
  PrimaryButton,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";

const settingsNav = [
  { label: "Company profile", icon: Building2, active: true },
  { label: "Security & Login", icon: Lock },
  { label: "Data room verification", icon: ShieldCheck },
  { label: "Notifications", icon: Bell },
];

export function EntrepreneurSettingsPage({ user }: { user: AuthUser }) {
  const initials = `${user.firstName?.[0] ?? user.email[0]}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
      {/* Sidebar navigation */}
      <Panel className="h-fit p-3">
        <nav aria-label="Settings navigation" className="space-y-1">
          {settingsNav.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold ${
                active
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ))}
        </nav>
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <strong className="mt-3 block text-xs text-slate-800">Founder verified</strong>
          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            KYB business incorporation verified with regulatory authorities.
          </p>
        </div>
      </Panel>

      {/* Main Settings Body */}
      <div className="space-y-5">
        <Panel className="p-5 sm:p-6">
          <SectionHeading
            title="Founder & Company profile"
            description="Used for investor transparency and campaign verification"
            action={<StatusPill tone="green">Verified Founder</StatusPill>}
          />
          <div className="mt-6 flex flex-col gap-6 sm:flex-row">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
              {initials}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={user.firstName || "Founder"} />
              <Field label="Last name" value={user.lastName || "Lead"} />
              <Field label="Contact email" value={user.email} />
              <Field label="Phone number" value={user.phone || "+1 (555) 019-2831"} />
              <Field label="Primary venture" value="SolarGrid / FinTech API" />
              <Field label="Headquarters" value="Dhaka, Bangladesh" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <PrimaryButton>Save profile changes</PrimaryButton>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <SectionHeading
            title="Security & Permissions"
            description="Control account authentication and founder data access"
          />
          <div className="mt-5 divide-y divide-slate-100">
            {[
              {
                icon: KeyRound,
                title: "Password",
                detail: "Secure password updated 18 days ago",
                action: "Change password",
              },
              {
                icon: ShieldCheck,
                title: "Two-factor authentication",
                detail: "SMS / Authenticator app enabled",
                action: "Manage",
              },
            ].map(({ icon: Icon, title, detail, action }) => (
              <div
                key={title}
                className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm text-slate-800">{title}</strong>
                  <span className="text-xs text-slate-500">{detail}</span>
                </span>
                <button type="button" className="text-xs font-bold text-emerald-700">
                  {action}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-bold text-slate-500">{label}</span>
      <input
        defaultValue={value}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}
