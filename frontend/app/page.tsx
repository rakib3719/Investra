"use client";

import React from "react";
import Navbar from "../components/public-facing/shared/Navbar";
import Hero from "../components/public-facing/homepage/Hero";
import TrustBadges from "../components/public-facing/homepage/TrustBadges";
import InvestmentOpportunities from "../components/public-facing/homepage/InvestmentOpportunities";
import InvestWithPurpose from "../components/public-facing/homepage/InvestWithPurpose";
import ImpactStats from "../components/public-facing/homepage/ImpactStats";
import CTASection from "../components/public-facing/homepage/CTASection";
import WhyChooseUs from "../components/public-facing/homepage/WhyChooseUs";
import PlatformPillars from "../components/public-facing/homepage/PlatformPillars";
import ConsultantSection from "../components/public-facing/homepage/ConsultantSection";
import Testimonials from "../components/public-facing/homepage/Testimonials";
import FAQAccordion from "../components/public-facing/homepage/FAQAccordion";
import BlogHome from "../components/public-facing/homepage/BlogHome";
import Footer from "../components/public-facing/shared/Footer";
import { VisitorConsent } from "@/components/public-facing/shared/VisitorConsent";

export default function Home() {
  return (
    <div className="min-h-screen bg-white w-full flex flex-col justify-between">
      
      {/* Header / Navigation */}
      <Navbar />
      <VisitorConsent />

      {/* Hero Presentation */}
      <Hero />

      {/* Partner Trust Signals */}
      <TrustBadges />

      {/* Main Grid Content Area */}
      <main className="w-full bg-white py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Investment Opportunities Cards */}
          <div className="lg:col-span-7">
            <InvestmentOpportunities />
          </div>

          {/* Right Column: Onboarding steps, verified achievements, and lead generation */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12">
            <InvestWithPurpose />
            <ImpactStats />
            <CTASection />
          </div>
          
        </div>
      </main>

      {/* Why Choose Investra Section */}
      <WhyChooseUs />

      {/* Sustainable Pillars (Forestry, Solar, Wind, etc.) */}
      <PlatformPillars />

      {/* Expert Consultant & Advisory Team */}
      <ConsultantSection />

      {/* Client Testimonials Section */}
      <Testimonials />

      {/* FAQ Accordion Section */}
      <FAQAccordion />

      {/* Insights & Blog Section */}
      <BlogHome />

      {/* Footer Navigation */}
      <Footer />
      
    </div>
  );
}
