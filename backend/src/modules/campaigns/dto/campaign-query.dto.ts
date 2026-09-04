import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { BusinessStage, RiskLevel } from "@prisma/client";

export class CampaignQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(BusinessStage)
  stage?: BusinessStage;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @Type(() => Number)
  minIrr?: number;

  @IsOptional()
  @Type(() => Number)
  maxTarget?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
