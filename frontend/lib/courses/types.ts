export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PayoutStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

export interface CourseConsultant {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
  bio?: string | null;
  headline?: string;
  specialization?: string;
  yearsOfExperience?: number;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
}

export interface LessonOutline {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  durationMinutes: number;
  isPreview: boolean;
  isLocked: boolean;
  videoProvider?: string | null;
  videoUrl?: string | null;
  resources?: any[];
  isCompleted?: boolean;
}

export interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level: CourseLevel;
  price: number;
  currency: string;
  status: CourseStatus;
  isFeatured: boolean;
  totalDurationMinutes: number;
  createdAt: string;
  consultant: CourseConsultant;
  stats: {
    lessonsCount: number;
    enrollmentsCount: number;
  };
  isEnrolled: boolean;
  enrollment?: {
    id: string;
    progressPercent: number;
    completedLessonIds: string[];
    enrolledAt: string;
  } | null;
  lessons: LessonOutline[];
}

export interface PublicCourseListItem {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level: CourseLevel;
  price: number;
  currency: string;
  isFeatured: boolean;
  totalDurationMinutes: number;
  createdAt: string;
  consultant: CourseConsultant;
  lessonsCount: number;
  enrollmentsCount: number;
}

export interface EnrolledCourseItem {
  enrollmentId: string;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    tagline?: string | null;
    thumbnailUrl?: string | null;
    category?: string | null;
    level: CourseLevel;
    totalDurationMinutes: number;
    consultantName: string;
    consultantImage?: string | null;
    consultantHeadline?: string;
  };
}

export interface ConsultantCourseStudioItem {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level: CourseLevel;
  price: number;
  currency: string;
  status: CourseStatus;
  isFeatured: boolean;
  totalDurationMinutes: number;
  lessonsCount: number;
  enrollmentsCount: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantEarningsData {
  stats: {
    totalGrossSales: number;
    platformFees: number;
    netEarnings: number;
    totalPaidOut: number;
    pendingPayout: number;
    availableBalance: number;
    payoutRate: string;
    platformFeeRate: string;
  };
  recentSales: {
    id: string;
    courseTitle: string;
    courseSlug: string;
    buyerName: string;
    grossAmount: number;
    platformFee: number;
    consultantEarnings: number;
    currency: string;
    createdAt: string;
  }[];
  payoutRequests: {
    id: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    payoutMethod: string;
    accountDetails: Record<string, any>;
    adminNotes?: string | null;
    processedAt?: string | null;
    createdAt: string;
  }[];
}
