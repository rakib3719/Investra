"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const colors = [
    { name: "Midnight Navy", hex: "#182B45", hsl: "hsl(215, 49%, 18%)", desc: "Primary Background & Deep Canvas" },
    { name: "Steel Blue", hex: "#263F6A", hsl: "hsl(218, 47%, 28%)", desc: "Primary Brand Color & UI Elements" },
    { name: "Forest Green", hex: "#193725", hsl: "hsl(144, 38%, 16%)", desc: "Success, Growth & Positive Accent" },
    { name: "Slate Gray", hex: "#606061", hsl: "hsl(240, 1%, 38%)", desc: "Utility, Borders & Muted Details" },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-navy-bg bg-radial-glow selection:bg-brand-blue selection:text-white text-gray-100 font-sans pb-24">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-brand-gray/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-navy-blue flex items-center justify-center border border-brand-gray/25 shadow-md shadow-brand-navy/50">
              <svg className="w-5 h-5 text-green-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-outfit">
              Investra<span className="text-green-text">.</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-text">
            <a href="#identity" className="hover:text-white transition-colors duration-200">Design Identity</a>
            <a href="#palette" className="hover:text-white transition-colors duration-200">Color System</a>
            <a href="#live-demo" className="hover:text-white transition-colors duration-200">Live UI Preview</a>
            <a href="#tailwind" className="hover:text-white transition-colors duration-200">Tailwind Settings</a>
          </nav>

          <button className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-navy-blue border border-brand-gray/30 hover:border-brand-gray/60 hover:shadow-lg hover:shadow-brand-blue/30 transition-all duration-300 text-white cursor-pointer">
            Explore Brand Guidelines
          </button>
        </div>
      </header>

      {/* 2. Hero Presentation */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-brand-gray/10 mb-6 text-xs text-blue-text font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-green-text animate-pulse"></span>
          <span>New Brand Palette Activated</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto font-outfit leading-tight">
          Crafting a Sophisticated <br />
          <span className="bg-gradient-to-r from-blue-text via-white to-green-text bg-clip-text text-transparent">
            Visual Ecosystem for Investra
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-text max-w-2xl mx-auto font-light leading-relaxed">
          Showcasing how <span className="text-white font-medium">Midnight Navy</span>, <span className="text-white font-medium">Steel Blue</span>, <span className="text-white font-medium">Forest Green</span>, and <span className="text-white font-medium">Slate Gray</span> merge to create a modern, corporate dark-mode financial landscape.
        </p>
      </section>

      {/* 3. Generated Visual Assets (Images) */}
      <section id="identity" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
        <h2 className="text-2xl font-bold font-outfit text-white mb-2">Generated Brand Assets</h2>
        <p className="text-sm text-slate-text mb-8">AI-generated concepts showcasing the palette in corporate branding and interface layouts.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Logo Showcase */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-brand-gray/25 shadow-xl">
            <div className="p-6 border-b border-brand-gray/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-text">Concept 1: Brand Logo</span>
              <h3 className="text-lg font-bold text-white mt-1">Elegantly Integrated Geometric Symbol</h3>
              <p className="text-xs text-slate-text mt-1">Stylized letter &quot;I&quot; fused with growth trends, highlighting the brand colors.</p>
            </div>
            <div className="bg-[#0b121e] aspect-square flex items-center justify-center p-8 relative">
              <Image 
                src="/investra_new_logo.png" 
                alt="Investra Brand Logo" 
                width={500}
                height={500}
                className="object-contain max-h-[360px] rounded-lg transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Card 2: UI Dashboard Preview */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-brand-gray/25 shadow-xl">
            <div className="p-6 border-b border-brand-gray/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-green-text">Concept 2: UI Section Overview</span>
              <h3 className="text-lg font-bold text-white mt-1">Dashboard Component Integration</h3>
              <p className="text-xs text-slate-text mt-1">A real-world illustration of how backgrounds, cards, indicators, and text elements render together.</p>
            </div>
            <div className="bg-[#0b121e] aspect-square flex items-center justify-center p-8 relative">
              <Image 
                src="/investra_ui_preview.png" 
                alt="Investra UI Design Preview" 
                width={500}
                height={500}
                className="object-contain max-h-[360px] rounded-lg transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Palette Swatch & Color Visualizer */}
      <section id="palette" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
        <h2 className="text-2xl font-bold font-outfit text-white mb-2">The Interactive Palette</h2>
        <p className="text-sm text-slate-text mb-8">Click on any swatch card to copy the hex code value instantly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div 
              key={color.hex}
              onClick={() => handleCopyColor(color.hex)}
              className="glass-panel glass-panel-hover rounded-xl p-5 border border-brand-gray/25 flex flex-col justify-between relative cursor-pointer group"
            >
              {/* Color Box */}
              <div 
                className="w-full h-32 rounded-lg shadow-inner border border-white/5 relative overflow-hidden" 
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-white/90">Copy HEX Code</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base">{color.name}</h3>
                  <span className="text-xs font-mono font-bold text-blue-text">{color.hex}</span>
                </div>
                <p className="text-[11px] text-slate-text mt-1 font-mono">{color.hsl}</p>
                <p className="text-xs text-slate-text mt-2 font-light border-t border-brand-gray/10 pt-2">{color.desc}</p>
              </div>

              {/* Copy indicator */}
              {copiedColor === color.hex && (
                <div className="absolute inset-0 bg-[#182b45]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center transition-all duration-300">
                  <svg className="w-8 h-8 text-green-text mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-xs font-semibold text-white">Copied to Clipboard!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Live UI Demo (Built Directly with Brand Colors) */}
      <section id="live-demo" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
        <h2 className="text-2xl font-bold font-outfit text-white mb-2">Live UI Component Rendering</h2>
        <p className="text-sm text-slate-text mb-8">This dashboard module is built dynamically using CSS variable mappings of the 4 brand colors.</p>

        {/* Dashboard Mock Container */}
        <div className="w-full bg-navy-bg border border-brand-gray/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[580px]">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-brand-navy/40 border-r border-brand-gray/10 p-6 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded bg-brand-blue flex items-center justify-center border border-brand-gray/20">
                  <svg className="w-4 h-4 text-green-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-bold text-white text-sm tracking-wide">INVESTRA HUB</span>
              </div>

              {/* Navigation links */}
              <div className="space-y-1">
                {[
                  { id: "dashboard", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" },
                  { id: "ventures", label: "Deals Room", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                  { id: "analytics", label: "Portfolio Trends", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                  { id: "consultants", label: "Advisory Network", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      activeTab === item.id 
                        ? "bg-brand-blue text-white shadow-md shadow-brand-navy/60 border border-brand-gray/30" 
                        : "text-slate-text hover:text-white hover:bg-brand-navy/20"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile area */}
            <div className="flex items-center space-x-3 border-t border-brand-gray/10 pt-6">
              <div className="w-8 h-8 rounded-full bg-gradient-navy-blue flex items-center justify-center border border-brand-gray/30 text-xs font-bold text-white">
                JD
              </div>
              <div>
                <p className="text-xs font-bold text-white">Julian Dev</p>
                <p className="text-[10px] text-slate-text">Investor Tier 1</p>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border-b border-brand-gray/10 pb-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white font-outfit">Financial Overview</h3>
                <p className="text-xs text-slate-text">Real-time valuation analytics using new visual guidelines.</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-brand-green/30 border border-brand-green text-green-text hover:bg-brand-green/50 transition-colors duration-200 cursor-pointer">
                  + Add Investment
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-brand-navy border border-brand-gray/25 hover:border-brand-gray/60 transition-colors duration-200 cursor-pointer text-white">
                  Export Report
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 flex-1">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Card 1: Valuation */}
                  <div className="glass-panel p-5 rounded-xl border border-brand-gray/20">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-text">Portfolio Value</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-2xl font-extrabold text-white">$148,630.75</span>
                      <span className="text-[11px] font-bold text-green-text bg-brand-green/30 px-1.5 py-0.5 rounded">+7.41%</span>
                    </div>
                    <div className="w-full h-1 bg-brand-navy rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-blue to-green-text w-3/4 rounded-full"></div>
                    </div>
                  </div>

                  {/* Card 2: Profit */}
                  <div className="glass-panel p-5 rounded-xl border border-brand-gray/20">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-text">Net Profit Yield</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-2xl font-extrabold text-white">$12,410.20</span>
                      <span className="text-[11px] font-bold text-green-text bg-brand-green/30 px-1.5 py-0.5 rounded">+12.4%</span>
                    </div>
                    <div className="w-full h-1 bg-brand-navy rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-green-text w-1/2 rounded-full"></div>
                    </div>
                  </div>

                  {/* Card 3: Risk Index */}
                  <div className="glass-panel p-5 rounded-xl border border-brand-gray/20">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-text">Risk Exposure</span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-2xl font-extrabold text-white">Moderate</span>
                      <span className="text-[11px] font-bold text-blue-text bg-brand-blue/30 px-1.5 py-0.5 rounded">Level 3</span>
                    </div>
                    <div className="w-full h-1 bg-brand-navy rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-brand-blue w-2/3 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* SVG Performance graph */}
                <div className="glass-panel p-5 rounded-xl border border-brand-gray/20">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Annual Growth Trajectory</h4>
                    <span className="text-[10px] text-slate-text">Current Palette Test (Steel Blue & Forest Green Line)</span>
                  </div>
                  <div className="w-full h-48 relative">
                    <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#263F6A" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#193725" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="50" x2="600" y2="50" stroke="#606061" strokeOpacity="0.1" strokeDasharray="5,5" />
                      <line x1="0" y1="100" x2="600" y2="100" stroke="#606061" strokeOpacity="0.1" strokeDasharray="5,5" />
                      <line x1="0" y1="150" x2="600" y2="150" stroke="#606061" strokeOpacity="0.1" strokeDasharray="5,5" />
                      
                      {/* Gradient Fill under the line */}
                      <path d="M 0,200 L 0,160 Q 150,110 300,140 T 600,60 L 600,200 Z" fill="url(#chartGradient)" />
                      
                      {/* Interactive Line */}
                      <path d="M 0,160 Q 150,110 300,140 T 600,60" fill="none" stroke="#263F6A" strokeWidth="3" />
                      
                      {/* Accents (Forest Green dots for key check points) */}
                      <circle cx="150" cy="120" r="5" fill="#193725" stroke="#606061" strokeWidth="1.5" />
                      <circle cx="300" cy="140" r="5" fill="#193725" stroke="#606061" strokeWidth="1.5" />
                      <circle cx="450" cy="98" r="5" fill="#193725" stroke="#606061" strokeWidth="1.5" />
                      <circle cx="600" cy="60" r="6" fill="#4ade80" stroke="#182b45" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-text mt-2 font-mono">
                    <span>Q1</span>
                    <span>Q2</span>
                    <span>Q3</span>
                    <span>Q4</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "dashboard" && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <svg className="w-12 h-12 text-brand-blue mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-sm font-bold text-white">Tab &quot;{activeTab}&quot; Active</h4>
                <p className="text-xs text-slate-text max-w-sm mt-2">
                  This layout would render specific deal rooms or analytics metrics using the steel blue border patterns.
                </p>
              </div>
            )}

            {/* Bottom Disclaimer */}
            <div className="border-t border-brand-gray/10 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-text">
              <span>Investra Design System v2.0</span>
              <span className="font-mono text-blue-text">Borders: 1px solid #606061 (20% Opacity)</span>
            </div>
          </main>
        </div>
      </section>

      {/* 6. Tailwind Custom Setup Config */}
      <section id="tailwind" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-24">
        <h2 className="text-2xl font-bold font-outfit text-white mb-2">Tailwind Configuration</h2>
        <p className="text-sm text-slate-text mb-8">Drop these code declarations into your CSS file or tailwind.config.ts to activate the exact color palette mappings.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CSS Variables Code block */}
          <div className="glass-panel p-6 rounded-xl border border-brand-gray/25 relative">
            <span className="absolute top-4 right-4 text-[10px] font-mono text-slate-text">Tailwind v4 (CSS)</span>
            <h3 className="text-sm font-bold text-white mb-4">globals.css Setup</h3>
            <pre className="text-xs text-blue-text font-mono overflow-x-auto p-4 bg-[#0a121e]/85 rounded-lg border border-brand-gray/10 select-all">
{`@theme {
  --color-brand-navy: #182b45;
  --color-brand-blue: #263f6a;
  --color-brand-green: #193725;
  --color-brand-gray: #606061;
}`}
            </pre>
          </div>

          {/* JS Tailwind Configuration block */}
          <div className="glass-panel p-6 rounded-xl border border-brand-gray/25 relative">
            <span className="absolute top-4 right-4 text-[10px] font-mono text-slate-text">Tailwind v3 (JS Config)</span>
            <h3 className="text-sm font-bold text-white mb-4">tailwind.config.js Extension</h3>
            <pre className="text-xs text-green-text font-mono overflow-x-auto p-4 bg-[#0a121e]/85 rounded-lg border border-brand-gray/10 select-all">
{`module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#182b45',
          blue: '#263f6a',
          green: '#193725',
          gray: '#606061',
        }
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
