"use client";

import React from "react";

interface FundItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const funds: FundItem[] = [
  {
    id: 1,
    title: "Apex FinTech Core Banking",
    category: "FinTech",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    description: "Deploying API billing engines and secure transaction layers for underserved micro-merchants in emerging markets.",
  },
  {
    id: 2,
    title: "ProDocs SaaS HR Platform",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    description: "Centralizing payroll pipelines, automated legal compliance, and healthcare benefits for modern remote operations.",
  },
  {
    id: 3,
    title: "Zephyr Energy Transmission Grid",
    category: "CleanTech",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
    description: "Integrating AI balancers into city smart grids, reducing electricity transmission overheads and thermal waste.",
  },
  {
    id: 4,
    title: "CargoSwift Smart Fleet Logistics",
    category: "Logistics",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    description: "Automating shipment route layouts and pooling cargo spaces to optimize industrial delivery efficiency.",
  },
];

export default function InvestmentOpportunities() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <h3 className="font-heading font-black text-2xl md:text-3xl text-[#064e3b] text-center lg:text-left">
        Investment Opportunities
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {funds.map((fund) => (
          <div 
            key={fund.id} 
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Card Image */}
            <div className="h-40 w-full relative overflow-hidden bg-slate-50">
              <img 
                src={fund.image} 
                alt={fund.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h4 className="font-heading font-extrabold text-base text-[#064e3b]">
                  {fund.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {fund.description}
                </p>
              </div>

              <div>
                <button className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors w-auto">
                  View Fund
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
