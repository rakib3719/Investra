import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IntroRequestStatus } from '@prisma/client';

export class UpdateIntroStatusDto {
  @ApiProperty({
    enum: IntroRequestStatus,
    description: 'Updated status of the introduction request',
    example: IntroRequestStatus.ACCEPTED,
  })
  @IsNotEmpty()
  @IsEnum(IntroRequestStatus)
  status: IntroRequestStatus;

  @ApiPropertyOptional({
    description: 'Optional response or feedback note from the investor to the founder',
  })
  @IsOptional()
  @IsString()
  investorFeedback?: string;
}
