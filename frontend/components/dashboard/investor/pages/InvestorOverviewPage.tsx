import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Leaf,
  LineChart,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  InvestorLineChart,
  MetricCard,
  Panel,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "../InvestorUI";

const allocation = [
  { label: "Private equity", value: "$473,725", percentage: 38, color: "#065f46" },
  { label: "Venture capital", value: "$349,250", percentage: 28, color: "#10b981" },
  { label: "Impact funds", value: "$224,775", percentage: 18, color: "#5ee0bb" },
  { label: "Real assets", value: "$124,875", percentage: 10, color: "#a7f3d0" },
  { label: "Cash", value: "$75,125", percentage: 6, color: "#d1fae5" },
];

const opportunities = [
  { name: "Solstice Energy", sector: "Clean energy storage", returnValue: "24.6%", stage: "Series B", tone: "bg-emerald-900" },
  { name: "AgriNova", sector: "Sustainable agriculture", returnValue: "18.3%", stage: "Series A", tone: "bg-emerald-600" },
  { name: "Neurovia", sector: "AI for mental health", returnValue: "15.7%", stage: "Series B", tone: "bg-slate-800" },
];

export function InvestorOverviewPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Total portfolio balance</p>
          <div className="mt-1 flex items-end gap-3"><h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">$1,248,750</h2><StatusPill>+12.4%</StatusPill></div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/investor/reports" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">View reports</Link>
          <Link href="/dashboard/investor/opportunities" className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#044c38]">Explore deals <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Portfolio value" value="$1,248,750" detail="Across 12 positions" change="12.4% over 12 months" icon={LineChart} />
        <MetricCard label="Total return" value="$137,650" detail="Realized + unrealized" change="4.8% this quarter" icon={TrendingUp} />
        <MetricCard label="Active opportunities" value="18" detail="6 match your preferences" change="3 added this week" icon={Leaf} />
        <MetricCard label="Available to invest" value="$42,300" detail="Cleared cash balance" change="Ready to deploy" trend="neutral" icon={WalletCards} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-5 sm:p-6 xl:col-span-7">
          <SectionHeading title="Portfolio performance" description="Total value across all holdings" action={<select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none"><option>All time</option><option>1 year</option><option>6 months</option></select>} />
          <div className="mt-5 flex items-center gap-3"><span className="text-2xl font-bold text-slate-950">$1.25M</span><StatusPill>+$137,650</StatusPill></div>
          <div className="mt-3"><InvestorLineChart /></div>
          <div className="flex justify-between text-[10px] font-medium text-slate-400"><span>May ’23</span><span>Nov ’23</span><span>May ’24</span><span>Nov ’24</span><span>May ’25</span></div>
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-5">
          <SectionHeading title="Asset allocation" description="Diversification by investment type" action={<Link href="/dashboard/investor/portfolio" className="text-xs font-bold text-emerald-700">Details</Link>} />
          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#065f46 0 38%, #10b981 38% 66%, #5ee0bb 66% 84%, #a7f3d0 84% 94%, #d1fae5 94% 100%)" }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center"><span><strong className="block text-xl text-slate-950">$1.25M</strong><span className="text-[10px] text-slate-500">Total value</span></span></div></div>
            <div className="w-full space-y-3">{allocation.map((item) => <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 text-xs"><span className="flex items-center gap-2 font-medium text-slate-700"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><span className="text-right"><strong className="text-slate-700">{item.percentage}%</strong><span className="ml-2 text-slate-400">{item.value}</span></span></div>)}</div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-4">
          <SectionHeading title="Trending opportunities" action={<Link href="/dashboard/investor/opportunities" className="text-xs font-bold text-emerald-700">View all</Link>} />
          <div className="mt-4 divide-y divide-slate-100">{opportunities.map((item) => <div key={item.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${item.tone}`}><Leaf className="h-4 w-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-800">{item.name}</strong><span className="block truncate text-xs text-slate-500">{item.sector}</span></span><span className="text-right"><strong className="block text-xs text-emerald-700">↑ {item.returnValue}</strong><span className="text-[10px] text-slate-400">{item.stage}</span></span></div>)}</div>
        </Panel>

        <Panel className="p-5 xl:col-span-5">
          <SectionHeading title="Recent activity" action={<button className="text-xs font-bold text-emerald-700" type="button">View all</button>} />
          <div className="mt-4 divide-y divide-slate-100">
            {[
              { icon: ShieldCheck, title: "Investment completed", detail: "Solstice Energy — Series B", value: "−$25,000", date: "May 20" },
              { icon: WalletCards, title: "Distribution received", detail: "Impact Fund II", value: "+$4,320", date: "May 15" },
              { icon: Building2, title: "Funds added", detail: "Verified bank transfer", value: "+$15,000", date: "May 12" },
            ].map(({ icon: Icon, title, detail, value, date }) => <div key={title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="grid h-9 w-9 place-items-center rounded-full border border-emerald-200 text-emerald-700"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-800">{title}</strong><span className="block truncate text-xs text-slate-500">{detail}</span></span><span className="text-right"><strong className="block text-xs text-slate-700">{value}</strong><span className="text-[10px] text-slate-400">{date}</span></span></div>)}
          </div>
        </Panel>

        <Panel className="flex flex-col p-5 xl:col-span-3">
          <SectionHeading title="Impact score" />
          <div className="mx-auto mt-5 grid h-32 w-32 place-items-center rounded-full border-[9px] border-emerald-500 bg-emerald-50/50 text-center"><span><Leaf className="mx-auto h-4 w-4 text-emerald-500" /><strong className="mt-1 block text-2xl text-slate-950">86</strong><span className="text-[10px] text-slate-500">Excellent</span></span></div>
          <p className="mt-4 text-center text-xs leading-5 text-slate-500">Your capital supports 8 measurable impact outcomes.</p>
          <ProgressBar value={86} className="mt-4" />
          <Link href="/dashboard/investor/impact" className="mt-5 inline-flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">View impact report <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Panel>
      </div>

      <Panel className="flex flex-col gap-4 bg-gradient-to-r from-[#064e3b] to-[#087252] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><CalendarDays className="h-5 w-5" /></span><div><h3 className="font-bold">Quarterly portfolio review</h3><p className="mt-1 text-xs text-emerald-100">Your advisor has prepared a new review for June 28, 2025.</p></div></div>
        <button type="button" className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900">Schedule review</button>
      </Panel>
    </div>
  );
}
