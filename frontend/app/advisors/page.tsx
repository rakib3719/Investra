"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import { 
  Users, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Mail, 
  Sparkles, 
  Building2, 
  ArrowRight
} from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

interface Advisor {
  name: string;
  role: string;
  fund: string;
  trackRecord: string;
  bio: string;
  avatar: string;
  specialization: string;
}

const advisorsList: Advisor[] = [
  {
    name: "Mahmudur Rahman, CFA",
    role: "Managing Director & Investment Partner",
    fund: "Apex Global Venture Capital",
    trackRecord: "$45M+ Deployed in Series A/B",
    bio: "Over 18 years in institutional equity structuring, renewable infrastructure, and cross-border tech acquisitions.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    specialization: "Fintech & Energy Infrastructure"
  },
  {
    name: "Dr. Farhana Yasmin",
    role: "Head of Startup Due Diligence & ESG Audit",
    fund: "InvestConnect Advisory Board",
    trackRecord: "120+ Vetted Startup Pitches",
    bio: "Specializes in ESG telemetry frameworks, regulatory compliance, and cap-table structuring for Uddokta entrepreneurs.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialization: "ESG Telemetry & Due Diligence"
  },
  {
    name: "Shahriar Ahmed",
    role: "General Partner",
    fund: "BioVest Sustainable Fund",
    trackRecord: "19.2% Avg IRR across Portfolio",
    bio: "Pioneer in AgriTech supply chain investments and climate finance across South Asia.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    specialization: "AgriTech & Climate Finance"
  }
];

export default function AdvisoryBoardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#085a45] to-[#064e3b] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#10b981] text-xs font-extrabold uppercase tracking-widest font-heading">
            <Users className="w-3.5 h-3.5" />
            <span>Venture Advisory Board & Partners</span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Guided by Industry Pioneers & VC Partners
          </h1>

          <p className="font-body text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Our advisory board consists of seasoned venture capitalists, financial analysts, and legal strategists dedicated to maintaining platform vetting standards.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-[1400px] mx-auto w-full px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">$120M+</div>
            <div className="text-xs text-slate-500 font-body mt-1">Capital Facilitated</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">45+</div>
            <div className="text-xs text-slate-500 font-body mt-1">Funded Ventures</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">18.4%</div>
            <div className="text-xs text-slate-500 font-body mt-1">Avg Projected IRR</div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl md:text-3xl text-[#064e3b]">99.4%</div>
            <div className="text-xs text-slate-500 font-body mt-1">Audit Compliance</div>
          </div>
        </div>
      </section>

      {/* Advisory Team Cards */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-16 flex-1 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisorsList.map((advisor, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#10b981] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-8 space-y-6">
                
                <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#10b981] text-[#064e3b]">
                      {advisor.specialization}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-lg text-slate-800">
                    {advisor.name}
                  </h3>
                  <p className="text-xs font-bold text-[#064e3b] font-heading">{advisor.role}</p>
                  <p className="text-[11px] text-slate-400 font-body flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{advisor.fund}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  {advisor.bio}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-body">Verified Record:</span>
                  <span className="font-bold text-slate-800 font-heading">{advisor.trackRecord}</span>
                </div>

              </div>

              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect</span>
                <div className="flex gap-2">
                  <a href="#" className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#064e3b] transition-colors">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#064e3b] transition-colors">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Inquiry Banner */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold">
              Are you a VC partner or startup mentor interested in joining our board?
            </h3>
            <p className="text-xs md:text-sm text-slate-200 font-body max-w-xl">
              We welcome experienced institutional investors and consultants to join our vetting committee.
            </p>
          </div>

          <Link
            href="/contact"
            className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold px-6 py-3 rounded-xl text-xs transition-all duration-200 shrink-0 flex items-center gap-2"
          >
            <span>Submit Partner Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
