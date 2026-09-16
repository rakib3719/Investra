import { ArrowRight, BriefcaseBusiness, CircleDollarSign, Download, PieChart, TrendingUp, WalletCards } from "lucide-react";
import { InvestorLineChart, MetricCard, Panel, ProgressBar, SectionHeading, StatusPill } from "../InvestorUI";

const holdings = [
  { name: "Solstice Energy", type: "Private equity", invested: "$185,000", value: "$238,650", returnValue: "+29.0%", allocation: 19.1, status: "Active" },
  { name: "Impact Fund II", type: "Impact fund", invested: "$210,000", value: "$224,775", returnValue: "+7.0%", allocation: 18, status: "Income" },
  { name: "AgriNova", type: "Venture capital", invested: "$145,000", value: "$192,850", returnValue: "+33.0%", allocation: 15.4, status: "Active" },
  { name: "GreenBuild REIT", type: "Real assets", invested: "$120,000", value: "$124,875", returnValue: "+4.1%", allocation: 10, status: "Income" },
  { name: "Neurovia", type: "Venture capital", invested: "$95,000", value: "$108,400", returnValue: "+14.1%", allocation: 8.7, status: "Active" },
];

export function PortfolioPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Current portfolio value</p><div className="mt-1 flex items-end gap-3"><h2 className="text-4xl font-bold tracking-[-0.04em] text-slate-950">$1,248,750</h2><StatusPill>+$137,650</StatusPill></div></div><button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700"><Download className="h-4 w-4" />Export portfolio</button></div>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Invested capital" value="$1,068,800" detail="Across 12 positions" change="$50,000 deployed this quarter" icon={BriefcaseBusiness} />
        <MetricCard label="Unrealized gains" value="$112,430" detail="Before fees and tax" change="10.5% gain" icon={TrendingUp} />
        <MetricCard label="Income received" value="$25,220" detail="Distributions to date" change="$4,320 this month" icon={CircleDollarSign} />
        <MetricCard label="Cash allocation" value="$42,300" detail="3.4% of portfolio" change="Within target range" trend="neutral" icon={WalletCards} />
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Panel className="p-6 xl:col-span-8"><SectionHeading title="Value over time" description="Portfolio value including distributions" action={<select className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"><option>All holdings</option><option>Private equity</option><option>Funds</option></select>} /><div className="mt-5"><InvestorLineChart /></div><div className="flex justify-between text-[10px] text-slate-400"><span>May ’23</span><span>Nov ’23</span><span>May ’24</span><span>Nov ’24</span><span>May ’25</span></div></Panel>
        <Panel className="p-6 xl:col-span-4"><SectionHeading title="Diversification health" description="Your portfolio is well balanced" /><div className="mx-auto mt-6 grid h-36 w-36 place-items-center rounded-full border-[12px] border-emerald-500 border-r-emerald-100 text-center"><span><strong className="block text-3xl text-slate-950">82</strong><span className="text-xs text-slate-500">Strong</span></span></div><div className="mt-6 space-y-4">{[{ label: "Asset mix", value: 86 }, { label: "Sector spread", value: 78 }, { label: "Liquidity", value: 72 }].map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold text-slate-600">{item.label}</span><span className="font-bold text-slate-800">{item.value}%</span></div><ProgressBar value={item.value} /></div>)}</div></Panel>
      </div>

      <Panel className="overflow-hidden">
        <div className="p-5 sm:p-6"><SectionHeading title="Holdings" description="Your five largest positions" action={<div className="flex gap-2"><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Filter</button><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">Sort</button></div>} /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3 font-bold">Holding</th><th className="px-4 py-3 font-bold">Invested</th><th className="px-4 py-3 font-bold">Current value</th><th className="px-4 py-3 font-bold">Return</th><th className="px-4 py-3 font-bold">Allocation</th><th className="px-6 py-3 text-right font-bold">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{holdings.map((holding) => <tr key={holding.name} className="hover:bg-emerald-50/20"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><PieChart className="h-4 w-4" /></span><span><strong className="block text-sm text-slate-800">{holding.name}</strong><span className="text-slate-500">{holding.type}</span></span></div></td><td className="px-4 py-4 font-semibold text-slate-600">{holding.invested}</td><td className="px-4 py-4 font-bold text-slate-800">{holding.value}</td><td className="px-4 py-4 font-bold text-emerald-700">{holding.returnValue}</td><td className="px-4 py-4"><div className="flex items-center gap-2"><ProgressBar value={holding.allocation * 3} className="w-16" /><span className="font-semibold text-slate-600">{holding.allocation}%</span></div></td><td className="px-6 py-4 text-right"><StatusPill tone={holding.status === "Income" ? "blue" : "green"}>{holding.status}</StatusPill></td></tr>)}</tbody></table></div>
        <button type="button" className="flex w-full items-center justify-center gap-2 border-t border-slate-100 py-4 text-xs font-bold text-emerald-700">View all 12 holdings <ArrowRight className="h-3.5 w-3.5" /></button>
      </Panel>
    </div>
  );
}
