"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3, 
  Scale, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Lock,
  Building2,
  FileSpreadsheet,
  Leaf
} from "lucide-react";

export default function ServiceDetailPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System (White & Green 2-Column Layout) */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <FileText className="w-3.5 h-3.5" />
              <span>Specialized Vetting Service</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Due Diligence.<br />
              Institutional Audit,<br />
              <ShinyText text="Complete Transparency." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Every business opportunity listed on Investra undergoes rigorous multi-step legal validation, financial forecasting checks, and sustainability audits.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/register" className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs">
                Submit Deal for Vetting
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Visual Image */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
              alt="Investra Due Diligence Service"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Detail Content */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-16 flex-1 space-y-12">
        
        {/* Overview Card */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] font-heading">
              Governance Framework
            </span>
            <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-800">
              Institutional Vetting Methodology
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-body leading-relaxed max-w-3xl">
              Our due diligence pipeline combines automated telemetry with expert review from certified financial analysts and legal partners. Investors receive complete transparency before issuing term sheets or committing capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-800">1. Cap Table & Legal Audit</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Verification of corporate registration, founder equity stakes, and debt obligations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-800">2. Financial Stress Test</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Validation of historical MRR, unit economics, valuation multiples, and cash runway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-slate-800">3. ESG Sustainability Audit</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Impact audit measuring carbon offsets, solar yield metrics, and community development.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-heading text-xl md:text-3xl font-black">
              Ready to submit your startup pitch for vetting?
            </h3>
            <p className="text-xs md:text-sm text-slate-200 font-body max-w-xl">
              Entrepreneurs (Uddokta) can get featured across our investor directory.
            </p>
          </div>

          <Link
            href="/register"
            className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold px-8 py-4 rounded-2xl text-xs transition-all shrink-0 flex items-center gap-2"
          >
            <span>Submit Startup Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
