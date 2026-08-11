"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Mail,
  Scale,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  CircleUserRound,
  LogIn,
  LogOut,
} from "lucide-react";
import { FaTwitter, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLogoutMutation } from "@/lib/auth/auth-hooks";

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
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Business Comparison",
    href: "/compare",
    icon: Scale,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Consultants",
    href: "/consultants",
    icon: GraduationCap,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "FAQ",
    href: "/faq",
    icon: HelpCircle,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Service",
    href: "/platform",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Our Team",
    href: "/advisors",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pricing Plan",
    href: "/subscription",
    icon: DollarSign,
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Service Detail",
    href: "/services/detail",
    icon: FileText,
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Portfolio Detail",
    href: "/portfolio/detail",
    icon: TrendingUp,
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "404 Error Page",
    href: "/404",
    icon: AlertCircle,
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const logout = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string>(menuItems[0].image);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !accountMenuRef.current?.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsAccountMenuOpen(false);
    setIsOpen(false);
    try {
      await logout.mutateAsync();
    } finally {
      router.replace("/");
    }
  };

  return (
    <nav
      className="w-full bg-white border-b border-slate-100 relative z-50"
      ref={dropdownRef}
    >
      {/* Component Styles for horizontal partners scroll */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg
            className="w-7 h-7 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="rgba(6, 78, 59, 0.08)"
              stroke="#064e3b"
            />
            <path
              d="M12 6a6 6 0 0 0-6 6c0 2.2.9 4.2 2.4 5.2"
              stroke="#10b981"
            />
            <path d="M12 6v12" stroke="#064e3b" />
            <path d="M12 9c1.5-.8 3-.8 4.5 0" stroke="#10b981" />
            <path d="M12 13c2-.8 3.5-.8 5.5 0" stroke="#10b981" />
          </svg>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#064e3b]">
            Investra
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 h-full">
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
              className={`text-xs font-bold flex items-center gap-1 transition-colors h-full cursor-pointer ${
                activeDropdown === "platform"
                  ? "text-[#064e3b]"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              <span>Platform</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  activeDropdown === "platform"
                    ? "rotate-180 text-[#064e3b]"
                    : "text-slate-400"
                }`}
              />
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
                              onClick={() => setActiveDropdown(null)}
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
                  </div>

                  {/* Right Section (1/3 width) */}
                  <div className="lg:col-span-4 bg-white p-8 flex flex-col justify-between gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xs font-heading font-black text-slate-800 uppercase tracking-widest">
                        Locate Us
                      </h3>

                      <div className="space-y-4">
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
                          </div>
                        </div>

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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FULL-WIDTH HORIZONTAL PARTNERS TICKER (Spans across all 12 columns at bottom) */}
                  <div className="lg:col-span-12 border-t border-slate-200/60 bg-[#064e3b]/5 px-8 py-4 flex items-center gap-6 overflow-hidden select-none">
                    <span className="text-[10px] font-heading font-black tracking-wider uppercase text-slate-400 shrink-0">
                      Our Partners:
                    </span>

                    <div className="relative w-full overflow-hidden">
                      <div className="animate-scroll-x gap-12 items-center whitespace-nowrap">
                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z"
                              fill="#064e3b"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              ACME
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M4 2v20h4V13h8v9h4V2h-4v7H8V2H4z"
                              fill="#10b981"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              HERTZ
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <circle
                              cx="10"
                              cy="12"
                              r="8"
                              fill="none"
                              stroke="#064e3b"
                              strokeWidth="2.5"
                            />
                            <circle cx="10" cy="12" r="4" fill="#10b981" />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              TERRA
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M10 2a8 8 0 00-8 8c0 4.4 8 12 8 12s8-7.6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
                              fill="#10b981"
                            />
                            <text
                              x="26"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="11"
                            >
                              BIOVEST
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M17 12a5 5 0 10-5 5h5v-2h-5a3 3 0 113-3v3h2v-3z"
                              fill="#064e3b"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              CARBON
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <circle cx="10" cy="12" r="5" fill="#10b981" />
                            <path
                              d="M10 2v3M10 19v3M2 12h3M19 12h3"
                              stroke="#064e3b"
                              strokeWidth="2"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              SOLAR
                            </text>
                          </svg>
                        </div>

                        {/* Duplicate set for seamless infinite scroll */}
                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z"
                              fill="#064e3b"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              ACME
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M4 2v20h4V13h8v9h4V2h-4v7H8V2H4z"
                              fill="#10b981"
                            />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              HERTZ
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <circle
                              cx="10"
                              cy="12"
                              r="8"
                              fill="none"
                              stroke="#064e3b"
                              strokeWidth="2.5"
                            />
                            <circle cx="10" cy="12" r="4" fill="#10b981" />
                            <text
                              x="28"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="12"
                            >
                              TERRA
                            </text>
                          </svg>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <svg
                            className="h-4.5 text-slate-400 hover:text-slate-800 transition-colors"
                            viewBox="0 0 100 24"
                            fill="currentColor"
                          >
                            <path
                              d="M10 2a8 8 0 00-8 8c0 4.4 8 12 8 12s8-7.6 8-12a8 8 0 00-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"
                              fill="#10b981"
                            />
                            <text
                              x="26"
                              y="17"
                              fontFamily="sans-serif"
                              fontWeight="900"
                              fontSize="11"
                            >
                              BIOVEST
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/funds"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Investment Funds
          </Link>
          <Link
            href="/compare"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/consultants"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Consultants
          </Link>
          <Link
            href="/impact"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Impact
          </Link>
          <Link
            href="/subscription"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Subscription
          </Link>
          <Link
            href="/about"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div
              className="h-10 w-28 animate-pulse rounded-xl bg-slate-100"
              aria-label="Loading account"
            />
          ) : user ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 hover:border-[#064e3b]/40 transition-colors"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <span className="w-8 h-8 rounded-lg bg-[#064e3b] text-emerald-300 grid place-items-center text-xs font-black">
                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-xs font-black text-slate-800">{user.firstName || "My account"}</span>
                  <span className="block text-[10px] text-slate-500">{user.role.toLowerCase()}</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {isAccountMenuOpen && (
                <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link href="/profile" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50" role="menuitem"><CircleUserRound className="w-4 h-4 text-[#064e3b]" />My profile</Link>
                  <button type="button" onClick={handleLogout} disabled={logout.isPending} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60" role="menuitem"><LogOut className="w-4 h-4" />{logout.isPending ? "Signing out…" : "Sign out"}</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#064e3b] transition-colors px-3.5 py-2.5 rounded-lg hover:bg-slate-50"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Create account <ArrowRight className="w-3.5 h-3.5 text-[#10b981]" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-[#064e3b] focus:outline-none rounded-xl bg-slate-100 border border-slate-200 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#064e3b]" />
          ) : (
            <Menu className="w-6 h-6 text-[#064e3b]" />
          )}
        </button>
      </div>

      {/* MOBILE DRAWER WITH CLEAN 'PLATFORM' ACCORDION */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Collapsible Mobile Platform Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <button
              onClick={() => setMobileMegaOpen(!mobileMegaOpen)}
              className="w-full flex items-center justify-between font-heading font-black text-xs uppercase tracking-wider text-[#064e3b] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10b981]" />
                <span>Platform</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#064e3b] transition-transform duration-300 ${
                  mobileMegaOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileMegaOpen && (
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60 animate-in fade-in duration-200">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100 hover:border-[#10b981] text-slate-700 hover:text-[#064e3b] transition-all shadow-2xs"
                    >
                      <span className="p-1.5 rounded-lg bg-[#10b981]/15 text-[#064e3b] shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] font-bold font-heading truncate">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* General Links Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs font-bold font-heading text-slate-700">
            <Link
              href="/funds"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              Investment Funds
            </Link>
            <Link
              href="/compare"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              Compare Deals
            </Link>
            <Link
              href="/consultants"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              Consultants
            </Link>
            <Link
              href="/subscription"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              Subscription
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              About Investra
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300"
            >
              FAQ Hub
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-2">
            {isLoading ? null : user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#064e3b] text-white text-xs font-extrabold font-heading py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <CircleUserRound className="w-4 h-4 text-[#10b981]" />
                  <span>My Profile</span>
                </Link>
                <button type="button" onClick={handleLogout} disabled={logout.isPending} className="w-full border border-red-100 text-red-600 text-xs font-extrabold font-heading py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"><LogOut className="w-4 h-4" />{logout.isPending ? "Signing out…" : "Sign out"}</button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs font-extrabold font-heading text-slate-800 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="inline-flex items-center gap-2"><LogIn className="w-4 h-4" />Sign in</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-[#064e3b] hover:bg-[#043c2e] text-white text-xs font-extrabold font-heading py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Create verified account</span>
                  <ArrowRight className="w-4 h-4 text-[#10b981]" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
