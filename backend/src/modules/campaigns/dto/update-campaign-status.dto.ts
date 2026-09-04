import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CampaignStatus } from "@prisma/client";

export class UpdateCampaignStatusDto {
  @IsEnum(CampaignStatus)
  @IsNotEmpty()
  status: CampaignStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
