"use client";

import React, { useState } from "react";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import Link from "next/link";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-[#064e3b] via-[#085a45] to-[#064e3b] text-white py-20 px-6 relative overflow-hidden">
        {/* Background Visual Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#10b981]/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#10b981] text-xs font-extrabold uppercase tracking-widest font-heading shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>Investra Help Center & Knowledge Base</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            How can we assist your venture journey today?
          </h1>

          <p className="font-body text-slate-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Find answers regarding role-based access control, subscription gates, consultant 80/20 revenue payouts, and business comparison matrices.
          </p>

          {/* Interactive Search Box */}
          <div className="max-w-2xl mx-auto relative pt-4">
            <div className="relative flex items-center bg-white p-2.5 rounded-2xl border border-white/30 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. comparison, 80/20 share, Stripe, chat)..."
                className="w-full px-4 py-2.5 text-sm text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400 font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="bg-[#064e3b] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl font-heading shrink-0 hidden sm:block">
                Search FAQ
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main FAQ Section */}
      <main className="max-w-[1200px] mx-auto w-full px-6 py-16 flex-1 space-y-16">
        
        {/* Spotlight Top Questions */}
        {!searchQuery && activeCategory === "All" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <h2 className="font-heading font-black text-xs uppercase tracking-widest text-slate-400">
                Spotlight Top Inquiries
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightFaqs.map((faq) => (
                <div
                  key={faq.id}
                  onClick={() => toggleAccordion(faq.id)}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#10b981] transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between group"
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
            
            {/* Category Pills */}
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
                      ? "bg-[#064e3b] text-white shadow-sm"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"
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
              Showing <span className="font-bold text-slate-800">{filteredFaqs.length}</span> verified topics
            </div>

          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-heading font-bold text-lg text-slate-700">No matching questions found</h3>
                <p className="text-xs text-slate-500 font-body max-w-md mx-auto">
                  We couldn't find any questions matching "{searchQuery}". Try selecting another category pill or reach out to our advisory desk.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openIndexes.includes(faq.id);
                const feedback = feedbackState[faq.id];

                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen ? "border-[#10b981] shadow-md ring-1 ring-[#10b981]/20" : "border-slate-200/80 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    {/* Question Row */}
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
                            {faq.isSpotlight && (
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-md bg-[#10b981]/15 text-[#064e3b] font-heading">
                                Featured
                              </span>
                            )}
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

                    {/* Answer Expanded Area */}
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-slate-600 font-body text-xs md:text-sm leading-relaxed space-y-4 animate-in fade-in duration-200 bg-slate-50/50">
                        <p>{faq.answer}</p>

                        {/* Helpful Feedback Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/60 text-xs">
                          <span className="text-slate-400 font-body">Was this answer helpful?</span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(faq.id, "up")}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-heading flex items-center gap-1.5 transition-colors ${
                                feedback === "up"
                                  ? "bg-[#10b981] text-white border-[#10b981]"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Yes</span>
                            </button>

                            <button
                              onClick={() => handleFeedback(faq.id, "down")}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-heading flex items-center gap-1.5 transition-colors ${
                                feedback === "down"
                                  ? "bg-slate-800 text-white border-slate-800"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>No</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* World-Class Concierge Support Desk */}
        <div className="bg-gradient-to-br from-[#064e3b] via-[#085a45] to-[#064e3b] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] text-[11px] font-extrabold uppercase font-heading">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>Live Advisory Desk Online</span>
              </div>

              <h2 className="font-heading font-black text-2xl md:text-4xl leading-tight">
                Need specialized assistance with cap-tables or due diligence?
              </h2>

              <p className="text-xs md:text-sm text-slate-200 max-w-xl font-body leading-relaxed">
                Our venture partners are available 24/7 to assist institutional investors, Uddokta founders, and advisory consultants.
              </p>

              <div className="flex flex-wrap gap-6 pt-2 text-xs text-slate-200 font-body">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#10b981]" />
                  <span>+880 (2) 881-9920</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#10b981]" />
                  <span>support@investra.io</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/contact"
                className="bg-[#10b981] hover:bg-[#0d9668] text-[#064e3b] font-heading font-extrabold py-3.5 px-6 rounded-2xl text-xs transition-all duration-200 shadow-lg text-center flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                <span>Connect With Support Desk</span>
              </Link>

              <Link
                href="/consultants"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-heading font-bold py-3.5 px-6 rounded-2xl text-xs transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-[#10b981]" />
                <span>Book Consultant Session</span>
              </Link>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
