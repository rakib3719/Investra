"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Zap, Trees, RefreshCw, Droplet, Check, ArrowRight } from "lucide-react";
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
      title: "Renewable Energy",
      heading: "Solar & Wind Power Infrastructure",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      details: "Harnessing natural resources to build clean energy capacity. We invest in high-yield solar grids and onshore wind farms that generate steady utility revenues while permanently displacing fossil fuel reliance.",
      points: [
        "Grid-scale solar installations and storage",
        "Onshore and offshore wind energy systems",
        "Long-term energy purchasing agreements (PPAs)",
        "Consistent quarterly dividends driven by energy sales"
      ],
      icon: Zap
    },
    {
      id: 1,
      title: "Regenerative Forestry",
      heading: "Sustainable Timberlands & Reforestation",
      image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
      details: "Unlocking the ecological and material value of standing forests. Our funds acquire commercial forests managed with strict FSC guidelines, blending carbon credit production with sustainable logging.",
      points: [
        "Biodiversity-focused native tree planting",
        "Regulated FSC-certified sustainable timber harvesting",
        "High-value carbon offset certificate generation",
        "Resilient asset valuation hedging against inflation"
      ],
      icon: Trees
    },
    {
      id: 2,
      title: "Circular Economy",
      heading: "Zero-Waste & Regenerative Materials",
      image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
      details: "Redesigning industrial systems to eliminate waste. We support enterprises converting agricultural residues, recycling plastics, and deploying bio-packaging alternatives to secure long-term value.",
      points: [
        "Industrial recycling and upcycling facilities",
        "Bio-based materials and biodegradable packaging",
        "Waste-to-energy technologies and systems",
        "Investing in companies driving closed-loop production"
      ],
      icon: RefreshCw
    },
    {
      id: 3,
      title: "Clean Water & Oceans",
      heading: "Aqua Preservation & Purification Solutions",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      details: "Securing clean water resources for communities and ecosystems. Our investments target advanced filtration technologies, marine biodiversity preservation, and sustainable inland aquaculture projects.",
      points: [
        "Smart water conservation and purification tech",
        "Marine ecosystem protection and restoration",
        "Eco-certified sustainable aquaculture farms",
        "Long-term contracts with regional water utilities"
      ],
      icon: Droplet
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
              <span>Sustainable Pillars</span>
              <span className="text-slate-400 font-normal">➔</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
            
            <h2 className="text-3xl md:text-[42px] font-heading font-black text-slate-900 leading-tight">
              Our Four Pillars of <br className="hidden md:block" />
              Ecological Wealth.
            </h2>
          </div>

          <div>
            <a
              href="/funds"
              className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 font-heading shadow-xs hover:shadow-md"
            >
              <span>View All Funds</span>
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
