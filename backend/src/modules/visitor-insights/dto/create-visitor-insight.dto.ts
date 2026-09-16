import {
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVisitorInsightDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  anonymousId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pagePath: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  language?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  timezone?: string;

  @IsInt()
  @Min(0)
  @Max(20_000)
  @IsOptional()
  screenWidth?: number;

  @IsInt()
  @Min(0)
  @Max(20_000)
  @IsOptional()
  screenHeight?: number;

  @IsInt()
  @Min(0)
  @Max(20_000)
  @IsOptional()
  viewportWidth?: number;

  @IsInt()
  @Min(0)
  @Max(20_000)
  @IsOptional()
  viewportHeight?: number;

  @IsString()
  @IsOptional()
  @MaxLength(2_000)
  referrer?: string;

  @IsBoolean()
  locationConsent: boolean;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsInt()
  @Min(0)
  @Max(100_000)
  @IsOptional()
  locationAccuracy?: number;
}
