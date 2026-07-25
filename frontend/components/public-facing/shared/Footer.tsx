"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b1320] text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] space-y-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" />
                <path d="M12 6a6 6 0 0 0-6 6c0 2.2.9 4.2 2.4 5.2" stroke="#34d399" />
                <path d="M12 6v12" stroke="#10b981" />
                <path d="M12 9c1.5-.8 3-.8 4.5 0" stroke="#34d399" />
                <path d="M12 13c2-.8 3.5-.8 5.5 0" stroke="#34d399" />
              </svg>
              <span className="font-heading font-extrabold text-lg text-white">
                Investra
              </span>
            </Link>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Sustainable and eco-wealth investment platform driving positive environmental and financial growth.
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              1325 Main Street,<br />
              Dolonoare, 192203
            </p>
          </div>

          {/* Links Column */}
          <div className="flex gap-12 text-[11px] font-bold">
            <div className="space-y-3">
              <Link href="/about" className="block text-slate-300 hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/careers" className="block text-slate-300 hover:text-emerald-400 transition-colors">Careers</Link>
              <Link href="/contact" className="block text-slate-300 hover:text-emerald-400 transition-colors">Contact</Link>
              <Link href="/legal" className="block text-slate-300 hover:text-emerald-400 transition-colors">Legal</Link>
            </div>
            <div className="space-y-3">
              <Link href="/blog" className="block text-slate-300 hover:text-emerald-400 transition-colors">Insights Blog</Link>
              <Link href="/esg" className="block text-slate-300 hover:text-emerald-400 transition-colors">ESG Reports</Link>
              <Link href="/help" className="block text-slate-300 hover:text-emerald-400 transition-colors">Help Center</Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-800" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
          <p>© {new Date().getFullYear()} Investra Sustainable Capital. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
