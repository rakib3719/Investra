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
    title: "Global Forest Fund",
    category: "Forestry",
    image: "/forest_fund.png",
    description: "Global forest fund is protarms and regenerative forest. In tmentathewl plants...",
  },
  {
    id: 2,
    title: "Renewable Infrastructure",
    category: "Solar Energy",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    description: "Renewable Infrastructure comlume-wallto/or power and tracenenimance connollies.",
  },
  {
    id: 3,
    title: "Wind Farm",
    category: "Wind Power",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
    description: "Wind farm and coronative propest animal and assinents sucless and financial growth.",
  },
  {
    id: 4,
    title: "Circular Economy",
    category: "Recycling",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=600&q=80",
    description: "Circular economy evoloes iix regenerative communities to oaisienmenat plants.",
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
