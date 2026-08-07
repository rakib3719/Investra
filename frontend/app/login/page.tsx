"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"Investor" | "Entrepreneur" | "Consultant">("Investor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signed in to Investra as ${selectedRole} (${email})!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6 relative overflow-hidden">
        {/* Ambient Gradient Mesh Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#064e3b]/10 via-[#10b981]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-2xl space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#064e3b]/20">
              <Lock className="w-6 h-6 text-[#10b981]" />
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800 tracking-tight">
              Sign In to Investra
            </h1>
            <p className="text-xs text-slate-500 font-body">
              Access your role-based venture network & dashboard
            </p>
          </div>

          {/* Role Switcher Pills */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
              Select Your Active Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setSelectedRole("Investor")}
                className={`py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center justify-center gap-1 ${
                  selectedRole === "Investor"
                    ? "bg-[#064e3b] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Investor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("Entrepreneur")}
                className={`py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center justify-center gap-1 ${
                  selectedRole === "Entrepreneur"
                    ? "bg-[#064e3b] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Uddokta</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("Consultant")}
                className={`py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center justify-center gap-1 ${
                  selectedRole === "Consultant"
                    ? "bg-[#064e3b] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Consultant</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-body">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">Password</label>
                <a href="#" className="text-[11px] text-[#064e3b] font-bold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Privilege Helper */}
            <div className="p-3 rounded-xl bg-[#064e3b]/5 border border-[#064e3b]/10 text-[11px] text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
              <span>
                {selectedRole === "Investor" && "Signing in unlocks side-by-side deal comparison & founder chat."}
                {selectedRole === "Entrepreneur" && "Signing in unlocks business posting & investor engagement analytics."}
                {selectedRole === "Consultant" && "Signing in unlocks session hosting & 80/20 revenue ledger."}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#064e3b] hover:bg-[#043c2e] text-white font-heading font-extrabold py-3.5 rounded-xl text-xs transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Sign In as {selectedRole}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
          </form>

          {/* Social Auth */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <hr className="w-full border-slate-200" />
              <span className="absolute bg-white px-3 text-[10px] uppercase font-bold text-slate-400">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={() => alert("Google OAuth Authentication initiated...")}
              className="w-full border border-slate-200 hover:bg-slate-50 font-heading font-bold py-2.5 rounded-xl text-xs text-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaGoogle className="w-3.5 h-3.5 text-red-500" />
              <span>Google Account</span>
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-500 font-body">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#064e3b] hover:underline">
              Create an Account
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
