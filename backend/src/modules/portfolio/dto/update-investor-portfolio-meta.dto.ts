import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessStage } from '@prisma/client';

export class UpdateInvestorPortfolioMetaDto {
  @ApiPropertyOptional({ description: 'Short professional headline' })
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional({ description: 'Detailed investment thesis and criteria' })
  @IsOptional()
  @IsString()
  investmentThesis?: string;

  @ApiPropertyOptional({ description: 'Investor bio or background' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Firm or fund name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: 'Designation / role in fund' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ description: 'Years of professional investing experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ description: 'Minimum check size in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  investmentRangeMin?: number;

  @ApiPropertyOptional({ description: 'Maximum check size in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  investmentRangeMax?: number;

  @ApiPropertyOptional({ description: 'Preferred currency' })
  @IsOptional()
  @IsString()
  preferredCurrency?: string;

  @ApiPropertyOptional({ description: 'Accredited investor status declaration' })
  @IsOptional()
  @IsBoolean()
  accreditedInvestor?: boolean;

  @ApiPropertyOptional({ enum: BusinessStage, description: 'Preferred startup stage' })
  @IsOptional()
  @IsEnum(BusinessStage)
  preferredStage?: BusinessStage;

  @ApiPropertyOptional({ description: 'LinkedIn profile URL' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ description: 'Twitter / X profile URL' })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({ description: 'Crunchbase or AngelList profile URL' })
  @IsOptional()
  @IsString()
  crunchbaseUrl?: string;

  @ApiPropertyOptional({ description: 'Personal or fund website URL' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Video introduction URL (YouTube/Vimeo/Loom)' })
  @IsOptional()
  @IsString()
  videoIntroUrl?: string;

  @ApiPropertyOptional({ description: 'MediaFile ID for video uploaded to Cloudflare private bucket' })
  @IsOptional()
  @IsString()
  videoIntroMediaId?: string;

  @ApiPropertyOptional({ description: 'Focus sectors/industries' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectors?: string[];

  @ApiPropertyOptional({ description: 'Total portfolio companies backed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalInvestmentsCount?: number;

  @ApiPropertyOptional({ description: 'Total successful exits' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalExitsCount?: number;

  @ApiPropertyOptional({ description: 'Total capital deployed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCapitalDeployed?: number;
}
