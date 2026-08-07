"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  Leaf
} from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

interface Advisor {
  id: string;
  name: string;
  role: string;
  fund: string;
  trackRecord: string;
  bio: string;
  avatar: string;
  specialization: "Venture Capital" | "ESG Telemetry" | "Legal & Compliance" | "AgriTech & Climate";
  stats: {
    dealsApproved: number;
    capitalManaged: string;
    avgYield: string;
  };
}

const advisorsList: Advisor[] = [
  {
    id: "adv-1",
    name: "Mahmudur Rahman, CFA",
    role: "Managing Director & Senior Investment Partner",
    fund: "Apex Global Venture Capital",
    trackRecord: "$45M+ Deployed in Series A/B",
    bio: "Over 18 years in institutional equity structuring, renewable infrastructure, and cross-border tech acquisitions. Mahmudur leads the Investment Vetting Committee at Investra.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    specialization: "Venture Capital",
    stats: {
      dealsApproved: 24,
      capitalManaged: "$45M",
      avgYield: "19.5% IRR"
    }
  },
  {
    id: "adv-2",
    name: "Dr. Farhana Yasmin",
    role: "Head of Startup Due Diligence & ESG Audit",
    fund: "Investra Telemetry Governance",
    trackRecord: "120+ Vetted Startup Pitches",
    bio: "Specializes in ESG telemetry frameworks, regulatory compliance, and cap-table structuring for Uddokta entrepreneurs seeking Series A growth rounds.",
    avatar: "/female-advisor.png",
    specialization: "ESG Telemetry",
    stats: {
      dealsApproved: 42,
      capitalManaged: "$30M",
      avgYield: "18.2% IRR"
    }
  },
  {
    id: "adv-3",
    name: "Shahriar Ahmed",
    role: "General Partner & Climate Lead",
    fund: "BioVest Sustainable Fund",
    trackRecord: "19.2% Avg IRR across Portfolio",
    bio: "Pioneer in AgriTech supply chain investments and climate finance across South Asia, bringing 15+ years of operational venture scaling experience.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    specialization: "AgriTech & Climate",
    stats: {
      dealsApproved: 18,
      capitalManaged: "$25M",
      avgYield: "21.0% IRR"
    }
  },
  {
    id: "adv-4",
    name: "Barrister Anisur Rahman",
    role: "Legal & Regulatory Structuring Partner",
    fund: "Rahman & Partners Corporate VC",
    trackRecord: "35+ Successful Cross-Border Mergers",
    bio: "Advises Investra on cross-border venture compliance, convertible note structuring, and investor protection mechanisms for global LPs.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    specialization: "Legal & Compliance",
    stats: {
      dealsApproved: 31,
      capitalManaged: "$20M",
      avgYield: "17.8% IRR"
    }
  }
];

export default function ConsistentAdvisorsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All Partners");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

  const filteredAdvisors = advisorsList.filter((a) => {
    if (activeCategory === "All Partners") return true;
    return a.specialization === activeCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System (White & Green 2-Column Layout) */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <Leaf className="w-3.5 h-3.5" />
              <span>Advisory Board & Committee</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Guiding Capital.<br />
              Empowering Yields,<br />
              <ShinyText text="Venture Excellence." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Institutional venture partners, ESG telemetry auditors, and legal strategists dedicated to maintaining Investra's deal vetting standards.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/funds" className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs">
                Explore Vetted Deals
              </Link>
              <a href="#advisors-grid" className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors">
                Meet Partners
              </a>
            </div>
          </div>

          {/* Right Column - Hero Visual Banner */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="/advisors-hero.png"
              alt="Investra Advisory Board"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-slate-50 py-10 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">$120M+</div>
            <div className="text-xs text-slate-500 font-body mt-1">Capital Facilitated</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">45+</div>
            <div className="text-xs text-slate-500 font-body mt-1">Funded Sustainable Deals</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">18.4%</div>
            <div className="text-xs text-slate-500 font-body mt-1">Avg Projected IRR Yield</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">99.4%</div>
            <div className="text-xs text-slate-500 font-body mt-1">ESG Audit Compliance</div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main id="advisors-grid" className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-16 flex-1 space-y-12">
        
        {/* Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {["All Partners", "Venture Capital", "ESG Telemetry", "Legal & Compliance", "AgriTech & Climate"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#064e3b] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-body shrink-0">
            Showing <span className="font-bold text-slate-800">{filteredAdvisors.length}</span> Verified Advisory Partners
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAdvisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#10b981] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="relative h-56 rounded-xl overflow-hidden border border-slate-100">
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-[#10b981] text-[#064e3b] font-heading shadow-xs">
                      {advisor.specialization}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base text-slate-800 leading-snug">
                    {advisor.name}
                  </h3>
                  <p className="text-xs font-bold text-[#064e3b] font-heading">{advisor.role}</p>
                  <p className="text-[11px] text-slate-500 font-body flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{advisor.fund}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-body leading-relaxed line-clamp-3">
                  {advisor.bio}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Approved Deals:</span>
                    <span className="font-bold text-slate-800">{advisor.stats.dealsApproved}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Capital Managed:</span>
                    <span className="font-bold text-slate-800">{advisor.stats.capitalManaged}</span>
                  </div>
                  <div className="flex justify-between text-[#064e3b] font-heading font-bold">
                    <span>Avg Yield:</span>
                    <span className="text-[#10b981]">{advisor.stats.avgYield}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedAdvisor(advisor)}
                  className="text-xs font-bold text-[#064e3b] hover:text-[#10b981] inline-flex items-center gap-1 font-heading cursor-pointer"
                >
                  <span>Full Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <div className="flex gap-2">
                  <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-[#064e3b] hover:text-white transition-colors">
                    <FaLinkedin className="w-3.5 h-3.5" />
                  </a>
                  <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-[#064e3b] hover:text-white transition-colors">
                    <FaTwitter className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
