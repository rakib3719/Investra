"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  Check, 
  Info, 
  ShieldAlert, 
  Award, 
  Star, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  ArrowRight,
  HelpCircle,
  Building2,
  Briefcase,
  Crown,
  CheckCircle2,
  Lock,
  ChevronRight
} from "lucide-react";

export default function MasterpieceSubscriptionPage() {
  const [role, setRole] = useState<"investor" | "entrepreneur">("investor");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = {
    investor: [
      {
        id: "starter",
        name: "Free Explorer",
        badge: "Standard Access",
        price: { monthly: 0, yearly: 0 },
        description: "Explore startup directories, inspect public pitch decks, and follow market trends.",
        features: [
          "Browse verified startup campaigns",
          "Advanced category & yield filtering",
          "Bookmark up to 50 opportunity posts",
          "Access free consultant webinars",
          "Community forum access",
          "Standard email support desk"
        ],
        popular: false,
        buttonText: "Get Started Free",
      },
      {
        id: "pro",
        name: "Investor Pro",
        badge: "Most Popular",
        price: { monthly: 39, yearly: 375 },
        description: "Side-by-side business comparison, unlimited bookmarks, and direct founder chat.",
        features: [
          "All Free Explorer features included",
          "Unlimited deal matrix bookmarks",
          "Side-by-side deal comparison tool",
          "Real-time founder chat (Socket.IO)",
          "Direct consultant booking & course downloads",
          "ESG audit telemetry breakdown",
          "24/7 Priority support hotline"
        ],
        popular: true,
        buttonText: "Unlock Investor Pro",
      },
      {
        id: "institutional",
        name: "Institutional LP",
        badge: "Enterprise & Funds",
        price: { monthly: 99, yearly: 950 },
        description: "Dedicated account management, custom CSV data exports, and legal audit logs.",
        features: [
          "All Investor Pro features included",
          "Custom CSV/Excel deal data exports",
          "Multi-seat team account access",
          "Private LP deal syndication room",
          "Direct due diligence file downloads",
          "Dedicated venture relationship partner",
          "Bespoke legal term sheet templates"
        ],
        popular: false,
        buttonText: "Contact Syndicate Desk",
      }
    ],
    entrepreneur: [
      {
        id: "starter-uddokta",
        name: "Starter Entrepreneur",
        badge: "Free Pitch",
        price: { monthly: 0, yearly: 0 },
        description: "Publish your initial startup proposal and monitor public visitor metrics.",
        features: [
          "Publish 1 active business pitch post",
          "Track total page views & impressions",
          "Standard founder dashboard access",
          "Access consultant video courses",
          "Standard support response times"
        ],
        popular: false,
        buttonText: "Publish Free Pitch",
      },
      {
        id: "pro-uddokta",
        name: "Pro Accelerator",
        badge: "Recommended Founder",
        price: { monthly: 49, yearly: 470 },
        description: "Priority homepage placement, investor telemetry insights, and comparison matrix.",
        features: [
          "Featured top position in deal directory",
          "Deep investor telemetry (Bookmarks, Unique LPs)",
          "Appear in side-by-side comparison system",
          "Direct message response capability",
          "Legal due diligence compliance badge",
          "Priority 1-on-1 consultant booking desk"
        ],
        popular: true,
        buttonText: "Accelerate Fundraising",
      },
      {
        id: "syndicate-uddokta",
        name: "Syndicate Growth",
        badge: "Scaleup & Series A",
        price: { monthly: 119, yearly: 1100 },
        description: "Dedicated pitch video production support, investor matchmaking, and PR boost.",
        features: [
          "All Pro Accelerator features included",
          "Custom video pitch production guidance",
          "Direct introduction to syndicate investors",
          "Press & newsletter feature placement",
          "Unlimited deal updates & cap-table tools",
          "Dedicated startup legal manager"
        ],
        popular: false,
        buttonText: "Get Syndicate Growth",
      }
    ]
  };

  const activePlans = plans[role];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System (White & Green 2-Column Layout) */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <Crown className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>Investra Tiered Packages</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Transparent Pricing.<br />
              Accelerate Growth,<br />
              <ShinyText text="Unlock High-Yield Deals." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Tailored subscription tiers designed for institutional investors, angel syndicates, and scaling entrepreneurs.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064e3b] bg-[#10b981]/15 px-3.5 py-2 rounded-xl font-heading">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Stripe & SSLCommerz Instant Activation
              </span>
            </div>
          </div>

          {/* Right Column - Hero Visual Image Showcase */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
              alt="Investra Subscription Tiers"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Pricing Section */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-16 flex-1 space-y-16">
        
        {/* Role & Billing Switcher */}
        <div className="flex flex-col items-center gap-6 text-center">
          
          {/* Role Switcher Pills */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setRole("investor")}
              className={`px-6 py-3 rounded-xl text-xs font-bold font-heading transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                role === "investor"
                  ? "bg-[#064e3b] text-white shadow-sm scale-102"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Investor Tiers</span>
            </button>

            <button
              onClick={() => setRole("entrepreneur")}
              className={`px-6 py-3 rounded-xl text-xs font-bold font-heading transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                role === "entrepreneur"
                  ? "bg-[#064e3b] text-white shadow-sm scale-102"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Entrepreneur Tiers</span>
            </button>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className={`text-xs font-bold font-heading transition-colors ${billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="focus:outline-none cursor-pointer group"
            >
              {billingPeriod === "monthly" ? (
                <div className="w-13 h-7 bg-slate-200 rounded-full p-1 flex items-center justify-start transition-all group-hover:bg-slate-300">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </div>
              ) : (
                <div className="w-13 h-7 bg-[#064e3b] rounded-full p-1 flex items-center justify-end transition-all">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform" />
                </div>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold font-heading transition-colors ${billingPeriod === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
                Annual Billing
              </span>
              <span className="bg-[#10b981]/20 text-[#064e3b] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-heading">
                Save 20%
              </span>
            </div>
          </div>

        </div>

        {/* 3-Column Masterclass Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {activePlans.map((plan) => {
            const currentPrice = billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-[28px] border overflow-hidden flex flex-col justify-between transition-all duration-300 relative group hover:-translate-y-1.5 hover:shadow-xl ${
                  isPopular
                    ? "border-2 border-[#10b981] shadow-lg ring-1 ring-[#10b981]/20 lg:-translate-y-2"
                    : "border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Popular Gradient Decorative Accent Bar */}
                {isPopular && (
                  <div className="w-full h-2 bg-gradient-to-r from-[#064e3b] via-[#10b981] to-[#064e3b]" />
                )}

                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Card Header & Badges */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full font-heading ${
                        isPopular ? "bg-[#10b981]/15 text-[#064e3b] border border-[#10b981]/30" : "bg-slate-100 text-slate-500"
                      }`}>
                        {plan.badge}
                      </span>
                      {isPopular && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-[#064e3b] uppercase tracking-wider font-heading bg-[#10b981]/20 px-2.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 text-[#10b981] fill-[#10b981]" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-heading font-black text-slate-800">
                      {plan.name}
                    </h3>

                    <p className="text-xs text-slate-500 font-body leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl md:text-5xl font-heading font-black text-[#064e3b]">
                          ${currentPrice}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {billingPeriod === "monthly" ? "/month" : "/year"}
                        </span>
                      </div>
                      {billingPeriod === "yearly" && currentPrice > 0 && (
                        <p className="text-[10px] font-bold mt-1 text-[#10b981] font-heading">
                          Billed annually (${(currentPrice / 12).toFixed(0)}/month)
                        </p>
                      )}
                    </div>

                    <hr className="border-slate-100 my-4" />

                    {/* Feature List */}
                    <ul className="space-y-3.5 text-xs font-body">
                      {plan.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[3]" />
                          </span>
                          <span className="text-slate-700 font-medium leading-snug">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-8">
                    <button
                      onClick={() => alert(`Selected ${plan.name} (${billingPeriod})... Directing to checkout!`)}
                      className={`w-full py-3.5 rounded-xl text-xs font-extrabold font-heading transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:shadow-md ${
                        isPopular
                          ? "bg-[#064e3b] hover:bg-[#043c2e] text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="w-4 h-4 text-[#10b981] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 space-y-6 max-w-5xl mx-auto shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] font-heading">
              Technical Access Matrix
            </span>
            <h3 className="text-xl font-heading font-black text-slate-800">
              Detailed Feature & Guard Breakdown
            </h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Enforced dynamically by NestJS backend Guards & PostgreSQL subscription state.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-heading font-bold uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-4">Ecosystem Feature</th>
                  <th className="py-3.5 px-4">Free Explorer</th>
                  <th className="py-3.5 px-4">Pro Tier</th>
                  <th className="py-3.5 px-4">Institutional LP</th>
                </tr>
              </thead>
              <tbody className="text-xs font-body text-slate-600 divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-800">Deal Bookmark Limit</td>
                  <td className="py-4 px-4">50 deals</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Unlimited</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-800">Side-by-Side Comparison</td>
                  <td className="py-4 px-4 text-slate-400">Locked</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">3 Deals Matrix</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Unlimited Matrix</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-800">Real-Time Founder Chat</td>
                  <td className="py-4 px-4 text-slate-400">Locked</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Socket.IO Unlocked</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Priority Founder Desk</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-800">CSV/Excel Deal Exports</td>
                  <td className="py-4 px-4 text-slate-400">Locked</td>
                  <td className="py-4 px-4 text-slate-400">Locked</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Full CSV Telemetry</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-slate-800">Legal Audit & Due Diligence</td>
                  <td className="py-4 px-4 text-slate-400">Standard view</td>
                  <td className="py-4 px-4 font-bold text-slate-800">Full Audit File</td>
                  <td className="py-4 px-4 text-[#064e3b] font-bold">Bespoke Legal Support</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#064e3b]/5 rounded-2xl border border-[#064e3b]/10 p-5 flex items-start gap-4 text-xs text-slate-700 font-body">
            <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-slate-800 mb-0.5">Instant Webhook Activation</h4>
              <p className="leading-relaxed text-slate-600">
                Stripe and SSLCommerz webhooks process plan upgrades instantly. Upgrades apply immediately to your active dashboard workspace with zero downtime.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
