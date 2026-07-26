"use client";

import React from "react";

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
              <span className="text-[#064e3b] italic">Your Sustainable Success</span>
            </h2>
          </div>

          <div className="md:col-span-6">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-body">
              At Investra, we merge high-yield investment strategies with verified environmental stewardship. We do not compromise on security, compliance, or transparency, ensuring your wealth grows alongside a healthier planet.
            </p>
          </div>

        </div>

        {/* Bottom Section - Animated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Filled Primary Brand Color */}
          <section className="bg-[#064e3b] p-6 rounded-2xl h-[360px] relative overflow-hidden transition-all duration-500 group shadow-xs hover:shadow-md cursor-pointer">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

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
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-lg md:text-xl font-heading font-bold text-white transition-transform duration-500 group-hover:-translate-y-28">
                100% Regulated & Secure
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-100 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                All investments are fully compliant with financial regulations, protected by bank-grade encryption and regular compliance checks.
              </p>
            </div>
          </section>

          {/* Card 2: Border outline style */}
          <section className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] relative overflow-hidden transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer">
            {/* Green Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/5 to-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

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
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Fractional Eco-Investing
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                Start with as little as $100. Diversify your wealth seamlessly across forestry, wind, solar, and other vetted ESG initiatives.
              </p>
            </div>
          </section>

          {/* Card 3: Border outline style */}
          <section className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] relative overflow-hidden transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer">
            {/* Green Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/5 to-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

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
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Real-Time Yield Tracking
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                Monitor your project dividends, cash payouts, and audited carbon offset certificates directly through a real-time investor dashboard.
              </p>
            </div>
          </section>

          {/* Card 4: Border outline style */}
          <section className="border border-slate-200 p-6 bg-white rounded-2xl h-[360px] relative overflow-hidden transition-all duration-500 group hover:border-[#064e3b]/30 shadow-xs hover:shadow-md cursor-pointer">
            {/* Green Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/5 to-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

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
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-lg md:text-xl font-heading font-bold text-[#1e293b] group-hover:text-[#064e3b] transition-all duration-500 group-hover:-translate-y-28">
                Expert ESG Stewardship
              </h3>

              {/* Paragraph moves up on hover */}
              <p className="absolute bottom-0 left-0 w-full text-slate-600 text-xs md:text-sm opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-body leading-relaxed">
                Our environmental analysts manage capital stewardship and audit project cycles to optimize return-on-investment profiles.
              </p>
            </div>
          </section>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
