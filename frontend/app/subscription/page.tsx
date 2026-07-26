"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import SpotlightCard from "@/components/ui/SpotlightCard";
import ShinyText from "@/components/ui/ShinyText";
import { Check, Info, ShieldAlert, Award, Star, ToggleLeft, ToggleRight } from "lucide-react";

export default function SubscriptionPage() {
  const [role, setRole] = useState<"investor" | "entrepreneur">("investor");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = {
    investor: [
      {
        name: "Basic Investor",
        price: { monthly: 0, yearly: 0 },
        description: "Explore the platform, browse ideas, and attend public sessions.",
        features: [
          "Browse business opportunities",
          "Advanced filter & search tools",
          "Bookmark up to 50 posts",
          "Access basic consultant sessions",
          "Standard support response times"
        ],
        popular: false,
        buttonText: "Start Free",
      },
      {
        name: "Premium Investor",
        price: { monthly: 39, yearly: 375 },
        description: "Unlock advanced comparison tools, premium chats, and infinite bookmarks.",
        features: [
          "All Basic Investor features",
          "Unlimited bookmarks",
          "Request premium chat access",
          "Compare businesses side-by-side",
          "Direct consultant booking & recordings",
          "Priority support (24/7)"
        ],
        popular: true,
        buttonText: "Upgrade to Premium",
      }
    ],
    entrepreneur: [
      {
        name: "Basic Entrepreneur",
        price: { monthly: 0, yearly: 0 },
        description: "Post your startup idea and monitor public visitor metrics.",
        features: [
          "Post business ideas (Standard visibility)",
          "Track total post views",
          "Standard dashboard access",
          "Access consultant courses",
          "Standard support response times"
        ],
        popular: false,
        buttonText: "Start Free",
      },
      {
        name: "Pro Entrepreneur",
        price: { monthly: 49, yearly: 470 },
        description: "Boost pitch deck visibility, get deep investor analytics, and appear in comparisons.",
        features: [
          "Post business ideas (Premium/Priority visibility)",
          "Deep dashboard metrics (Bookmarks, Unique investors)",
          "Appear in side-by-side comparison system",
          "Direct message response capability",
          "Featured listing on the homepage directory",
          "Priority support & legal advice logs"
        ],
        popular: true,
        buttonText: "Go Pro",
      }
    ]
  };

  const activePlans = plans[role];

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar />

      <main className="w-full pb-20">
        
        {/* Page Hero */}
        <section className="bg-white border-b border-slate-100 py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-6 text-center max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-3 py-1.5 rounded-full font-heading">
              Monetization & Plans
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-secondary leading-tight tracking-tight">
              InvestConnect <br />
              <ShinyText text="Subscription Packages" speed={4} />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              Find the perfect plan mapped to your objectives. Choose whether you are searching for capital to scale or looking to back premium business ideas.
            </p>
          </div>
        </section>

        {/* Pricing Selection Controls */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-12 flex flex-col items-center gap-8">
          
          {/* Role Tab Switches */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setRole("investor")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                role === "investor" 
                  ? "bg-white text-secondary shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              I am an Investor
            </button>
            <button
              onClick={() => setRole("entrepreneur")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                role === "entrepreneur" 
                  ? "bg-white text-secondary shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              I am an Entrepreneur (Uddokta)
            </button>
          </div>

          {/* Billing Switch Controls */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold font-heading ${billingPeriod === "monthly" ? "text-secondary" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="focus:outline-none cursor-pointer"
            >
              {billingPeriod === "monthly" ? (
                <div className="w-11 h-6 bg-slate-200 rounded-full p-0.5 flex items-center justify-start transition-all">
                  <div className="w-5 h-5 bg-white rounded-full shadow-xs border border-slate-300" />
                </div>
              ) : (
                <div className="w-11 h-6 bg-primary rounded-full p-0.5 flex items-center justify-end transition-all">
                  <div className="w-5 h-5 bg-white rounded-full shadow-xs border border-slate-300" />
                </div>
              )}
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold font-heading ${billingPeriod === "yearly" ? "text-secondary" : "text-slate-400"}`}>
                Yearly
              </span>
              <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-heading">
                Save 20%
              </span>
            </div>
          </div>

        </section>

        {/* Pricing Cards Grid */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activePlans.map((plan, idx) => {
              const currentPrice = billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly;
              
              return (
                <SpotlightCard
                  key={idx}
                  spotlightColor={plan.popular ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.04)"}
                  className={`bg-white border rounded-[32px] p-8 space-y-8 flex flex-col justify-between relative ${
                    plan.popular ? "border-2 border-primary shadow-md" : "border-slate-200/60"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-heading shadow-xs">
                      Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold uppercase tracking-wider font-heading ${plan.popular ? "text-primary" : "text-slate-400"}`}>
                        {plan.name}
                      </span>
                      {plan.popular && <Star className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />}
                    </div>

                    <div>
                      <h3 className="text-4xl font-heading font-black text-secondary">
                        ${currentPrice}
                        <span className="text-xs font-normal text-slate-400">
                          {billingPeriod === "monthly" ? "/mo" : "/yr"}
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-body leading-relaxed mt-1">{plan.description}</p>
                    </div>

                    <hr className="border-slate-100" />

                    <ul className="space-y-3.5 text-xs text-slate-600 font-body">
                      {plan.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`w-full py-3 rounded-2xl text-xs font-bold font-heading transition-all cursor-pointer ${
                    plan.popular 
                      ? "bg-primary hover:opacity-95 text-white" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}>
                    {plan.buttonText}
                  </button>

                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* Feature Matrix Details */}
        <section className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] mt-24">
          <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 md:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
            <div className="space-y-2">
              <h3 className="text-lg font-heading font-black text-secondary">Comparison Feature Details</h3>
              <p className="text-xs text-slate-500 font-body leading-relaxed">
                See exact feature permissions handled dynamically by our NestJS route guards and packages filters.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-heading font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Ecosystem Feature</th>
                    <th className="py-3 px-2">Basic Level</th>
                    <th className="py-3 px-2">Premium / Pro Level</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-body text-slate-600 divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-2 font-bold text-slate-800">Bookmark Limit</td>
                    <td className="py-3.5 px-2">50 bookmarked posts</td>
                    <td className="py-3.5 px-2 text-emerald-600 font-bold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-bold text-slate-800">Business Posts Visibility</td>
                    <td className="py-3.5 px-2">Standard feed visibility</td>
                    <td className="py-3.5 px-2 text-emerald-600 font-bold">Priority/Featured feed visibility</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-bold text-slate-800">Side-by-Side Comparison</td>
                    <td className="py-3.5 px-2 text-slate-400">Not included</td>
                    <td className="py-3.5 px-2 text-emerald-600 font-bold">Included (Unlimited comparisons)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-bold text-slate-800">Direct Chat Requests</td>
                    <td className="py-3.5 px-2 text-slate-400">Blocked</td>
                    <td className="py-3.5 px-2 text-emerald-600 font-bold">Unlimited chat message requests</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-bold text-slate-800">Consultant session fees</td>
                    <td className="py-3.5 px-2">Standard pricing</td>
                    <td className="py-3.5 px-2 text-emerald-600 font-bold">Priority booking & discounts</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#064e3b]/5 rounded-2xl border border-slate-100 p-4 flex items-start gap-3 mt-4">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-body leading-relaxed">
                Stripe webhooks handle package lifecycles dynamically. Upgrading or cancelling takes effect immediately in your client dashboard workspace.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
