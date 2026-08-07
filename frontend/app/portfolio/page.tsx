"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import { Search, Compass, Briefcase, ArrowUpRight, ShieldCheck, CheckCircle, Sparkles, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { portfolioData } from "./data";

export default function PortfolioPage() {
  const [filterType, setFilterType] = useState<"all" | "startup" | "investor" | "consultant">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return portfolioData.filter((item) => {
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  return (
    <div className="min-h-screen bg-white w-full flex flex-col justify-between selection:bg-[#10b981]/20">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-24">
        
        {/* Standardized Hero Banner System (White & Green 2-Column Layout) */}
        <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column - Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Verified Venture Directory</span>
              </div>

              <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
                Venture Directory.<br />
                Funded Startups & Advisors,<br />
                <ShinyText text="Explore Pitch Proposals." speed={4.5} />
              </h1>

              <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
                Explore the collective directory of funded startups, active angel investors, and verified consultants shaping regional business growth.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link href="/portfolio/detail" className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs flex items-center gap-2">
                  <span>View Sample Pitch Deck</span>
                  <ArrowRight className="w-4 h-4 text-[#10b981]" />
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Showcase Card */}
            <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80"
                alt="Investra Portfolio Showcase"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </section>

        {/* Aggregate Stats Section */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Combined Capital Allocated</span>
              <p className="text-2xl font-heading font-black text-[#064e3b]">$45.8 Million</p>
            </div>
            <div className="border-y sm:border-y-0 sm:border-x border-slate-200/60 py-4 sm:py-0 space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Total Matchmaking Deals</span>
              <p className="text-2xl font-heading font-black text-[#064e3b]">1,280 Matches</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Verified Consultants</span>
              <p className="text-2xl font-heading font-black text-[#064e3b]">45 Advisors</p>
            </div>
          </div>
        </section>

        {/* Filter and Search Controls */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {(["all", "startup", "investor", "consultant"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer ${
                    filterType === type
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                  }`}
                >
                  {type === "all" && "Show All Showcase"}
                  {type === "startup" && "Startups (Uddoktas)"}
                  {type === "investor" && "Active Investors"}
                  {type === "consultant" && "Verified Consultants"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, tags or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#064e3b] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none transition-all font-body"
              />
            </div>

          </div>
        </section>

        {/* Directory Showcase Cards */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 max-w-4xl mx-auto space-y-3">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-heading font-black text-slate-700">No directory listings found</h3>
              <p className="text-xs text-slate-500 font-body">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredItems.map((item) => (
                <SpotlightCard
                  key={item.id}
                  spotlightColor="rgba(16, 185, 129, 0.04)"
                  className="bg-white border border-slate-200 rounded-[32px] overflow-hidden p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow relative group"
                >
                  
                  {/* TOP RIGHT CORNER HIGH-VISIBILITY DETAIL BUTTON */}
                  <div className="absolute top-6 right-6 z-20">
                    <Link
                      href="/portfolio/detail"
                      className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold font-heading px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>View Pitch Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Main Grid inside Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Column 1: Portrait / Brand image (4/12 span) */}
                    <div className="lg:col-span-4 relative h-[220px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Floating category badge */}
                      <span className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-heading backdrop-blur-xs border ${
                        item.type === "startup" ? "bg-emerald-600 text-white border-emerald-400/20" :
                        item.type === "investor" ? "bg-[#064e3b] text-white border-blue-400/20" :
                        "bg-slate-800 text-white border-slate-400/20"
                      }`}>
                        {item.type === "startup" ? "Startup Pitch" : item.type === "investor" ? "Investor Profile" : "Verified Advisor"}
                      </span>
                    </div>

                    {/* Column 2: Profile identity & metrics info (8/12 span) */}
                    <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6 pr-0 md:pr-32">
                      
                      {/* Upper Identity segment */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 shadow-2xs">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-xl font-heading font-black text-slate-800 leading-none">
                                {item.name}
                              </h3>
                              <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                            </div>
                            <p className="text-xs text-slate-500 font-body mt-1 leading-none">{item.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-lg font-body font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Metrics Bar & CTA Link */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        
                        {/* 3-column stats */}
                        <div className="flex gap-8">
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-heading">{item.metrics.label1}</span>
                            <p className="text-sm font-heading font-black text-slate-800">{item.metrics.value1}</p>
                          </div>
                          <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-heading">{item.metrics.label2}</span>
                            <p className="text-sm font-heading font-black text-slate-800">{item.metrics.value2}</p>
                          </div>
                          <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-heading">{item.metrics.label3}</span>
                            <p className="text-sm font-heading font-black text-[#064e3b]">{item.metrics.value3}</p>
                          </div>
                        </div>

                        {/* CTA Navigate Link */}
                        <Link 
                          href="/portfolio/detail"
                          className="bg-[#064e3b] hover:bg-[#043c2e] text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading transition-colors flex items-center gap-2 cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
                        >
                          <span>View Pitch Proposal Details</span>
                          <ArrowRight className="w-4 h-4 text-[#10b981]" />
                        </Link>

                      </div>

                    </div>

                  </div>

                </SpotlightCard>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
