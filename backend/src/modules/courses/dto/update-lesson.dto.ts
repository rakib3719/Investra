import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  videoProvider?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isPreview?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsOptional()
  resources?: any;
}
