import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VerificationStatus } from '../../../common/enums/verification-status.enum';

export class ReviewKycDto {
  @ApiProperty({
    enum: [VerificationStatus.VERIFIED, VerificationStatus.REJECTED, VerificationStatus.UNDER_REVIEW],
    example: VerificationStatus.VERIFIED,
  })
  @IsNotEmpty()
  @IsEnum([VerificationStatus.VERIFIED, VerificationStatus.REJECTED, VerificationStatus.UNDER_REVIEW], {
    message: 'Status must be VERIFIED, REJECTED, or UNDER_REVIEW',
  })
  status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED | VerificationStatus.UNDER_REVIEW;

  @ApiPropertyOptional({ description: 'Rejection reason if status is REJECTED' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
