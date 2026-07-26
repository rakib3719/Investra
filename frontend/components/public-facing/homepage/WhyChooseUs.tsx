"use client";

import React from "react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const WhyChooseUs = () => {
  return (
    <section className="w-full bg-slate-50 py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-12">
          
          <div className="md:col-span-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#064e3b] font-heading">
              Why Investra
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1e293b] leading-tight">
              We’re Dedicated Partners in <br />
              <span className="text-[#064e3b] italic">Your Venture Success</span>
            </h2>
          </div>

          <div className="md:col-span-6">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-body">
              At Investra, we merge high-yield investment discovery with verified entrepreneur vetting. We do not compromise on security, compliance, or transparency, ensuring investors and entrepreneurs grow together.
            </p>
          </div>

        </div>

        {/* Bottom Section - Animated Spotlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Filled Primary Brand Color */}
          <SpotlightCard 
            spotlightColor="rgba(255, 255, 255, 0.12)"
            className="bg-[#064e3b] p-6 rounded-2xl h-[360px] transition-all duration-500 group shadow-xs hover:shadow-md cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-4xl font-heading font-black text-emerald-400">
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
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg md:text-xl font-heading font-bold text-white transition-transform duration-500 group-hover:-translate-y-28">
                100% Regulated & Secure
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-100 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                All portfolios are fully compliant with financial regulations, protected by secure KYC check-ins and structured subscription limits.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 2: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-4xl font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
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
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Side-by-Side Comparison
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                Compare multiple business opportunities side-by-side using ROI projections, growth stage, capital requirements, and locations.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-4xl font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
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
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Direct Chat Requests
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                Connect with entrepreneurs directly. Submit message requests, and engage in real-time encrypted chats once approved.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4: Border outline style */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer"
          >
            {/* Card Number */}
            <h1 className="text-4xl font-heading font-black text-[#064e3b]/30 group-hover:text-[#064e3b] transition-colors duration-300">
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
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Consultant Monetization
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
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
