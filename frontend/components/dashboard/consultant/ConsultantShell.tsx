"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
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
  { section: "profile", label: "My Profile", icon: User },
  { section: "kyc", label: "Identity & KYC", icon: ShieldCheck },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const meta = consultantPageMeta[activeSection];
  const firstName = user.firstName || user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {mobileMenuOpen && (
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          aria-label="Close navigation overlay"
        />
      )}

      <div className="grid min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-black text-[#064e3b]"
              aria-label="Investra home"
            >
              <Image
                src="/investra-logo.png"
                alt="Investra"
                width={1254}
                height={1254}
                className="h-8 w-8 object-contain"
                priority
              />
              <span className="font-heading">Investra</span>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 hover:text-slate-600 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Consultant dashboard navigation">
            {navigation.map(({ section, label, icon: Icon, badge }) => {
              const active = activeSection === section;
              return (
                <Link
                  key={section}
                  href={consultantSectionPath(section)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-emerald-300" : "text-slate-400"}`} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={onSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <InvestraInlineLoader label="Signing out…" />
              ) : (
                <>
                  <LogOut className="h-4 w-4 text-slate-400" />
                  Sign out
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                  {meta.title}
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {meta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <div className="hidden sm:block text-left">
                  <p className="font-heading font-bold text-xs text-slate-900">
                    {user.firstName || "Consultant"} {user.lastName || ""}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-700">
                    Verified Advisor
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
