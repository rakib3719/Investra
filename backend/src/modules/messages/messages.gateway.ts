import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { env, isAllowedOrigin } from '../../common/config/env.config';
import { MessagesService } from './messages.service';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  };
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow if origin is undefined (mobile / server-to-server / curl) or permitted by Investra CORS rules
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 5000,
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessagesGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  /**
   * Helper to extract JWT token from auth object, authorization header, or cookie
   */
  private extractToken(client: Socket): string | null {
    // 1. Check handshake auth token (standard socket.io practice)
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim().length > 0) {
      return authToken.replace(/^Bearer\s+/i, '').trim();
    }

    // 2. Check Authorization header
    const authHeader = client.handshake.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.trim().length > 0) {
      return authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    // 3. Check cookies (accessToken)
    const cookieHeader = client.handshake.headers?.cookie;
    if (typeof cookieHeader === 'string' && cookieHeader.includes('accessToken=')) {
      const match = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    return null;
  }

  /**
   * Handle incoming socket connection with JWT verification
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`[Socket ${client.id}] Connection rejected: No auth token provided`);
        client.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: env.JWT_SECRET,
      });

      if (!payload || !payload.sub) {
        this.logger.warn(`[Socket ${client.id}] Connection rejected: Invalid JWT payload`);
        client.disconnect(true);
        return;
      }

      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      // Automatically join the user's private notification room
      await client.join(`user_${payload.sub}`);
      this.logger.log(`[Socket ${client.id}] User ${payload.sub} (${payload.email}) connected`);
    } catch (err: any) {
      this.logger.warn(`[Socket ${client.id}] Connection error: ${err?.message || err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data?.user?.id;
    if (userId) {
      this.logger.log(`[Socket ${client.id}] User ${userId} disconnected`);
    }
  }

  /**
   * Join a specific conversation deal room
   */
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data?.user?.id;
    if (!userId || !data?.conversationId) {
      return { success: false, error: 'Unauthorized or invalid conversation ID' };
    }

    const isMember = await this.messagesService.isUserInConversation(userId, data.conversationId);
    if (!isMember) {
      return { success: false, error: 'Not authorized for this deal room' };
    }

    const room = `conversation_${data.conversationId}`;
    await client.join(room);
    this.logger.log(`[Socket ${client.id}] User ${userId} joined room ${room}`);
    return { success: true, conversationId: data.conversationId };
  }

  /**
   * Leave a specific conversation deal room
   */
  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      const room = `conversation_${data.conversationId}`;
      await client.leave(room);
    }
    return { success: true };
  }

  /**
   * Send a direct message via WebSocket
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      mediaFileId?: string;
      attachmentName?: string;
      attachmentUrl?: string;
    },
  ) {
    const userId = client.data?.user?.id;
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const message = await this.messagesService.sendMessage(userId, data.conversationId, {
        content: data.content,
        mediaFileId: data.mediaFileId,
        attachmentName: data.attachmentName,
        attachmentUrl: data.attachmentUrl,
      });

      return { success: true, message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send message' };
    }
  }

  /**
   * Typing indicator broadcast
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const user = client.data?.user;
    if (!user || !data?.conversationId) return;

    const room = `conversation_${data.conversationId}`;
    client.to(room).emit('userTyping', {
      conversationId: data.conversationId,
      userId: user.id,
      isTyping: !!data.isTyping,
    });
  }

  /**
   * Mark messages as read
   */
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data?.user?.id;
    if (!userId || !data?.conversationId) return;

    await this.messagesService.markAsRead(userId, data.conversationId);
    return { success: true };
  }

  /**
   * Broadcast new message to conversation room and to recipient's personal user room
   */
  broadcastNewMessage(
    conversationId: string,
    message: any,
    recipientId: string,
    recipientUnreadCount?: number,
  ) {
    if (!this.server) return;

    // 1. Broadcast to active conversation room (deal room chat window)
    const room = `conversation_${conversationId}`;
    this.server.to(room).emit('newMessage', {
      conversationId,
      message,
    });

    // 2. Broadcast to recipient's private user room (sidebar preview & unread badge)
    this.server.to(`user_${recipientId}`).emit('conversationUpdated', {
      conversationId,
      lastMessageText: message.content,
      lastMessageAt: message.createdAt,
      unreadCount: recipientUnreadCount ?? 1,
      message,
    });
  }

  /**
   * Broadcast read event to conversation room
   */
  broadcastMessagesRead(conversationId: string, readByUserId: string) {
    if (!this.server) return;
    const room = `conversation_${conversationId}`;
    this.server.to(room).emit('messagesRead', {
      conversationId,
      readByUserId,
    });
  }

  /**
   * Broadcast real-time in-app notification to a specific user's private socket room
   */
  sendNotificationToUser(userId: string, notification: any) {
    if (!this.server) return;
    this.server.to(`user_${userId}`).emit('notification:new', notification);
  }
}
