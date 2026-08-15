"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  Layers, 
  ShieldCheck, 
  Database, 
  Zap, 
  Lock, 
  Cpu, 
  Globe, 
  CreditCard, 
  MessageSquare, 
  Server, 
  Sparkles, 
  ArrowRight,
  Code2,
  CheckCircle2
} from "lucide-react";

export default function PlatformArchitecturePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <Layers className="w-3.5 h-3.5" />
              <span>Platform Architecture & Tech Stack</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              High-Performance Tech.<br />
              NestJS & PostgreSQL,<br />
              <ShinyText text="Real-Time Scalability." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Engineered with modern software design patterns, NestJS REST API, PostgreSQL, Redis caching, and real-time WebSockets for institutional security.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/subscription" className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs md:text-sm font-bold px-6 py-3 rounded-lg transition-colors shadow-xs">
                View Subscriptions
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Visual Image */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
              alt="Investra Platform Technology"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Architecture Content */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-16 flex-1 space-y-16">
        
        {/* End-to-End Pipeline */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-800">
              End-to-End System Pipeline
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-body max-w-xl mx-auto">
              How data flows seamlessly from Next.js frontend clients to PostgreSQL and Redis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">1. Next.js Client</h3>
              <p className="text-xs text-slate-500 font-body">App Router, SSR deal discovery, Tailwind v4 global design system.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">2. NestJS REST API</h3>
              <p className="text-xs text-slate-500 font-body">Modular controllers, DTO validation, service layer & guards.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">3. Redis Cache</h3>
              <p className="text-xs text-slate-500 font-body">Rate limiting, session store, high-frequency query caching.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">4. PostgreSQL</h3>
              <p className="text-xs text-slate-500 font-body">Prisma ORM schema, indexed relational model & foreign keys.</p>
            </div>

            <div className="bg-[#064e3b] text-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#10b981] text-[#064e3b] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm">5. Socket.IO Engine</h3>
              <p className="text-xs text-slate-200 font-body">Real-time WebSocket chat rooms & instant notifications.</p>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-800">
              Dynamic RBAC & Sub-Admin PBAC
            </h3>
            <p className="text-xs text-slate-600 font-body leading-relaxed">
              Granular authorization guards enforcing unique rights for Investors, Entrepreneurs, Consultants, Admins, and Sub-Admins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-800">
              Stripe & SSLCommerz Webhooks
            </h3>
            <p className="text-xs text-slate-600 font-body leading-relaxed">
              Dual payment processor support handling international cards via Stripe Checkout and Bangladesh local banking via SSLCommerz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-800">
              80/20 Consultant Revenue Ledger
            </h3>
            <p className="text-xs text-slate-600 font-body leading-relaxed">
              Automated calculation split allocating 80% to consultant balances and 20% to platform fees with payout tracking.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
