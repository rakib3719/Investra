import {
  IsArray,
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
  @IsNotEmpty()
  pitchText: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery?: string[];
}
