import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PortfolioItemType } from '@prisma/client';

export class CreatePortfolioItemDto {
  @ApiProperty({
    enum: PortfolioItemType,
    description: 'Type of portfolio item: INVESTMENT, CERTIFICATION, EXPERIENCE, VIDEO_PRESENTATION, CASE_STUDY',
  })
  @IsEnum(PortfolioItemType)
  @IsNotEmpty()
  type: PortfolioItemType;

  @ApiProperty({ description: 'Title of the company, certificate, role, or video' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Subtitle or secondary title (e.g. Lead Investor, Series A)' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Detailed description or investment thesis for this holding' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sector / industry' })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiPropertyOptional({ description: 'Startup stage or round (e.g. Seed, Series A, Growth)' })
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiPropertyOptional({ description: 'Amount invested in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amountInvested?: number;

  @ApiPropertyOptional({ description: 'Company valuation in USD at investment round' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valuation?: number;

  @ApiPropertyOptional({ description: 'Return multiple (e.g. 3.5x, 10x, Undisclosed)' })
  @IsOptional()
  @IsString()
  returnMultiple?: string;

  @ApiPropertyOptional({ description: 'Status (e.g. ACTIVE, EXITED_ACQUISITION, EXITED_IPO, WRITTEN_OFF)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Year of investment or achievement' })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Issuing organization (for certifications)' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ description: 'Credential ID or license number' })
  @IsOptional()
  @IsString()
  credentialId?: string;

  @ApiPropertyOptional({ description: 'External credential verification URL' })
  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @ApiPropertyOptional({ description: 'Video provider: R2_PRIVATE, YOUTUBE, VIMEO, LOOM' })
  @IsOptional()
  @IsString()
  videoProvider?: string;

  @ApiPropertyOptional({ description: 'External video URL' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'External company website or article link' })
  @IsOptional()
  @IsString()
  externalUrl?: string;

  @ApiPropertyOptional({ description: 'Logo or thumbnail image URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Uploaded MediaFile ID in Cloudflare private storage' })
  @IsOptional()
  @IsString()
  mediaFileId?: string;

  @ApiPropertyOptional({ description: 'Highlight this item as featured' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Keep strictly private to premium subscribers only' })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiPropertyOptional({ description: 'Display order priority' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
