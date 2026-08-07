"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  Scale, 
  Check, 
  X, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Building2, 
  BarChart3, 
  Bookmark, 
  Sparkles, 
  Plus, 
  Trash2,
  ArrowRight,
  Info
} from "lucide-react";

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  stage: string;
  valuation: string;
  targetFund: string;
  raisedAmount: string;
  raisedPercentage: number;
  projectedIRR: string;
  minInvestment: string;
  esgRating: string;
  revenueModel: string;
  bookmarks: number;
  premiumOnly: boolean;
  image: string;
}

const mockBusinesses: BusinessItem[] = [
  {
    id: "b1",
    name: "SolarGrid Bangladesh Ltd",
    category: "Clean Energy",
    stage: "Series A",
    valuation: "$4.5M",
    targetFund: "$1,200,000",
    raisedAmount: "$840,000",
    raisedPercentage: 70,
    projectedIRR: "18.5%",
    minInvestment: "$5,000",
    esgRating: "AAA",
    revenueModel: "PPA & Subscription",
    bookmarks: 142,
    premiumOnly: false,
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "b2",
    name: "FinFlow Micro-Credit API",
    category: "Fintech",
    stage: "Seed",
    valuation: "$2.8M",
    targetFund: "$600,000",
    raisedAmount: "$480,000",
    raisedPercentage: 80,
    projectedIRR: "24.0%",
    minInvestment: "$2,500",
    esgRating: "AA",
    revenueModel: "Transaction Fee (1.5%)",
    bookmarks: 98,
    premiumOnly: false,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "b3",
    name: "AgriTech Logistics Hub",
    category: "Agri-Supply",
    stage: "Pre-Series A",
    valuation: "$6.0M",
    targetFund: "$2,000,000",
    raisedAmount: "$1,100,000",
    raisedPercentage: 55,
    projectedIRR: "21.2%",
    minInvestment: "$10,000",
    esgRating: "AAA",
    revenueModel: "Commission & SaaS",
    bookmarks: 215,
    premiumOnly: true,
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"
  }
];

export default function BusinessComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["b1", "b2", "b3"]);

  const selectedBusinesses = mockBusinesses.filter((b) => selectedIds.includes(b.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Header Hero Banner - High-End 2-Column Showcase */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Pitch Matrix</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Compare Opportunities.<br />
              Analyze Financial Yields,<br />
              <ShinyText text="Invest With Confidence." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Evaluate key financial yield metrics, valuation multiples, ESG ratings, and projected IRR side-by-side to make confident investment decisions.
            </p>

            <div className="pt-2">
              <Link href="/subscription" className="inline-block bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs">
                Unlock Pro Comparison
              </Link>
            </div>
          </div>

          {/* Right Column - Image Card */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
              alt="Business Comparison Matrix"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-12 flex-1 space-y-8">
        
        {/* Deal Selector Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-slate-800">
                Select Up to 3 Startup Opportunities
              </h3>
              <p className="text-xs text-slate-500 font-body">
                Click deals to add or remove them from the active comparison matrix.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {mockBusinesses.map((b) => {
                const isSelected = selectedIds.includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => toggleSelect(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#064e3b] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{b.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparison Table / Cards Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="p-5 font-heading text-xs font-black uppercase text-slate-400 w-1/4">
                    Comparison Metrics
                  </th>
                  {selectedBusinesses.map((b) => (
                    <th key={b.id} className="p-5 w-1/4 border-l border-slate-100">
                      <div className="space-y-3">
                        <div className="h-28 rounded-xl overflow-hidden relative">
                          <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#064e3b] text-white text-[9px] font-bold rounded-md">
                            {b.stage}
                          </span>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-heading font-extrabold text-sm text-slate-800 leading-snug">
                              {b.name}
                            </h4>
                            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                              {b.category}
                            </span>
                          </div>
                          {selectedIds.length > 1 && (
                            <button
                              onClick={() => toggleSelect(b.id)}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-body text-slate-700">
                {/* Metric 1: Valuation */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#064e3b]" />
                      <span>Post-Money Valuation</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100 font-extrabold text-slate-900 text-sm font-heading">
                      {b.valuation}
                    </td>
                  ))}
                </tr>

                {/* Metric 2: Target Capital & Progress */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#064e3b]" />
                      <span>Target Fund Raise</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100">
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-800">{b.targetFund}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#10b981] h-full rounded-full"
                              style={{ width: `${b.raisedPercentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#064e3b]">{b.raisedPercentage}%</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Raised: {b.raisedAmount}</div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Metric 3: Projected IRR% */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#10b981]" />
                      <span>Projected Target IRR</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100 font-black text-[#064e3b] text-base font-heading">
                      {b.projectedIRR}
                    </td>
                  ))}
                </tr>

                {/* Metric 4: Minimum Ticket */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#064e3b]" />
                      <span>Minimum Ticket Size</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100 font-bold text-slate-800">
                      {b.minInvestment}
                    </td>
                  ))}
                </tr>

                {/* Metric 5: ESG Rating */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#064e3b]" />
                      <span>ESG Sustainability Audit</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-[#10b981]/15 text-[#064e3b]">
                        Rating {b.esgRating}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Metric 6: Revenue Model */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#064e3b]" />
                      <span>Monetization Model</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100 font-medium text-slate-600">
                      {b.revenueModel}
                    </td>
                  ))}
                </tr>

                {/* Metric 7: Bookmarks & Social Proof */}
                <tr>
                  <td className="p-5 font-heading font-bold text-slate-800 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#064e3b]" />
                      <span>Investor Interest</span>
                    </div>
                  </td>
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900">{b.bookmarks}</span> Investors Bookmarked
                    </td>
                  ))}
                </tr>

                {/* Metric 8: Actions */}
                <tr>
                  <td className="p-5 bg-slate-50/40" />
                  {selectedBusinesses.map((b) => (
                    <td key={b.id} className="p-5 border-l border-slate-100">
                      <Link
                        href={`/funds`}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064e3b] text-white text-xs font-bold font-heading hover:bg-[#043c2e] transition-colors shadow-xs"
                      >
                        <span>Request Access</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#10b981]" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Subscription Upgrade Callout */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#10b981] font-heading font-extrabold text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Unlimited Deals Comparison</span>
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold">
              Want deep due diligence & custom CSV exports?
            </h3>
            <p className="text-xs md:text-sm text-slate-200 max-w-xl font-body">
              Upgrade to the Investor Pro subscription tier to unlock unlimited business comparisons, direct chat with Uddokta founders, and financial audit files.
            </p>
          </div>

          <Link
            href="/subscription"
            className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold px-6 py-3 rounded-xl text-xs transition-all duration-200 shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Explore Subscription Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
