"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Zap, Briefcase, UserCheck, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillarItem {
  id: number;
  title: string;
  heading: string;
  image: string;
  details: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const PlatformPillars = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillarsData: PillarItem[] = [
    {
      id: 0,
      title: "Vetted Startups",
      heading: "Discover High-Growth Opportunities",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      details: "Connecting investors with pre-screened startup pitches. We target scalable SaaS, FinTech, and logistics ventures that have clear product-market fit and audited transaction volumes.",
      points: [
        "Pre-vetted pitch decks and compliance records",
        "Complete financial modeling and traction stats",
        "Opportunities spanning SaaS, FinTech, and AgriTech",
        "Secure investment pledges routed directly"
      ],
      icon: Briefcase
    },
    {
      id: 1,
      title: "Entrepreneur Hub",
      heading: "Showcase Pitch Decks & Get Backed",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      details: "Allowing entrepreneurs (Uddoktas) to publish business plans, track investor views and bookmark metrics, and secure growth capital efficiently.",
      points: [
        "Custom pitch deck showcase builders",
        "Real-time visitor analytics and dashboard tracking",
        "Gated premium visibility upgrades",
        "Direct match-making queues"
      ],
      icon: Zap
    },
    {
      id: 2,
      title: "Expert Mentorship",
      heading: "Certified Consultants & Live Training",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      details: "Certified business consultants host paid Q&A sessions, deadline-based cohorts, and pre-recorded training videos, keeping an 80/20 platform split.",
      points: [
        "Scheduled Zoom & Google Meet integrations",
        "Paid workshop enrollment and course delivery",
        "Secure Stripe-tracked billing",
        "Direct mentoring loops with entrepreneurs"
      ],
      icon: UserCheck
    },
    {
      id: 3,
      title: "Subscription Engine",
      heading: "Feature-Based Gating & Packages",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      details: "Admin-configured subscription plans enabling customizable access boundaries. Investors and entrepreneurs purchase packages to lift bookmark and chat limits.",
      points: [
        "Feature gating verified by custom middleware",
        "Unlimited bookmark options for Pro members",
        "Premium chat unlocks with messaging request queues",
        "Flexible monthly and annual Stripe plans"
      ],
      icon: ShieldCheck
    }
  ];

  return (
    <section className="w-full bg-[#f4f5f6] py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="space-y-3">
            {/* Pill tag style */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 font-heading">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span>Core Modules</span>
              <span className="text-slate-400 font-normal">➔</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
            
            <h2 className="text-3xl md:text-[42px] font-heading font-black text-slate-900 leading-tight">
              Our Four Pillars of <br className="hidden md:block" />
              Venture Connection.
            </h2>
          </div>

          <div>
            <a
              href="/funds"
              className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 font-heading shadow-xs hover:shadow-md"
            >
              <span>View All Campaigns</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Dynamic Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
          
          {/* Left Column - Pillar Selector List */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {pillarsData.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4.5 rounded-[20px] transition-all duration-300 font-heading font-bold text-xs md:text-sm text-left w-full shadow-xs border",
                    isActive
                      ? "bg-[#064e3b]/10 border-[#064e3b]/20 text-[#064e3b] font-extrabold shadow-md scale-102"
                      : "bg-white border-transparent text-slate-700 hover:text-slate-900 hover:bg-white/80"
                  )}
                >
                  <span className={cn(
                    "p-2.5 rounded-xl flex items-center justify-center transition-colors duration-300",
                    isActive ? "bg-white text-[#064e3b]" : "bg-slate-50 text-slate-500"
                  )}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column - Unified Card Layout */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-6 md:p-8 shadow-xs border border-slate-100/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Card Image */}
              <div className="md:col-span-5 relative w-full h-[220px] md:h-[320px] rounded-[24px] overflow-hidden shadow-xs">
                <Image
                  src={pillarsData[activeTab].image}
                  alt={pillarsData[activeTab].title}
                  fill
                  sizes="(max-w-768px) 100vw, 30vw"
                  className="object-cover transition-transform duration-700 hover:scale-103"
                  priority
                />
              </div>

              {/* Card Text & Bullets */}
              <div className="md:col-span-7 space-y-5">
                <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 leading-tight">
                  {pillarsData[activeTab].heading}
                </h3>
                
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-body">
                  {pillarsData[activeTab].details}
                </p>

                {/* Bullet Points with check inside circle */}
                <ul className="space-y-3 pt-2">
                  {pillarsData[activeTab].points.map((point, index) => (
                    <li key={index} className="flex items-center gap-3 text-xs md:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-[#064e3b] text-white flex items-center justify-center text-[10px] flex-shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="font-body leading-none">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformPillars;
