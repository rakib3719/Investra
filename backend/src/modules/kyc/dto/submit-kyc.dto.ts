import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitKycDto {
  @ApiPropertyOptional({ description: 'National Identity Number' })
  @IsOptional()
  @IsString()
  nidNumber?: string;

  @ApiPropertyOptional({ description: 'Passport Number' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ description: 'Tax Identification Number (TIN / e-TIN)' })
  @IsOptional()
  @IsString()
  taxIdNumber?: string;

  @ApiPropertyOptional({ description: 'Full verified residential street address' })
  @IsOptional()
  @IsString()
  residentialAddress?: string;

  @ApiPropertyOptional({ description: 'Declared source of investment funds (e.g., Employment, Business, Inheritance)' })
  @IsOptional()
  @IsString()
  sourceOfFunds?: string;

  @ApiPropertyOptional({ description: 'Annual income bracket' })
  @IsOptional()
  @IsString()
  annualIncomeRange?: string;

  @ApiPropertyOptional({ description: 'Estimated liquid / total net worth bracket' })
  @IsOptional()
  @IsString()
  netWorthRange?: string;

  @ApiPropertyOptional({ description: 'Politically Exposed Person (PEP) declaration flag' })
  @IsOptional()
  @IsBoolean()
  pepDeclaration?: boolean;

  @ApiPropertyOptional({ description: 'Registered Trade License Number (for startups & consultants)' })
  @IsOptional()
  @IsString()
  tradeLicenseNumber?: string;

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

  @ApiPropertyOptional({ description: 'Proof of Address (Utility bill, bank statement) private media UUID' })
  @IsOptional()
  @IsUUID('4')
  poaMediaId?: string;

  @ApiPropertyOptional({ description: 'Proof of Funds / Bank statement private media UUID' })
  @IsOptional()
  @IsUUID('4')
  proofOfFundsMediaId?: string;

  @ApiPropertyOptional({ description: 'Trade License / Incorporation Certificate private media UUID' })
  @IsOptional()
  @IsUUID('4')
  tradeLicenseMediaId?: string;

  @ApiPropertyOptional({ description: 'Tax Identification Certificate private media UUID' })
  @IsOptional()
  @IsUUID('4')
  tinCertificateMediaId?: string;
}
