import { apiClient } from '../api/client';

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ConsultantSlotItem {
  id: string;
  consultantId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: SlotStatus;
  createdAt: string;
  booking?: ConsultationBookingItem;
}

export interface ConsultationBookingItem {
  id: string;
  slotId: string;
  consultantId: string;
  clientId: string;
  topic: string;
  clientNotes?: string | null;
  status: BookingStatus;
  meetingPlatform: string;
  meetingLink?: string | null;
  grossAmount: number | string;
  platformFeeRate: number | string;
  platformFeeAmount: number | string;
  consultantEarnings: number | string;
  currency: string;
  transactionId?: string | null;
  isPaid: boolean;
  paidAt?: string | null;
  createdAt: string;
  slot: {
    id: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    status: SlotStatus;
  };
  consultant?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    image?: string | null;
    consultantProfile?: {
      headline?: string | null;
      specialization?: string | null;
    };
  };
  client?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    image?: string | null;
    role?: string;
  };
}

export interface ConsultantUnifiedEarnings {
  stats: {
    totalGross: number;
    totalPlatformFee: number;
    totalNetEarnings: number;
    availableBalance: number;
    totalPaidOut: number;
    pendingPayout: number;
  };
  breakdown: {
    courses: {
      totalEnrollments?: number;
      count?: number;
      gross: number;
      platformFee: number;
      net: number;
      rate: string;
    };
    sessions: {
      totalSessions?: number;
      count?: number;
      gross: number;
      platformFee: number;
      net: number;
      rate: string;
    };
  };
  courseTransactions: any[];
  sessionTransactions: ConsultationBookingItem[];
  profile: {
    sessionFee: number;
    consultationFee: number;
    defaultMeetingLink: string | null;
  };
}

function unwrap<T>(resData: any): T {
  if (resData && typeof resData === 'object' && 'data' in resData && 'success' in resData) {
    return resData.data as T;
  }
  return resData as T;
}

export const consultationsApi = {
  // Public: View slots for a consultant
  getPublicSlots: async (consultantId: string): Promise<ConsultantSlotItem[]> => {
    const res = await apiClient.get(`/consultations/slots/public/${consultantId}`);
    return unwrap<ConsultantSlotItem[]>(res.data) || [];
  },

  // Consultant: Manage slots
  createSlot: async (payload: {
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes?: number;
  }): Promise<ConsultantSlotItem> => {
    const res = await apiClient.post('/consultations/slots', payload);
    return unwrap<ConsultantSlotItem>(res.data);
  },

  getMySlots: async (): Promise<ConsultantSlotItem[]> => {
    const res = await apiClient.get('/consultations/slots/my-slots');
    return unwrap<ConsultantSlotItem[]>(res.data) || [];
  },

  deleteSlot: async (slotId: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/consultations/slots/${slotId}`);
    return unwrap<{ message: string }>(res.data);
  },

  // Client: Book session
  bookSession: async (payload: {
    slotId: string;
    topic: string;
    clientNotes?: string;
    meetingPlatform?: string;
  }): Promise<ConsultationBookingItem> => {
    const res = await apiClient.post('/consultations/bookings/checkout', payload);
    return unwrap<ConsultationBookingItem>(res.data);
  },

  getMyClientBookings: async (): Promise<ConsultationBookingItem[]> => {
    const res = await apiClient.get('/consultations/bookings/my-bookings');
    return unwrap<ConsultationBookingItem[]>(res.data) || [];
  },

  // Consultant: My sessions & preference
  getMyConsultantSessions: async (): Promise<ConsultationBookingItem[]> => {
    const res = await apiClient.get('/consultations/bookings/my-sessions');
    return unwrap<ConsultationBookingItem[]>(res.data) || [];
  },

  updateMeetingLink: async (
    bookingId: string,
    payload: { meetingLink: string; meetingPlatform?: string },
  ): Promise<ConsultationBookingItem> => {
    const res = await apiClient.patch(`/consultations/bookings/${bookingId}/meeting-link`, payload);
    return unwrap<ConsultationBookingItem>(res.data);
  },

  updateDefaultMeetingPreference: async (defaultMeetingLink: string): Promise<any> => {
    const res = await apiClient.patch('/consultations/preference/meeting-link', {
      defaultMeetingLink,
    });
    return unwrap(res.data);
  },

  // Unified financial breakdown
  getEarningsBreakdown: async (): Promise<ConsultantUnifiedEarnings> => {
    const res = await apiClient.get('/consultations/earnings/breakdown');
    return unwrap<ConsultantUnifiedEarnings>(res.data);
  },
};
