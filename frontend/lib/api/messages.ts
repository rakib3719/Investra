import { apiClient } from './client';

export interface ParticipantSummary {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName: string;
  email: string;
  image?: string | null;
  role: string;
  company?: string | null;
  designation?: string | null;
}

export interface DirectMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  senderRole: string;
  content: string;
  mediaFileId?: string | null;
  attachmentName?: string | null;
  attachmentUrl?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  isMe: boolean;
}

export interface ConversationSummary {
  id: string;
  introRequestId?: string | null;
  subject: string;
  lastMessageAt: string;
  lastMessageText?: string | null;
  unreadCount: number;
  otherParticipant: ParticipantSummary | null;
  introRequest?: {
    id: string;
    startupName: string;
    status: string;
    raisingAmount?: string | null;
    targetSector?: string | null;
    deckUrl?: string | null;
    pitchMessage?: string | null;
  } | null;
  createdAt: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: DirectMessageItem[];
}

export interface CreateMessageDto {
  content: string;
  mediaFileId?: string;
  attachmentName?: string;
  attachmentUrl?: string;
}

export interface InitiateConversationDto {
  recipientId: string;
  introRequestId?: string;
  subject?: string;
  initialMessage?: string;
}

export const MessagesApi = {
  async getConversations(): Promise<ConversationSummary[]> {
    const res = await apiClient.get('/api/v1/messages/conversations');
    return res.data?.data || res.data || [];
  },

  async getConversation(id: string): Promise<ConversationDetail> {
    const res = await apiClient.get(`/api/v1/messages/conversations/${id}`);
    return res.data?.data || res.data;
  },

  async initiateConversation(dto: InitiateConversationDto): Promise<ConversationDetail> {
    const res = await apiClient.post('/api/v1/messages/conversations/initiate', dto);
    return res.data?.data || res.data;
  },

  async sendMessage(conversationId: string, dto: CreateMessageDto): Promise<DirectMessageItem> {
    const res = await apiClient.post(`/api/v1/messages/conversations/${conversationId}/messages`, dto);
    return res.data?.data || res.data;
  },

  async markAsRead(conversationId: string): Promise<{ success: boolean }> {
    const res = await apiClient.patch(`/api/v1/messages/conversations/${conversationId}/read`);
    return res.data?.data || res.data;
  },
};
