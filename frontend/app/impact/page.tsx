"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  BarChart3, 
  UserCheck,
  Zap,
  ArrowUpRight
} from "lucide-react";

interface VentureProject {
  id: number;
  name: string;
  location: string;
  type: "FinTech" | "SaaS" | "HealthTech" | "Logistics";
  metric: string;
  metricLabel: string;
  status: "Funding Active" | "Target Reached" | "Vetting Phase";
  investors: number;
  lastUpdated: string;
}

const activeVentures: VentureProject[] = [
  {
    id: 1,
    name: "Apex FinTech Solutions",
    location: "Dhaka, Bangladesh",
    type: "FinTech",
    metric: "$780,000",
    metricLabel: "Capital Deployed",
    status: "Funding Active",
    investors: 42,
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    name: "ProDocs SaaS HR Platform",
    location: "Silicon Valley, USA",
    type: "SaaS",
    metric: "$612,000",
    metricLabel: "Capital Deployed",
    status: "Target Reached",
    investors: 98,
    lastUpdated: "1 day ago"
  },
  {
    id: 3,
    name: "MedVitals Telehealth Node",
    location: "Munich, Germany",
    type: "HealthTech",
    metric: "$400,000",
    metricLabel: "Capital Deployed",
    status: "Funding Active",
    investors: 64,
    lastUpdated: "4 hours ago"
  },
  {
    id: 4,
    name: "CargoSwift Automated Logistics",
    location: "Singapore",
    type: "Logistics",
    metric: "$495,000",
    metricLabel: "Capital Deployed",
    status: "Vetting Phase",
    investors: 36,
    lastUpdated: "3 days ago"
  }
];

export default function ImpactPage() {
  const [investmentVal, setInvestmentVal] = useState<number>(5000);

  // Calculates networking matched parameters dynamically based on investment size
  const calculatedImpact = useMemo(() => {
    return {
      pitches: Math.round(investmentVal * 0.05),
      matches: Math.round(investmentVal * 0.008),
      hours: Math.round(investmentVal * 0.002) || 1
    };
  }, [investmentVal]);

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-20">
        
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Ecosystem Transparency
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Ecosystem Outcomes, <br />
              <ShinyText text="Verified Venture Statistics" speed={4.5} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Every connection and dollar deployed on Investra drives business expansion. Through strict entrepreneur vetting, independent audits, and real-time dashboard analytics, we ensure complete ecosystem transparency.
            </p>
          </div>
        </section>

        {/* Live Metrics Grid */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <span className="p-3 rounded-2xl bg-[#064e3b]/5 text-[#064e3b]">
                  <Briefcase className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Businesses Funded
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-heading font-black text-secondary">142</h3>
                <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider mt-1">Vetted Startups Scaled</p>
              </div>
            </SpotlightCard>

            {/* Metric 2 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <span className="p-3 rounded-2xl bg-[#064e3b]/5 text-[#064e3b]">
                  <Users className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Active Investors
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-heading font-black text-secondary">1,240</h3>
                <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider mt-1">Allocating Capital Globally</p>
              </div>
            </SpotlightCard>

            {/* Metric 3 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <span className="p-3 rounded-2xl bg-[#064e3b]/5 text-[#064e3b]">
                  <UserCheck className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Elite Advisors
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-heading font-black text-secondary">450+</h3>
                <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider mt-1">Consultants Monetizing</p>
              </div>
            </SpotlightCard>

            {/* Metric 4 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <span className="p-3 rounded-2xl bg-[#064e3b]/5 text-[#064e3b]">
                  <Globe className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Capital Allocated
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-heading font-black text-secondary">$48.2M</h3>
                <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider mt-1">Transacted Deploys</p>
              </div>
            </SpotlightCard>

          </div>
        </section>

        {/* Interactive Impact Calculator */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24">
          <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Side: Inputs */}
            <div className="lg:col-span-6 p-8 md:p-12 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-heading">
                  Interactive Simulator
                </span>
                <h2 className="text-2xl font-heading font-black text-secondary">
                  Simulate Your Networking Reach
                </h2>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Adjust the slider to simulate your planned portfolio deployment size. View projected business matches and mentorship hours calculated dynamically.
                </p>
              </div>

              {/* Slider Input */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 font-heading">Planned Portfolio Size</span>
                  <span className="text-lg font-black text-primary">${investmentVal.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={investmentVal}
                  onChange={(e) => setInvestmentVal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-body">
                  <span>Min: $500</span>
                  <span>Max: $100,000</span>
                </div>
              </div>
            </div>

            {/* Right Side: Calculated Outputs */}
            <div className="lg:col-span-6 bg-[#064e3b]/5 p-8 md:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 gap-8">
              
              <div className="grid grid-cols-3 gap-4">
                {/* Out 1 */}
                <div className="space-y-2 text-center lg:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center mx-auto lg:mx-0 shadow-xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-secondary">{calculatedImpact.pitches}</h3>
                    <p className="text-[9px] text-slate-400 font-body uppercase tracking-wider mt-0.5">Pitches Unlocked</p>
                  </div>
                </div>

                {/* Out 2 */}
                <div className="space-y-2 text-center lg:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center mx-auto lg:mx-0 shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-secondary">{calculatedImpact.matches}</h3>
                    <p className="text-[9px] text-slate-400 font-body uppercase tracking-wider mt-0.5">Startup Matches</p>
                  </div>
                </div>

                {/* Out 3 */}
                <div className="space-y-2 text-center lg:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center mx-auto lg:mx-0 shadow-xs">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-secondary">{calculatedImpact.hours} hrs</h3>
                    <p className="text-[9px] text-slate-400 font-body uppercase tracking-wider mt-0.5">Consultant Hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/50 p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[10px] text-slate-500 font-body leading-relaxed">
                  Estimates are generated based on average matchmaking cycles and active advisor feedback rates on the platform.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* Active Telemetry Projects */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
                Monitored Milestones
              </span>
              <h2 className="text-3xl font-heading font-black text-secondary">
                Featured Active Ventures
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-body max-w-sm leading-relaxed">
              Below are the active startup campaigns funded on Investra. Statuses represent underwriting milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeVentures.map((site) => (
              <SpotlightCard 
                key={site.id} 
                spotlightColor="rgba(16, 185, 129, 0.08)"
                className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow duration-300"
              >
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {site.type}
                    </span>
                    <h3 className="text-base font-heading font-black text-secondary mt-1.5">{site.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-body">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{site.location}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold font-heading px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    site.status === "Funding Active" 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                      : site.status === "Target Reached"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-slate-50 text-slate-500 border border-slate-200"
                  }`}>
                    {site.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center md:text-left">
                  <div>
                    <span className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">{site.metricLabel}</span>
                    <h4 className="text-sm font-black text-secondary mt-0.5">{site.metric}</h4>
                    <p className="text-[9px] text-slate-400 font-body leading-none">Vetted Allocation</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">Investors backed</span>
                    <h4 className="text-sm font-black text-secondary mt-0.5">{site.investors}</h4>
                    <p className="text-[9px] text-slate-400 font-body leading-none">Direct Connections</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">Last Activity</span>
                    <h4 className="text-sm font-black text-secondary mt-0.5">{site.lastUpdated}</h4>
                    <p className="text-[9px] text-slate-400 font-body leading-none">Verification Cycle</p>
                  </div>
                </div>

              </SpotlightCard>
            ))}
          </div>

        </section>

        {/* ESG Audit Board & Vetting framework */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24">
          <div className="bg-[#064e3b] text-white rounded-[32px] p-8 md:p-12 space-y-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
            
            <div className="max-w-xl space-y-3 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-heading">
                Underwriting & Vetting
              </span>
              <h2 className="text-3xl font-heading font-extrabold leading-tight">
                Our Rigorous Multi-Stage Pitch Vetting Framework
              </h2>
              <p className="text-xs md:text-sm text-emerald-100 font-body leading-relaxed">
                Before any entrepreneur campaign goes live, it must pass strict auditing hurdles overseen by our risk analysts and legal advisors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold">1</div>
                <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">Financial Feasibility</h3>
                <p className="text-[11px] text-emerald-100/80 font-body leading-relaxed">
                  We audit cash-flow projections, debt margins, and valuation modeling to ensure investment safety.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold">2</div>
                <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">KYC & Compliance checks</h3>
                <p className="text-[11px] text-emerald-100/80 font-body leading-relaxed">
                  Verify business registrations, executive track records, and operational legitimacy prior to listing.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 font-bold">3</div>
                <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">Dashboard Integration</h3>
                <p className="text-[11px] text-emerald-100/80 font-body leading-relaxed">
                  Startups must integrate financial and active user APIs, granting investors live data feeds on their dashboard.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
