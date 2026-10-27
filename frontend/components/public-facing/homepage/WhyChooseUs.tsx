"use client";

import React from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-slate-50/80 py-[55px] md:py-[89px] border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Top Section: Golden Ratio 1.618 : 1 Headline vs Narrative Split */}
        <div className="grid grid-cols-1 md:grid-cols-[1.618fr_1fr] gap-[34px] lg:gap-[55px] items-center mb-[42px]">
          
          <div className="space-y-[13px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#064e3b] font-heading">
              Why Investra • Mathematical Integrity
            </span>
            <h2 className="text-[34px] md:text-[42px] font-heading font-black text-[#1e293b] leading-[1.15]">
              We’re Dedicated Partners in <br />
              <span className="text-[#064e3b] italic">Your Venture Success</span>
            </h2>
          </div>

          <div>
            <p className="text-[14px] md:text-[16px] text-slate-600 leading-[26px] font-body">
              At Investra, we merge high-yield investment discovery with verified entrepreneur vetting. We do not compromise on security, compliance, or transparency, ensuring investors and entrepreneurs scale together in harmony.
            </p>
          </div>

        </div>

        {/* Bottom Section - Animated Spotlight Cards Grid (Fibonacci 26px Gaps & Golden Heights) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[26px]">
          
          {/* Card 1: Filled Primary Brand Color */}
          <SpotlightCard 
            spotlightColor="rgba(255, 255, 255, 0.12)"
            className="bg-[#064e3b] p-[26px] rounded-[26px] h-[380px] transition-all duration-500 group shadow-xs hover:shadow-lg cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-[42px] font-heading font-black text-emerald-400">
              01
            </h1>

            {/* Small dots indicator */}
            <div className="mt-4 flex gap-1.5">
              <div className="bg-white w-1.5 h-1.5 rounded-full" />
              <div className="bg-white w-1.5 h-1.5 rounded-full" />
              <div className="bg-white w-1.5 h-1.5 rounded-full" />
              <div className="bg-emerald-400 w-10 h-1.5 rounded-full" />
            </div>

            {/* Text content container */}
            <div className="absolute bottom-[26px] left-[26px] right-[26px] z-20">
              <h3 className="text-[18px] md:text-[21px] font-heading font-bold text-white transition-transform duration-500 group-hover:-translate-y-28">
                100% Regulated & Secure
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-100 text-[13px] leading-[21px] opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body">
                All portfolios are fully compliant with financial regulations, protected by secure KYC check-ins and structured subscription limits.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 2: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-[26px] bg-white rounded-[26px] h-[380px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-lg cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-[42px] font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
              02
            </h1>

            {/* Small dots indicator */}
            <div className="mt-4 flex gap-1.5">
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/40 w-10 h-1.5 rounded-full" />
            </div>

            {/* Text content container */}
            <div className="absolute bottom-[26px] left-[26px] right-[26px] z-20">
              <h3 className="text-[18px] md:text-[21px] font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Side-by-Side Comparison
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-[13px] leading-[21px] opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body">
                Compare multiple business opportunities side-by-side using ROI projections, growth stage, capital requirements, and locations.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-[26px] bg-white rounded-[26px] h-[380px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-lg cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-[42px] font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
              03
            </h1>

            {/* Small dots indicator */}
            <div className="mt-4 flex gap-1.5">
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/40 w-10 h-1.5 rounded-full" />
            </div>

            {/* Text content container */}
            <div className="absolute bottom-[26px] left-[26px] right-[26px] z-20">
              <h3 className="text-[18px] md:text-[21px] font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Direct Chat Requests
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-[13px] leading-[21px] opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body">
                Connect with entrepreneurs directly. Submit message requests, and engage in real-time encrypted chats once approved.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-[26px] bg-white rounded-[26px] h-[380px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-lg cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-[42px] font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
              04
            </h1>

            {/* Small dots indicator */}
            <div className="mt-4 flex gap-1.5">
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/20 w-1.5 h-1.5 rounded-full" />
              <div className="bg-[#064e3b]/40 w-10 h-1.5 rounded-full" />
            </div>

            {/* Text content container */}
            <div className="absolute bottom-[26px] left-[26px] right-[26px] z-20">
              <h3 className="text-[18px] md:text-[21px] font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Consultant Monetization
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-[13px] leading-[21px] opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body">
                Advisors and experts monetize knowledge. Host video courses, live sessions, and workshops with custom platform splits.
              </p>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
