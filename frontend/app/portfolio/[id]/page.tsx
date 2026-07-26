"use client";

import React, { use } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ExternalLink, ShieldCheck, Mail, MapPin, Calendar, Award, Lock, Briefcase, Users, TrendingUp } from "lucide-react";
import { portfolioData } from "../data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PortfolioDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const idNum = parseInt(resolvedParams.id, 10);
  const item = portfolioData.find((p) => p.id === idNum);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <h2 className="text-2xl font-heading font-black text-secondary">Profile Listing Not Found</h2>
          <p className="text-xs text-slate-500 font-body max-w-sm">The selected portfolio profile details could not be found or has been archived.</p>
          <Link href="/portfolio" className="primary-button text-xs font-bold font-heading">
            Return to Portfolio Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-24">
        
        {/* Top Cover Image Hero Banner */}
        <section className="relative h-[320px] md:h-[400px] w-full bg-slate-900 overflow-hidden border-b border-slate-200">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-955/90 via-slate-900/40 to-transparent" />
          
          {/* Back Button and Info Row */}
          <div className="absolute inset-0 max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] flex flex-col justify-between py-8">
            
            {/* Back Button */}
            <div>
              <Link 
                href="/portfolio" 
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl px-4 py-2 text-xs font-bold font-heading transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </Link>
            </div>

            {/* Float Profile Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-2xl overflow-hidden border-4 border-white bg-white shrink-0 shadow-md">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-4xl font-heading font-black text-white leading-tight">
                      {item.name}
                    </h1>
                    <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 font-body leading-none">{item.subtitle}</p>
                </div>
              </div>

              {/* Floating metrics tags on cover */}
              <div className="flex gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full font-heading backdrop-blur-md">
                  Vetting Score: PASSED
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-full font-heading backdrop-blur-md">
                  Escrow: ACTIVE
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* 3-Column Structured Layout Grid */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: Profile metadata & certifications (4/12 span) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Bio Data & Contacts */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">Bio Data Info</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>

                <div className="space-y-4 text-xs font-body text-slate-600">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>Registered: verified@investra.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>Gulshan Avenue, Dhaka, BD</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>Active Hours: 10:00 am - 6:00 pm</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-heading">Sourcing Status</span>
                  <p className="text-xs font-semibold text-slate-700 font-body">Direct contact requests are currently moderated by platform admins.</p>
                </div>
              </SpotlightCard>

              {/* Card 2: Audited Certification Dossier */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">Compliance Checklist</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>

                <ul className="space-y-3.5">
                  {item.details.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-body leading-relaxed">
                      <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              {/* Card 3: Active Tags */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">Focus Verticals</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200/50 text-slate-600 text-[10px] px-3 py-1 rounded-lg font-bold font-heading">
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>

            </div>

            {/* COLUMN 2: Long story, Milestones & Gallery (5/12 span) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Story Details */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">The Strategic Story</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed whitespace-pre-line">
                  {item.details.story}
                </p>
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                  <p className="text-xs text-primary font-body font-bold leading-relaxed">
                    "All metrics displayed have been audited under Investra's standard compliance checks. Connection requires subscription plan verification."
                  </p>
                </div>
              </SpotlightCard>

              {/* Card 2: Milestones Timeline */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-6 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">Platform Milestones</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>

                <div className="relative pl-6 border-l border-slate-100 space-y-6">
                  {item.details.milestones.map((ms, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle dot on line */}
                      <span className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-4 border-white shadow-2xs" />
                      <span className="text-[10px] font-bold text-primary font-heading uppercase tracking-wider">{ms.year}</span>
                      <h4 className="text-xs font-bold text-secondary font-heading mt-0.5">{ms.title}</h4>
                      <p className="text-[11px] text-slate-500 font-body mt-1 leading-relaxed">{ms.description}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              {/* Card 3: Operations Gallery */}
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.03)" className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-heading font-black text-secondary uppercase tracking-wider">Operations Showcase</h3>
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {item.details.gallery.map((galImg, idx) => (
                    <div key={idx} className="relative h-28 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-3xs">
                      <img
                        src={galImg}
                        alt="Operational scene"
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </SpotlightCard>

            </div>

            {/* COLUMN 3: Sticky Action Hub Card (3/12 span) */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
              
              <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.04)" className="bg-white border border-slate-200/60 rounded-[28px] p-6 space-y-6 shadow-xs">
                
                <div className="space-y-1 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-heading">Focus Parameters</span>
                  <h3 className="text-lg font-heading font-black text-secondary">Connection parameters</h3>
                </div>

                {/* 3-column stats list vertical */}
                <div className="space-y-4 pt-2">
                  
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-body">{item.metrics.label1}</span>
                    <span className="font-heading font-black text-secondary">{item.metrics.value1}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-body">{item.metrics.label2}</span>
                    <span className="font-heading font-black text-secondary">{item.metrics.value2}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-body">{item.metrics.label3}</span>
                    <span className="font-heading font-black text-secondary">{item.metrics.value3}</span>
                  </div>

                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  
                  <button className="w-full bg-primary hover:bg-[#043c2e] text-white py-3 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs">
                    <span>Request Connection</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer text-center border border-slate-200/50">
                    Download Vetting Dossier
                  </button>

                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-body pt-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Stripe Secure Vetted Profile</span>
                </div>

              </SpotlightCard>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
