"use client";

import Link from "next/link";
import React from "react";
import { FaTwitter, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import { ChevronUp, Send } from "lucide-react";
import WavyBackground from "@/components/ui/WavyBackground";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#080d16] text-slate-300 relative overflow-hidden rounded-t-[40px] md:rounded-t-[60px] pt-16 pb-8 border-t border-slate-900 z-10">
      
      {/* Animated Canvas Wavy Background behind the footer items */}
      <WavyBackground 
        colors={["var(--primary)", "var(--accent)", "#047857"]}
        waveWidth={1}
        backgroundFill="#080d16"
        waveOpacity={0.12}
        speed="slow"
      />

      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-12 relative z-20">
        
        {/* Top Grid: Logo/Socials, Newsletter registration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Logo & Social Links (4/12 span) */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" fill="var(--selection)" stroke="var(--accent)" />
                <path d="M12 6a6 6 0 0 0-6 6c0 2.2.9 4.2 2.4 5.2" stroke="currentColor" />
                <path d="M12 6v12" stroke="var(--accent)" />
                <path d="M12 9c1.5-.8 3-.8 4.5 0" stroke="currentColor" />
                <path d="M12 13c2-.8 3.5-.8 5.5 0" stroke="currentColor" />
              </svg>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                InvestConnect
              </span>
            </Link>
            
            <p className="text-[11px] leading-relaxed text-slate-400 font-body max-w-sm">
              Connecting Investors, Entrepreneurs, and Consultants in a secure subscription-based ecosystem.
            </p>

            <div className="space-y-3">
              <h4 className="text-[11px] font-heading font-black tracking-wider uppercase text-slate-200">
                Stay Tuned
              </h4>
              <div className="flex gap-3">
                <a href="#" className="w-8.5 h-8.5 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-colors bg-slate-900/20">
                  <FaTwitter className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="w-8.5 h-8.5 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-colors bg-slate-900/20">
                  <FaYoutube className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="w-8.5 h-8.5 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-colors bg-slate-900/20">
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="w-8.5 h-8.5 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-colors bg-slate-900/20">
                  <FaGlobe className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Newsletter Header (4/12 span) */}
          <div className="md:col-span-4 flex items-center md:h-full">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white leading-tight">
              Register For Our <br /> Updates!
            </h2>
          </div>

          {/* Column 3: Newsletter Input & Terms checkbox (4/12 span) */}
          <div className="md:col-span-4 space-y-4">
            {/* Input box */}
            <div className="flex bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors p-1 backdrop-blur-xs">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent text-xs text-white px-4 py-2.5 w-full focus:outline-none placeholder-slate-500 font-body"
              />
              <button className="bg-primary hover:opacity-95 text-primary-foreground p-2 rounded-lg transition-colors flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="mt-0.5 rounded border-slate-800 bg-slate-900 text-primary focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5" 
              />
              <span className="text-[10px] text-slate-400 leading-normal font-body">
                I acknowledge all the Terms & Conditions
              </span>
            </label>
          </div>

        </div>

        {/* Middle Grid: Nav Links columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-slate-900/60 text-[11px]">
          
          {/* Link Col 1 */}
          <div className="space-y-4">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
              Support Pages
            </h3>
            <ul className="space-y-2.5 text-slate-400 font-body">
              <li><Link href="/about" className="hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/chat" className="hover:text-accent transition-colors">Live Chat</Link></li>
              <li><Link href="/guide" className="hover:text-accent transition-colors">Trading Guide</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/risk" className="hover:text-accent transition-colors">Risk Disclosure</Link></li>
            </ul>
          </div>

          {/* Link Col 2 */}
          <div className="space-y-4">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
              About
            </h3>
            <ul className="space-y-2.5 text-slate-400 font-body">
              <li><Link href="/story" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link href="/advisors" className="hover:text-accent transition-colors">Our Team</Link></li>
              <li><Link href="/funds" className="hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition-colors">Career</Link></li>
              <li><Link href="/testimonials" className="hover:text-accent transition-colors">Client Testimonials</Link></li>
              <li><Link href="/security" className="hover:text-accent transition-colors">Security Promise</Link></li>
            </ul>
          </div>

          {/* Link Col 3 */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-slate-400 font-body grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2.5">
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/subscription" className="hover:text-accent transition-colors">Pricing Plan</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/market" className="hover:text-accent transition-colors">Market Overview</Link></li>
              <li><Link href="/transact" className="hover:text-accent transition-colors">Deposit & Withdrawals</Link></li>
              <li><Link href="/login" className="hover:text-accent transition-colors">Account Login</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright and Scroll To Top */}
        <div className="pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-body relative">
          <p>© {new Date().getFullYear()} InvestConnect. All Rights Reserved</p>
          
          <div className="flex items-center gap-8">
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Condition</Link>
            </div>
            
            {/* Circular Scroll-to-Top Button */}
            <button
              onClick={scrollToTop}
              className="bg-primary hover:opacity-90 text-primary-foreground p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
