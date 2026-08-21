"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight 
} from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  category: string;
  risk: "Low" | "Medium" | "High";
  pitch: string;
  entrepreneur: string;
  avatar: string;
  image: string;
  target: number;
  raised: number;
  irr: number;
  minInvest: number;
  impactMetric: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Apex FinTech Core Banking API",
    category: "FinTech",
    risk: "Low",
    pitch: "Next-gen banking infrastructure API and transaction processing layer for micro-merchants in emerging markets.",
    entrepreneur: "Tariqul Islam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    target: 1200000,
    raised: 780000,
    irr: 18.5,
    minInvest: 2500,
    impactMetric: "40K Active Merchants"
  },
  {
    id: 2,
    title: "ProDocs SaaS HR Automation",
    category: "SaaS",
    risk: "Medium",
    pitch: "Automated compliance, custom payroll pipelines, and healthcare benefits for remote-first borderless workforces.",
    entrepreneur: "Mominul Haque",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    target: 850000,
    raised: 612000,
    irr: 22.4,
    minInvest: 5000,
    impactMetric: "120 Active Accounts"
  },
  {
    id: 3,
    title: "MedVitals Telehealth Node Network",
    category: "HealthTech",
    risk: "High",
    pitch: "AI-driven remote patient monitoring, vitals streaming hardware, and instant specialist consultations.",
    entrepreneur: "Lina Chowdhury",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    target: 2000000,
    raised: 400000,
    irr: 24.2,
    minInvest: 10000,
    impactMetric: "18% Care Speed Boost"
  },
  {
    id: 4,
    title: "Bio-Circular Agri Supply Chain",
    category: "AgriTech",
    risk: "Low",
    pitch: "Connecting independent organic growers directly to regional retail pipelines, minimizing food waste.",
    entrepreneur: "Rafiq Hasan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80",
    target: 450000,
    raised: 382500,
    irr: 15.6,
    minInvest: 1000,
    impactMetric: "1.2K Farms Linked"
  },
  {
    id: 5,
    title: "Zephyr CleanTech Smart Grid",
    category: "CleanTech",
    risk: "Medium",
    pitch: "Power transmission grid monitoring software dynamically balancing load anomalies to reduce overheads.",
    entrepreneur: "Elena Petrova",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
    target: 3500000,
    raised: 2800000,
    irr: 16.5,
    minInvest: 25000,
    impactMetric: "8.4 MW Power Balanced"
  },
  {
    id: 6,
    title: "CargoSwift Automated Logistics",
    category: "Logistics",
    risk: "Medium",
    pitch: "Real-time shipping route optimization engine and empty cargo sharing model for heavy logistics carriers.",
    entrepreneur: "Rahim Al-Mansoori",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    target: 1100000,
    raised: 495000,
    irr: 19.0,
    minInvest: 5000,
    impactMetric: "1.2M Miles Saved/mo"
  }
];

const categories = ["All", "FinTech", "SaaS", "AgriTech", "HealthTech", "CleanTech", "Logistics"];


export default function FundsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesCategory = selectedCategory === "All" || campaign.category === selectedCategory;
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            campaign.pitch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            campaign.entrepreneur.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="w-full pb-20">
        
        {/* Header Hero Section */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Venture Hub & Green Funds
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Empowering Capital, Fueling <br />
              <ShinyText text="Sustainable Growth" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Connect directly with vetted climate entrepreneurs, forestry developers, and clean tech innovators. Review verified ESG impacts, monitor transparent yields, and build a high-performance carbon-smart portfolio.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs flex flex-col lg:flex-row gap-6 justify-between items-center">
            
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search ventures, developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-none focus:border-primary/50 transition-colors font-body text-slate-800"
              />
            </div>

          </div>
        </section>

        {/* Opportunities Grid Section */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((camp) => {
                const percentRaised = Math.min(Math.round((camp.raised / camp.target) * 100), 100);
                
                return (
                  <SpotlightCard
                    key={camp.id}
                    spotlightColor="rgba(16, 185, 129, 0.08)"
                    className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[510px]"
                  >
                    
                    {/* Top Content */}
                    <div className="space-y-4">
                      {/* Image & Badges */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={camp.image}
                          alt={camp.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-primary text-white text-[9px] font-bold font-heading px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {camp.category}
                          </span>
                          <span className={`text-white text-[9px] font-bold font-heading px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            camp.risk === "Low" ? "bg-emerald-600" : camp.risk === "Medium" ? "bg-amber-600" : "bg-rose-600"
                          }`}>
                            {camp.risk} Risk
                          </span>
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="px-6 space-y-2">
                        <h3 className="text-base font-heading font-extrabold text-secondary hover:text-primary transition-colors line-clamp-1">
                          {camp.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-body leading-relaxed line-clamp-2 h-9">
                          {camp.pitch}
                        </p>
                      </div>
                    </div>

                    {/* Progress, Stats & CTA */}
                    <div className="px-6 pb-6 pt-4 space-y-4 border-t border-slate-100 bg-slate-50/30">
                      
                      {/* Funding Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Funded: {percentRaised}%</span>
                          <span className="text-primary">${camp.raised.toLocaleString()} / ${camp.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentRaised}%` }}
                          />
                        </div>
                      </div>

                      {/* Metrics Panel */}
                      <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200/50 rounded-2xl p-3 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">Est. IRR</p>
                          <p className="text-xs font-black text-emerald-600 mt-0.5">{camp.irr}%</p>
                        </div>
                        <div className="border-x border-slate-100">
                          <p className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">Min. Invest</p>
                          <p className="text-xs font-black text-secondary mt-0.5">${camp.minInvest.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-heading uppercase tracking-wider">Impact</p>
                          <p className="text-[9px] font-bold text-primary mt-1 leading-none truncate px-1" title={camp.impactMetric}>
                            {camp.impactMetric.split(" ")[0]} {camp.impactMetric.split(" ")[1]}
                          </p>
                        </div>
                      </div>

                      {/* Entrepreneur Creator info & CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={camp.avatar}
                            alt={camp.entrepreneur}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-[10px] font-bold text-secondary font-heading leading-tight">{camp.entrepreneur}</p>
                            <p className="text-[9px] text-slate-400 font-body">Campaign Owner</p>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/funds/${camp.id}`} 
                          className="bg-primary hover:opacity-95 text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Invest</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>

                  </SpotlightCard>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-16 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-heading font-extrabold text-secondary">No Venture Opportunities Found</h3>
              <p className="text-xs text-slate-500 font-body leading-relaxed">
                We couldn&apos;t find any campaigns matching your filters. Try checking other categories or modifying your search keywords.
              </p>
            </div>
          )}

        </section>

        {/* Platform Milestones & Trust Metrics */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-primary text-white rounded-[32px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
            
            <div className="space-y-2 md:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-heading">
                Platform Statistics
              </span>
              <h2 className="text-2xl font-heading font-extrabold leading-tight">
                Vetted Campaigns, Certified Results.
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-6 md:col-span-3 items-center">
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-heading font-black text-emerald-400">$48M+</h3>
                <p className="text-[10px] text-emerald-100 font-body uppercase tracking-wider">Total Allocated Capital</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-heading font-black text-emerald-400">142</h3>
                <p className="text-[10px] text-emerald-100 font-body uppercase tracking-wider">Campaigns Funded</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-heading font-black text-emerald-400">11.2%</h3>
                <p className="text-[10px] text-emerald-100 font-body uppercase tracking-wider">Avg. Investor Yield (IRR)</p>
              </div>
            </div>

          </div>
        </section>

        {/* Two-Sided Platform Guide: connecting Investors and Entrepreneurs */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">
              How Investra Connects You
            </span>
            <h2 className="text-3xl font-heading font-black text-secondary">
              A Direct Bridge from Ambition to Capital
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-body leading-relaxed">
              We empower sustainable innovation by matching forward-thinking capital providers with audited green business campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: For Investors */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-primary/5 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-heading font-black text-secondary">For Capital Investors</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Browse Audited Campaigns</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Filter by expected IRR, risk parameters, and environmental impact metrics.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Deploy Capital Securely</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Transact fractions of equity or project debt in a fully regulated, compliant marketplace.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Track Real-Time Dividends</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Access yields and download audited carbon footprint reduction certificates directly.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: For Entrepreneurs */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-[#10b981]/10 text-emerald-600">
                  <Zap className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-heading font-black text-secondary">For Green Entrepreneurs</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Submit Venture Campaign</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Provide detailed business plans, structural financial models, and operational frameworks.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Pass Multi-Stage ESG Vetting</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Our environmental analysts and risk underwriters evaluate each submission for compliance.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-secondary font-heading">Secure Seed & Scale Capital</h4>
                    <p className="text-[11px] text-slate-500 font-body leading-relaxed mt-0.5">Pitch to institutional capital, venture funds, and micro-investors on a single dashboard.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
