"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Image from "next/image";
import { ShieldCheck, Target, Users, Award, Handshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-20">
        
        {/* Page Hero */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Our Identity
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              Bridging Capital and <br />
              <ShinyText text="Venture Ambition" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              InvestConnect is a next-generation investment networking platform designed to bring together Investors, Entrepreneurs, and Consultants in a highly secure, subscription-driven ecosystem.
            </p>
          </div>
        </section>

        {/* Vision & Core Mission Cards */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.06)" className="bg-white border border-slate-200/60 rounded-[32px] p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-heading font-black text-secondary">Our Vision</h2>
              <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
                To simplify how seed capital and mentorship find scalable business startups. By stripping away middle layers, we allow entrepreneurs to secure backing, investors to review transparent metrics, and consultants to share knowledge.
              </p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.06)" className="bg-white border border-slate-200/60 rounded-[32px] p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-heading font-black text-secondary">Our Core Vetting Standards</h2>
              <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
                Security and legitimacy are core parameters. All startup listings undergo thorough KYC verification, bank checks, and financial viability auditing to ensure a trusted framework for all participants.
              </p>
            </SpotlightCard>

          </div>
        </section>

        {/* Corporate Advisory Board / Advisors */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-heading">Advisory Council</span>
            <h2 className="text-3xl font-heading font-black text-secondary">Meet Our Elite Consultants</h2>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Highly certified sector experts providing guidance, review, and premium mentorship sessions on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Consultant 1 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.06)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 shadow-xs">
                  <Image
                    src="/advisor_labonno.png"
                    alt="Labonno"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-heading font-black text-secondary">Labonno</h3>
                  <p className="text-[10px] text-primary font-bold font-heading uppercase tracking-wider">Lead AgriTech Advisor</p>
                </div>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Over 10 years of experience directing startup supply chain logistics and organic agriculture business modeling.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-heading font-bold text-slate-400">
                <span>REVENUE SHARE: 80%</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Verified</span>
              </div>
            </SpotlightCard>

            {/* Consultant 2 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.06)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 shadow-xs">
                  <Image
                    src="/advisor_marco.png"
                    alt="Marco Jansen"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-heading font-black text-secondary">Marco Jansen</h3>
                  <p className="text-[10px] text-primary font-bold font-heading uppercase tracking-wider">SaaS & Growth Strategist</p>
                </div>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Specializes in B2B SaaS scaling, recurring billing integrations, and multi-stage venture capital pitches.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-heading font-bold text-slate-400">
                <span>REVENUE SHARE: 80%</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Verified</span>
              </div>
            </SpotlightCard>

            {/* Consultant 3 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.06)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 shadow-xs flex items-center justify-center text-slate-300">
                  <Users className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-black text-secondary">Join As Consultant</h3>
                  <p className="text-[10px] text-slate-400 font-bold font-heading uppercase tracking-wider">Share Expertise</p>
                </div>
                <p className="text-xs text-slate-500 font-body leading-relaxed">
                  Create Zoom cohorts, publish pre-recorded video tutorials, track session earnings, and build a consulting presence.
                </p>
              </div>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer mt-4">
                Become a Mentor
              </button>
            </SpotlightCard>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
