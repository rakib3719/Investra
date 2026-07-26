"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, useMe } from "@/features/auth/hooks/use-auth";
import { useToast } from "@/components/ui/Toast";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import { Mail, Lock, ArrowLeft, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const loginMutation = useLogin();
  const { data: currentUser } = useMe();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Validation Error", "Please fill in all credentials.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("Login Successful", `Welcome back, ${data.user.firstName}!`);
          router.push("/");
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || err.message || "Invalid credentials.";
          const formattedMsg = Array.isArray(errMsg) ? errMsg.join(". ") : errMsg;
          toast.error("Authentication Failed", formattedMsg);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-body">
      
      {/* Upper Navigation/Branding header */}
      <header className="py-6 px-6 md:px-12 border-b border-slate-100 bg-white">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors font-heading">
              Back to Home
            </span>
          </Link>
          
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

      {/* Main Login Card Panel Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md">
          
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.05)"
            className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-10 shadow-xs space-y-8"
          >
            
            {/* Header info */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1 rounded-full font-heading">
                Client Workspace
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-black text-secondary">
                Login to <ShinyText text="Investra" speed={4} />
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Securely log in to manage investments, ideas, or consultation sessions.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter verified email"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold font-heading text-slate-500 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-[10px] text-primary hover:underline font-bold font-heading">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs text-secondary outline-hidden transition-all shadow-2xs font-body"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary hover:bg-[#043c2e] disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Verify and Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400 font-body">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline font-heading">
                  Register here
                </Link>
              </p>
            </div>

          </SpotlightCard>
          
        </div>
      </main>

      {/* Footer copyright bar */}
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
