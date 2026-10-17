import {
  IsNumber,
  Min,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PayoutStatus } from '@prisma/client';

export class RequestPayoutDto {
  @IsNumber()
  @Min(10)
  amount: number;

  @IsString()
  @IsNotEmpty()
  payoutMethod: string; // e.g. BANK_TRANSFER, PAYPAL, STRIPE

  @IsNotEmpty()
  accountDetails: Record<string, any>;
}

export class UpdatePayoutStatusDto {
  @IsEnum(PayoutStatus)
  status: PayoutStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
