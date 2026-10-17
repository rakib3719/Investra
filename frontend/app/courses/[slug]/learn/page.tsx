"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  ShieldCheck,
  Video,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { coursesApi } from "@/lib/courses/courses-api";
import { useCurrentUserQuery } from "@/lib/auth/auth-hooks";
import { toast } from "@/lib/toast";

export default function CourseClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: user, isLoading: authLoading } = useCurrentUserQuery();
  const isAuthenticated = Boolean(user);
  const slug = params?.slug as string;

  const [courseData, setCourseData] = useState<any | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingComplete, setTogglingComplete] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}/learn`);
      return;
    }

    const fetchClassroom = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getCourseClassroom(slug);
        setCourseData(data);

        // Pick first uncompleted lesson, or first lesson
        if (data.lessons && data.lessons.length > 0) {
          const firstUncompleted = data.lessons.find((l: any) => !l.isCompleted);
          setCurrentLesson(firstUncompleted || data.lessons[0]);
        }
      } catch (err: any) {
        console.error(err);
        toast.apiError(err, "Access denied: Please enroll in this course first.");
        router.push(`/courses/${slug}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug && isAuthenticated) {
      fetchClassroom();
    }
  }, [slug, isAuthenticated, authLoading]);

  const handleToggleComplete = async () => {
    if (!courseData || !currentLesson) return;
    try {
      setTogglingComplete(true);
      const res = await coursesApi.toggleLessonComplete(
        courseData.course.id,
        currentLesson.id,
      );

      // Update local state
      setCourseData((prev: any) => {
        if (!prev) return prev;
        const updatedLessons = prev.lessons.map((l: any) =>
          l.id === currentLesson.id ? { ...l, isCompleted: res.isCompleted } : l,
        );
        return {
          ...prev,
          enrollment: {
            ...prev.enrollment,
            progressPercent: res.progressPercent,
            completedLessonIds: res.completedLessonIds,
          },
          lessons: updatedLessons,
        };
      });

      setCurrentLesson((prev: any) => ({
        ...prev,
        isCompleted: res.isCompleted,
      }));

      if (res.isCompleted) {
        toast.success("Lesson marked as complete!");
      }
    } catch (err: any) {
      toast.apiError(err, "Failed to update completion status");
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleNextLesson = () => {
    if (!courseData || !currentLesson) return;
    const currentIndex = courseData.lessons.findIndex(
      (l: any) => l.id === currentLesson.id,
    );
    if (currentIndex > -1 && currentIndex < courseData.lessons.length - 1) {
      setCurrentLesson(courseData.lessons[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevLesson = () => {
    if (!courseData || !currentLesson) return;
    const currentIndex = courseData.lessons.findIndex(
      (l: any) => l.id === currentLesson.id,
    );
    if (currentIndex > 0) {
      setCurrentLesson(courseData.lessons[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold">
        Entering Classroom Player...
      </div>
    );
  }

  if (!courseData) return null;

  const { course, enrollment, lessons } = courseData;
  const currentIndex = lessons.findIndex((l: any) => l.id === currentLesson?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Course Syllabus</span>
          </Link>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <h1 className="font-heading text-sm md:text-base font-bold text-white truncate max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Progress:</span>
            <span className="font-bold text-emerald-400">{enrollment.progressPercent}%</span>
            <div className="h-2 w-20 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${enrollment.progressPercent}%` }}
              />
            </div>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left / Center Video Player & Lesson Details */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-slate-950 p-4 md:p-8">
          {/* Video Player Box */}
          <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
            {currentLesson?.videoUrl ? (
              currentLesson.videoProvider === "YOUTUBE" ? (
                <iframe
                  src={
                    currentLesson.videoUrl.includes("embed")
                      ? currentLesson.videoUrl
                      : `https://www.youtube-nocookie.com/embed/${
                          currentLesson.videoUrl.split("v=")[1]?.split("&")[0] || ""
                        }`
                  }
                  title={currentLesson.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={currentLesson.videoUrl}
                  controls
                  playsInline
                  src={currentLesson.videoUrl}
                  className="h-full w-full object-contain"
                />
              )
            ) : (
              <div className="text-center p-8 text-slate-500">
                <Video className="mx-auto h-12 w-12 text-slate-700 mb-2" />
                <p className="font-bold">No video stream uploaded for this lesson yet.</p>
                <p className="text-xs text-slate-600 mt-1">
                  Read the outline notes below or advance to the next lesson.
                </p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                <span>•</span>
                <span>{currentLesson?.durationMinutes} mins</span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                {currentLesson?.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleComplete}
                disabled={togglingComplete}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
                  currentLesson?.isCompleted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                {currentLesson?.isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Completed
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" /> Mark as Complete
                  </>
                )}
              </button>

              <button
                onClick={handlePrevLesson}
                disabled={currentIndex === 0}
                className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous Lesson"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === lessons.length - 1}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next Lesson</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lesson Description & Notes */}
          <div className="mt-6 space-y-4 max-w-4xl">
            <h3 className="font-heading text-base font-bold text-slate-300">
              Lesson Overview &amp; Learning Objectives
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {currentLesson?.description ||
                "No additional notes provided for this lesson. Watch the video above to master this section."}
            </p>
          </div>
        </div>

        {/* Right Sidebar: Syllabus Playlist */}
        <div className="lg:col-span-4 xl:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-900/60 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="font-heading text-base font-bold text-white">
              Course Outline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lessons.length} lessons • {enrollment.progressPercent}% finished
            </p>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {lessons.map((lesson: any, idx: number) => {
              const isCurrent = lesson.id === currentLesson?.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLesson(lesson);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full text-left rounded-xl p-3.5 transition flex items-start gap-3 border ${
                    isCurrent
                      ? "bg-emerald-950/40 border-emerald-500/50 text-white"
                      : "bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="pt-0.5">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <PlayCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="grid h-4 w-4 place-items-center rounded-full border border-slate-600 text-[9px] text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold truncate leading-snug">
                      {lesson.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {lesson.durationMinutes} mins
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
