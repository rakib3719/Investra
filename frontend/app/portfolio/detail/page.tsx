"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Bookmark, 
  MessageSquare, 
  CheckCircle2, 
  Play, 
  FileText, 
  ArrowRight,
  Share2
} from "lucide-react";

export default function PitchDetailShowcasePage() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#085a45] to-[#064e3b] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#10b981] text-xs font-extrabold uppercase tracking-widest font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Pitch Campaign • Series A</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center gap-1.5 ${
                  isBookmarked
                    ? "bg-[#10b981] text-[#064e3b]"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked ? "Bookmarked" : "Bookmark Pitch"}</span>
              </button>

              <button 
                onClick={() => alert("Share link copied to clipboard!")}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight max-w-4xl">
            SolarGrid Bangladesh: Decentralized Clean Energy Micro-Grids
          </h1>

          <p className="font-body text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            Expanding solar-powered micro-grids across 12 rural agricultural hubs, delivering reliable energy with 18.5% projected IRR and AAA ESG rating.
          </p>

        </div>
      </section>

      {/* Main Pitch Details */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Media & Proposal Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Pitch Media Cover */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative group">
            <div className="h-80 md:h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
                alt="SolarGrid Pitch Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <button
                  onClick={() => alert("Playing Founder Video Pitch Pitch Deck...")}
                  className="w-16 h-16 rounded-full bg-[#10b981] text-[#064e3b] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-[#064e3b] ml-1" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-body">
              <span>Verified Founder Video Pitch (3:45 mins)</span>
              <span className="font-bold text-[#064e3b]">Audit Rating: AAA</span>
            </div>
          </div>

          {/* Executive Summary & Investment Thesis */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="font-heading font-black text-xl text-slate-800">
              Executive Investment Thesis
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
              SolarGrid Bangladesh operates 28 active solar micro-grids serving 14,000+ rural households and agricultural pumps. This Series A funding round ($1.2M target) will fund hardware deployment for 12 new grid hubs with long-term Power Purchase Agreements (PPAs).
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-heading">Post Valuation</div>
                <div className="font-heading font-extrabold text-base text-slate-800">$4.5 Million</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-heading">Target IRR</div>
                <div className="font-heading font-extrabold text-base text-[#064e3b]">18.5% / Year</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-heading">Min Ticket</div>
                <div className="font-heading font-extrabold text-base text-slate-800">$5,000</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-heading">Stage</div>
                <div className="font-heading font-extrabold text-base text-[#10b981]">Series A</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Funding Progress & Chat Action Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6 sticky top-24">
            
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#10b981] font-heading">
                Funding Target Progress
              </span>
              <div className="font-heading font-black text-2xl text-slate-800">$840,000</div>
              <div className="text-xs text-slate-500 font-body">Raised of $1,200,000 Target</div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-2">
                <div className="bg-[#10b981] h-full rounded-full w-[70%]" />
              </div>
              <div className="flex justify-between text-[11px] font-bold font-heading text-slate-600 pt-1">
                <span>70% Funded</span>
                <span>142 Bookmarks</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <button
                onClick={() => alert("Initiating Premium Chat Request to Founder (Entrepreneur)... Unlocked via active subscription.")}
                className="w-full bg-[#064e3b] hover:bg-[#043c2e] text-white font-heading font-extrabold py-3.5 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#10b981]" />
                <span>Request Founder Premium Chat</span>
              </button>

              <Link
                href="/compare"
                className="w-full border border-slate-200 hover:border-[#064e3b] text-slate-700 font-heading font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Compare with Other Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-body flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>Verified Audit File available for Pro Investor Subscribers.</span>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
