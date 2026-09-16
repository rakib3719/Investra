"use client";

import { useState } from "react";
import Image from "next/image";
import { CiPlay1 } from "react-icons/ci";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "How does Investra select sustainable projects?",
      answer: "We run all projects through a rigorous ESG (Environmental, Social, and Governance) framework and third-party audit to ensure they deliver measurable, positive impact and financial viability."
    },
    {
      question: "What is the minimum investment requirement?",
      answer: "Investra is designed to be accessible. You can start investing in sustainable funds with as little as $100."
    },
    {
      question: "How are financial returns calculated and paid?",
      answer: "Returns vary by fund type (e.g. forestry yield, solar power sales). Dividends are typically paid quarterly or annually, and you can track your earnings directly on your dashboard."
    },
    {
      question: "Are my investments secure and regulated?",
      answer: "Yes, Investra is a registered investment platform compliant with national financial regulations, utilizing bank-grade encryption to protect your funds and personal data."
    },
    {
      question: "Can I withdraw my funds at any time?",
      answer: "While some long-term projects like forestry have locking periods, we offer a secondary market for selected funds where you can sell your shares to other investors."
    }
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px]">
        <div className="grid gap-12 items-center lg:grid-cols-12">
          
          {/* FAQ Left Section */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#064e3b] font-heading">
              FAQ&apos;s
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-[#1e293b] leading-tight">
              Got Questions? We’ve Got <span className="italic text-[#064e3b]">Answers</span>!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-body">
              Explore the fundamentals of sustainable investing. If you have additional questions, our specialized support team is always ready to guide you.
            </p>
            <div className="pt-2">
              <a 
                href="/help"
                className="inline-block border border-slate-200 hover:border-[#064e3b] text-[#1e293b] hover:text-[#064e3b] text-xs font-bold px-5 py-2.5 rounded-lg transition-colors font-heading"
              >
                Visit Help Center
              </a>
            </div>
          </div>

          {/* Image with Play Button in the Center */}
          <div className="lg:col-span-4 relative group rounded-2xl overflow-hidden aspect-[4/3] md:aspect-square bg-slate-50 border border-slate-100 shadow-xs">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
              alt="Investra Platform Presentation"
              fill
              sizes="(max-w-768px) 100vw, 30vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#064e3b]/10 group-hover:bg-[#064e3b]/20 transition-colors duration-300" />
            
            {/* Play Button */}
            <button 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#064e3b] hover:bg-[#043c2e] text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 active:scale-95 group/btn cursor-pointer"
              aria-label="Play video"
            >
              <CiPlay1 className="w-6 h-6 text-white ml-0.5 group-hover/btn:scale-110 transition-transform duration-300" />
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-full bg-[#064e3b] -z-10 animate-ping opacity-30" />
            </button>
          </div>

          {/* Custom Accordion on the Right */}
          <div className="lg:col-span-4 space-y-3">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl overflow-hidden border transition-all duration-300",
                    isOpen
                      ? "border-[#064e3b]/20 bg-slate-50/50 shadow-xs"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <button
                    className={cn(
                      "w-full flex justify-between items-center font-heading font-bold text-xs md:text-sm p-4 text-left transition-colors duration-300",
                      isOpen ? "text-[#064e3b]" : "text-[#1e293b] hover:text-[#064e3b]"
                    )}
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="pr-4">{item.question}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform duration-300 text-slate-400",
                        isOpen && "rotate-180 text-[#064e3b]"
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-350 ease-in-out font-body",
                      isOpen ? "max-h-[300px] opacity-100 border-t border-slate-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="p-4 text-xs md:text-sm text-slate-600 leading-relaxed bg-white">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
