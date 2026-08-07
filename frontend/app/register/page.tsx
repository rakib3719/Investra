"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { 
  UserCheck, 
  Mail, 
  Lock, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"Investor" | "Entrepreneur" | "Consultant">("Investor");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Account created successfully for ${fullName} as ${role}! Redirecting to onboarding...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#064e3b]/10 via-[#10b981]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-2xl space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Investra Venture Network</span>
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
              Create Your Role-Based Profile
            </h1>
            <p className="text-xs text-slate-500 font-body">
              Select how you want to participate in the investment ecosystem
            </p>
          </div>

          {/* Role Cards Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Investor Card */}
            <button
              type="button"
              onClick={() => setRole("Investor")}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-2 cursor-pointer ${
                role === "Investor"
                  ? "border-[#064e3b] bg-[#064e3b]/5 ring-2 ring-[#064e3b]/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-4 h-4 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-slate-800">Investor</h3>
                <p className="text-[10px] text-slate-500 font-body leading-snug">Discover & compare deal matrix</p>
              </div>
            </button>

            {/* Entrepreneur Card */}
            <button
              type="button"
              onClick={() => setRole("Entrepreneur")}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-2 cursor-pointer ${
                role === "Entrepreneur"
                  ? "border-[#064e3b] bg-[#064e3b]/5 ring-2 ring-[#064e3b]/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shadow-xs">
                <Briefcase className="w-4 h-4 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-slate-800">Uddokta</h3>
                <p className="text-[10px] text-slate-500 font-body leading-snug">Publish pitches & raise capital</p>
              </div>
            </button>

            {/* Consultant Card */}
            <button
              type="button"
              onClick={() => setRole("Consultant")}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-2 cursor-pointer ${
                role === "Consultant"
                  ? "border-[#064e3b] bg-[#064e3b]/5 ring-2 ring-[#064e3b]/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4 h-4 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xs text-slate-800">Consultant</h3>
                <p className="text-[10px] text-slate-500 font-body leading-snug">Paid sessions (80% share)</p>
              </div>
            </button>

          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 font-body">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Syed Rakib Hasan"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Work Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rakib@venturefund.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 transition-all"
              />
            </div>

            {/* Privilege Card */}
            <div className="p-4 bg-[#064e3b]/5 rounded-2xl border border-[#064e3b]/10 space-y-1.5">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-heading">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>Selected Privileges ({role})</span>
              </div>
              <p className="text-[11px] text-slate-600 font-body leading-relaxed">
                {role === "Investor" && "Unlimited side-by-side deal comparison, deal bookmarking, and direct founder chat access."}
                {role === "Entrepreneur" && "Create business campaign posts, track investor telemetry views, and access advisors."}
                {role === "Consultant" && "Publish 1-on-1 mentoring sessions, courses, and keep 80% of generated revenue."}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#064e3b] hover:bg-[#043c2e] text-white font-heading font-extrabold py-3.5 rounded-xl text-xs transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Complete {role} Registration</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-500 font-body">
            Already have an active account?{" "}
            <Link href="/login" className="font-bold text-[#064e3b] hover:underline">
              Sign In Here
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
