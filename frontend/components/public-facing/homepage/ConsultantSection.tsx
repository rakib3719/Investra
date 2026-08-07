"use client";

import React from "react";
import Image from "next/image";
import { FiUser, FiArrowRight } from "react-icons/fi";
import ShinyText from "@/components/ui/ShinyText";

const ConsultantSection = () => {
  return (
    <section className="w-full bg-slate-50 py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Tall Large Representative Image */}
          <div className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xs border border-slate-100 group">
            <Image
              src="/female-advisor.png"
              alt="Investra Lead Consultant"
              fill
              sizes="(max-w-768px) 100vw, 40vw"
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            {/* Soft Green Gradient Overlay on bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/30 via-transparent to-transparent" />
          </div>

          {/* Right Column: Content & Advisor Grid */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Text */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064e3b] font-heading">
                Expert Advisory
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1e293b] leading-tight">
                Empowering <ShinyText text="Venture Growth" speed={3.5} className="italic font-black text-[#064e3b]" />, One Session at a Time
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-body">
                Navigating startup fundraising and business growth requires deep sector expertise. Our certified consultants work alongside you, tailoring business models, refining pitches, and maximizing revenue potential.
              </p>
            </div>

            {/* Advisor Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              
              {/* Profile Card 1 */}
              <div className="sm:col-span-4 relative group h-[180px] rounded-xl overflow-hidden border border-slate-100 shadow-xs">
                <Image
                  src="/advisor_marco.png"
                  alt="Marco Jansen"
                  fill
                  sizes="150px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs border border-white/20">
                  <FiUser className="w-3.5 h-3.5 text-[#064e3b] flex-shrink-0" />
                  <span className="text-[10px] font-heading font-bold text-slate-800 truncate">
                    Marco Jansen
                  </span>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="sm:col-span-4 relative group h-[180px] rounded-xl overflow-hidden border border-slate-100 shadow-xs">
                <Image
                  src="/advisor_labonno.png"
                  alt="Labonno"
                  fill
                  sizes="150px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs border border-white/20">
                  <FiUser className="w-3.5 h-3.5 text-[#064e3b] flex-shrink-0" />
                  <span className="text-[10px] font-heading font-bold text-slate-800 truncate">
                    Labonno
                  </span>
                </div>
              </div>

              {/* Styled Branding Text next to photos */}
              <div className="sm:col-span-4 pl-0 sm:pl-2">
                <p className="font-heading font-extrabold text-sm md:text-base text-[#064e3b] leading-tight border-l-2 border-[#064e3b] pl-3">
                  Your Partners In Startup Success
                </p>
                <p className="text-[10px] text-slate-500 font-body mt-2 leading-relaxed">
                  Experienced business strategists ready to design your scaling roadmap.
                </p>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Connect with our expert team to understand business metrics, transaction structures, and the detailed performance of our active modules.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-6 py-3 rounded-lg transition-colors font-heading shadow-xs flex items-center gap-2">
                  <span>Connect with an Advisor</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-slate-200 hover:border-[#064e3b] text-slate-700 hover:text-[#064e3b] text-xs font-bold px-6 py-3 rounded-lg transition-colors font-heading">
                  Learn about Advisory Rates
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ConsultantSection;
