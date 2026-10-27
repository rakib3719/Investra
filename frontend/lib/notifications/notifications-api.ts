import { apiClient } from '../api/client';

export type NotificationType =
  | 'TERM_SHEET_RECEIVED'
  | 'TERM_SHEET_RESPONDED'
  | 'INTRO_REQUEST_RECEIVED'
  | 'KYC_APPROVED'
  | 'KYC_REJECTED'
  | 'SESSION_BOOKED'
  | 'COURSE_ENROLLED'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'NEW_MESSAGE';

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  isRead: boolean;
  readAt?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface NotificationsResponse {
  items: InAppNotification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

function unwrap<T>(resData: any): T {
  if (resData && typeof resData === 'object' && 'data' in resData && 'success' in resData) {
    return resData.data as T;
  }
  return resData as T;
}

export const notificationsApi = {
  getMyNotifications: async (params?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }): Promise<NotificationsResponse> => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));
    if (params?.unreadOnly) q.set('unreadOnly', 'true');

    const res = await apiClient.get(`/notifications?${q.toString()}`);
    return unwrap<NotificationsResponse>(res.data);
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get('/notifications/unread-count');
    const data = unwrap<{ unreadCount: number }>(res.data);
    return data?.unreadCount ?? 0;
  },

  markAsRead: async (id: string): Promise<InAppNotification> => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return unwrap<InAppNotification>(res.data);
  },

  markAllAsRead: async (): Promise<{ updatedCount: number }> => {
    const res = await apiClient.patch('/notifications/read-all');
    return unwrap<{ updatedCount: number }>(res.data);
  },

  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return unwrap<{ message: string }>(res.data);
  },
};
