import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, Matches } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'slotDate must be in YYYY-MM-DD format',
  })
  slotDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in 24-hour HH:mm format (e.g. 14:00)',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in 24-hour HH:mm format (e.g. 15:00)',
  })
  endTime: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;
}

export class BulkCreateSlotsDto {
  slots: CreateSlotDto[];
}
