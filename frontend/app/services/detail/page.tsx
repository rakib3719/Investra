"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3, 
  Scale, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Lock
} from "lucide-react";

export default function ServiceDetailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#085a45] to-[#064e3b] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#10b981] text-xs font-extrabold uppercase tracking-widest font-heading">
            <FileText className="w-3.5 h-3.5" />
            <span>Specialized Platform Service</span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Venture Due Diligence & ESG Audit Framework
          </h1>

          <p className="font-body text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every business opportunity listed on InvestConnect undergoes rigorous multi-step legal validation, financial forecasting checks, and sustainability audits.
          </p>
        </div>
      </section>

      {/* Detail Content */}
      <main className="max-w-[1200px] mx-auto w-full px-6 py-16 flex-1 space-y-12">
        
        {/* Overview Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="font-heading font-black text-2xl text-slate-800">
            Institutional Vetting Methodology
          </h2>
          <p className="text-sm text-slate-600 font-body leading-relaxed">
            Our due diligence pipeline combines automated telemetry with expert review from certified financial analysts and legal partners. Investors receive complete transparency before issuing term sheets or committing capital.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">Cap Table & Legal Audit</h3>
              <p className="text-xs text-slate-500 font-body">Verification of corporate registration, founder equity stakes, and debt obligations.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">Financial Model Stress Test</h3>
              <p className="text-xs text-slate-500 font-body">Validation of historical MRR, unit economics, valuation multiples, and cash runway.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">ESG Sustainability Scoring</h3>
              <p className="text-xs text-slate-500 font-body">Impact audit measuring carbon offsets, solar yield metrics, and community development.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold">
              Ready to submit your startup pitch for vetting?
            </h3>
            <p className="text-xs text-slate-200 font-body">
              Entrepreneurs (Uddokta) can get featured across our investor directory.
            </p>
          </div>

          <Link
            href="/register"
            className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold px-6 py-3 rounded-xl text-xs transition-all shrink-0 flex items-center gap-2"
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
