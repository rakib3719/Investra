"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column - Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] xl:text-[56px] text-[#064e3b] leading-[1.1] tracking-tight">
            Invest in a Greener Future.<br />
            Secure Your Wealth,<br />
            Sustain the Planet.
          </h1>
          
          <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
            Impactful investment opportunities driving positive environmental and financial growth.
          </p>
          
          <div className="pt-2">
            <Link href="/funds" className="inline-block bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs">
              Explore Sustainable Investments
            </Link>
          </div>
        </div>

        {/* Right Column - Hero Image */}
        <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[480px] xl:h-[540px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
          <img 
            src="/hero_sustainable_investing.png" 
            alt="Investra Sustainable Investments"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
