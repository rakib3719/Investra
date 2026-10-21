import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { InitiateConversationDto } from './dto/initiate-conversation.dto';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MessagesGateway))
    private readonly messagesGateway?: MessagesGateway,
  ) {}

  /**
   * Helper to format a participant's public profile summary
   */
  private formatParticipantSummary(user: any) {
    if (!user) return null;
    const profile =
      user.investorProfile ||
      user.entrepreneurProfile ||
      user.consultantProfile ||
      null;

    const company =
      profile?.companyName || profile?.businessName || user.company || null;
    const designation =
      profile?.designation || profile?.headline || user.role || 'Member';

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.email,
      email: user.email,
      image: user.image,
      role: user.role,
      company,
      designation,
    };
  }

  /**
   * Get all conversations for the authenticated user
   */
  async getUserConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
        status: 'ACTIVE',
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            role: true,
            investorProfile: { select: { companyName: true, designation: true } },
            entrepreneurProfile: { select: { companyName: true, designation: true } },
            consultantProfile: { select: { companyName: true, designation: true } },
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            role: true,
            investorProfile: { select: { companyName: true, designation: true } },
            entrepreneurProfile: { select: { companyName: true, designation: true } },
            consultantProfile: { select: { companyName: true, designation: true } },
          },
        },
        introRequest: {
          select: {
            id: true,
            startupName: true,
            status: true,
            raisingAmount: true,
            targetSector: true,
            deckUrl: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return conversations.map((conv) => {
      const isUser1 = conv.participant1Id === userId;
      const otherUser = isUser1 ? conv.participant2 : conv.participant1;
      const unreadCount = isUser1 ? conv.unreadCountUser1 : conv.unreadCountUser2;

      return {
        id: conv.id,
        introRequestId: conv.introRequestId,
        subject: conv.subject,
        lastMessageAt: conv.lastMessageAt,
        lastMessageText: conv.lastMessageText,
        unreadCount,
        otherParticipant: this.formatParticipantSummary(otherUser),
        introRequest: conv.introRequest,
        createdAt: conv.createdAt,
      };
    });
  }

  /**
   * Get a single conversation by ID with all messages
   */
  async getConversationById(userId: string, conversationId: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            role: true,
            investorProfile: { select: { companyName: true, designation: true } },
            entrepreneurProfile: { select: { companyName: true, designation: true } },
            consultantProfile: { select: { companyName: true, designation: true } },
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            role: true,
            investorProfile: { select: { companyName: true, designation: true } },
            entrepreneurProfile: { select: { companyName: true, designation: true } },
            consultantProfile: { select: { companyName: true, designation: true } },
          },
        },
        introRequest: {
          select: {
            id: true,
            startupName: true,
            pitchMessage: true,
            status: true,
            raisingAmount: true,
            deckUrl: true,
            targetSector: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
      throw new ForbiddenException('You do not have permission to view this conversation');
    }

    // Mark as read
    const isUser1 = conv.participant1Id === userId;
    if (isUser1 && conv.unreadCountUser1 > 0) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCountUser1: 0 },
      });
    } else if (!isUser1 && conv.unreadCountUser2 > 0) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCountUser2: 0 },
      });
    }

    // Mark messages sent by the other user as read
    await this.prisma.directMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    const otherUser = isUser1 ? conv.participant2 : conv.participant1;

    return {
      id: conv.id,
      introRequestId: conv.introRequestId,
      subject: conv.subject,
      lastMessageAt: conv.lastMessageAt,
      lastMessageText: conv.lastMessageText,
      unreadCount: 0,
      otherParticipant: this.formatParticipantSummary(otherUser),
      introRequest: conv.introRequest,
      messages: conv.messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: [m.sender.firstName, m.sender.lastName].filter(Boolean).join(' ') || 'User',
        senderImage: m.sender.image,
        senderRole: m.sender.role,
        content: m.content,
        mediaFileId: m.mediaFileId,
        attachmentName: m.attachmentName,
        attachmentUrl: m.attachmentUrl,
        isRead: m.isRead,
        readAt: m.readAt,
        createdAt: m.createdAt,
        isMe: m.senderId === userId,
      })),
      createdAt: conv.createdAt,
    };
  }

  /**
   * Start or find an existing conversation
   */
  async initiateConversation(userId: string, dto: InitiateConversationDto) {
    if (userId === dto.recipientId) {
      throw new ForbiddenException('Cannot start a conversation with yourself');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.recipientId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    // Look for existing conversation between these users
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: dto.recipientId },
          { participant1Id: dto.recipientId, participant2Id: userId },
        ],
        ...(dto.introRequestId ? { introRequestId: dto.introRequestId } : {}),
      },
    });

    if (!conversation) {
      // Check subscription requirement if sender is an Investor
      const sender = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      });

      if (sender?.role === 'INVESTOR') {
        const activeSub = await this.prisma.userSubscription.findFirst({
          where: {
            userId,
            status: 'ACTIVE',
            currentPeriodEnd: { gte: new Date() },
          },
        });

        if (!activeSub) {
          throw new ForbiddenException(
            'Active Investor Subscription Required. An active subscription is required to connect with startup founders and initiate deal room discussions.',
          );
        }
      }

      conversation = await this.prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: dto.recipientId,
          introRequestId: dto.introRequestId || null,
          subject: dto.subject?.trim() || 'Deal Discussion',
          lastMessageText: dto.initialMessage?.trim() || null,
          unreadCountUser1: 0,
          unreadCountUser2: dto.initialMessage ? 1 : 0,
        },
      });

      if (dto.initialMessage?.trim()) {
        await this.prisma.directMessage.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: dto.initialMessage.trim(),
          },
        });
      }
    } else if (dto.initialMessage?.trim()) {
      // Add message to existing conversation
      await this.sendMessage(userId, conversation.id, {
        content: dto.initialMessage.trim(),
      });
    }

    return this.getConversationById(userId, conversation.id);
  }

  /**
   * Send a message in an existing conversation
   */
  async sendMessage(userId: string, conversationId: string, dto: CreateMessageDto) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
      throw new ForbiddenException('Not authorized to message in this conversation');
    }

    const isUser1 = conv.participant1Id === userId;

    const message = await this.prisma.directMessage.create({
      data: {
        conversationId,
        senderId: userId,
        content: dto.content.trim(),
        mediaFileId: dto.mediaFileId || null,
        attachmentName: dto.attachmentName || null,
        attachmentUrl: dto.attachmentUrl || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Update conversation lastMessage and unread counts
    const updatedConv = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: dto.content.trim().slice(0, 200),
        ...(isUser1
          ? { unreadCountUser2: { increment: 1 } }
          : { unreadCountUser1: { increment: 1 } }),
      },
      select: {
        id: true,
        unreadCountUser1: true,
        unreadCountUser2: true,
        participant1Id: true,
        participant2Id: true,
      },
    });

    const recipientId = isUser1 ? conv.participant2Id : conv.participant1Id;
    const recipientUnread = isUser1 ? updatedConv.unreadCountUser2 : updatedConv.unreadCountUser1;

    const formattedMessage = {
      id: message.id,
      conversationId,
      senderId: message.senderId,
      senderName: [message.sender.firstName, message.sender.lastName].filter(Boolean).join(' ') || 'User',
      senderImage: message.sender.image,
      senderRole: message.sender.role,
      content: message.content,
      mediaFileId: message.mediaFileId,
      attachmentName: message.attachmentName,
      attachmentUrl: message.attachmentUrl,
      isRead: message.isRead,
      readAt: message.readAt,
      createdAt: message.createdAt,
      isMe: true,
    };

    // Broadcast in real-time via WebSocket gateway to deal room and recipient user room
    if (this.messagesGateway) {
      this.messagesGateway.broadcastNewMessage(
        conversationId,
        formattedMessage,
        recipientId,
        recipientUnread,
      );
    }

    return formattedMessage;
  }

  /**
   * Check if a user is a participant in a conversation
   */
  async isUserInConversation(userId: string, conversationId: string): Promise<boolean> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { participant1Id: true, participant2Id: true },
    });
    if (!conv) return false;
    return conv.participant1Id === userId || conv.participant2Id === userId;
  }

  /**
   * Mark all unread messages in conversation as read
   */
  async markAsRead(userId: string, conversationId: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    const isUser1 = conv.participant1Id === userId;
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: isUser1 ? { unreadCountUser1: 0 } : { unreadCountUser2: 0 },
    });

    await this.prisma.directMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Notify other participant that messages were read
    if (this.messagesGateway) {
      this.messagesGateway.broadcastMessagesRead(conversationId, userId);
    }

    return { success: true };
  }
}
