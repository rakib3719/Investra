import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { MessagesGateway } from '../messages/messages.gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  /**
   * Core notification dispatch:
   * 1. Inserts into database
   * 2. Pushes real-time WebSocket event via socket.io
   * 3. Sends formatted HTML email alert
   */
  async notify(dto: CreateNotificationDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      if (!user) {
        this.logger.warn(`User ${dto.userId} not found when attempting to dispatch notification.`);
        return null;
      }

      // 1. Create in Database
      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          actionUrl: dto.actionUrl || null,
          metadata: dto.metadata || {},
          isRead: false,
        },
      });

      // 2. Real-time WebSocket Push
      try {
        this.messagesGateway.sendNotificationToUser(dto.userId, {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          actionUrl: notification.actionUrl,
          isRead: false,
          createdAt: notification.createdAt,
        });
      } catch (wsErr: any) {
        this.logger.warn(`WebSocket notification push failed: ${wsErr?.message || wsErr}`);
      }

      // 3. Email Alert (Async)
      if (dto.sendEmail !== false && user.email) {
        const recipientName =
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

        const categoryMap: Record<NotificationType, string> = {
          TERM_SHEET_RECEIVED: 'Investment Term Sheet',
          TERM_SHEET_RESPONDED: 'Term Sheet Update',
          INTRO_REQUEST_RECEIVED: 'Founder Introduction',
          KYC_APPROVED: 'KYC Verification',
          KYC_REJECTED: 'KYC Compliance',
          SESSION_BOOKED: '1-on-1 Consultation',
          COURSE_ENROLLED: 'Course Studio',
          SYSTEM_ANNOUNCEMENT: 'Platform Notice',
          NEW_MESSAGE: 'Deal Chat',
        };

        this.mailService
          .sendNotificationEmail({
            to: user.email,
            recipientName,
            title: dto.title,
            message: dto.message,
            actionUrl: dto.actionUrl,
            actionText: 'Open in Investra &rarr;',
            category: categoryMap[dto.type] || 'Platform Alert',
          })
          .catch((mailErr) => {
            this.logger.error(`Failed to send notification email: ${mailErr?.message || mailErr}`);
          });
      }

      return notification;
    } catch (err: any) {
      this.logger.error(`Error dispatching notification: ${err?.message || err}`);
      return null;
    }
  }

  /**
   * Get user's notifications (Paginated)
   */
  async getMyNotifications(
    userId: string,
    query?: { limit?: number; offset?: number; unreadOnly?: boolean },
  ) {
    const limit = Math.max(1, Math.min(50, Number(query?.limit) || 20));
    const offset = Math.max(0, Number(query?.offset) || 0);

    const where: any = { userId };
    if (query?.unreadOnly) {
      where.isRead = false;
    }

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      items,
      total,
      unreadCount,
      limit,
      offset,
    };
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const item = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!item) {
      throw new NotFoundException('Notification not found.');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('You cannot modify this notification.');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all user's notifications as read
   */
  async markAllAsRead(userId: string) {
    const res = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { updatedCount: res.count };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    const item = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!item) {
      throw new NotFoundException('Notification not found.');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('You cannot delete this notification.');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted.' };
  }
}
