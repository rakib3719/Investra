"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
import ShinyText from "@/components/ui/ShinyText";
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Lock, 
  CreditCard, 
  MessageSquare,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Building2
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Investor" | "Entrepreneur" | "Consultant" | "Subscriptions & Billing";
  isSpotlight?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    category: "Investor",
    question: "How does the side-by-side Business Comparison matrix work?",
    answer: "Active Investor subscribers can select up to 3 business opportunities simultaneously from the deal directory. The matrix provides side-by-side metrics including post-money valuation, target fund progress %, projected IRR yield, minimum ticket size, and ESG sustainability audit ratings.",
    isSpotlight: true
  },
  {
    id: "faq-2",
    category: "Consultant",
    question: "How is the 80/20 revenue commission split calculated and paid out?",
    answer: "Consultants keep 80% of all earnings generated from paid 1-on-1 mentoring sessions, live workshops, and pre-recorded video courses. Investra retains a 20% platform fee to cover automated payment gateway processing (Stripe & SSLCommerz), video hosting infrastructure, and administrative telemetry.",
    isSpotlight: true
  },
  {
    id: "faq-3",
    category: "Investor",
    question: "Can I directly message Uddokta entrepreneurs before committing capital?",
    answer: "Yes! Premium chat allows investors to send connection requests to business owners. Once approved by the entrepreneur, a secure real-time messaging room powered by Socket.IO is initialized for confidential discussions and file sharing.",
    isSpotlight: true
  },
  {
    id: "faq-4",
    category: "Entrepreneur",
    question: "What are the requirements for publishing a business opportunity on Investra?",
    answer: "Entrepreneurs (Uddokta) can publish business posts detailing target raise capital, business model, pitch decks, and financial forecasts. Campaign visibility, featured directory placement, and investor telemetry tracking depend on your active subscription tier."
  },
  {
    id: "faq-5",
    category: "Entrepreneur",
    question: "How do I monitor investor interest and analytics on my business post?",
    answer: "The Entrepreneur Analytics Dashboard provides real-time telemetry on total campaign views, unique investor visitors, active bookmarks, and incoming chat connection requests."
  },
  {
    id: "faq-6",
    category: "Consultant",
    question: "How do live workshop and mentoring sessions work?",
    answer: "Consultants specify enrollment deadlines, ticket pricing, and session capacity. Zoom or Google Meet links are integrated directly inside the session management interface. Participants receive calendar invitations and real-time email reminders upon enrollment."
  },
  {
    id: "faq-7",
    category: "Subscriptions & Billing",
    question: "Which payment gateways are supported for subscriptions and booking checkout?",
    answer: "Investra seamlessly supports international credit/debit cards via Stripe Checkout as well as local Bangladesh bank transfers, card payments, and mobile banking (bKash, Nagad) via SSLCommerz."
  },
  {
    id: "faq-8",
    category: "Subscriptions & Billing",
    question: "What happens when my active subscription tier expires?",
    answer: "When a subscription expires, your account gracefully reverts to standard view mode. Premium features such as unlimited deal bookmarks, side-by-side business comparison, and direct founder chat will be locked until plan renewal."
  }
];

export default function MasterpieceFAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndexes, setOpenIndexes] = useState<string[]>(["faq-1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackState, setFeedbackState] = useState<Record<string, "up" | "down">>({});

  const toggleAccordion = (id: string) => {
    if (openIndexes.includes(id)) {
      setOpenIndexes(openIndexes.filter((item) => item !== id));
    } else {
      setOpenIndexes([...openIndexes, id]);
    }
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const spotlightFaqs = faqData.filter((item) => item.isSpotlight);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Banner - Unified Design System */}
      <section className="w-full bg-white py-12 md:py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#064e3b] text-xs font-extrabold uppercase tracking-wider font-heading">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help & Knowledge Center</span>
            </div>

            <h1 className="font-heading font-black text-3xl md:text-[42px] lg:text-[48px] text-[#064e3b] leading-[1.1] tracking-tight">
              Investra Knowledge.<br />
              Instant Answers,<br />
              <ShinyText text="Verified Guidance." speed={4.5} />
            </h1>

            <p className="font-body text-slate-700 text-sm md:text-base xl:text-lg max-w-lg leading-relaxed">
              Find answers regarding role permissions, subscription packages, consultant revenue payouts, and deal discovery.
            </p>

            {/* Live Search */}
            <div className="pt-2">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 font-body"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual Image */}
          <div className="lg:col-span-6 relative w-full h-[280px] md:h-[360px] lg:h-[440px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
              alt="Investra Knowledge Base"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-12 flex-1 space-y-12">
        
        {/* Spotlight Questions */}
        {!searchQuery && activeCategory === "All" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <h2 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400">
                Spotlight Popular Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightFaqs.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() => toggleAccordion(faq.id)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-[#10b981] transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-[#10b981]/15 text-[#064e3b]">
                      {faq.category}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-slate-800 group-hover:text-[#064e3b] transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#064e3b] font-bold font-heading pt-2 border-t border-slate-100">
                    <span>Read Explanation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#10b981] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills & Count Bar */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {[
                { name: "All", count: faqData.length },
                { name: "Investor", count: faqData.filter(f => f.category === "Investor").length },
                { name: "Entrepreneur", count: faqData.filter(f => f.category === "Entrepreneur").length },
                { name: "Consultant", count: faqData.filter(f => f.category === "Consultant").length },
                { name: "Subscriptions & Billing", count: faqData.filter(f => f.category === "Subscriptions & Billing").length },
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.name
                      ? "bg-[#064e3b] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat.name ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-body shrink-0">
              Showing <span className="font-bold text-slate-800">{filteredFaqs.length}</span> topics
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIndexes.includes(faq.id);
              const feedback = feedbackState[faq.id];

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? "border-[#10b981] shadow-sm" : "border-slate-200 shadow-xs hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="p-2 rounded-xl bg-[#064e3b]/10 text-[#064e3b] shrink-0 font-heading font-extrabold text-xs">
                        {faq.category === "Investor" && <Building2 className="w-4 h-4" />}
                        {faq.category === "Entrepreneur" && <Briefcase className="w-4 h-4" />}
                        {faq.category === "Consultant" && <GraduationCap className="w-4 h-4" />}
                        {faq.category === "Subscriptions & Billing" && <CreditCard className="w-4 h-4" />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 font-heading">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-slate-800 text-sm md:text-base leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-[#064e3b] text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-slate-600 font-body text-xs md:text-sm leading-relaxed space-y-4 animate-in fade-in duration-200 bg-slate-50/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
