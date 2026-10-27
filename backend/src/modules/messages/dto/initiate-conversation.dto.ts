import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class InitiateConversationDto {
  @ApiProperty({ description: 'Target user ID to start conversation with' })
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  @ApiPropertyOptional({ description: 'Optional associated intro request ID' })
  @IsOptional()
  @IsUUID()
  introRequestId?: string;

  @ApiPropertyOptional({ description: 'Conversation topic / subject' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: 'Initial message content to send immediately' })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}
