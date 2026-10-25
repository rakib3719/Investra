import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminPermission } from '../../../common/enums/admin-permission.enum';

export class UpdateSubAdminPermissionsDto {
  @ApiProperty({
    enum: AdminPermission,
    isArray: true,
    example: [AdminPermission.USER_MANAGEMENT, AdminPermission.KYC_MODERATION],
  })
  @IsArray()
  @IsEnum(AdminPermission, { each: true, message: 'Invalid permission specified' })
  permissions: AdminPermission[];

  @ApiPropertyOptional({ example: 'Deal Moderation' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Updated permissions on quarterly review' })
  @IsString()
  @IsOptional()
  notes?: string;
}
