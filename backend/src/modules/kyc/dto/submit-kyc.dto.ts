import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitKycDto {
  @ApiPropertyOptional({ description: 'National Identity Number' })
  @IsOptional()
  @IsString()
  nidNumber?: string;

  @ApiPropertyOptional({ description: 'Passport Number' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({ description: 'Front document private media UUID' })
  @IsNotEmpty()
  @IsUUID('4')
  frontMediaId: string;

  @ApiPropertyOptional({ description: 'Back document private media UUID' })
  @IsOptional()
  @IsUUID('4')
  backMediaId?: string;

  @ApiProperty({ description: 'Selfie or liveness check private media UUID' })
  @IsNotEmpty()
  @IsUUID('4')
  selfieMediaId: string;
}
