import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { InvestmentInstrument } from '@prisma/client';

export class CreateCommitmentDto {
  @ApiProperty({ description: 'Target entrepreneur user ID' })
  @IsUUID()
  @IsNotEmpty()
  entrepreneurId: string;

  @ApiPropertyOptional({ description: 'Optional linked campaign/business ID' })
  @IsOptional()
  @IsUUID()
  businessId?: string;

  @ApiPropertyOptional({ description: 'Optional linked intro request ID' })
  @IsOptional()
  @IsUUID()
  introRequestId?: string;

  @ApiProperty({ description: 'Startup or venture company name' })
  @IsString()
  @IsNotEmpty()
  startupName: string;

  @ApiProperty({ description: 'Investment ticket size / commitment amount', example: 50000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    enum: InvestmentInstrument,
    description: 'Investment vehicle type (SAFE, EQUITY, CONVERTIBLE_NOTE, DEBT, REVENUE_SHARE)',
    default: InvestmentInstrument.SAFE,
  })
  @IsEnum(InvestmentInstrument)
  instrument: InvestmentInstrument;

  @ApiPropertyOptional({ description: 'Pre-money or post-money valuation in USD', example: 5000000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  valuation?: number;

  @ApiPropertyOptional({ description: 'Target equity ownership percentage', example: 5.5 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(100)
  equityPercentage?: number;

  @ApiProperty({ description: 'Executive summary of terms, milestones, board observers, and vesting' })
  @IsString()
  @IsNotEmpty()
  termsSummary: string;

  @ApiPropertyOptional({ description: 'Uploaded term sheet PDF URL' })
  @IsOptional()
  @IsString()
  termSheetDocUrl?: string;

  @ApiPropertyOptional({ description: 'Cloudflare R2 media file ID for term sheet' })
  @IsOptional()
  @IsUUID()
  termSheetMediaId?: string;

  @ApiPropertyOptional({ description: 'Personal private note from investor to founder' })
  @IsOptional()
  @IsString()
  investorNotes?: string;
}
