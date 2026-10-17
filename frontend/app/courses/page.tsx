"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import ShinyText from "@/components/ui/ShinyText";
import {
  GraduationCap,
  PlayCircle,
  Search,
  Clock,
  BookOpen,
  Star,
  ShieldCheck,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  Users,
} from "lucide-react";
import { coursesApi } from "@/lib/courses/courses-api";
import type { PublicCourseListItem, CourseLevel } from "@/lib/courses/types";

const CATEGORIES = [
  "ALL",
  "Startup Funding",
  "Venture Capital",
  "Financial Modeling",
  "Legal & Governance",
  "Pitch Deck Mastery",
  "AgriTech & ESG",
];

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getPublicCourses({
          category: activeCategory !== "ALL" ? activeCategory : undefined,
          level: selectedLevel !== "ALL" ? (selectedLevel as CourseLevel) : undefined,
          search: searchQuery.trim() || undefined,
        });
        setCourses(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error("Failed to load course catalog", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCatalog();
    }, 250);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, selectedLevel]);

  return (
    <div className="min-h-screen bg-[#fafcfb] flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-white py-14 md:py-20 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider font-heading mb-4 border border-emerald-100">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Investra Academy &amp; Masterclasses</span>
          </div>

          <h1 className="font-heading font-black text-3xl md:text-5xl lg:text-[54px] text-slate-900 leading-[1.1] tracking-tight">
            Learn From Vetted Advisors.<br />
            <ShinyText text="Master Deal Structuring &amp; VC." speed={4.5} />
          </h1>

          <p className="font-body text-slate-600 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            Video courses, legal frameworks, and fundraising outlines authored by verified venture partners and financial analysts. Free and paid masterclasses with 1-click enrollment.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center gap-2 rounded-2xl border-2 border-emerald-600/30 bg-white p-2 shadow-lg shadow-emerald-950/5">
            <Search className="h-5 w-5 text-slate-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials, cap tables, ESG audits, valuation..."
              className="flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Main Catalog Body */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-12 flex-1">
        {/* Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-[#078457] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Showing {courses.length} courses</span>
          <Link
            href="/consultants"
            className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
          >
            Meet Verified Advisors &rarr;
          </Link>
        </div>

        {/* Grid of Courses */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="font-heading text-lg font-bold text-slate-800">
              No courses matching your criteria
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition duration-300"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-4">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#064e3b] to-slate-950 text-white font-bold">
                        <PlayCircle className="h-12 w-12 text-emerald-400 opacity-60 group-hover:scale-110 transition duration-300" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-emerald-700/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
                        {course.category || "Masterclass"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1 text-xs font-black text-white backdrop-blur-sm">
                      {course.price === 0 ? (
                        <span className="text-emerald-400">FREE</span>
                      ) : (
                        <span>${course.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Level & Duration */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                    <span className="text-emerald-700 font-bold">{course.level}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.totalDurationMinutes} mins
                    </span>
                    <span>•</span>
                    <span>{course.lessonsCount} lessons</span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#078457] transition line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  {course.tagline && (
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>
                  )}
                </div>

                {/* Footer: Instructor Info & Enroll CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {course.consultant.image ? (
                      <img
                        src={course.consultant.image}
                        alt={course.consultant.name}
                        className="h-8 w-8 rounded-full object-cover border border-emerald-200"
                      />
                    ) : (
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                        {course.consultant.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {course.consultant.name}
                        </span>
                        {course.consultant.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{course.consultant.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#078457] group-hover:translate-x-1 transition">
                    View Outline
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
