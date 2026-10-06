import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { UserRole, AccountStatus, VerificationStatus } from "@prisma/client";

export class AdminUsersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsEnum(VerificationStatus)
  kycStatus?: VerificationStatus;

  /**
   * Filter specifically for users who have NOT yet submitted any KYC documents
   */
  @IsOptional()
  @IsString()
  kycSubmission?: "UNSUBMITTED" | "SUBMITTED" | "ALL";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
