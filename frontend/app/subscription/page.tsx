"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import ShinyText from "@/components/ui/ShinyText";
import Link from "next/link";
import { 
  Check, 
  Info, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Building2,
  Briefcase,
  Crown,
  CheckCircle2,
  Lock,
  UserCheck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { 
  usePublicPlansQuery, 
  useMySubscriptionQuery,
} from "@/lib/admin/admin-subscription-hooks";
import { adminSubscriptionsApi, type TargetRole } from "@/lib/admin/admin-subscriptions-api";
import { useCurrentUserQuery } from "@/lib/auth/auth-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";

export default function MasterpieceSubscriptionPage() {
  const [role, setRole] = useState<"investor" | "entrepreneur" | "consultant">("investor");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserQuery();
  const { data: mySubscription, refetch: refetchMySubscription } = useMySubscriptionQuery();

  // Fetch all plans across roles once for instant tab switching and exact counts
  const { data: allRemotePlans, isLoading: isPlansLoading } = usePublicPlansQuery();

  const targetRoleMap: Record<string, TargetRole> = {
    investor: "INVESTOR",
    entrepreneur: "ENTREPRENEUR",
    consultant: "CONSULTANT",
  };

  // Restrict role selection:
  // If user is logged in as INVESTOR, ENTREPRENEUR, or CONSULTANT: lock to their role.
  // If not logged in, or ADMIN: they can browse any role.
  const userRole = currentUser?.role?.toUpperCase();
  const isRoleRestricted = Boolean(
    userRole && (userRole === "INVESTOR" || userRole === "ENTREPRENEUR" || userRole === "CONSULTANT")
  );

  useEffect(() => {
    if (userRole === "INVESTOR") {
      setRole("investor");
    } else if (userRole === "ENTREPRENEUR") {
      setRole("entrepreneur");
    } else if (userRole === "CONSULTANT") {
      setRole("consultant");
    }
  }, [userRole]);

  const currentTargetRole = targetRoleMap[role];

  // Role plan counts
  const roleCounts = useMemo(() => {
    if (!allRemotePlans) return { investor: 0, entrepreneur: 0, consultant: 0 };
    return {
      investor: allRemotePlans.filter((p) => p.targetRole === "INVESTOR").length,
      entrepreneur: allRemotePlans.filter((p) => p.targetRole === "ENTREPRENEUR").length,
      consultant: allRemotePlans.filter((p) => p.targetRole === "CONSULTANT").length,
    };
  }, [allRemotePlans]);

  // Fallback plans if network hasn't loaded yet
  const fallbackPlans = {
    investor: [
      {
        id: "fallback-starter",
        slug: "investor-free",
        name: "Free Explorer",
        badge: "Standard Access",
        price: { monthly: 0, yearly: 0 },
        currency: "USD",
        description: "Explore startup directories, inspect public pitch decks, and follow market trends.",
        popular: false,
        isActive: true,
        rawFeatures: [
          { name: "Opportunity Bookmarks", isEnabled: true, limitValue: 50, unit: "bookmarks" },
          { name: "Side-by-Side Comparison Matrix", isEnabled: false },
          { name: "Real-time Founder Messaging", isEnabled: false },
          { name: "Confidential Due Diligence Vault", isEnabled: false },
          { name: "Bulk Data CSV & Excel Export", isEnabled: false },
          { name: "Private LP Deal Syndication Room", isEnabled: false },
        ],
      },
      {
        id: "fallback-pro",
        slug: "investor-pro",
        name: "Investor Pro",
        badge: "Most Popular",
        price: { monthly: 39, yearly: 375 },
        currency: "USD",
        description: "Side-by-side business comparison, unlimited bookmarks, and direct founder chat.",
        popular: true,
        isActive: true,
        rawFeatures: [
          { name: "Opportunity Bookmarks", isEnabled: true, limitValue: -1, unit: "bookmarks" },
          { name: "Side-by-Side Comparison Matrix", isEnabled: true },
          { name: "Real-time Founder Messaging", isEnabled: true },
          { name: "Confidential Due Diligence Vault", isEnabled: true },
          { name: "Bulk Data CSV & Excel Export", isEnabled: false },
          { name: "Private LP Deal Syndication Room", isEnabled: false },
        ],
      },
      {
        id: "fallback-institutional",
        slug: "investor-institutional",
        name: "Institutional LP",
        badge: "Enterprise & Funds",
        price: { monthly: 99, yearly: 950 },
        currency: "USD",
        description: "Dedicated account management, custom CSV data exports, and legal audit logs.",
        popular: false,
        isActive: true,
        rawFeatures: [
          { name: "Opportunity Bookmarks", isEnabled: true, limitValue: -1, unit: "bookmarks" },
          { name: "Side-by-Side Comparison Matrix", isEnabled: true },
          { name: "Real-time Founder Messaging", isEnabled: true },
          { name: "Confidential Due Diligence Vault", isEnabled: true },
          { name: "Bulk Data CSV & Excel Export", isEnabled: true },
          { name: "Private LP Deal Syndication Room", isEnabled: true },
        ],
      },
    ],
    entrepreneur: [
      {
        id: "fallback-starter-uddokta",
        slug: "entrepreneur-starter",
        name: "Starter Entrepreneur",
        badge: "Free Pitch",
        price: { monthly: 0, yearly: 0 },
        currency: "USD",
        description: "Publish your initial startup proposal and monitor public visitor metrics.",
        popular: false,
        isActive: true,
        rawFeatures: [
          { name: "Active Pitch Campaigns", isEnabled: true, limitValue: 1, unit: "campaigns" },
          { name: "Deep Investor Telemetry", isEnabled: false },
          { name: "Comparison Matrix Placement", isEnabled: false },
          { name: "Confidential Pitch Decks", isEnabled: true, limitValue: 1, unit: "decks" },
          { name: "Direct Founder-to-Investor Chat", isEnabled: false },
          { name: "Featured Top Placement", isEnabled: false },
        ],
      },
      {
        id: "fallback-pro-uddokta",
        slug: "entrepreneur-pro",
        name: "Pro Accelerator",
        badge: "Recommended Founder",
        price: { monthly: 49, yearly: 470 },
        currency: "USD",
        description: "Priority placement, investor telemetry insights, and comparison matrix inclusion.",
        popular: true,
        isActive: true,
        rawFeatures: [
          { name: "Active Pitch Campaigns", isEnabled: true, limitValue: 3, unit: "campaigns" },
          { name: "Deep Investor Telemetry", isEnabled: true },
          { name: "Comparison Matrix Placement", isEnabled: true },
          { name: "Confidential Pitch Decks", isEnabled: true, limitValue: 5, unit: "decks" },
          { name: "Direct Founder-to-Investor Chat", isEnabled: true },
          { name: "Featured Top Placement", isEnabled: true },
        ],
      },
      {
        id: "fallback-syndicate-uddokta",
        slug: "entrepreneur-syndicate",
        name: "Syndicate Growth",
        badge: "Scaleup & Series A",
        price: { monthly: 119, yearly: 1100 },
        currency: "USD",
        description: "Dedicated pitch video production support, investor matchmaking, and unlimited campaigns.",
        popular: false,
        isActive: true,
        rawFeatures: [
          { name: "Active Pitch Campaigns", isEnabled: true, limitValue: -1, unit: "campaigns" },
          { name: "Deep Investor Telemetry", isEnabled: true },
          { name: "Comparison Matrix Placement", isEnabled: true },
          { name: "Confidential Pitch Decks", isEnabled: true, limitValue: 20, unit: "decks" },
          { name: "Direct Founder-to-Investor Chat", isEnabled: true },
          { name: "Featured Top Placement", isEnabled: true },
        ],
      },
    ],
    consultant: [
      {
        id: "fallback-consultant-starter",
        slug: "consultant-starter",
        name: "Mentor Starter",
        badge: "Directory Listing",
        price: { monthly: 0, yearly: 0 },
        currency: "USD",
        description: "Listed mentor in startup directory with direct client booking calendar.",
        popular: false,
        isActive: true,
        rawFeatures: [
          { name: "Marketplace Directory Listing", isEnabled: true },
          { name: "Monthly Client Bookings", isEnabled: true, limitValue: 10, unit: "sessions" },
          { name: "Host Video Courses & Masterclasses", isEnabled: false },
          { name: "Top Rated Advisor Spotlight", isEnabled: false },
        ],
      },
      {
        id: "fallback-consultant-pro",
        slug: "consultant-expert",
        name: "Advisory Partner",
        badge: "Top Mentor",
        price: { monthly: 29, yearly: 290 },
        currency: "USD",
        description: "Unlimited monthly bookings, webinar hosting, and verified advisory spotlight.",
        popular: true,
        isActive: true,
        rawFeatures: [
          { name: "Marketplace Directory Listing", isEnabled: true },
          { name: "Monthly Client Bookings", isEnabled: true, limitValue: -1, unit: "sessions" },
          { name: "Host Video Courses & Masterclasses", isEnabled: true },
          { name: "Top Rated Advisor Spotlight", isEnabled: true },
        ],
      },
    ],
  };

  // Filter plans for selected role
  const matchingRemotePlans = useMemo(() => {
    if (!allRemotePlans) return null;
    return allRemotePlans.filter((p) => p.targetRole === currentTargetRole);
  }, [allRemotePlans, currentTargetRole]);

  // Convert plans to display format with ALL features shown (Enabled + Locked)
  const activePlans = useMemo(() => {
    if (matchingRemotePlans && matchingRemotePlans.length > 0) {
      return matchingRemotePlans.map((rp) => {
        const rawFeatures = rp.features || [];
        
        // Every single feature from admin is preserved
        const featureItems = rawFeatures.map((f: any) => ({
          name: f.name,
          code: f.code,
          isEnabled: Boolean(f.isEnabled),
          limitValue: f.limitValue,
          unit: f.unit,
          formatted: f.isEnabled
            ? f.limitValue !== null && f.limitValue !== undefined
              ? f.limitValue === -1
                ? `${f.name} (Unlimited)`
                : `${f.name} (Up to ${f.limitValue} ${f.unit || ""})`
              : `${f.name} (Included)`
            : `${f.name} (Not included)`,
        }));

        return {
          id: rp.id,
          slug: rp.slug,
          name: rp.name,
          badge: rp.badge || (rp.isPopular ? "Featured Tier" : "Standard Tier"),
          price: { monthly: rp.priceMonthly, yearly: rp.priceYearly },
          currency: rp.currency || "USD",
          description: rp.description || "",
          rawFeatures,
          features: featureItems,
          popular: rp.isPopular,
          isActive: rp.isActive,
          stripeMonthlyPriceId: rp.stripeMonthlyPriceId,
          stripeYearlyPriceId: rp.stripeYearlyPriceId,
          buttonText: !rp.isActive 
            ? "Coming Soon" 
            : rp.priceMonthly === 0 
            ? "Get Started Free" 
            : `Choose ${rp.name}`,
        };
      });
    }

    // Fallback plans
    return fallbackPlans[role].map((p) => ({
      ...p,
      features: p.rawFeatures.map((f: any) => ({
        name: f.name,
        code: f.name.toLowerCase().replace(/\s+/g, "_"),
        isEnabled: f.isEnabled,
        limitValue: f.limitValue,
        unit: f.unit,
        formatted: f.isEnabled
          ? f.limitValue !== null && f.limitValue !== undefined
            ? f.limitValue === -1
              ? `${f.name} (Unlimited)`
              : `${f.name} (Up to ${f.limitValue} ${f.unit || ""})`
            : `${f.name} (Included)`
          : `${f.name} (Not included)`,
      })),
      stripeMonthlyPriceId: null,
      stripeYearlyPriceId: null,
      buttonText: p.price.monthly === 0 ? "Get Started Free" : `Choose ${p.name}`,
    }));
  }, [matchingRemotePlans, role]);

  // Catalog features for Technical Access Matrix comparison derived dynamically from live plans
  const comparisonFeatures = useMemo(() => {
    if (activePlans && activePlans.length > 0) {
      const featureMap = new Map<string, any>();
      for (const p of activePlans) {
        for (const pf of (p.rawFeatures as any[]) || []) {
          const key = pf.code || pf.name;
          if (!featureMap.has(key)) {
            featureMap.set(key, {
              id: pf.featureId || pf.id || key,
              code: pf.code || key,
              name: pf.name,
              description: pf.description || "",
              featureType: pf.featureType || "BOOLEAN",
              unit: pf.unit,
            });
          }
        }
      }
      const list = Array.from(featureMap.values());
      if (list.length > 0) return list;
    }

    return [
      { id: "f1", code: "deal_bookmark_limit", name: "Deal Bookmark Limit", description: "Opportunity bookmarks", featureType: "NUMERIC_LIMIT", unit: "deals" },
      { id: "f2", code: "deal_comparison_matrix", name: "Side-by-Side Comparison Matrix", description: "Comparison matrix", featureType: "BOOLEAN", unit: null },
    ];
  }, [activePlans]);

  // Listen for Stripe Checkout return params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutStatus = urlParams.get("checkout");
      const sessionId = urlParams.get("session_id");

      if (checkoutStatus === "success") {
        if (sessionId) {
          adminSubscriptionsApi
            .verifyCheckoutSession(sessionId)
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ["public", "subscriptions"] });
              refetchMySubscription();
            })
            .catch((err) => {
              console.error("Instant session verification fallback error:", err);
            });
        }
        const msg = "Payment successful! Your new subscription tier has been activated.";
        setSuccessMessage(msg);
        toast.success(msg, { title: "Payment Confirmed" });
        queryClient.invalidateQueries({ queryKey: ["public", "subscriptions"] });
        refetchMySubscription();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (checkoutStatus === "cancelled") {
        toast.info("Subscription checkout was cancelled. You have not been charged.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [queryClient, refetchMySubscription]);

  // Action handler for plan selection / payment preparation
  const handleSubscribe = async (plan: any) => {
    if (!plan.isActive) {
      toast.info("This subscription tier is currently in preparation and will be available soon.");
      return;
    }

    if (!currentUser) {
      window.location.href = `/login?redirect=/subscription`;
      return;
    }

    try {
      setSubscribingPlanId(plan.id);

      const res = await adminSubscriptionsApi.checkoutPlan(
        plan.id,
        billingPeriod === "monthly" ? "MONTHLY" : "YEARLY"
      );

      // If Stripe Checkout URL is returned, redirect user directly to Stripe payment page!
      if (res && res.url) {
        window.location.href = res.url;
        return;
      }

      // Only free plans activate directly
      if (res && res.isFree) {
        queryClient.invalidateQueries({ queryKey: ["public", "subscriptions"] });
        await refetchMySubscription();

        const userDashboardSection = currentUser?.role ? `/dashboard/${currentUser.role.toLowerCase()}/subscription` : null;
        const msg = `Successfully enrolled in free plan "${plan.name}"! Your standard limits are now active.`;
        setSuccessMessage(msg);
        toast.success(msg, { 
          title: "Plan Enrolled",
          action: userDashboardSection ? {
            label: "View in Dashboard",
            onClick: () => { window.location.href = userDashboardSection; }
          } : undefined
        });
        return;
      }

      toast.error("Stripe payment gateway did not return a checkout URL. Please check server configuration.");
    } catch (err: any) {
      toast.apiError(err, "Failed to initiate subscription checkout. Please try again.");
    } finally {
      setSubscribingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - White & Green Unified Layout */}
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
        
        {/* Success Feedback Alert */}
        {successMessage && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-sm font-semibold flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current Active Subscription Banner if user is subscribed */}
        {mySubscription && mySubscription.planName && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-[#064e3b]/5 border border-[#10b981]/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Crown className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
                  Active Subscription
                </p>
                <h4 className="text-base font-extrabold text-slate-900">
                  You are currently on <span className="text-[#064e3b]">{mySubscription.planName}</span> ({mySubscription.billingInterval || "MONTHLY"})
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/20 text-[#064e3b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Entitlements Active
              </span>
              {currentUser && (
                <Link
                  href={`/dashboard/${currentUser.role.toLowerCase()}/subscription`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#053e2f] transition"
                >
                  <span>Manage in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Role & Billing Switcher */}
        <div className="flex flex-col items-center gap-6 text-center">
          
          {/* Role Switcher Pills with Live Plan Counts */}
          {isRoleRestricted ? (
            <div className="flex items-center gap-3 bg-emerald-50/80 px-5 py-3 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                {role === "investor" && <Building2 className="w-4 h-4" />}
                {role === "entrepreneur" && <Briefcase className="w-4 h-4" />}
                {role === "consultant" && <UserCheck className="w-4 h-4" />}
              </span>
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Your Account Role
                </p>
                <p className="text-xs font-bold text-slate-900 capitalize">
                  {role} Plans & Entitlements
                </p>
              </div>
              <span className="ml-3 rounded-full bg-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900">
                Active Stakeholder
              </span>
            </div>
          ) : (
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
                {roleCounts.investor > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    role === "investor" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {roleCounts.investor}
                  </span>
                )}
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
                {roleCounts.entrepreneur > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    role === "entrepreneur" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {roleCounts.entrepreneur}
                  </span>
                )}
              </button>

              <button
                onClick={() => setRole("consultant")}
                className={`px-6 py-3 rounded-xl text-xs font-bold font-heading transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  role === "consultant"
                    ? "bg-[#064e3b] text-white shadow-sm scale-102"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Consultant Tiers</span>
                {roleCounts.consultant > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    role === "consultant" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {roleCounts.consultant}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Billing Cycle Switcher */}
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className={`text-xs font-bold font-heading transition-colors ${billingPeriod === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="focus:outline-none cursor-pointer group"
              aria-label="Toggle billing interval"
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

        {/* Dynamic Pricing Cards Grid */}
        {isPlansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-[28px] border border-slate-200 bg-slate-50/50 animate-pulse p-8 flex flex-col justify-between" />
            ))}
          </div>
        ) : activePlans.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 font-heading">No Active Plans Configured</h3>
            <p className="text-xs text-slate-500 font-body">
              There are currently no published subscription tiers for {role}s. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {activePlans.map((plan) => {
              const currentPrice = billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly;
              const isPopular = plan.popular;
              const isCurrentPlan = mySubscription?.planId === plan.id;
              const isPlanActive = plan.isActive;
              const currentSubMonthlyPrice = mySubscription?.priceMonthly ?? 0;
              const isUpgrade = Boolean(mySubscription && plan.price.monthly > currentSubMonthlyPrice);
              const isDowngrade = Boolean(mySubscription && !isCurrentPlan && plan.price.monthly < currentSubMonthlyPrice);

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-[28px] border overflow-hidden flex flex-col justify-between transition-all duration-300 relative group hover:-translate-y-1.5 hover:shadow-xl ${
                    isCurrentPlan
                      ? "border-2 border-[#064e3b] shadow-md ring-2 ring-[#064e3b]/20 bg-emerald-50/10"
                      : isPopular
                      ? "border-2 border-[#10b981] shadow-lg ring-1 ring-[#10b981]/20 lg:-translate-y-2"
                      : "border-slate-200 shadow-xs hover:border-slate-300"
                  }`}
                >
                  {/* Decorative Accent Bar */}
                  {isCurrentPlan ? (
                    <div className="w-full h-2.5 bg-[#064e3b]" />
                  ) : isPopular ? (
                    <div className="w-full h-2 bg-gradient-to-r from-[#064e3b] via-[#10b981] to-[#064e3b]" />
                  ) : null}

                  <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                    
                    {/* Card Header & Badges */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full font-heading ${
                          isCurrentPlan
                            ? "bg-[#064e3b] text-white shadow-xs"
                            : !isPlanActive
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : isPopular
                            ? "bg-[#10b981]/15 text-[#064e3b] border border-[#10b981]/30"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {isCurrentPlan ? "Active Tier" : !isPlanActive ? "Coming Soon" : plan.badge}
                        </span>
                        
                        {isPopular && !isCurrentPlan && isPlanActive && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-[#064e3b] uppercase tracking-wider font-heading bg-[#10b981]/20 px-2.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 text-[#10b981] fill-[#10b981]" />
                            <span>Featured</span>
                          </span>
                        )}
                        {isCurrentPlan && (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Current
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

                      {/* All Features List from Admin (Enabled + Locked) */}
                      <ul className="space-y-3 text-xs font-body">
                        {plan.features.map((feat: any, fidx: number) => (
                          <li key={fidx} className="flex items-start gap-3">
                            {feat.isEnabled ? (
                              <>
                                <span className="w-5 h-5 rounded-full bg-[#10b981]/15 text-[#064e3b] flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[3]" />
                                </span>
                                <span className="text-slate-800 font-medium leading-snug">
                                  {feat.formatted}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                </span>
                                <span className="text-slate-400 font-normal leading-snug">
                                  {feat.formatted}
                                </span>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-8">
                      {isCurrentPlan ? (
                        <div className="w-full py-3.5 rounded-xl text-xs font-extrabold font-heading bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-2 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Current Active Plan</span>
                        </div>
                      ) : !isPlanActive ? (
                        <button
                          disabled
                          className="w-full py-3.5 rounded-xl text-xs font-extrabold font-heading bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Coming Soon</span>
                        </button>
                      ) : (
                        <button
                          disabled={subscribingPlanId === plan.id}
                          onClick={() => handleSubscribe(plan)}
                          className={`w-full py-3.5 rounded-xl text-xs font-extrabold font-heading transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50 ${
                            isUpgrade
                              ? "bg-[#064e3b] hover:bg-[#043c2e] text-white"
                              : isPopular
                              ? "bg-[#064e3b] hover:bg-[#043c2e] text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <span>
                            {subscribingPlanId === plan.id
                              ? "Redirecting to Stripe..."
                              : !currentUser
                              ? plan.price.monthly === 0
                                ? "Get Started Free"
                                : `Subscribe to ${plan.name}`
                              : isUpgrade
                              ? `Upgrade to ${plan.name}`
                              : isDowngrade
                              ? `Switch to ${plan.name}`
                              : plan.price.monthly === 0
                              ? "Switch to Free"
                              : `Select ${plan.name}`}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#10b981] group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Feature Comparison Matrix Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 space-y-6 max-w-5xl mx-auto shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10b981] font-heading">
              Technical Access Matrix
            </span>
            <h3 className="text-xl font-heading font-black text-slate-800">
              Detailed Feature & Guard Breakdown ({currentTargetRole})
            </h3>
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              Enforced dynamically by NestJS backend Guards & PostgreSQL subscription state.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-[10px] font-heading font-bold uppercase tracking-wider bg-slate-50">
                  <th className="py-3.5 px-4 min-w-[220px]">Ecosystem Feature</th>
                  {activePlans.map((p) => (
                    <th key={p.id} className="py-3.5 px-4 text-center min-w-[140px]">
                      <div className="font-bold text-slate-800 text-xs">{p.name}</div>
                      <div className="text-[10px] text-emerald-700 font-extrabold">
                        ${billingPeriod === "monthly" ? p.price.monthly : p.price.yearly}
                        <span className="text-slate-400 font-normal">/{billingPeriod === "monthly" ? "mo" : "yr"}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-body text-slate-600 divide-y divide-slate-100">
                {comparisonFeatures.map((feat) => (
                  <tr key={feat.id || feat.code} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{feat.name}</div>
                      {feat.description && (
                        <div className="text-[11px] text-slate-400 font-normal line-clamp-1">{feat.description}</div>
                      )}
                    </td>

                    {activePlans.map((plan) => {
                      // Lookup feature in plan's rawFeatures
                      const planFeat = (plan.rawFeatures || []).find(
                        (pf: any) => pf.code === feat.code || pf.featureId === feat.id || pf.name === feat.name
                      );

                      if (!planFeat || !planFeat.isEnabled) {
                        return (
                          <td key={plan.id} className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-xs">
                              <Lock className="w-3 h-3 text-slate-300" />
                              <span>Locked</span>
                            </span>
                          </td>
                        );
                      }

                      // Enabled numeric feature
                      if (planFeat.limitValue !== null && planFeat.limitValue !== undefined) {
                        return (
                          <td key={plan.id} className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 font-bold text-[#064e3b]">
                              <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[2.5]" />
                              <span>
                                {planFeat.limitValue === -1
                                  ? "Unlimited"
                                  : `${planFeat.limitValue} ${planFeat.unit || feat.unit || ""}`}
                              </span>
                            </span>
                          </td>
                        );
                      }

                      // Enabled boolean feature
                      return (
                        <td key={plan.id} className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-[#064e3b]">
                            <Check className="w-3.5 h-3.5 text-[#10b981] stroke-[2.5]" />
                            <span>Included</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#064e3b]/5 rounded-2xl border border-[#064e3b]/10 p-5 flex items-start gap-4 text-xs text-slate-700 font-body">
            <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-slate-800 mb-0.5">Instant Webhook & Payment Gateway Readiness</h4>
              <p className="leading-relaxed text-slate-600">
                Stripe & SSLCommerz payment webhooks process subscription activations in real-time. Plan upgrades apply instantly with immutable subscriber guarantee and zero downtime.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
