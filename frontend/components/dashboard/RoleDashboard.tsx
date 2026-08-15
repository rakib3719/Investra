"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Compass,
  FileBarChart,
  FileText,
  Handshake,
  LayoutDashboard,
  Leaf,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import type { AuthUser, PublicUserRole } from "@/lib/auth/types";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";

type NavigationItem = { label: string; icon: LucideIcon; badge?: string };
type Metric = {
  label: string;
  value: string;
  detail: string;
  footer: string;
  icon: LucideIcon;
  action?: string;
};
type Activity = { title: string; description: string; amount: string; date: string; icon: LucideIcon };
type ListItem = { title: string; subtitle: string; value: string; meta: string; tone: "emerald" | "mint" | "slate" };

interface RoleDashboardConfig {
  roleName: string;
  roleDescription: string;
  navigation: NavigationItem[];
  metrics: Metric[];
  chartTitle: string;
  chartSubtitle: string;
  chartValue: string;
  chartChange: string;
  chartLabels: string[];
  allocationTitle: string;
  allocationValue: string;
  allocationLabel: string;
  allocation: { label: string; percentage: string; value: string; color: string }[];
  listTitle: string;
  list: ListItem[];
  activityTitle: string;
  activity: Activity[];
  scoreTitle: string;
  score: string;
  scoreLabel: string;
  scoreCopy: string;
  scoreAction: string;
  ctaTitle: string;
  ctaCopy: string;
  ctaAction: string;
}

const investorNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Portfolio", icon: BriefcaseBusiness },
  { label: "Investments", icon: WalletCards },
  { label: "Opportunities", icon: Compass },
  { label: "Impact", icon: Leaf },
  { label: "Reports", icon: FileBarChart },
  { label: "Watchlist", icon: Bookmark },
  { label: "Messages", icon: MessageSquare, badge: "3" },
  { label: "Settings", icon: Settings },
];

const entrepreneurNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My company", icon: Building2 },
  { label: "Fundraising", icon: Rocket },
  { label: "Investor matches", icon: Users, badge: "8" },
  { label: "Data room", icon: FileText },
  { label: "Analytics", icon: LineChart },
  { label: "Messages", icon: MessageSquare, badge: "5" },
  { label: "Tasks", icon: ClipboardList },
  { label: "Settings", icon: Settings },
];

const consultantNavigation: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Client workspace", icon: Users },
  { label: "Advisory work", icon: Handshake },
  { label: "Deal room", icon: BriefcaseBusiness },
  { label: "Reports", icon: FileBarChart },
  { label: "Calendar", icon: CalendarDays },
  { label: "Messages", icon: MessageSquare, badge: "2" },
  { label: "Earnings", icon: WalletCards },
  { label: "Settings", icon: Settings },
];

const dashboardConfigs: Record<PublicUserRole, RoleDashboardConfig> = {
  INVESTOR: {
    roleName: "Investor",
    roleDescription: "Here’s what’s happening with your portfolio today.",
    navigation: investorNavigation,
    metrics: [
      { label: "Portfolio value", value: "$1,248,750", detail: "Total value", footer: "12.4% vs last 12 months", icon: LineChart },
      { label: "Performance", value: "$137,650", detail: "Total return", footer: "12.4% vs last 12 months", icon: TrendingUp },
      { label: "Funding opportunities", value: "18", detail: "Active opportunities", footer: "Browse opportunities", icon: Leaf, action: "Browse opportunities" },
      { label: "Available to invest", value: "$42,300", detail: "Available balance", footer: "Add funds", icon: WalletCards, action: "Add funds" },
    ],
    chartTitle: "Performance",
    chartSubtitle: "Total return (All time)",
    chartValue: "12.4%",
    chartChange: "Portfolio growth this year",
    chartLabels: ["May ’23", "Aug ’23", "Nov ’23", "Feb ’24", "May ’24", "Aug ’24", "Nov ’24", "Feb ’25", "May ’25"],
    allocationTitle: "Asset allocation",
    allocationValue: "$1,248,750",
    allocationLabel: "Total value",
    allocation: [
      { label: "Private Equity", percentage: "38%", value: "$473,725", color: "#065f46" },
      { label: "Venture Capital", percentage: "28%", value: "$349,250", color: "#10b981" },
      { label: "Impact Funds", percentage: "18%", value: "$224,775", color: "#5ee0bb" },
      { label: "Real Assets", percentage: "10%", value: "$124,875", color: "#a7f3d0" },
      { label: "Cash & Equivalents", percentage: "6%", value: "$75,125", color: "#d1fae5" },
    ],
    listTitle: "Trending opportunities",
    list: [
      { title: "Solstice Energy", subtitle: "Clean energy storage", value: "24.6%", meta: "Series B", tone: "emerald" },
      { title: "AgriNova", subtitle: "Sustainable agriculture", value: "18.3%", meta: "Series A", tone: "mint" },
      { title: "Neurovia", subtitle: "AI for mental health", value: "15.7%", meta: "Series B", tone: "slate" },
    ],
    activityTitle: "Recent activity",
    activity: [
      { title: "Investment completed", description: "Solstice Energy — Series B", amount: "−$25,000", date: "May 20, 2025", icon: ShieldCheck },
      { title: "Distribution received", description: "Impact Fund II", amount: "+$4,320", date: "May 15, 2025", icon: WalletCards },
      { title: "Funds added", description: "Bank transfer", amount: "+$15,000", date: "May 12, 2025", icon: Building2 },
    ],
    scoreTitle: "Impact score",
    score: "86",
    scoreLabel: "Excellent",
    scoreCopy: "You’re in the top 15% of investors on Investra.",
    scoreAction: "View impact report",
    ctaTitle: "Grow your impact",
    ctaCopy: "Discover curated opportunities that align with your values.",
    ctaAction: "Explore opportunities",
  },
  ENTREPRENEUR: {
    roleName: "Entrepreneur",
    roleDescription: "Here’s the latest progress from your fundraising workspace.",
    navigation: entrepreneurNavigation,
    metrics: [
      { label: "Capital committed", value: "$684,000", detail: "of $1.2M target", footer: "57% of round closed", icon: WalletCards },
      { label: "Active investors", value: "24", detail: "In your pipeline", footer: "6 new this month", icon: Users },
      { label: "Profile views", value: "1,482", detail: "Last 30 days", footer: "18.6% vs prior month", icon: TrendingUp },
      { label: "Investor interest", value: "42", detail: "Qualified matches", footer: "Review matches", icon: Handshake, action: "Review matches" },
    ],
    chartTitle: "Fundraising progress",
    chartSubtitle: "Committed capital (All time)",
    chartValue: "57%",
    chartChange: "$142,000 committed this quarter",
    chartLabels: ["Jun ’24", "Aug ’24", "Oct ’24", "Dec ’24", "Feb ’25", "Apr ’25", "Jun ’25"],
    allocationTitle: "Investor pipeline",
    allocationValue: "42",
    allocationLabel: "Qualified matches",
    allocation: [
      { label: "Ready to meet", percentage: "31%", value: "13 investors", color: "#065f46" },
      { label: "In due diligence", percentage: "26%", value: "11 investors", color: "#10b981" },
      { label: "Reviewing", percentage: "24%", value: "10 investors", color: "#5ee0bb" },
      { label: "New matches", percentage: "19%", value: "8 investors", color: "#a7f3d0" },
    ],
    listTitle: "Priority investor matches",
    list: [
      { title: "Northstar Ventures", subtitle: "Climate & infrastructure", value: "98%", meta: "Strong match", tone: "emerald" },
      { title: "Bluefield Capital", subtitle: "Growth equity", value: "94%", meta: "Strong match", tone: "mint" },
      { title: "Mango Seed Fund", subtitle: "Early-stage technology", value: "88%", meta: "New match", tone: "slate" },
    ],
    activityTitle: "Recent activity",
    activity: [
      { title: "Meeting requested", description: "Northstar Ventures", amount: "Tomorrow", date: "10:30 AM", icon: CalendarDays },
      { title: "Data room viewed", description: "Bluefield Capital", amount: "Viewed", date: "2 hours ago", icon: FileText },
      { title: "Profile shortlisted", description: "Mango Seed Fund", amount: "New", date: "Yesterday", icon: Target },
    ],
    scoreTitle: "Readiness score",
    score: "92",
    scoreLabel: "Investor ready",
    scoreCopy: "Your profile is well positioned for the next investor conversation.",
    scoreAction: "Improve profile",
    ctaTitle: "Move your round forward",
    ctaCopy: "Keep your data room current to maintain investor confidence.",
    ctaAction: "Open data room",
  },
  CONSULTANT: {
    roleName: "Consultant",
    roleDescription: "Here’s what needs your attention across client workspaces.",
    navigation: consultantNavigation,
    metrics: [
      { label: "Active clients", value: "16", detail: "Across 4 sectors", footer: "2 new this month", icon: Users },
      { label: "Open mandates", value: "9", detail: "Currently in progress", footer: "3 due this week", icon: ClipboardList },
      { label: "Hours logged", value: "84.5", detail: "This month", footer: "72% of target", icon: CalendarDays },
      { label: "Monthly earnings", value: "$12,840", detail: "Projected payout", footer: "View earnings", icon: WalletCards, action: "View earnings" },
    ],
    chartTitle: "Client engagement",
    chartSubtitle: "Advisory hours (All time)",
    chartValue: "84.5h",
    chartChange: "18.2% more than last month",
    chartLabels: ["Dec ’24", "Jan ’25", "Feb ’25", "Mar ’25", "Apr ’25", "May ’25", "Jun ’25"],
    allocationTitle: "Workload overview",
    allocationValue: "9",
    allocationLabel: "Open mandates",
    allocation: [
      { label: "Strategy reviews", percentage: "34%", value: "3 mandates", color: "#065f46" },
      { label: "Due diligence", percentage: "28%", value: "2 mandates", color: "#10b981" },
      { label: "Fundraising support", percentage: "22%", value: "2 mandates", color: "#5ee0bb" },
      { label: "Reporting", percentage: "16%", value: "2 mandates", color: "#a7f3d0" },
    ],
    listTitle: "Priority client work",
    list: [
      { title: "Verdant Labs", subtitle: "Investment-readiness review", value: "Due", meta: "Today", tone: "emerald" },
      { title: "Solstice Energy", subtitle: "Board reporting pack", value: "Due", meta: "Tomorrow", tone: "mint" },
      { title: "AgriNova", subtitle: "Growth strategy workshop", value: "Thu", meta: "2:00 PM", tone: "slate" },
    ],
    activityTitle: "Upcoming sessions",
    activity: [
      { title: "Portfolio strategy", description: "Verdant Labs", amount: "10:00 AM", date: "Today", icon: CalendarDays },
      { title: "Founder check-in", description: "AgriNova", amount: "2:00 PM", date: "Tomorrow", icon: MessageSquare },
      { title: "Due diligence review", description: "Solstice Energy", amount: "11:30 AM", date: "Thu, May 22", icon: FileBarChart },
    ],
    scoreTitle: "Client satisfaction",
    score: "94",
    scoreLabel: "Excellent",
    scoreCopy: "Your clients consistently rate their advisory experience highly.",
    scoreAction: "View feedback",
    ctaTitle: "Plan your next client win",
    ctaCopy: "Use your workspace to stay ahead of deadlines and conversations.",
    ctaAction: "View calendar",
  },
};

function Initials({ user }: { user: AuthUser }) {
  const initials = `${user.firstName?.[0] ?? user.email[0]}${user.lastName?.[0] ?? ""}`.toUpperCase();
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">{initials}</span>;
}

function Sparkline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 160" className={`h-full w-full ${className}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dashboard-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#10b981" stopOpacity=".22" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 137 L16 128 L30 131 L47 116 L64 121 L82 102 L96 108 L114 87 L130 96 L147 73 L164 81 L181 65 L197 72 L213 55 L231 63 L246 43 L264 51 L279 30 L296 39 L313 26 L331 34 L348 17 L365 25 L380 11 L397 20 L416 5 L440 10 V160 H0 Z" fill="url(#dashboard-chart-fill)" />
      <path d="M0 137 L16 128 L30 131 L47 116 L64 121 L82 102 L96 108 L114 87 L130 96 L147 73 L164 81 L181 65 L197 72 L213 55 L231 63 L246 43 L264 51 L279 30 L296 39 L313 26 L331 34 L348 17 L365 25 L380 11 L397 20 L416 5 L440 10" fill="none" stroke="#078457" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.025)] ${className}`}>{children}</section>;
}

function Sidebar({ config, isOpen, onClose, onSignOut, isSigningOut }: {
  config: RoleDashboardConfig;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
      <div className="flex h-24 items-center justify-between border-b border-slate-100 px-7">
        <Link href="/" className="inline-flex items-center gap-2 text-[27px] font-bold tracking-tight text-[#065f46]" aria-label="Investra home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50"><Leaf className="h-5 w-5 fill-emerald-400 text-[#078457]" /></span>
          <span className="font-serif">Investra</span>
        </Link>
        <button type="button" className="rounded-lg p-2 text-slate-500 lg:hidden" onClick={onClose} aria-label="Close menu"><X className="h-5 w-5" /></button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label={`${config.roleName} dashboard navigation`}>
        {config.navigation.map(({ label, icon: Icon, badge }) => (
          <button key={label} type="button" onClick={onClose} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${label === "Dashboard" ? "bg-emerald-50 text-[#065f46]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
            <Icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{label}</span>
            {badge && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">{badge}</span>}
          </button>
        ))}
      </nav>

      <div className="space-y-4 border-t border-slate-100 p-4">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
          <Leaf className="mb-2 h-5 w-5 text-emerald-600" />
          <p className="text-sm font-bold text-slate-800">{config.ctaTitle}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{config.ctaCopy}</p>
          <button type="button" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#06734d] hover:text-[#064e3b]">{config.ctaAction}<ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
        <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onSignOut} disabled={isSigningOut}>
          {isSigningOut ? <InvestraInlineLoader label="Signing out…" /> : <><LogOut className="h-[18px] w-[18px]" />Sign out</>}
        </button>
      </div>
    </aside>
  );
}

export function RoleDashboard({ user, onSignOut, isSigningOut }: { user: AuthUser; onSignOut: () => void; isSigningOut: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = dashboardConfigs[user.role];
  const firstName = user.firstName || user.email.split("@")[0];

  return (
    <main className="min-h-screen bg-[#fbfdfc] text-slate-900">
      {sidebarOpen && <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden" />}
      <div className="grid min-h-screen lg:grid-cols-[268px_minmax(0,1fr)]">
        <Sidebar config={config} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSignOut={onSignOut} isSigningOut={isSigningOut} />

        <div className="min-w-0">
          <header className="flex min-h-24 items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8 lg:px-9">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Welcome back, {firstName}<Leaf className="h-4 w-4 text-emerald-500" /></h1>
                <p className="mt-1 hidden text-sm text-slate-500 sm:block">{config.roleDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <button type="button" aria-label="Search" className="hidden rounded-xl p-2 text-slate-500 hover:bg-slate-50 md:block"><Search className="h-5 w-5" /></button>
              <button type="button" aria-label="Notifications" className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-50"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" /></button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <button type="button" className="flex items-center gap-2 text-left" aria-label="Open account menu">
                <Initials user={user} />
                <span className="hidden leading-tight md:block"><span className="block text-sm font-bold text-slate-800">{user.firstName || "My account"} {user.lastName || ""}</span><span className="block text-xs text-slate-500">{config.roleName}</span></span>
                <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
              </button>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1540px] px-5 py-7 sm:px-8 lg:px-9 lg:py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{config.roleName} workspace</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">Overview</h2></div>
              <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Time range">
                {["1D", "1W", "1M", "6M", "1Y", "All"].map((range) => <button key={range} type="button" className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${range === "All" ? "bg-emerald-50 text-emerald-800" : "text-slate-500 hover:bg-slate-50"}`}>{range}</button>)}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {config.metrics.map(({ label, value, detail, footer, icon: Icon, action }) => (
                <Card key={label} className="p-5">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-700">{label}</p><p className="mt-3 text-[28px] font-bold tracking-tight text-slate-950">{value}</p><p className="mt-0.5 text-xs text-slate-500">{detail}</p></div><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span></div>
                  <div className="mt-5 flex min-h-8 items-end border-t border-slate-100 pt-3">{action ? <button type="button" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900">{footer}<ArrowRight className="h-3.5 w-3.5" /></button> : <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><TrendingUp className="h-3.5 w-3.5" />{footer}</span>}</div>
                </Card>
              ))}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-12">
              <Card className="overflow-hidden p-5 sm:p-6 xl:col-span-7">
                <div className="flex items-start justify-between gap-4"><div><h3 className="text-base font-bold text-slate-800">{config.chartTitle}</h3><div className="mt-3 flex items-center gap-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700"><TrendingUp className="mr-1 inline h-3.5 w-3.5" />{config.chartValue}</span><span className="text-xs text-slate-500">{config.chartSubtitle}</span></div></div><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">All time<ChevronDown className="h-3.5 w-3.5" /></button></div>
                <div className="relative mt-7 h-56 border-b border-slate-200"><div className="absolute inset-x-0 top-0 flex h-[82%] flex-col justify-between"><span className="border-t border-slate-100" /><span className="border-t border-slate-100" /><span className="border-t border-slate-100" /><span className="border-t border-slate-100" /></div><Sparkline className="relative z-10" /></div>
                <div className="mt-3 flex justify-between gap-2 overflow-hidden text-[10px] font-medium text-slate-500">{config.chartLabels.map((label) => <span key={label} className="shrink-0">{label}</span>)}</div>
                <p className="mt-4 text-xs text-slate-500"><span className="font-bold text-emerald-700">{config.chartChange}</span> · Updated today</p>
              </Card>

              <Card className="p-5 sm:p-6 xl:col-span-5">
                <h3 className="text-base font-bold text-slate-800">{config.allocationTitle}</h3>
                <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-center">
                  <div className="relative mx-auto grid h-40 w-40 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${config.allocation.map((item, index) => `${item.color} ${index === 0 ? 0 : config.allocation.slice(0, index).reduce((total, current) => total + Number.parseInt(current.percentage, 10), 0)}% ${config.allocation.slice(0, index + 1).reduce((total, current) => total + Number.parseInt(current.percentage, 10), 0)}%`).join(", ")})` }}><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center"><span className="block text-lg font-bold tracking-tight text-slate-900">{config.allocationValue}</span><span className="mt-1 block text-[10px] text-slate-500">{config.allocationLabel}</span></div></div>
                  <ul className="min-w-0 flex-1 space-y-3">{config.allocation.map((item) => <li key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 text-xs"><span className="flex min-w-0 items-center gap-2 font-medium text-slate-700"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /> <span className="truncate">{item.label}</span></span><span className="font-semibold text-slate-700">{item.percentage}</span><span className="text-slate-500">{item.value}</span></li>)}</ul>
                </div>
              </Card>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-12">
              <Card className="p-5 xl:col-span-4"><SectionHeader title={config.listTitle} /><div className="mt-4 divide-y divide-slate-100">{config.list.map((item) => <div key={item.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.tone === "emerald" ? "bg-emerald-800 text-white" : item.tone === "mint" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}><Leaf className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{item.title}</span><span className="block truncate text-xs text-slate-500">{item.subtitle}</span></span><span className="text-right"><span className="block text-xs font-bold text-emerald-700">{item.value}</span><span className="block text-[11px] text-slate-500">{item.meta}</span></span></div>)}</div></Card>
              <Card className="p-5 xl:col-span-5"><SectionHeader title={config.activityTitle} /><div className="mt-4 divide-y divide-slate-100">{config.activity.map(({ title, description, amount, date, icon: Icon }) => <div key={`${title}-${date}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-emerald-200 text-emerald-700"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{title}</span><span className="block truncate text-xs text-slate-500">{description}</span></span><span className="text-right"><span className="block whitespace-nowrap text-xs font-bold text-slate-700">{amount}</span><span className="block whitespace-nowrap text-[11px] text-slate-500">{date}</span></span></div>)}</div></Card>
              <Card className="flex flex-col p-5 xl:col-span-3"><SectionHeader title={config.scoreTitle} hideAction /><div className="mx-auto mt-5 grid h-32 w-32 place-items-center rounded-full border-[9px] border-emerald-500 bg-emerald-50/30 text-center"><span><Leaf className="mx-auto h-4 w-4 text-emerald-500" /><strong className="mt-1 block text-2xl font-bold text-slate-900">{config.score}</strong><span className="block text-[10px] text-slate-500">{config.scoreLabel}</span></span></div><p className="mt-5 text-center text-xs leading-5 text-slate-500">{config.scoreCopy}</p><button type="button" className="mt-auto pt-4 text-left text-xs font-bold text-emerald-700">{config.scoreAction} <ArrowRight className="inline h-3.5 w-3.5" /></button></Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title, hideAction = false }: { title: string; hideAction?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-slate-800">{title}</h3>{!hideAction && <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">View all</button>}</div>;
}
