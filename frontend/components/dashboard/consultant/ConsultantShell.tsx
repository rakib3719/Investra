"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  Handshake,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import {
  consultantPageMeta,
  consultantSectionPath,
  type ConsultantSection,
} from "./navigation";

const navigation: {
  section: ConsultantSection;
  label: string;
  icon: LucideIcon;
  badge?: string;
}[] = [
  { section: "overview", label: "Dashboard", icon: LayoutDashboard },
  { section: "kyc", label: "Identity & KYC", icon: ShieldCheck },
  { section: "profile", label: "Profile", icon: User },
  { section: "clients", label: "Client workspace", icon: Users },
  { section: "advisory", label: "Advisory work", icon: Handshake },
  { section: "deal-room", label: "Deal room", icon: BriefcaseBusiness },
  { section: "reports", label: "Reports", icon: FileBarChart },
  { section: "calendar", label: "Calendar", icon: CalendarDays },
  { section: "messages", label: "Messages", icon: MessageSquare, badge: "2" },
  { section: "earnings", label: "Earnings", icon: WalletCards },
  { section: "settings", label: "Settings", icon: Settings },
];

function UserAvatar({ user }: { user: AuthUser }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.firstName || "User"}
        className="h-10 w-10 shrink-0 rounded-full object-cover border border-emerald-200"
      />
    );
  }
  const initials = `${user.firstName?.[0] ?? user.email[0]}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">
      {initials}
    </span>
  );
}

export function ConsultantShell({
  user,
  activeSection,
  children,
  onSignOut,
  isSigningOut,
}: {
  user: AuthUser;
  activeSection: ConsultantSection;
  children: ReactNode;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const meta = consultantPageMeta[activeSection];
  const firstName = user.firstName || user.email.split("@")[0];

  return (
    <main className="min-h-screen bg-[#f9fbfa] text-slate-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <div className="grid min-h-screen lg:grid-cols-[268px_minmax(0,1fr)]">
        {/* Sidebar - matches RoleDashboard and InvestorShell 1:1 */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="flex h-24 items-center justify-between border-b border-slate-100 px-7">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[27px] font-bold tracking-tight text-[#078457]"
              aria-label="Investra home"
            >
              <Image
                src="/investra-logo.png"
                alt="Investra"
                width={1254}
                height={1254}
                className="h-10 w-10 object-contain"
                priority
              />
              <span className="font-serif">Investra</span>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-500 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
            aria-label="Consultant dashboard navigation"
          >
            {navigation.map(({ section, label, icon: Icon, badge }) => {
              const active = section === activeSection;
              return (
                <Link
                  key={section}
                  href={consultantSectionPath(section)}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-emerald-50 text-[#065f46] shadow-[inset_3px_0_0_#10b981]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span
                      className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold ${
                        active
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-4 border-t border-slate-100 p-4">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
              <Leaf className="mb-2 h-5 w-5 text-emerald-600" />
              <p className="text-sm font-bold text-slate-800">
                Plan your next client win
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use your workspace to stay ahead of deadlines and conversations.
              </p>
              <Link
                href="/dashboard/consultant/calendar"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#06734d] hover:text-[#064e3b]"
              >
                View calendar
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={onSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <InvestraInlineLoader label="Signing out…" />
              ) : (
                <>
                  <LogOut className="h-[18px] w-[18px]" />
                  Sign out
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex min-h-24 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  {meta.eyebrow}
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {meta.title}
                </h1>
                <p className="mt-0.5 hidden truncate text-xs text-slate-500 md:block">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                aria-label="Search"
                className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 sm:block"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  <UserAvatar user={user} />
                  <span className="hidden text-left leading-tight md:block">
                    <span className="block text-sm font-bold text-slate-800">
                      {user.firstName || "My account"} {user.lastName || ""}
                    </span>
                    <span className="block text-xs text-slate-500">
                      Verified Consultant
                    </span>
                  </span>
                  <ChevronDown
                    className={`hidden h-4 w-4 text-slate-400 transition md:block ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50"
                  >
                    <Link
                      href="/dashboard/consultant/profile"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      role="menuitem"
                    >
                      My profile
                    </Link>
                    <Link
                      href="/dashboard/consultant/kyc"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                      role="menuitem"
                    >
                      Identity & KYC
                    </Link>
                    <Link
                      href="/dashboard/consultant/settings"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      role="menuitem"
                    >
                      Account settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onSignOut();
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1540px] px-5 py-7 sm:px-8 lg:px-9 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
