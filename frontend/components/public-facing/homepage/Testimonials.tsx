"use client";

import React from "react";
import Image from "next/image";
import { FaApple, FaGoogle, FaYoutube, FaQuoteLeft } from "react-icons/fa";
import { Star, ArrowRight } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  image: string;
}

const testimonialsColumn1: Testimonial[] = [
  {
    id: 1,
    text: "InvestConnect's comparison engine provided us with verified metrics that made matching with seed capital incredibly straightforward.",
    author: "Editha Kristin",
    role: "CEO, FinTech Ventures",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    text: "The real-time business metrics dashboard is game-changing. It makes tracking entrepreneur engagement stats simple for our founders.",
    author: "Alvaro M.",
    role: "Entrepreneur Support Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    text: "Starting with a basic allocation in the comparison tools allowed us to comfortably find high-yield seed rounds.",
    author: "Elena Rostova",
    role: "Asset Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  }
];

const testimonialsColumn2: Testimonial[] = [
  {
    id: 4,
    text: "Partnering with InvestConnect helped us secure funding for our SaaS scaling phase in record time. Excellent communication and transparency.",
    author: "Mario Pascal",
    role: "SaaS Project Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 5,
    text: "Transparent messaging pipelines paired with expert advisor sessions. They are our trusted partners.",
    author: "Edelgard Gisa",
    role: "Operations Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 6,
    text: "Securing capital with premium features like side-by-side comparison makes discovering seed funds very attractive.",
    author: "Marcus Vance",
    role: "Ventures Lead",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
  }
];

const Testimonials = () => {
  return (
    <section className="w-full bg-[#f4f5f6] py-16 md:py-24 border-b border-slate-200/50">
      
      {/* Component Styles for vertical scroll marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 25s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 25s linear infinite;
        }
        .animate-scroll-up:hover,
        .animate-scroll-down:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-8">
        
        {/* Top Grid: Testimonial cards & sidebar stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Large Card (2/3 width) */}
          <div className="lg:col-span-8 bg-white rounded-[32px] p-8 md:p-10 shadow-xs border border-slate-100 flex flex-col md:grid md:grid-cols-12 gap-8 overflow-hidden items-center">
            
            {/* Left Card Content Column */}
            <div className="md:col-span-5 space-y-6 flex flex-col justify-center h-full">
              <h2 className="text-3xl md:text-[38px] font-heading font-black text-slate-900 leading-tight">
                Trusted By Over <span className="text-[#064e3b]">1300+</span> Loyal Clients
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-body">
                Our investors' trust is built on regulatory compliance, risk-managed yields, and verified environmental footprint indicators.
              </p>
              
              <div>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-300 font-heading shadow-xs hover:shadow-md"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Right Card Vertical Scrolling Testimonials Columns */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] w-full overflow-hidden relative select-none pointer-events-auto">
              
              {/* Fade Overlay Top/Bottom */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

              {/* Scrolling Column 1 (Scrolls Up) */}
              <div className="flex flex-col gap-4 overflow-hidden relative h-full">
                <div className="flex flex-col gap-4 animate-scroll-up">
                  {/* First iteration */}
                  {testimonialsColumn1.map((item) => (
                    <div key={`col1-${item.id}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[180px] shrink-0">
                      <div>
                        <FaQuoteLeft className="text-[#064e3b]/10 w-6 h-6 mb-2" />
                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-body">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={item.image} alt={item.author} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-800 truncate font-heading">{item.author}</h4>
                          <p className="text-[9px] text-slate-400 truncate font-body">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Second iteration (for infinite loop) */}
                  {testimonialsColumn1.map((item) => (
                    <div key={`col1-dup-${item.id}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[180px] shrink-0">
                      <div>
                        <FaQuoteLeft className="text-[#064e3b]/10 w-6 h-6 mb-2" />
                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-body">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={item.image} alt={item.author} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-800 truncate font-heading">{item.author}</h4>
                          <p className="text-[9px] text-slate-400 truncate font-body">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrolling Column 2 (Scrolls Down) */}
              <div className="flex flex-col gap-4 overflow-hidden relative h-full">
                <div className="flex flex-col gap-4 animate-scroll-down">
                  {/* First iteration */}
                  {testimonialsColumn2.map((item) => (
                    <div key={`col2-${item.id}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[180px] shrink-0">
                      <div>
                        <FaQuoteLeft className="text-[#064e3b]/10 w-6 h-6 mb-2" />
                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-body">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={item.image} alt={item.author} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-800 truncate font-heading">{item.author}</h4>
                          <p className="text-[9px] text-slate-400 truncate font-body">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Second iteration (for infinite loop) */}
                  {testimonialsColumn2.map((item) => (
                    <div key={`col2-dup-${item.id}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[180px] shrink-0">
                      <div>
                        <FaQuoteLeft className="text-[#064e3b]/10 w-6 h-6 mb-2" />
                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-body">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={item.image} alt={item.author} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-800 truncate font-heading">{item.author}</h4>
                          <p className="text-[9px] text-slate-400 truncate font-body">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Cards Stack (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Top Stack Card: Ratings */}
            <div className="bg-white rounded-[32px] p-8 shadow-xs border border-slate-100 flex flex-col justify-between flex-1 min-h-[180px]">
              <div className="space-y-2">
                <h3 className="text-5xl font-heading font-black text-slate-900">4.80</h3>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-body">2,568 Reviews and counting</p>
              </div>
              <div className="flex gap-4 pt-6 text-slate-400">
                <FaApple className="w-6 h-6 hover:text-slate-800 transition-colors" />
                <FaGoogle className="w-5.5 h-5.5 hover:text-slate-800 transition-colors" />
                <FaYoutube className="w-6 h-6 hover:text-slate-800 transition-colors" />
              </div>
            </div>

            {/* Bottom Stack Card: Group Cooperation */}
            <div className="bg-[#064e3b] rounded-[32px] p-8 shadow-xs border border-transparent flex flex-col justify-between flex-1 min-h-[180px] text-white">
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-black text-white leading-tight">
                  Group <br /> Cooperation
                </h3>
              </div>
              <div className="flex items-center gap-2 pt-6">
                {/* Overlapping Avatars */}
                <div className="flex -space-x-3.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#064e3b] object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="user 1"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#064e3b] object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="user 2"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-[#064e3b] object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="user 3"
                  />
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#064e3b] ring-2 ring-[#064e3b] text-xs font-bold">
                    +
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Banner Stats */}
        <div className="bg-[#0b1320] text-white rounded-[24px] p-8 md:p-12 relative overflow-hidden border border-slate-800">
          {/* Vector flow lines background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-2 border-r last:border-r-0 border-slate-800 pr-2">
              <h3 className="text-3xl md:text-[42px] font-heading font-black text-white leading-none">27+</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-body tracking-wider uppercase">Depth Of Experience</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2 border-r last:border-r-0 border-slate-800 pr-2">
              <h3 className="text-3xl md:text-[42px] font-heading font-black text-white leading-none">150+</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-body tracking-wider uppercase">Happy Clients</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2 border-r last:border-r-0 border-slate-800 pr-2">
              <h3 className="text-3xl md:text-[42px] font-heading font-black text-white leading-none">$600M</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-body tracking-wider uppercase">Profit Growth</p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-2 last:border-r-0 border-slate-800">
              <h3 className="text-3xl md:text-[42px] font-heading font-black text-white leading-none">97%</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-body tracking-wider uppercase">Customer Success Rate</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
