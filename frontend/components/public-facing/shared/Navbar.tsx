"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-slate-100 py-4">
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" fill="rgba(6, 78, 59, 0.08)" stroke="#064e3b" />
            <path d="M12 6a6 6 0 0 0-6 6c0 2.2.9 4.2 2.4 5.2" stroke="#10b981" />
            <path d="M12 6v12" stroke="#064e3b" />
            <path d="M12 9c1.5-.8 3-.8 4.5 0" stroke="#10b981" />
            <path d="M12 13c2-.8 3.5-.8 5.5 0" stroke="#10b981" />
          </svg>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#064e3b]">
            Investra
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/platform" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Platform
          </Link>
          <Link href="/funds" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Investment Funds
          </Link>
          <Link href="/impact" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Impact
          </Link>
          <Link href="/resources" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Resources
          </Link>
          <Link href="/about" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            About
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors px-3 py-2">
            Client Login
          </Link>
          <Link href="/register" className="bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-primary focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 animate-fade-in">
          <Link
            href="/platform"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Platform
          </Link>
          <Link
            href="/funds"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Investment Funds
          </Link>
          <Link
            href="/impact"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Impact
          </Link>
          <Link
            href="/resources"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Resources
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            About
          </Link>
          <hr className="border-slate-100" />
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-center text-xs font-bold text-slate-600 border border-slate-200 py-2 rounded-lg">
              Client Login
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="text-center bg-[#064e3b] text-white text-xs font-bold py-2 rounded-lg">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
