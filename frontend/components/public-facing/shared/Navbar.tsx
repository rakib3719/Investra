"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronDown, 
  Info, 
  HelpCircle, 
  Layers, 
  Briefcase, 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  Phone,
  Mail
} from "lucide-react";
import { FaTwitter, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    name: "About Us",
    href: "/about",
    icon: Info,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "FAQ",
    href: "/faq",
    icon: HelpCircle,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Service",
    href: "/platform",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Our Team",
    href: "/advisors",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Pricing Plan",
    href: "/pricing",
    icon: DollarSign,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Service Detail",
    href: "/services/detail",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Portfolio Detail",
    href: "/portfolio/detail",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "404 Error Page",
    href: "/404",
    icon: AlertCircle,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string>(menuItems[0].image);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle active dropdown
  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-white border-b border-slate-100 relative z-50" ref={dropdownRef}>
      
      {/* Component Styles for horizontal partners scroll */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x {
          display: flex;
          animation: scroll-x 20s linear infinite;
        }
        .animate-scroll-x:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] flex items-center justify-between h-20">
        
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
        <div className="hidden md:flex items-center gap-8 h-full">
          
          {/* Dropdown Link: Platform with Hover-to-Open Wrapper */}
          <div 
            onMouseEnter={() => {
              if (window.innerWidth >= 768) setActiveDropdown("platform");
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 768) setActiveDropdown(null);
            }}
            className="h-full flex items-center"
          >
            <button 
              onClick={() => {
                toggleDropdown("platform");
              }}
              className={`text-xs font-bold flex items-center gap-1 transition-colors h-full ${
                activeDropdown === "platform" ? "text-[#064e3b]" : "text-slate-600 hover:text-primary"
              }`}
            >
              <span>Platform</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                activeDropdown === "platform" ? "rotate-180 text-[#064e3b]" : "text-slate-400"
              }`} />
            </button>

            {/* MEGA MENU DROPDOWN PANEL */}
            {activeDropdown === "platform" && (
              <div className="absolute top-full left-0 right-0 w-full bg-transparent px-6 md:px-12 lg:px-24 xl:px-[100px] pt-0.5 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-100">
                  
                  {/* Left Section (2/3 width, Brand Green accent BG) */}
                  <div className="lg:col-span-8 bg-[#064e3b]/5 p-8 flex flex-col justify-between gap-8">
                    
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                      
                      {/* Embedded workspace preview image (changes dynamically on item hover) */}
                      <div className="hidden md:block md:w-[220px] relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/50 shrink-0">
                        <img
                          src={hoveredImage}
                          alt="Category Preview"
                          className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                        />
                      </div>

                      {/* Sub-menu grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6 w-full">
                        {menuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link 
                              key={item.name} 
                              href={item.href} 
                              onMouseEnter={() => setHoveredImage(item.image)}
                              className="flex items-center gap-3 group"
                            >
                              <span className="p-2.5 rounded-xl bg-white text-[#064e3b] shadow-xs group-hover:bg-[#064e3b] group-hover:text-white transition-colors duration-300">
                                <Icon className="w-4 h-4" />
                              </span>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-[#064e3b] transition-colors font-heading">
                                {item.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                    </div>

                    {/* HORIZONTAL PARTNERS TICKER (Infinite scroll with real vector-like SVG logos) */}
                    <div className="border-t border-slate-200/50 pt-5 flex items-center gap-6 overflow-hidden select-none">
                      <span className="text-[10px] font-heading font-black tracking-wider uppercase text-slate-400 shrink-0">
                        Our Partners:
                      </span>
                      
                      <div className="relative w-full overflow-hidden">
                        <div className="animate-scroll-x gap-10 items-center whitespace-nowrap">
                          {/* Vector SVG logos for Acme, Hertz, Terra, BioVest, CarbonFlow, SolArray */}
                          {/* Logo 1 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" fill="#064e3b" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">ACME</text>
                            </svg>
                          </div>
                          
                          {/* Logo 2 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M4 2v20h4V13h8v9h4V2h-4v7H8V2H4z" fill="#10b981" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">HERTZ</text>
                            </svg>
                          </div>

                          {/* Logo 3 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <circle cx="10" cy="12" r="8" fill="none" stroke="#064e3b" strokeWidth="2.5" />
                              <circle cx="10" cy="12" r="4" fill="#10b981" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">TERRA</text>
                            </svg>
                          </div>

                          {/* Logo 4 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M10 2a8 8 0 00-8 8c0 4.4 8 12 8 12s8-7.6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" fill="#10b981" />
                              <text x="26" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="11">BIOVEST</text>
                            </svg>
                          </div>

                          {/* Logo 5 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M17 12a5 5 0 10-5 5h5v-2h-5a3 3 0 113-3v3h2v-3z" fill="#064e3b" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">CARBON</text>
                            </svg>
                          </div>

                          {/* Logo 6 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <circle cx="10" cy="12" r="5" fill="#10b981" />
                              <path d="M10 2v3M10 19v3M2 12h3M19 12h3" stroke="#064e3b" strokeWidth="2" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">SOLAR</text>
                            </svg>
                          </div>

                          {/* Duplicate set for seamless infinite scroll */}
                          {/* Logo 1 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" fill="#064e3b" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">ACME</text>
                            </svg>
                          </div>
                          
                          {/* Logo 2 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M4 2v20h4V13h8v9h4V2h-4v7H8V2H4z" fill="#10b981" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">HERTZ</text>
                            </svg>
                          </div>

                          {/* Logo 3 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <circle cx="10" cy="12" r="8" fill="none" stroke="#064e3b" strokeWidth="2.5" />
                              <circle cx="10" cy="12" r="4" fill="#10b981" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">TERRA</text>
                            </svg>
                          </div>

                          {/* Logo 4 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M10 2a8 8 0 00-8 8c0 4.4 8 12 8 12s8-7.6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" fill="#10b981" />
                              <text x="26" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="11">BIOVEST</text>
                            </svg>
                          </div>

                          {/* Logo 5 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <path d="M17 12a5 5 0 10-5 5h5v-2h-5a3 3 0 113-3v3h2v-3z" fill="#064e3b" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">CARBON</text>
                            </svg>
                          </div>

                          {/* Logo 6 */}
                          <div className="flex items-center gap-2 shrink-0">
                            <svg className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors" viewBox="0 0 100 24" fill="currentColor">
                              <circle cx="10" cy="12" r="5" fill="#10b981" />
                              <path d="M10 2v3M10 19v3M2 12h3M19 12h3" stroke="#064e3b" strokeWidth="2" />
                              <text x="28" y="17" fontFamily="sans-serif" fontWeight="900" fontSize="12">SOLAR</text>
                            </svg>
                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Right Section (1/3 width, solid white card) */}
                  <div className="lg:col-span-4 bg-white p-8 flex flex-col justify-between gap-8">
                    
                    <div className="space-y-6">
                      <h3 className="text-xs font-heading font-black text-slate-800 uppercase tracking-widest">
                        Locate Us
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Phone Info */}
                        <div className="flex items-center gap-4">
                          <span className="p-3 rounded-2xl bg-[#10b981]/15 text-[#064e3b] shrink-0">
                            <Phone className="w-5 h-5" />
                          </span>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800 font-heading">
                              Talk To Us
                            </h4>
                            <p className="text-[10px] text-slate-500 font-body">
                              +00-123-456789
                            </p>
                            <p className="text-[10px] text-slate-500 font-body">
                              +000-1234-56789
                            </p>
                          </div>
                        </div>

                        {/* Email Info */}
                        <div className="flex items-center gap-4">
                          <span className="p-3 rounded-2xl bg-[#10b981]/15 text-[#064e3b] shrink-0">
                            <Mail className="w-5 h-5" />
                          </span>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800 font-heading">
                              Email Us
                            </h4>
                            <p className="text-[10px] text-slate-500 font-body">
                              Info@Investra.Com
                            </p>
                            <p className="text-[10px] text-slate-500 font-body">
                              Support@Investra.Com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social links */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-heading font-black text-slate-800 uppercase tracking-widest">
                        Follow Us
                      </h3>
                      <div className="flex gap-3">
                        <a href="#" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors">
                          <FaTwitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors">
                          <FaYoutube className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors">
                          <FaInstagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-colors">
                          <FaGlobe className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>

          <Link href="/funds" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Investment Funds
          </Link>
          <Link href="/impact" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Impact
          </Link>
          <Link href="/subscription" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Subscription
          </Link>
          <Link href="/about" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
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
            href="/subscription"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Subscription
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-xs font-bold text-slate-600 hover:text-primary"
          >
            Contact
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
