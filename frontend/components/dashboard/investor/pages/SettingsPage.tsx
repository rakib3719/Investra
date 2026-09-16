import { Bell, Building2, Check, ChevronRight, CircleUserRound, CreditCard, Fingerprint, KeyRound, Lock, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { Panel, PrimaryButton, SectionHeading, StatusPill } from "../InvestorUI";

const settingsNavigation = [
  { label: "Profile", icon: CircleUserRound, active: true },
  { label: "Security", icon: Lock },
  { label: "Investment preferences", icon: SlidersHorizontal },
  { label: "Notifications", icon: Bell },
  { label: "Payment methods", icon: CreditCard },
];

export function SettingsPage({ user }: { user: AuthUser }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
      <Panel className="h-fit p-3"><nav aria-label="Settings sections" className="space-y-1">{settingsNavigation.map(({ label, icon: Icon, active }) => <button key={label} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold ${active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="h-4 w-4" /><span className="flex-1">{label}</span><ChevronRight className="h-3.5 w-3.5" /></button>)}</nav><div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"><ShieldCheck className="h-5 w-5 text-emerald-700" /><strong className="mt-3 block text-xs text-slate-800">Account protected</strong><p className="mt-1 text-[11px] leading-4 text-slate-500">Two-factor authentication is active.</p></div></Panel>

      <div className="space-y-5">
        <Panel className="p-5 sm:p-6"><SectionHeading title="Personal information" description="Used for account verification and investor records" action={<StatusPill>Verified</StatusPill>} /><div className="mt-6 flex flex-col gap-6 sm:flex-row"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">{`${user.firstName?.[0] ?? user.email[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()}</div><div className="grid flex-1 gap-4 sm:grid-cols-2"><Field label="First name" value={user.firstName || "Alex"} /><Field label="Last name" value={user.lastName || "Roberts"} /><Field label="Email address" value={user.email} /><Field label="Phone number" value={user.phone || "+1 (415) 555-0142"} /><Field label="Country of residence" value="United States" /><Field label="Investor type" value="Accredited investor" /></div></div><div className="mt-6 flex justify-end"><PrimaryButton>Save profile</PrimaryButton></div></Panel>

        <Panel className="p-5 sm:p-6"><SectionHeading title="Security" description="Protect access to your investments and personal information" /><div className="mt-5 divide-y divide-slate-100">{[{ icon: KeyRound, title: "Password", detail: "Last changed 42 days ago", action: "Change password" }, { icon: Fingerprint, title: "Two-factor authentication", detail: "Authenticator app enabled", action: "Manage" }, { icon: ShieldCheck, title: "Identity verification", detail: "Identity and accreditation verified", action: "View status" }].map(({ icon: Icon, title, detail, action }) => <div key={title} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-800">{title}</strong><span className="text-xs text-slate-500">{detail}</span></span><button type="button" className="text-xs font-bold text-emerald-700">{action}</button></div>)}</div></Panel>

        <Panel className="p-5 sm:p-6"><SectionHeading title="Investment preferences" description="Used to personalize opportunities and portfolio guidance" /><div className="mt-5 grid gap-5 sm:grid-cols-2"><Preference title="Risk tolerance" value="Balanced growth" options={["Conservative", "Balanced growth", "Growth"]} /><Preference title="Minimum investment" value="$5,000" options={["$1,000", "$5,000", "$10,000+"]} /><Preference title="Preferred stages" value="Series A to Growth" options={["Seed", "Series A to Growth", "Funds"]} /><Preference title="Target annual return" value="12% – 20%" options={["8% – 12%", "12% – 20%", "20%+"]} /></div><div className="mt-6"><p className="text-xs font-bold text-slate-700">Priority impact themes</p><div className="mt-3 flex flex-wrap gap-2">{["Clean energy", "Climate agriculture", "Inclusive health", "Circular economy"].map((theme) => <button key={theme} type="button" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" />{theme}</button>)}</div></div><div className="mt-6 flex justify-end"><PrimaryButton>Update preferences</PrimaryButton></div></Panel>

        <Panel className="p-5 sm:p-6"><SectionHeading title="Linked bank account" description="Used to fund investments and receive distributions" /><div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><Building2 className="h-5 w-5" /></span><span className="flex-1"><strong className="block text-sm text-slate-800">Chase Bank ···· 4821</strong><span className="text-xs text-slate-500">Checking account · Verified</span></span><StatusPill>Primary</StatusPill><button type="button" className="text-xs font-bold text-emerald-700">Manage</button></div></Panel>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <label><span className="mb-1.5 block text-[11px] font-bold text-slate-500">{label}</span><input defaultValue={value} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>;
}

function Preference({ title, value, options }: { title: string; value: string; options: string[] }) {
  return <label><span className="mb-1.5 block text-[11px] font-bold text-slate-500">{title}</span><select defaultValue={value} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
