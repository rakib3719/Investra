"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister, useMe } from "@/features/auth/hooks/use-auth";
import { useToast } from "@/components/ui/Toast";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import { Mail, Lock, User as UserIcon, ArrowLeft, Loader2, ArrowRight, ShieldCheck, Check, Briefcase, Star, Users } from "lucide-react";

type UserRole = "INVESTOR" | "ENTREPRENEUR" | "CONSULTANT";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const registerMutation = useRegister();
  const { data: currentUser } = useMe();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("INVESTOR");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleNextStep = () => {
    if (step === 1 && !role) {
      toast.error("Role Required", "Please select your ecosystem role to proceed.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error("Validation Error", "Please fill in all details.");
      return;
    }
    if (password.length < 8) {
      toast.error("Validation Error", "Password must be at least 8 characters long.");
      return;
    }

    registerMutation.mutate(
      { firstName, lastName, email, password, role },
      {
        onSuccess: (data) => {
          toast.success("Account Created", "Your account has been registered! Please check email verification steps.");
          setStep(3);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || err.message || "Registration failed.";
          const formattedMsg = Array.isArray(errMsg) ? errMsg.join(". ") : errMsg;
          toast.error("Registration Failed", formattedMsg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-body">
      
      {/* Header */}
      <header className="py-6 px-6 md:px-12 border-b border-slate-100 bg-white">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : router.push("/")} 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors font-heading">
              {step > 1 ? "Go Back" : "Back to Home"}
            </span>
          </button>
          
          <Link href="/" className="flex items-center gap-2.5">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-heading font-black text-lg tracking-tight text-secondary">
              Investra
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-xl">
          
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.05)"
            className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-xs space-y-8"
          >
            
            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-heading ${step >= 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>1</div>
              <div className={`h-0.5 w-10 ${step >= 2 ? "bg-primary" : "bg-slate-100"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-heading ${step >= 2 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>2</div>
              <div className={`h-0.5 w-10 ${step >= 3 ? "bg-primary" : "bg-slate-100"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-heading ${step >= 3 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>3</div>
            </div>

            {/* STEP 1: Select Role */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full font-heading">
                    Ecosystem Identity
                  </span>
                  <h2 className="text-2xl md:text-3xl font-heading font-black text-secondary">
                    Choose your <ShinyText text="Platform Role" speed={4} />
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[340px] mx-auto">
                    Select your workspace layout. You can pivot or adjust details inside settings later.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Investor Option */}
                  <div
                    onClick={() => setRole("INVESTOR")}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      role === "INVESTOR"
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === "INVESTOR" ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200/50"}`}>
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold font-heading text-secondary">Platform Investor</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Discover validated pitches, track comparisons, and allocate seed capital.</p>
                    </div>
                    {role === "INVESTOR" && <Check className="w-5 h-5 text-primary shrink-0" />}
                  </div>

                  {/* Entrepreneur Option */}
                  <div
                    onClick={() => setRole("ENTREPRENEUR")}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      role === "ENTREPRENEUR"
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === "ENTREPRENEUR" ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200/50"}`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold font-heading text-secondary">Entrepreneur (Uddokta)</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Post your startup concepts, monitor investor metrics, and scale campaigns.</p>
                    </div>
                    {role === "ENTREPRENEUR" && <Check className="w-5 h-5 text-primary shrink-0" />}
                  </div>

                  {/* Consultant Option */}
                  <div
                    onClick={() => setRole("CONSULTANT")}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      role === "CONSULTANT"
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === "CONSULTANT" ? "bg-primary text-white" : "bg-white text-slate-500 border border-slate-200/50"}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold font-heading text-secondary">Verified Consultant</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Monetize your niche advising, host Zoom cohorts, and guide startups.</p>
                    </div>
                    {role === "CONSULTANT" && <Check className="w-5 h-5 text-primary shrink-0" />}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-[#043c2e] text-white py-3.5 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue Account Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Fill Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1 text-center">
                  <h3 className="text-2xl font-heading font-black text-secondary">Account Credentials</h3>
                  <p className="text-xs text-slate-400">Fill in your credential details to set up your verified profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">First Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Last Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Register email address"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-primary hover:bg-[#043c2e] disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Ecosystem Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify and Register</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: Verification success message */}
            {step === 3 && (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-primary border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-black text-secondary">Ecosystem Account Created!</h3>
                  <p className="text-xs text-slate-500 font-body leading-relaxed max-w-sm mx-auto">
                    We've registered your profile details. An activation email has been routed to{" "}
                    <span className="font-bold text-slate-700">{email}</span>. Please verify your address to access dashboard actions.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="bg-primary hover:bg-[#043c2e] text-white px-6 py-2.5 rounded-xl text-xs font-bold font-heading transition-colors inline-block cursor-pointer"
                >
                  Return to Client Login
                </Link>
              </div>
            )}

            {step < 3 && (
              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400 font-body">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-bold hover:underline font-heading">
                    Login here
                  </Link>
                </p>
              </div>
            )}

          </SpotlightCard>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center text-[10px] text-slate-400 font-body">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center px-6 md:px-12 gap-2">
          <p>© {new Date().getFullYear()} Investra. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted connection</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
