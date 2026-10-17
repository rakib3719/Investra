"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/public-facing/shared/Navbar";
import Footer from "@/components/public-facing/shared/Footer";
import {
  GraduationCap,
  PlayCircle,
  Clock,
  BookOpen,
  Star,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Share2,
  AlertCircle,
  Video,
} from "lucide-react";
import { coursesApi } from "@/lib/courses/courses-api";
import type { CourseDetail, LessonOutline } from "@/lib/courses/types";
import { useCurrentUserQuery } from "@/lib/auth/auth-hooks";
import { toast } from "@/lib/toast";

export default function CourseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = useCurrentUserQuery();
  const slug = params?.slug as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState<LessonOutline | null>(null);

  const checkoutSuccess = searchParams.get("checkout_success");
  const checkoutCancelled = searchParams.get("checkout_cancelled");
  const sessionId = searchParams.get("session_id");

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getPublicCourseBySlug(slug);
      setCourse(data);

      // Default active preview to first previewable lesson if available
      const firstPreview = data.lessons.find((l) => l.isPreview && l.videoUrl);
      if (firstPreview) {
        setActivePreviewLesson(firstPreview);
      }
    } catch (err: any) {
      console.error(err);
      toast.apiError(err, "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  // Handle post-redirect Stripe verification fallback
  useEffect(() => {
    const handlePostCheckoutVerification = async () => {
      if (checkoutSuccess && sessionId && user) {
        try {
          await coursesApi.verifyCheckoutSession(sessionId);
          toast.success("Payment confirmed! Welcome to the course.");
          fetchCourse();
        } catch (err) {
          console.error("Session verification fallback error", err);
        }
      } else if (checkoutCancelled) {
        toast.info("Checkout was cancelled. You can enroll anytime.");
      }
    };

    handlePostCheckoutVerification();
  }, [checkoutSuccess, sessionId, user]);

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Please sign in or create an account to enroll.");
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      const res = await coursesApi.enrollInCourse(course.id);

      if (res.isFree || res.alreadyEnrolled) {
        toast.success(res.message || "Enrolled successfully!");
        router.push(`/courses/${course.slug}/learn`);
      } else if (res.url) {
        // Redirect to Stripe checkout
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.apiError(err, "Failed to initialize enrollment");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-4xl mx-auto py-24 text-center text-slate-500 font-semibold">
          Loading course syllabus &amp; outline...
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto py-24 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
          <p className="text-slate-500 text-sm mt-1">
            The course you are looking for does not exist or has been archived.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#078457] px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafcfb] flex flex-col justify-between selection:bg-[#10b981]/20">
      <Navbar />

      {/* Hero Header */}
      <section className="w-full bg-[#032d23] text-white py-12 md:py-16 border-b border-emerald-950">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-300">
              <span className="rounded-full bg-emerald-800/80 px-3 py-1 uppercase tracking-wider text-emerald-200">
                {course.category || "Masterclass"}
              </span>
              <span>•</span>
              <span>{course.level}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.totalDurationMinutes} mins total duration
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl md:text-4xl lg:text-5xl leading-tight">
              {course.title}
            </h1>

            {course.tagline && (
              <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
                {course.tagline}
              </p>
            )}

            {/* Instructor Quick Info */}
            <div className="pt-3 flex items-center gap-3">
              {course.consultant?.image ? (
                <img
                  src={course.consultant.image}
                  alt={course.consultant.name || "Advisor"}
                  className="h-11 w-11 rounded-full object-cover border-2 border-emerald-400"
                />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {(course.consultant?.name || "Advisor").slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                  <span>Taught by {course.consultant?.name || "Advisor"}</span>
                  {course.consultant?.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs text-emerald-200/80">
                  {course.consultant?.headline || "Verified Venture Advisor"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enrollment Card (Sticky desktop) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border-2 border-emerald-600/40 bg-white p-6 text-slate-900 shadow-2xl">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tuition &amp; Access
                </span>
                <span className="font-heading text-3xl font-black text-[#064e3b]">
                  {course.price === 0 ? "FREE" : `$${course.price}`}
                </span>
              </div>

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>You are enrolled in this course</span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#078457] py-3 text-sm font-bold text-white shadow-md hover:bg-[#06734d] transition"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Go to Classroom &amp; Video Player
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#078457] py-3.5 text-sm font-black text-white shadow-md hover:bg-[#06734d] transition shadow-emerald-700/25 disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    {enrolling
                      ? "Processing Enrollment..."
                      : course.price === 0
                      ? "Enroll for Free (1-Click)"
                      : `Enroll Now ($${course.price})`}
                  </button>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Instant, lifetime on-demand streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Full syllabus outline with {course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>90% goes directly to the verified instructor</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Free Preview Player & Syllabus Outline */}
      <main className="max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 xl:px-[100px] py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Syllabus Outline */}
          <div className="lg:col-span-8 space-y-8">
            {/* Interactive Free Preview Video Player (if activePreviewLesson) */}
            {activePreviewLesson && activePreviewLesson.videoUrl && (
              <div className="rounded-2xl border border-slate-200 bg-black overflow-hidden shadow-lg">
                <div className="p-3 bg-slate-900 text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-600/30 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                      FREE PREVIEW LESSON
                    </span>
                    <span className="text-white truncate max-w-md">{activePreviewLesson.title}</span>
                  </div>
                  <span className="text-slate-400">{activePreviewLesson.durationMinutes} mins</span>
                </div>

                <div className="aspect-video w-full bg-black">
                  {activePreviewLesson.videoProvider === "YOUTUBE" ? (
                    <iframe
                      src={
                        activePreviewLesson.videoUrl.includes("embed")
                          ? activePreviewLesson.videoUrl
                          : `https://www.youtube-nocookie.com/embed/${
                              activePreviewLesson.videoUrl.split("v=")[1]?.split("&")[0] || ""
                            }`
                      }
                      title={activePreviewLesson.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      playsInline
                      src={activePreviewLesson.videoUrl}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Curriculum Outline Header */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    Curriculum Syllabus &amp; Outline
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.lessons.length} lessons • {course.totalDurationMinutes} mins total length
                  </p>
                </div>
                <BookOpen className="h-5 w-5 text-emerald-700" />
              </div>

              {/* Notice for Outline */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3 mb-5 text-xs text-slate-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  The full outline with lesson topics and descriptions is open for review. Free preview lessons can be streamed immediately; remaining lessons unlock upon enrollment.
                </span>
              </div>

              {/* Lessons Outline List */}
              <div className="space-y-4">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className={`rounded-xl border p-4.5 transition ${
                      lesson.isPreview
                        ? "border-emerald-200 bg-emerald-50/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                            lesson.isPreview
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-heading text-sm font-bold text-slate-900">
                              {lesson.title}
                            </h4>

                            {lesson.isPreview ? (
                              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                                FREE PREVIEW
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                <Lock className="h-2.5 w-2.5" /> Enrolled Only
                              </span>
                            )}
                          </div>

                          {lesson.description && (
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                          {lesson.durationMinutes} mins
                        </span>

                        {lesson.isPreview && lesson.videoUrl && (
                          <button
                            onClick={() => {
                              setActivePreviewLesson(lesson);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                          >
                            <PlayCircle className="h-3.5 w-3.5" />
                            Watch Preview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Profile & Credentials */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Instructor Credentials
              </h3>

              <div className="flex items-center gap-3.5 mb-4">
                {course.consultant.image ? (
                  <img
                    src={course.consultant.image}
                    alt={course.consultant.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-emerald-300"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-base font-bold text-emerald-800">
                    {course.consultant.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                    <span>{course.consultant.name}</span>
                    {course.consultant.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {course.consultant.specialization || "Venture Specialist"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{course.consultant.rating || 5.0} Instructor Rating</span>
                  </div>
                </div>
              </div>

              {course.consultant.bio && (
                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {course.consultant.bio}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Experience: {course.consultant.yearsOfExperience || 5}+ Years</span>
                <Link
                  href="/consultants"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  View Profile &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
