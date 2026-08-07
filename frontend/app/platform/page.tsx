"use client";

import React from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#085a45] to-[#064e3b] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#10b981] text-xs font-extrabold uppercase tracking-widest font-heading">
            <Layers className="w-3.5 h-3.5" />
            <span>Investra System Architecture</span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Scalable, Role-Based Platform & Technology Stack
          </h1>

          <p className="font-body text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Engineered with modern software design patterns, NestJS REST API, PostgreSQL, Redis caching, and real-time WebSockets for institutional performance and security.
          </p>
        </div>
      </section>

      {/* Main Architecture Content */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-16 flex-1 space-y-16">
        
        {/* Visual Architecture Pipeline */}
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
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">1. Next.js Client</h3>
              <p className="text-xs text-slate-500 font-body">App Router, SSR deal discovery, Tailwind v4 global design system.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">2. NestJS REST API</h3>
              <p className="text-xs text-slate-500 font-body">Modular controllers, DTO validation, service layer & guards.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">3. Redis Cache</h3>
              <p className="text-xs text-slate-500 font-body">Rate limiting, session store, high-frequency query caching.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group hover:border-[#10b981] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-[#10b981] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-slate-800">4. PostgreSQL</h3>
              <p className="text-xs text-slate-500 font-body">Prisma ORM schema, indexed relational model & foreign keys.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-[#064e3b] text-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group">
              <div className="w-10 h-10 rounded-xl bg-[#10b981] text-[#064e3b] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm">5. Socket.IO Engine</h3>
              <p className="text-xs text-slate-200 font-body">Real-time WebSocket chat rooms & instant notifications.</p>
            </div>
          </div>
        </div>

        {/* 6 Core Architectural Modules */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-black text-2xl md:text-3xl text-slate-800">
              Core Technical Pillars & Security
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-body max-w-xl mx-auto">
              Built to strictly enforce business rules, RBAC controls, and payment webhooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                Dynamic RBAC & Sub-Admin PBAC
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Granular authorization guards enforcing unique rights for Investors, Entrepreneurs, Consultants, Admins, and Sub-Admins with module permissions.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> JWT Bearer Strategy</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Permission Guards</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                Stripe & SSLCommerz Webhooks
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Dual payment processor support handling international cards via Stripe Checkout and Bangladesh local banking via SSLCommerz with idempotent webhook handlers.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Automated Subscription Renewal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Transaction History Audit Logs</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                Subscription-Gated Premium Chat
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Real-time Socket.IO WebSocket server with approval handshake logic before room initialization and historical message persistence in PostgreSQL.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Connection Request Approval</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Read Receipt Status</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                Prisma ORM & PostgreSQL Database
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Relational schema modeling Users, Business Posts, Subscriptions, Transactions, Bookmarks, Chats, Courses, and System Audit Logs.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Indexed Foreign Keys</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Migration Versioning</li>
              </ul>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                80/20 Consultant Revenue Ledger
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Automated calculation split allocating 80% to consultant balances and 20% to platform fees with payout status tracking.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Automated Ledger Entries</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Capacity Enforcement</li>
              </ul>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                System Telemetry & Audit Logs
              </h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Global interceptors recording API response latencies, security exceptions, rate limit triggers, and administrative actions.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-500 font-body pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Response Interceptors</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Global Exception Filters</li>
              </ul>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#064e3b] to-[#0d6e53] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-heading text-xl md:text-2xl font-bold">
              Ready to explore our deal directory or active subscription tiers?
            </h3>
            <p className="text-xs md:text-sm text-slate-200 max-w-xl font-body">
              Join thousands of investors, high-growth Uddokta entrepreneurs, and expert consultants in our unified ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/funds"
              className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold px-5 py-3 rounded-xl text-xs transition-all duration-200 shadow-md"
            >
              Explore Deals
            </Link>
            <Link
              href="/subscription"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-heading font-bold px-5 py-3 rounded-xl text-xs transition-all duration-200"
            >
              Subscription Plans
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
