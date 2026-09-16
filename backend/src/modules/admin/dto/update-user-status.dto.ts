import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AccountStatus } from "@prisma/client";

export class UpdateUserStatusDto {
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
