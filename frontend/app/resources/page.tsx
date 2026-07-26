"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  FileText, 
  Video, 
  HelpCircle, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Award,
  Zap,
  Bookmark,
  MessageSquare
} from "lucide-react";

interface ResourceItem {
  id: number;
  title: string;
  category: "For Investors" | "For Entrepreneurs" | "For Consultants";
  description: string;
  type: "PDF Guide" | "Video Tutorial" | "Template Document";
  sizeOrDuration: string;
}

const mockResources: ResourceItem[] = [
  {
    id: 1,
    title: "Structuring Your Pitch Deck for Seed Capital",
    category: "For Entrepreneurs",
    description: "A comprehensive guide on creating an investment-ready pitch covering market size, financial modeling, and roadmap.",
    type: "Template Document",
    sizeOrDuration: "12 Pages PDF"
  },
  {
    id: 2,
    title: "Evaluating ROI & Valuation Margins",
    category: "For Investors",
    description: "Learn how to utilize our comparison systems to filter startups by industry averages and risk indexes.",
    type: "PDF Guide",
    sizeOrDuration: "8 Pages PDF"
  },
  {
    id: 3,
    title: "Monetizing Mentorship & Creating Live Sessions",
    category: "For Consultants",
    description: "Step-by-step walkthrough on linking Zoom API, setting session pricing thresholds, and tracking payouts.",
    type: "Video Tutorial",
    sizeOrDuration: "14 Mins Video"
  },
  {
    id: 4,
    title: "Startup Compliance & Vetting Preparation Kit",
    category: "For Entrepreneurs",
    description: "Checklist of legal documents, KYC verification requirements, and bank account proofs needed for active listing.",
    type: "Template Document",
    sizeOrDuration: "Checklist Form"
  },
  {
    id: 5,
    title: "Premium Networking: Utilizing Message Requests",
    category: "For Investors",
    description: "Guidelines on requesting direct chat access, accepting pitches, and formalizing private investment discussions.",
    type: "PDF Guide",
    sizeOrDuration: "5 Pages PDF"
  },
  {
    id: 6,
    title: "Creating High-Impact Workshops & Recorded Courses",
    category: "For Consultants",
    description: "Best practices for pricing strategy, uploading course materials, and promoting sessions to entrepreneurs.",
    type: "Video Tutorial",
    sizeOrDuration: "20 Mins Video"
  }
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredResources = mockResources.filter((res) => {
    return activeTab === "All" || res.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-20">
        
        {/* Page Hero */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Platform Playbook
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Platform Guides & <br />
              <ShinyText text="Subscription Ecosystem" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Explore step-by-step guides built for each role on InvestConnect. Plus, compare pricing tiers and premium features designed to accelerate your connections.
            </p>
          </div>
        </section>

        {/* Subscription Tier Comparison Section */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-16 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">Pricing & Access</span>
            <h2 className="text-3xl font-heading font-black text-secondary">Choose Your Access Level</h2>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Admin-controlled features and boundaries defined clearly. Select a plan to upgrade your connection limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Tier */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.04)" className="bg-white border border-slate-200/60 rounded-3xl p-8 space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Basic Plan</span>
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-heading">Standard</span>
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-black text-secondary">$0</h3>
                  <p className="text-[10px] text-slate-400 font-body">Free Forever for casual networking</p>
                </div>
                
                <hr className="border-slate-100" />
                
                <ul className="space-y-3.5 text-xs text-slate-600 font-body">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Browse and filter listed startups</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bookmark up to 50 campaigns</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Access public consultant courses</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400 line-through">
                    <span>Premium Business Comparison Tools</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400 line-through">
                    <span>Direct Investor Chat Requests</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold font-heading transition-colors cursor-pointer">
                Get Started Free
              </button>
            </SpotlightCard>

            {/* Premium Tier */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" className="bg-white border-2 border-primary rounded-3xl p-8 space-y-8 flex flex-col justify-between relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading shadow-xs">
                Popular
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">Pro Networker</span>
                  <span className="bg-primary/5 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-heading">Premium</span>
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-black text-secondary">$39<span className="text-xs font-normal text-slate-400">/mo</span></h3>
                  <p className="text-[10px] text-slate-400 font-body">Scale connections and unlock advanced dashboards</p>
                </div>
                
                <hr className="border-slate-100" />
                
                <ul className="space-y-3.5 text-xs text-slate-600 font-body">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Priority visibility for listed campaigns</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited business bookmarks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Advanced Side-by-Side Comparison Tool</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Direct Investor Chat (Message Requests)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Zoom integrated consultation booking</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-primary hover:opacity-95 text-white py-3 rounded-2xl text-xs font-bold font-heading transition-opacity cursor-pointer">
                Upgrade to Premium
              </button>
            </SpotlightCard>

          </div>
        </section>

        {/* Resources & Guides Directory */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-28 space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">Knowledge Hub</span>
              <h2 className="text-3xl font-heading font-black text-secondary">Guides & Playbooks</h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              {["All", "For Investors", "For Entrepreneurs", "For Consultants"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-heading transition-colors cursor-pointer ${
                    activeTab === tab 
                      ? "bg-primary text-white" 
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <SpotlightCard
                key={res.id}
                spotlightColor="rgba(16, 185, 129, 0.06)"
                className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between h-56 hover:shadow-sm transition-shadow duration-300"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-heading">
                      {res.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-body">{res.sizeOrDuration}</span>
                  </div>
                  
                  <h3 className="text-sm font-heading font-extrabold text-secondary hover:text-primary transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-body leading-relaxed line-clamp-3">
                    {res.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary font-heading">
                    {res.category}
                  </span>
                  
                  <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                    <span>Access Resource</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </SpotlightCard>
            ))}
          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
