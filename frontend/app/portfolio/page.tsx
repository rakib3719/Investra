"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import { Search, Compass, Briefcase, ArrowUpRight, ShieldCheck, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-24">
        
        {/* Centered Page Hero Banner */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Ecosystem Showcase
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Investra <br />
              <ShinyText text="Enterprise Showcase" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Explore the collective directory of funded startups, active angel investors, and verified consultants shaping regional business growth.
            </p>
          </div>
        </section>

        {/* Aggregate Stats Section */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] -translate-y-6">
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Combined Capital Allocated</span>
              <p className="text-2xl font-heading font-black text-primary">$45.8 Million</p>
            </div>
            <div className="border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0 space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Total Matchmaking Deals</span>
              <p className="text-2xl font-heading font-black text-primary">1,280 Matches</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-heading font-bold uppercase tracking-wider">Verified Consultants</span>
              <p className="text-2xl font-heading font-black text-primary">45 Advisors</p>
            </div>
          </div>
        </section>

        {/* Filter and Search Controls */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center max-w-5xl mx-auto">
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {(["all", "startup", "investor", "consultant"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer ${
                    filterType === type
                      ? "bg-primary text-white"
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
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-secondary outline-none transition-all font-body"
              />
            </div>

          </div>
        </section>

        {/* Spacious Showcase Panels Directory */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 max-w-4xl mx-auto space-y-3">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-heading font-black text-secondary">No directory listings found</h3>
              <p className="text-xs text-slate-500 font-body">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {filteredItems.map((item) => (
                <SpotlightCard
                  key={item.id}
                  spotlightColor="rgba(16, 185, 129, 0.04)"
                  className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow relative"
                >
                  
                  {/* Main Grid inside Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Column 1: Portrait / Brand image (4/12 span) */}
                    <div className="lg:col-span-4 relative h-[220px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* floating category badge */}
                      <span className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full font-heading backdrop-blur-xs border ${
                        item.type === "startup" ? "bg-emerald-500/90 text-white border-emerald-400/20" :
                        item.type === "investor" ? "bg-blue-600/90 text-white border-blue-400/20" :
                        "bg-purple-600/90 text-white border-purple-400/20"
                      }`}>
                        {item.type === "startup" ? "Startup Pitch" : item.type === "investor" ? "Investor Profile" : "Verified Advisor"}
                      </span>
                    </div>

                    {/* Column 2: Profile identity & metrics info (8/12 span) */}
                    <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6">
                      
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
                              <h3 className="text-xl font-heading font-black text-secondary leading-none">
                                {item.name}
                              </h3>
                              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                            </div>
                            <p className="text-xs text-slate-400 font-body mt-1 leading-none">{item.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-200/50 text-slate-500 text-[10px] px-3 py-1 rounded-lg font-body font-bold">
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
                            <p className="text-sm font-heading font-black text-secondary">{item.metrics.value1}</p>
                          </div>
                          <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-heading">{item.metrics.label2}</span>
                            <p className="text-sm font-heading font-black text-secondary">{item.metrics.value2}</p>
                          </div>
                          <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-heading">{item.metrics.label3}</span>
                            <p className="text-sm font-heading font-black text-secondary">{item.metrics.value3}</p>
                          </div>
                        </div>

                        {/* CTA Navigate Link */}
                        <Link 
                          href={`/portfolio/${item.id}`}
                          className="bg-primary hover:bg-[#043c2e] text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading transition-colors flex items-center gap-2 cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
                        >
                          <span>View Full Profile</span>
                          <ArrowUpRight className="w-4 h-4" />
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
