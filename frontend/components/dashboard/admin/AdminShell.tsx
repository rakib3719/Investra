"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  CircleHelp,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Rocket,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import {
  adminPageMeta,
  adminSectionPath,
  type AdminSection,
} from "./navigation";

const navigation: {
  section: AdminSection;
  label: string;
  icon: LucideIcon;
  badge?: string;
}[] = [
  { section: "overview", label: "Command Center", icon: LayoutDashboard },
  { section: "campaigns", label: "Moderation Queue", icon: Rocket },
  { section: "users", label: "User Directory", icon: Users },
  { section: "categories", label: "Categories", icon: FolderTree },
  { section: "visitors", label: "Traffic & Telemetry", icon: Activity },
  { section: "settings", label: "Settings", icon: Settings },
];

function UserAvatar({ user }: { user: AuthUser }) {
  const initials = `${user.firstName?.[0] ?? user.email[0]}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">
      {initials}
    </span>
  );
}

export function AdminShell({
  user,
  activeSection,
  children,
  onSignOut,
  isSigningOut,
}: {
  user: AuthUser;
  activeSection: AdminSection;
  children: ReactNode;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const meta = adminPageMeta[activeSection];

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
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="flex h-24 items-center justify-between border-b border-slate-100 px-7">
            <Link
              href="/"
              className="flex items-center gap-2"
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
              <div className="flex flex-col">
                <span className="font-serif text-[26px] font-bold leading-none tracking-tight text-[#078457]">
                  Investra
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                  Admin Console
                </span>
              </div>
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
            aria-label="Admin dashboard navigation"
          >
            {navigation.map(({ section, label, icon: Icon, badge }) => {
              const active = section === activeSection;
              return (
                <Link
                  key={section}
                  href={adminSectionPath(section)}
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

          <div className="space-y-3 border-t border-slate-100 p-4">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Platform Security
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Logged in with superuser privileges. Audit logging is active.
              </p>
            </div>
            <Link
              href="/faq"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <CircleHelp className="h-[18px] w-[18px]" />
              Help & Docs
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
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
                      {user.firstName || "Administrator"} {user.lastName || ""}
                    </span>
                    <span className="block text-xs font-semibold text-emerald-600">
                      Platform Admin
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
                    className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                  >
                    <Link
                      href="/profile"
                      className="block rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      role="menuitem"
                    >
                      My profile
                    </Link>
                    <Link
                      href="/dashboard/admin/settings"
                      className="block rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      role="menuitem"
                    >
                      Admin settings
                    </Link>
                    <button
                      type="button"
                      onClick={onSignOut}
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
