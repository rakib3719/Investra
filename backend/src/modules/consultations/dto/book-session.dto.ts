import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class BookSessionDto {
  @IsUUID()
  @IsNotEmpty()
  slotId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  topic: string;

  @IsOptional()
  @IsString()
  clientNotes?: string;

  @IsOptional()
  @IsString()
  meetingPlatform?: string;
}

export class UpdateMeetingLinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  meetingLink: string;

  @IsOptional()
  @IsString()
  meetingPlatform?: string;
}

export class UpdateConsultantMeetingPreferenceDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  defaultMeetingLink?: string;
}
