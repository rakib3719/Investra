"use client";

import React from "react";
import Image from "next/image";
import { FiUser, FiArrowRight } from "react-icons/fi";
import ShinyText from "@/components/ui/ShinyText";

const ConsultantSection = () => {
  return (
    <section className="w-full bg-slate-50/80 py-[55px] md:py-[89px] border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        
        {/* Main Grid Layout: Golden Ratio Split (1fr : 1.618fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.618fr] gap-[34px] lg:gap-[55px] items-center">
          
          {/* Left Column (38.2%): Representative Portrait Image */}
          <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[580px] rounded-[26px] overflow-hidden shadow-sm border border-slate-200/80 group">
            <Image
              src="/female-advisor.png"
              alt="Investra Lead Consultant"
              fill
              sizes="(max-w-768px) 100vw, 40vw"
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            {/* Soft Green Gradient Overlay on bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/40 via-transparent to-transparent" />
          </div>

          {/* Right Column (61.8%): Content & Advisor Grid */}
          <div className="space-y-[26px]">
            
            {/* Header Text */}
            <div className="space-y-[13px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#064e3b] font-heading">
                Expert Advisory • Strategic Velocity
              </span>
              <h2 className="text-[34px] md:text-[42px] font-heading font-black text-[#1e293b] leading-[1.15]">
                Empowering <ShinyText text="Venture Growth" speed={3.5} className="italic font-black text-[#064e3b]" />, One Session at a Time
              </h2>
              <p className="text-[14px] md:text-[16px] text-slate-600 leading-[26px] font-body">
                Navigating startup fundraising and business growth requires deep sector expertise. Our certified consultants work alongside you, tailoring business models, refining pitches, and maximizing revenue potential.
              </p>
            </div>

            {/* Advisor Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-[21px] items-center">
              
              {/* Profile Card 1 */}
              <div className="sm:col-span-4 relative group h-[190px] rounded-[16px] overflow-hidden border border-slate-200/80 shadow-2xs">
                <Image
                  src="/advisor_marco.png"
                  alt="Marco Jansen"
                  fill
                  sizes="180px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs border border-white/20">
                  <FiUser className="w-3.5 h-3.5 text-[#064e3b] flex-shrink-0" />
                  <span className="text-[11px] font-heading font-bold text-slate-800 truncate">
                    Marco Jansen
                  </span>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="sm:col-span-4 relative group h-[190px] rounded-[16px] overflow-hidden border border-slate-200/80 shadow-2xs">
                <Image
                  src="/advisor_labonno.png"
                  alt="Labonno"
                  fill
                  sizes="180px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs border border-white/20">
                  <FiUser className="w-3.5 h-3.5 text-[#064e3b] flex-shrink-0" />
                  <span className="text-[11px] font-heading font-bold text-slate-800 truncate">
                    Labonno
                  </span>
                </div>
              </div>

              {/* Styled Branding Text next to photos */}
              <div className="sm:col-span-4 pl-0 sm:pl-2">
                <p className="font-heading font-extrabold text-[15px] text-[#064e3b] leading-tight border-l-2 border-[#064e3b] pl-3">
                  Your Partners In Startup Success
                </p>
                <p className="text-[11px] text-slate-500 font-body mt-2 leading-[18px]">
                  Experienced business strategists ready to design your scaling roadmap.
                </p>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="pt-[21px] border-t border-slate-200/80 space-y-[16px]">
              <p className="text-[13px] text-slate-600 font-body leading-[21px]">
                Connect with our expert team to understand business metrics, transaction structures, and the detailed performance of our active modules.
              </p>
              <div className="flex flex-wrap items-center gap-[16px]">
                <button className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-[13px] font-bold px-[26px] py-[13px] rounded-[10px] transition-colors font-heading shadow-xs flex items-center gap-2 cursor-pointer">
                  <span>Connect with an Advisor</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <button className="border border-slate-200 hover:border-[#064e3b] text-slate-700 hover:text-[#064e3b] text-[13px] font-bold px-[26px] py-[13px] rounded-[10px] transition-colors font-heading cursor-pointer">
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
