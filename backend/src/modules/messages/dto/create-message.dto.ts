import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message body text' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Optional Cloudflare R2 uploaded media file ID' })
  @IsOptional()
  @IsUUID()
  mediaFileId?: string;

  @ApiPropertyOptional({ description: 'Original attachment name if any' })
  @IsOptional()
  @IsString()
  attachmentName?: string;

  @ApiPropertyOptional({ description: 'External or R2 attachment URL' })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
