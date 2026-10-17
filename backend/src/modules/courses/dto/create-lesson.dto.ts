import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;

  @IsString()
  @IsOptional()
  videoProvider?: string = 'HTML5';

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  durationMinutes?: number = 0;

  @IsBoolean()
  @IsOptional()
  isPreview?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;

  @IsOptional()
  resources?: any;
}
