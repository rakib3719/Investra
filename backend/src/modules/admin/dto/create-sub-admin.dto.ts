import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminPermission } from '../../../common/enums/admin-permission.enum';

export class CreateSubAdminDto {
  @ApiProperty({ example: 'subadmin@investra.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Rahim' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Chowdhury' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+8801700000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: AdminPermission,
    isArray: true,
    example: [AdminPermission.USER_MANAGEMENT, AdminPermission.KYC_MODERATION],
  })
  @IsArray()
  @IsEnum(AdminPermission, { each: true, message: 'Invalid permission specified' })
  permissions: AdminPermission[];

  @ApiPropertyOptional({ example: 'Compliance & Verification' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Assigned to KYC moderation and user audit' })
  @IsString()
  @IsOptional()
  notes?: string;
}
