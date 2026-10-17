import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { CourseLevel, CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  tagline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel = CourseLevel.ALL_LEVELS;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number = 0;

  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus = CourseStatus.DRAFT;
}
