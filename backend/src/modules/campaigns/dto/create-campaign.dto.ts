import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { BusinessStage, RiskLevel } from "@prisma/client";

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  parentCompany?: string;

  @IsString()
  @IsNotEmpty()
  pitchText: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  customCategory?: string;

  @IsEnum(BusinessStage)
  @IsOptional()
  stage?: BusinessStage;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAmount: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minInvestment: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  projectedIrr?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valuation?: number;

  @IsEnum(RiskLevel)
  @IsOptional()
  riskLevel?: RiskLevel;

  @IsString()
  @IsOptional()
  esgRating?: string;

  @IsString()
  @IsOptional()
  impactMetric?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsUUID()
  @IsOptional()
  coverMediaId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery?: string[];

  @IsString()
  @IsOptional()
  pitchDeckUrl?: string;

  @IsString()
  @IsOptional()
  pitchDeckTitle?: string;

  @IsUUID()
  @IsOptional()
  pitchDeckMediaId?: string;

  @IsBoolean()
  @IsOptional()
  isPitchDeckConfidential?: boolean;
}
