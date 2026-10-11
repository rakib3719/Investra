import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class QueryPlansDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
