import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { InitiateConversationDto } from './dto/initiate-conversation.dto';
import { MessagesService } from './messages.service';

@ApiTags('Direct Messages & Deal Rooms')
@Controller('api/v1/messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all active conversations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Conversations returned successfully' })
  async getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getUserConversations(userId);
  }

  @Post('conversations/initiate')
  @ApiOperation({ summary: 'Initiate or retrieve an existing conversation with another user' })
  @ApiResponse({ status: 200, description: 'Conversation started or retrieved' })
  async initiateConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiateConversationDto,
  ) {
    return this.messagesService.initiateConversation(userId, dto);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a conversation by ID with all its messages' })
  @ApiResponse({ status: 200, description: 'Conversation and messages returned' })
  async getConversation(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.messagesService.getConversationById(userId, conversationId);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, conversationId, dto);
  }

  @Patch('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all unread messages in conversation as read' })
  @ApiResponse({ status: 200, description: 'Marked as read' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.messagesService.markAsRead(userId, conversationId);
  }
}
