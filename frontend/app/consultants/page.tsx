"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  GraduationCap, 
  Star, 
  Clock, 
  Users, 
  Search, 
  ArrowRight,
  ShieldCheck,
  DollarSign
} from "lucide-react";

interface Consultant {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  expertise: string[];
  hourlyRate: string;
  nextAvailable: string;
  avatar: string;
  type: "Mentoring" | "Course" | "Workshop";
  topic: string;
  enrolled: number;
  maxCapacity: number;
}

const mockConsultants: Consultant[] = [
  {
    id: "c1",
    name: "Dr. Ariful Islam",
    role: "Venture Partner & Legal Strategist",
    rating: 4.9,
    reviewsCount: 48,
    expertise: ["Pitch Review", "Cap Table", "Series A Legal"],
    hourlyRate: "$120",
    nextAvailable: "Tomorrow at 3:00 PM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    type: "Mentoring",
    topic: "1-on-1 Venture Capital Deal Structuring",
    enrolled: 12,
    maxCapacity: 20
  },
  {
    id: "c2",
    name: "Nusrat Jahan",
    role: "Ex-VC Director & Financial Analyst",
    rating: 5.0,
    reviewsCount: 62,
    expertise: ["Financial Modeling", "Valuation", "AgriTech"],
    hourlyRate: "$150",
    nextAvailable: "Friday at 11:00 AM",
    avatar: "/female-advisor.png",
    type: "Workshop",
    topic: "Live Workshop: Masterclass in Startup Financial Forecasts",
    enrolled: 35,
    maxCapacity: 50
  },
  {
    id: "c3",
    name: "Tariqur Rahman",
    role: "ESG Telemetry Consultant",
    rating: 4.8,
    reviewsCount: 31,
    expertise: ["ESG Auditing", "Carbon Credits", "Solar Energy"],
    hourlyRate: "$95",
    nextAvailable: "Available Today",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    type: "Course",
    topic: "Pre-recorded Course: ESG Audit Readiness for Investors",
    enrolled: 110,
    maxCapacity: 500
  }
];

export default function ConsultantMarketplacePage() {
  const [activeTab, setActiveTab] = useState<"All" | "Mentoring" | "Workshop" | "Course">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  const filteredConsultants = mockConsultants.filter((c) => {
    const matchesTab = activeTab === "All" || c.type === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Consultant Marketplace</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Advisory Marketplace.<br />
              Masterclass Sessions,<br />
              <ShinyText text="80/20 Revenue Share." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Accelerate your fundraising journey or refine your investment thesis with vetted venture partners, legal advisors, and financial modelers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064e3b] bg-[#10b981]/15 px-3 py-1.5 rounded-lg font-heading">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" /> 80/20 Consultant Revenue Share
              </span>
            </div>
          </div>

          {/* Right Column - Hero Visual Image */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="Investra Consultants"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-12 flex-1 space-y-8">
        
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {(["All", "Mentoring", "Workshop", "Course"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#064e3b] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab === "All" ? "All Services" : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search advisor name, topic, skill..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] font-body"
            />
          </div>
        </div>

        {/* Consultants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#10b981] transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#064e3b]">
                      {c.type}
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-slate-800 mt-1">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-body">{c.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold font-heading">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{c.rating}</span>
                    <span className="text-slate-400 font-normal">({c.reviewsCount} reviews)</span>
                  </div>
                  <div className="font-heading font-black text-sm text-[#064e3b]">
                    {c.hourlyRate} <span className="text-[10px] font-normal text-slate-500">/ session</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-800 leading-snug">
                    {c.topic}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.expertise.map((exp, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold font-heading">
                      {exp}
                    </span>
                  ))}
                </div>

                <div className="space-y-1.5 text-slate-500 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>Next Slot: {c.nextAvailable}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#064e3b]" />
                    <span>Enrolled: {c.enrolled} / {c.maxCapacity} seats</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#064e3b] uppercase">80% Consultant Yield</span>
                <button
                  onClick={() => setSelectedConsultant(c)}
                  className="bg-[#064e3b] hover:bg-[#043c2e] text-white px-4 py-2 rounded-xl text-xs font-bold font-heading transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#10b981]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Modal */}
        {selectedConsultant && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative border border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                    Session Checkout
                  </span>
                  <h3 className="font-heading font-black text-xl text-slate-800">
                    Book {selectedConsultant.type} Session
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedConsultant(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                <img src={selectedConsultant.avatar} alt={selectedConsultant.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-800">{selectedConsultant.name}</h4>
                  <p className="text-xs text-slate-500">{selectedConsultant.topic}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    alert(`Booking requested for ${selectedConsultant.name}! Directing to payment gateway...`);
                    setSelectedConsultant(null);
                  }}
                  className="w-full bg-[#064e3b] hover:bg-[#043c2e] text-white font-heading font-bold py-3 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-[#10b981]" />
                  <span>Proceed to Payment ({selectedConsultant.hourlyRate})</span>
                </button>

                <button
                  onClick={() => setSelectedConsultant(null)}
                  className="w-full bg-slate-100 text-slate-600 font-heading font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
