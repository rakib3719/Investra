import { apiClient } from '../api/client';
import type {
  CourseDetail,
  PublicCourseListItem,
  EnrolledCourseItem,
  ConsultantCourseStudioItem,
  ConsultantEarningsData,
  CourseLevel,
  CourseStatus,
  PayoutStatus,
} from './types';

// Helper to safely unwrap NestJS ResponseInterceptor payload { success, statusCode, message, data }
function unwrap<T>(resData: any): T {
  if (resData && typeof resData === 'object' && 'data' in resData && 'success' in resData) {
    return resData.data as T;
  }
  return resData as T;
}

export const coursesApi = {
  // 1. Public catalog
  getPublicCourses: async (params?: {
    category?: string;
    level?: CourseLevel;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.level) searchParams.set('level', params.level);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.minPrice !== undefined) searchParams.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) searchParams.set('maxPrice', String(params.maxPrice));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const res = await apiClient.get<any>(`/courses/public?${searchParams.toString()}`);
    const unwrapped: any = unwrap(res.data);

    const courseList: PublicCourseListItem[] = Array.isArray(unwrapped)
      ? unwrapped
      : Array.isArray(unwrapped?.courses)
      ? unwrapped.courses
      : Array.isArray(unwrapped?.data)
      ? unwrapped.data
      : Array.isArray(unwrapped?.items)
      ? unwrapped.items
      : [];

    const totalCount: number =
      unwrapped?.total ??
      unwrapped?.meta?.total ??
      courseList.length;

    return {
      total: totalCount,
      page: unwrapped?.page || unwrapped?.meta?.page || 1,
      limit: unwrapped?.limit || unwrapped?.meta?.limit || 12,
      totalPages: unwrapped?.totalPages || unwrapped?.meta?.totalPages || Math.ceil(totalCount / 12) || 1,
      data: courseList,
    };
  },

  // 2. Public course detail with outline
  getPublicCourseBySlug: async (slug: string) => {
    const res = await apiClient.get<any>(`/courses/public/${slug}`);
    return unwrap<CourseDetail>(res.data);
  },

  // 3. Public verified consultants
  getVerifiedConsultants: async () => {
    const res = await apiClient.get<any>('/courses/public/consultants');
    const unwrapped: any = unwrap(res.data);
    if (Array.isArray(unwrapped)) return unwrapped;
    if (Array.isArray(unwrapped?.data)) return unwrapped.data;
    if (Array.isArray(unwrapped?.items)) return unwrapped.items;
    return [];
  },

  // 4. Enroll in course (Free or Paid Checkout)
  enrollInCourse: async (courseId: string) => {
    const res = await apiClient.post<any>(`/courses/${courseId}/enroll`);
    return unwrap<{
      isFree?: boolean;
      enrolled?: boolean;
      alreadyEnrolled?: boolean;
      url?: string;
      sessionId?: string;
      message?: string;
    }>(res.data);
  },

  // 5. Synchronous verify session
  verifyCheckoutSession: async (sessionId: string) => {
    const res = await apiClient.post<any>('/courses/verify-session', { sessionId });
    return unwrap<any>(res.data);
  },

  // 6. Student enrolled courses
  getMyEnrolledCourses: async () => {
    const res = await apiClient.get<any>('/courses/my-enrolled');
    return unwrap<EnrolledCourseItem[]>(res.data);
  },

  // 7. Student classroom player data
  getCourseClassroom: async (slug: string) => {
    const res = await apiClient.get<any>(`/courses/my-enrolled/${slug}`);
    return unwrap<any>(res.data);
  },

  // 8. Toggle lesson complete
  toggleLessonComplete: async (courseId: string, lessonId: string) => {
    const res = await apiClient.post<any>(
      `/courses/my-enrolled/${courseId}/lessons/${lessonId}/complete`,
    );
    return unwrap<{
      progressPercent: number;
      completedLessonIds: string[];
      isCompleted: boolean;
    }>(res.data);
  },

  // 9. Consultant: My created courses
  getMyCreatedCourses: async () => {
    const res = await apiClient.get<any>('/courses/creator/my-courses');
    return unwrap<ConsultantCourseStudioItem[]>(res.data);
  },

  // 10. Consultant: Get course by ID for editing
  getCourseForEditing: async (courseId: string) => {
    const res = await apiClient.get<any>(`/courses/creator/my-courses/${courseId}`);
    return unwrap<any>(res.data);
  },

  // 11. Consultant: Create course
  createCourse: async (payload: {
    title: string;
    tagline?: string;
    description?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: CourseLevel;
    price?: number;
    currency?: string;
    status?: CourseStatus;
  }) => {
    const res = await apiClient.post<any>('/courses/creator', payload);
    return unwrap<any>(res.data);
  },

  // 12. Consultant: Update course
  updateCourse: async (
    courseId: string,
    payload: {
      title?: string;
      tagline?: string;
      description?: string;
      thumbnailUrl?: string;
      category?: string;
      level?: CourseLevel;
      price?: number;
      currency?: string;
      status?: CourseStatus;
      isFeatured?: boolean;
    },
  ) => {
    const res = await apiClient.patch<any>(`/courses/creator/${courseId}`, payload);
    return unwrap<any>(res.data);
  },

  // 13. Consultant: Delete course
  deleteCourse: async (courseId: string) => {
    const res = await apiClient.delete<any>(`/courses/creator/${courseId}`);
    return unwrap<any>(res.data);
  },

  // 14. Consultant: Add lesson
  addLesson: async (
    courseId: string,
    payload: {
      title: string;
      description?: string;
      videoProvider?: string;
      videoUrl?: string;
      durationMinutes?: number;
      isPreview?: boolean;
      isPublished?: boolean;
      sortOrder?: number;
      resources?: any;
    },
  ) => {
    const res = await apiClient.post<any>(`/courses/creator/${courseId}/lessons`, payload);
    return unwrap<any>(res.data);
  },

  // 15. Consultant: Update lesson
  updateLesson: async (
    courseId: string,
    lessonId: string,
    payload: {
      title?: string;
      description?: string;
      videoProvider?: string;
      videoUrl?: string;
      durationMinutes?: number;
      isPreview?: boolean;
      isPublished?: boolean;
      sortOrder?: number;
      resources?: any;
    },
  ) => {
    const res = await apiClient.patch<any>(
      `/courses/creator/${courseId}/lessons/${lessonId}`,
      payload,
    );
    return unwrap<any>(res.data);
  },

  // 16. Consultant: Delete lesson
  deleteLesson: async (courseId: string, lessonId: string) => {
    const res = await apiClient.delete<any>(`/courses/creator/${courseId}/lessons/${lessonId}`);
    return unwrap<any>(res.data);
  },

  // 17. Consultant: Earnings & Withdrawals
  getEarnings: async () => {
    const res = await apiClient.get<any>('/courses/creator/earnings');
    return unwrap<ConsultantEarningsData>(res.data);
  },

  requestWithdrawal: async (payload: {
    amount: number;
    payoutMethod: string;
    accountDetails: Record<string, any>;
  }) => {
    const res = await apiClient.post<any>('/courses/creator/withdraw', payload);
    return unwrap<any>(res.data);
  },

  // 18. Admin: Course & Payout review
  getAdminCourses: async () => {
    const res = await apiClient.get<any>('/courses/admin/all');
    return unwrap<any[]>(res.data);
  },

  updateCourseStatusByAdmin: async (
    courseId: string,
    payload: { status?: CourseStatus; isFeatured?: boolean },
  ) => {
    const res = await apiClient.patch<any>(`/courses/admin/${courseId}/status`, payload);
    return unwrap<any>(res.data);
  },

  getAdminPayouts: async (status?: PayoutStatus) => {
    const res = await apiClient.get<any>(
      status ? `/courses/admin/payouts?status=${status}` : '/courses/admin/payouts',
    );
    return unwrap<any[]>(res.data);
  },

  updatePayoutStatus: async (
    payoutId: string,
    payload: { status: PayoutStatus; adminNotes?: string },
  ) => {
    const res = await apiClient.patch<any>(`/courses/admin/payouts/${payoutId}/status`, payload);
    return unwrap<any>(res.data);
  },
};
