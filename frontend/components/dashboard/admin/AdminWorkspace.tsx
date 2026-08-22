"use client";

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Activity, Globe2, LogOut, MapPin, MonitorSmartphone, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import type { AuthUser } from '@/lib/auth/types';
import { getApiError } from '@/lib/api/client';
import { InvestraInlineLoader, InvestraLoader } from '@/components/ui/InvestraLoader';
import { getAdminVisitorOverview } from '@/lib/admin/visitor-insights-api';

export function AdminWorkspace({
  user,
  onSignOut,
  isSigningOut,
}: {
  user: AuthUser;
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const insights = useQuery({
    queryKey: ['admin', 'visitor-insights'],
    queryFn: getAdminVisitorOverview,
    refetchOnWindowFocus: false,
  });

  const overview = insights.data;
  const error = insights.error ? getApiError(insights.error).message : null;

  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-900">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8"><Link href="/" className="font-serif text-2xl font-bold text-[#078457]">Investra</Link><div className="flex items-center gap-3"><span className="hidden text-right sm:block"><strong className="block text-sm text-slate-800">{user.firstName || 'Administrator'} {user.lastName || ''}</strong><span className="text-xs text-slate-500">Platform administrator</span></span><button type="button" onClick={onSignOut} disabled={isSigningOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">{isSigningOut ? <InvestraInlineLoader label="Signing out…" /> : <><LogOut className="h-4 w-4" />Sign out</>}</button></div></div></header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Administrator workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Visitor insights</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Only visitors who actively allow insights are listed. Precise location appears only after its separate browser permission.</p></div><button type="button" onClick={() => insights.refetch()} disabled={insights.isFetching} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${insights.isFetching ? 'animate-spin' : ''}`} />Refresh</button></div>

        {insights.isLoading ? <div className="grid min-h-80 place-items-center rounded-2xl border border-slate-200 bg-white"><InvestraLoader label="Loading visitor insights" description="Fetching consented visitor information." /></div> : error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div> : overview && <><div className="grid gap-4 sm:grid-cols-3"><Metric icon={Activity} label="Recorded visits" value={overview.summary.totalRecordedVisits} /><Metric icon={Users} label="Unique opted-in visitors" value={overview.summary.uniqueOptedInVisitors} /><Metric icon={MapPin} label="Visits sharing location" value={overview.summary.visitsWithLocation} /></div><section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="text-base font-bold text-slate-800">Latest consented visits</h2><p className="mt-1 text-xs text-slate-500">IP addresses and raw user-agent strings are not displayed or stored.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800"><ShieldCheck className="h-3.5 w-3.5" />Consent-based</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Visited</th><th className="px-4 py-3">Browser / OS</th><th className="px-4 py-3">Device</th><th className="px-4 py-3">Locale</th><th className="px-4 py-3">Screen</th><th className="px-4 py-3">Referrer</th><th className="px-5 py-3">Location</th></tr></thead><tbody className="divide-y divide-slate-100">{overview.visitors.length === 0 ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">No visitor has opted in yet.</td></tr> : overview.visitors.map((visitor) => <tr key={visitor.id} className="hover:bg-emerald-50/30"><td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(visitor.visitedAt).toLocaleString()}</td><td className="px-4 py-4"><strong className="block text-slate-800">{visitor.browser}</strong><span className="text-slate-500">{visitor.operatingSystem}</span></td><td className="px-4 py-4"><span className="inline-flex items-center gap-1.5 text-slate-700"><MonitorSmartphone className="h-3.5 w-3.5 text-emerald-700" />{visitor.device}</span></td><td className="px-4 py-4"><strong className="block text-slate-700">{visitor.language}</strong><span className="text-slate-500">{visitor.timezone}</span></td><td className="px-4 py-4 text-slate-600">{visitor.screen}<span className="block text-slate-400">viewport {visitor.viewport}</span></td><td className="max-w-52 truncate px-4 py-4 text-slate-600" title={visitor.referrer}>{visitor.referrer}</td><td className="px-5 py-4">{visitor.location ? <span className="inline-flex items-center gap-1.5 text-emerald-800"><Globe2 className="h-3.5 w-3.5" />{visitor.location.latitude.toFixed(4)}, {visitor.location.longitude.toFixed(4)}<span className="text-slate-400">±{visitor.location.accuracyMeters ?? '?'}m</span></span> : <span className="text-slate-400">Not shared</span>}</td></tr>)}</tbody></table></div></section></>}</div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><strong className="mt-4 block text-3xl tracking-tight text-slate-950">{value.toLocaleString()}</strong><span className="mt-1 block text-xs font-semibold text-slate-500">{label}</span></section>;
}
