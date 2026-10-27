"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  PlayCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { coursesApi } from "@/lib/courses/courses-api";
import type { EnrolledCourseItem } from "@/lib/courses/types";
import { toast } from "@/lib/toast";

export function MyCoursesPage({ user }: { user: AuthUser }) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getMyEnrolledCourses();
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];
        setEnrolledCourses(list);
      } catch (err: any) {
        console.error(err);
        setEnrolledCourses([]);
        toast.apiError(err, "Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolled();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Learning Hub</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            My Enrolled Courses &amp; Masterclasses
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Access your active courses, follow lesson progress, and continue video streaming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/${user.role.toLowerCase()}/consultations`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition"
          >
            <span>My Consultations &rarr;</span>
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-[#078457] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#06734d] shadow-emerald-700/20 transition"
          >
            <BookOpen className="h-4 w-4" />
            Browse Course Catalog
          </Link>
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading your classroom enrollments...
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            You have not enrolled in any courses yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Discover free and paid masterclasses taught by vetted venture consultants, legal experts, and financial modelers.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#078457] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#06734d] transition"
          >
            <Sparkles className="h-4 w-4" />
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrolledCourses.map((item) => {
            const { course, progressPercent, completedLessonsCount, totalLessonsCount } = item;
            return (
              <div
                key={item.enrollmentId}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-4">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-900 text-white font-bold">
                        <PlayCircle className="h-10 w-10 text-emerald-400 opacity-60" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-emerald-700/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                        {course.category || "Masterclass"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      <span>{course.totalDurationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Instructor & Title */}
                  <div className="text-xs text-slate-500 font-medium mb-1">
                    Instructor: <span className="font-bold text-slate-700">{course.consultantName}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-slate-900 line-clamp-2">
                    {course.title}
                  </h3>

                  {course.tagline && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {course.tagline}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-emerald-700">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-[#078457] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {completedLessonsCount} of {totalLessonsCount} lessons completed
                    </div>
                  </div>
                </div>

                {/* Continue CTA */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/courses/${course.slug}/learn`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#078457] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#06734d] transition shadow-sm"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>{progressPercent > 0 ? "Continue Lesson" : "Start Course"}</span>
                  </Link>

                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="ml-2 rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
                    title="View Syllabus Outline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
