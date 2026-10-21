"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  PlayCircle,
  Video,
  Eye,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layers,
  Lock,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { coursesApi } from "@/lib/courses/courses-api";
import type { ConsultantCourseStudioItem, CourseLevel, CourseStatus } from "@/lib/courses/types";
import { useMyKycQuery } from "@/lib/kyc/kyc-hooks";
import { toast } from "@/lib/toast";
import { FileUploadDropzone } from "@/components/ui/FileUploadDropzone";

interface LessonFormState {
  id?: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoProvider: string;
  videoUrl: string;
  isPreview: boolean;
  isPublished: boolean;
}

export function ConsultantCoursesPage({ user }: { user: AuthUser }) {
  const { data: kycData } = useMyKycQuery();
  const isKycVerified = kycData?.status === "VERIFIED";

  const [courses, setCourses] = useState<ConsultantCourseStudioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Course create / edit modal state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ConsultantCourseStudioItem | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    tagline: "",
    description: "",
    thumbnailUrl: "",
    category: "Startup Funding",
    level: "ALL_LEVELS" as CourseLevel,
    price: 0,
    status: "DRAFT" as CourseStatus,
  });
  const [savingCourse, setSavingCourse] = useState(false);

  // Lesson Manager Drawer / Modal state
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<any | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonFormState | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonFormState>({
    title: "",
    description: "",
    durationMinutes: 10,
    videoProvider: "HTML5",
    videoUrl: "",
    isPreview: false,
    isPublished: true,
  });
  const [savingLesson, setSavingLesson] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getMyCreatedCourses();
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.data)
        ? (data as any).data
        : [];
      setCourses(list);
    } catch (err: any) {
      console.error(err);
      setCourses([]);
      toast.apiError(err, "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "",
      tagline: "",
      description: "",
      thumbnailUrl: "",
      category: "Venture Capital",
      level: "ALL_LEVELS",
      price: 0,
      status: "DRAFT",
    });
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (c: ConsultantCourseStudioItem) => {
    setEditingCourse(c);
    setCourseForm({
      title: c.title,
      tagline: c.tagline || "",
      description: "",
      thumbnailUrl: c.thumbnailUrl || "",
      category: c.category || "General",
      level: c.level,
      price: c.price,
      status: c.status,
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    try {
      setSavingCourse(true);
      if (editingCourse) {
        await coursesApi.updateCourse(editingCourse.id, {
          title: courseForm.title,
          tagline: courseForm.tagline,
          description: courseForm.description,
          thumbnailUrl: courseForm.thumbnailUrl,
          category: courseForm.category,
          level: courseForm.level,
          price: Number(courseForm.price),
          status: courseForm.status,
        });
        toast.success("Course updated successfully!");
      } else {
        await coursesApi.createCourse({
          title: courseForm.title,
          tagline: courseForm.tagline,
          description: courseForm.description,
          thumbnailUrl: courseForm.thumbnailUrl,
          category: courseForm.category,
          level: courseForm.level,
          price: Number(courseForm.price),
          status: courseForm.status,
        });
        toast.success("Course created successfully!");
      }
      setIsCourseModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.apiError(err, "Failed to save course");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete or archive this course?")) return;
    try {
      await coursesApi.deleteCourse(courseId);
      toast.success("Course removed successfully.");
      fetchCourses();
    } catch (err: any) {
      toast.apiError(err, "Failed to delete course");
    }
  };

  // Open Lesson Manager
  const openLessonsManager = async (course: ConsultantCourseStudioItem) => {
    try {
      const detailed = await coursesApi.getCourseForEditing(course.id);
      setSelectedCourseForLessons(detailed);
    } catch (err: any) {
      toast.apiError(err, "Failed to load course lessons");
    }
  };

  const openAddLessonModal = () => {
    setEditingLesson(null);
    setLessonForm({
      title: "",
      description: "",
      durationMinutes: 15,
      videoProvider: "HTML5",
      videoUrl: "",
      isPreview: false,
      isPublished: true,
    });
    setIsLessonModalOpen(true);
  };

  const openEditLessonModal = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonForm({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || "",
      durationMinutes: lesson.durationMinutes || 0,
      videoProvider: lesson.videoProvider || "HTML5",
      videoUrl: lesson.videoUrl || "",
      isPreview: lesson.isPreview || false,
      isPublished: lesson.isPublished !== undefined ? lesson.isPublished : true,
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      toast.error("Please enter a lesson title.");
      return;
    }

    try {
      setSavingLesson(true);
      if (editingLesson?.id) {
        await coursesApi.updateLesson(selectedCourseForLessons.id, editingLesson.id, {
          title: lessonForm.title,
          description: lessonForm.description,
          durationMinutes: Number(lessonForm.durationMinutes),
          videoProvider: lessonForm.videoProvider,
          videoUrl: lessonForm.videoUrl,
          isPreview: lessonForm.isPreview,
          isPublished: lessonForm.isPublished,
        });
        toast.success("Lesson updated!");
      } else {
        await coursesApi.addLesson(selectedCourseForLessons.id, {
          title: lessonForm.title,
          description: lessonForm.description,
          durationMinutes: Number(lessonForm.durationMinutes),
          videoProvider: lessonForm.videoProvider,
          videoUrl: lessonForm.videoUrl,
          isPreview: lessonForm.isPreview,
          isPublished: lessonForm.isPublished,
        });
        toast.success("Lesson added!");
      }
      setIsLessonModalOpen(false);
      // Refresh current detailed course lessons
      const updated = await coursesApi.getCourseForEditing(selectedCourseForLessons.id);
      setSelectedCourseForLessons(updated);
      fetchCourses();
    } catch (err: any) {
      toast.apiError(err, "Failed to save lesson");
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await coursesApi.deleteLesson(selectedCourseForLessons.id, lessonId);
      toast.success("Lesson deleted.");
      const updated = await coursesApi.getCourseForEditing(selectedCourseForLessons.id);
      setSelectedCourseForLessons(updated);
      fetchCourses();
    } catch (err: any) {
      toast.apiError(err, "Failed to delete lesson");
    }
  };

  return (
    <div className="space-y-8">
      {/* KYC Warning Banner if not verified */}
      {!isKycVerified && (
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-700">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-amber-900">
                  KYC Verification Required
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  You need an approved Consultant KYC verification before you can publish courses,
                  upload tutorial lessons, and receive course revenue payouts.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/consultant/kyc"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-700 transition"
            >
              <ShieldCheck className="h-4 w-4" />
              Complete KYC Verification
            </Link>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Creator Studio</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Tutorials & Course Management
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Build video masterclasses and tutorials. Keep 90% of every enrollment sale (10% platform fee).
          </p>
        </div>

        <button
          onClick={openCreateCourseModal}
          disabled={!isKycVerified}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition ${
            isKycVerified
              ? "bg-[#078457] text-white hover:bg-[#06734d] shadow-emerald-700/20"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          title={!isKycVerified ? "Complete KYC verification first" : "Create new course"}
        >
          <Plus className="h-4 w-4" />
          Create New Course
        </button>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading your courses studio...
        </div>
      ) : !Array.isArray(courses) || courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            No courses created yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Share your venture expertise, legal structuring frameworks, or valuation masterclasses with thousands of verified founders and investors.
          </p>
          {isKycVerified ? (
            <button
              onClick={openCreateCourseModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#078457] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#06734d] transition"
            >
              <Plus className="h-4 w-4" />
              Create Your First Course
            </button>
          ) : (
            <Link
              href="/dashboard/consultant/kyc"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition"
            >
              <ShieldCheck className="h-4 w-4" />
              Complete KYC To Unlock Course Creation
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div>
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-4">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900 text-white font-bold">
                      <Video className="h-10 w-10 text-emerald-400 opacity-60" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                        course.status === "PUBLISHED"
                          ? "bg-emerald-600/90 text-white"
                          : course.status === "DRAFT"
                          ? "bg-amber-500/90 text-white"
                          : "bg-slate-700/90 text-white"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm flex items-center gap-1.5">
                    {course.price === 0 ? (
                      <span className="text-emerald-400 font-extrabold">FREE</span>
                    ) : (
                      <span>${course.price}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                  <span>{course.category || "General"}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-slate-900 line-clamp-2">
                  {course.title}
                </h3>

                {course.tagline && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {course.tagline}
                  </p>
                )}

                {/* Stats Bar */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center text-xs">
                  <div>
                    <span className="block font-bold text-slate-800">{course.lessonsCount}</span>
                    <span className="text-[11px] text-slate-400">Lessons</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">{course.enrollmentsCount}</span>
                    <span className="text-[11px] text-slate-400">Students</span>
                  </div>
                  <div>
                    <span className="block font-bold text-emerald-700">
                      ${course.totalEarnings.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400">Net Earned</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => openLessonsManager(course)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Manage Lessons ({course.lessonsCount})
                </button>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="View public outline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => openEditCourseModal(course)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="Edit course settings"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="rounded-lg p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              {editingCourse ? "Edit Course" : "Create New Masterclass Course"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure course metadata, category, pricing, and visibility.
            </p>

            <form onSubmit={handleSaveCourse} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Masterclass in Seed & Series A Cap Table Structuring"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Brief Summary
                </label>
                <input
                  type="text"
                  value={courseForm.tagline}
                  onChange={(e) => setCourseForm({ ...courseForm, tagline: e.target.value })}
                  placeholder="e.g. Step-by-step guidance on term sheets, cap table modeling, and investor diligence"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Startup Funding">Startup Funding</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Financial Modeling">Financial Modeling</option>
                    <option value="Legal & Governance">Legal & Governance</option>
                    <option value="Pitch Deck Mastery">Pitch Deck Mastery</option>
                    <option value="AgriTech & ESG">AgriTech & ESG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Audience Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as CourseLevel })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="ALL_LEVELS">All Levels</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (USD) - $0 for Free
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {courseForm.price === 0 ? "Anyone can enroll with 1 click." : "90% goes to your wallet; 10% platform fee."}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as CourseStatus })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="PUBLISHED">PUBLISHED (Live in Catalog)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Course Thumbnail Image
                </label>
                <FileUploadDropzone
                  category="CAMPAIGN_COVER"
                  label="Upload Course Thumbnail (JPEG, PNG, WebP up to 10MB)"
                  description="Uploads directly to secure media vault with live progress."
                  currentMedia={
                    courseForm.thumbnailUrl
                      ? {
                          url: courseForm.thumbnailUrl,
                          status: "ACTIVE",
                        }
                      : undefined
                  }
                  onUploadSuccess={(media) => {
                    if (media.url) {
                      setCourseForm((prev) => ({ ...prev, thumbnailUrl: media.url as string }));
                      toast.success("Thumbnail uploaded successfully!");
                    }
                  }}
                  onRemove={() => {
                    setCourseForm((prev) => ({ ...prev, thumbnailUrl: "" }));
                  }}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="rounded-xl bg-[#078457] px-5 py-2 text-sm font-bold text-white hover:bg-[#06734d] disabled:opacity-50"
                >
                  {savingCourse ? "Saving..." : editingCourse ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LESSONS MANAGER MODAL / DRAWER */}
      {selectedCourseForLessons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                    Syllabus Outline
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedCourseForLessons.lessons?.length || 0} Lessons
                  </span>
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  {selectedCourseForLessons.title}
                </h2>
              </div>

              <button
                onClick={openAddLessonModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#078457] px-4 py-2 text-xs font-bold text-white hover:bg-[#06734d]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Lesson
              </button>
            </div>

            {/* Lesson List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {(!selectedCourseForLessons.lessons || selectedCourseForLessons.lessons.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No lessons added yet. Click &quot;Add Lesson&quot; to build the curriculum.
                </div>
              ) : (
                selectedCourseForLessons.lessons.map((lesson: any, idx: number) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-xs">
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">{lesson.title}</h4>
                          {lesson.isPreview && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                              FREE PREVIEW
                            </span>
                          )}
                          {!lesson.isPublished && (
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                              DRAFT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.durationMinutes} mins</span>
                          <span>•</span>
                          <span className="truncate max-w-[240px] text-slate-500">
                            {lesson.videoUrl || "No video URL"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditLessonModal(lesson)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
                        title="Edit lesson"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="rounded-lg p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete lesson"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCourseForLessons(null)}
                className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT LESSON MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              {editingLesson?.id ? "Edit Lesson" : "Add Lesson to Course"}
            </h3>

            <form onSubmit={handleSaveLesson} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Lesson 1: Understanding Safe Notes vs Priced Equity"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Outline Description
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Describe what students will learn in this session (visible in the public outline to everyone)"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Video Provider
                  </label>
                  <select
                    value={lessonForm.videoProvider}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoProvider: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="HTML5">Direct Video Upload (MP4)</option>
                    <option value="YOUTUBE">YouTube Video</option>
                    <option value="VIMEO">Vimeo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lessonForm.durationMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {lessonForm.videoProvider === "HTML5" ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Lesson Video File
                  </label>
                  <FileUploadDropzone
                    category="VIDEO"
                    accept="video/mp4,video/webm"
                    label="Upload Lesson Video (MP4 or WebM up to 100MB)"
                    description="Uploads directly to secure media vault with live progress."
                    currentMedia={
                      lessonForm.videoUrl
                        ? {
                            url: lessonForm.videoUrl,
                            status: "ACTIVE",
                          }
                        : undefined
                    }
                    onUploadSuccess={(media) => {
                      if (media.url) {
                        setLessonForm((prev) => ({ ...prev, videoUrl: media.url as string }));
                        toast.success("Lesson video uploaded successfully!");
                      }
                    }}
                    onRemove={() => {
                      setLessonForm((prev) => ({ ...prev, videoUrl: "" }));
                    }}
                  />
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Or paste an existing stream / video URL:
                    </span>
                    <input
                      type="text"
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      placeholder="https://...mp4 or direct video URL"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lessonForm.videoProvider} Video URL or ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.isPreview}
                    onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Free Preview (Anyone can play)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.isPublished}
                    onChange={(e) => setLessonForm({ ...lessonForm, isPublished: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Published
                  </span>
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="rounded-xl bg-[#078457] px-5 py-2 text-xs font-bold text-white hover:bg-[#06734d] disabled:opacity-50"
                >
                  {savingLesson ? "Saving..." : "Save Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
