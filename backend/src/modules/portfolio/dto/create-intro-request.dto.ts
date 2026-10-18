import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIntroRequestDto {
  @ApiProperty({ description: 'The User ID or Investor Profile ID of the investor' })
  @IsNotEmpty()
  @IsString()
  investorId: string;

  @ApiProperty({ description: 'Name of the startup / business' })
  @IsNotEmpty()
  @IsString()
  startupName: string;

  @ApiProperty({ description: 'Introduction message, traction highlights, and why you are pitching' })
  @IsNotEmpty()
  @IsString()
  pitchMessage: string;

  @ApiPropertyOptional({ description: 'Executive business overview & unit economics' })
  @IsOptional()
  @IsString()
  businessOverview?: string;

  @ApiPropertyOptional({ description: 'Target sector / industry (e.g. FinTech, CleanTech)' })
  @IsOptional()
  @IsString()
  targetSector?: string;

  @ApiPropertyOptional({ description: 'Funding round stage (e.g. Pre-Seed, Seed, Series A)' })
  @IsOptional()
  @IsString()
  roundStage?: string;

  @ApiPropertyOptional({ description: 'Target capital raising amount (e.g. $250,000)' })
  @IsOptional()
  @IsString()
  raisingAmount?: string;

  @ApiPropertyOptional({ description: 'Pitch deck or presentation link' })
  @IsOptional()
  @IsString()
  deckUrl?: string;

  @ApiPropertyOptional({ description: 'Startup website or demo link' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Direct contact email for follow-up' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Direct contact phone number / WhatsApp' })
  @IsOptional()
  @IsString()
  contactPhone?: string;
}
