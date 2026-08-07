"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { 
  Search, 
  ArrowLeft, 
  Home, 
  Briefcase, 
  Scale, 
  GraduationCap, 
  Compass, 
  HelpCircle,
  Sparkles
} from "lucide-react";

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/funds?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#064e3b]/10 via-[#10b981]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#064e3b]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto relative z-10 text-center space-y-8">
          
          {/* 404 Badge & Visual Number */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] text-xs font-extrabold uppercase tracking-widest font-heading">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Investra 404 - Page Not Found</span>
            </div>

            <h1 className="font-heading text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#064e3b] via-[#0b6e54] to-slate-800 tracking-tighter leading-none select-none">
              404
            </h1>

            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Oops! The investment opportunity you requested does not exist.
            </h2>
            <p className="font-body text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              The page may have been moved, renamed, or restricted to active subscription tiers. Explore our live startup directory or use the deal finder below.
            </p>
          </div>

          {/* Quick Deal Search Box */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto flex items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business campaigns, startups, or consultants..."
              className="w-full px-3 py-2 text-sm text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 font-body"
            />
            <button
              type="submit"
              className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shrink-0 font-heading"
            >
              Search
            </button>
          </form>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#064e3b] text-white font-bold text-xs shadow-md hover:bg-[#043c2e] hover:shadow-lg transition-all duration-200"
            >
              <Home className="w-4 h-4 text-[#10b981]" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/funds"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-xs hover:border-[#064e3b] hover:text-[#064e3b] transition-all duration-200"
            >
              <Briefcase className="w-4 h-4 text-[#064e3b]" />
              <span>Browse Active Deals</span>
            </Link>
          </div>

          {/* Quick Helpful Destinations */}
          <div className="pt-8 border-t border-slate-200/80">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-4">
              Popular Investra Destinations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <Link href="/compare" className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#10b981] hover:shadow-xs text-left transition-all duration-200 group">
                <Scale className="w-4 h-4 text-[#064e3b] mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 font-heading">Compare Deals</div>
                <div className="text-[10px] text-slate-500 font-body">Side-by-side IRR</div>
              </Link>

              <Link href="/consultants" className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#10b981] hover:shadow-xs text-left transition-all duration-200 group">
                <GraduationCap className="w-4 h-4 text-[#064e3b] mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 font-heading">Consultants</div>
                <div className="text-[10px] text-slate-500 font-body">Mentors & Courses</div>
              </Link>

              <Link href="/subscription" className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#10b981] hover:shadow-xs text-left transition-all duration-200 group">
                <Compass className="w-4 h-4 text-[#064e3b] mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 font-heading">Subscription</div>
                <div className="text-[10px] text-slate-500 font-body">Premium Limits</div>
              </Link>

              <Link href="/faq" className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#10b981] hover:shadow-xs text-left transition-all duration-200 group">
                <HelpCircle className="w-4 h-4 text-[#064e3b] mb-1 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-800 font-heading">Help & FAQ</div>
                <div className="text-[10px] text-slate-500 font-body">Platform Guide</div>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
