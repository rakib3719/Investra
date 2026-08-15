import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { BusinessStage } from '../../../common/enums/business-stage.enum';
import { ConsultantLevel } from '../../../common/enums/consultant-level.enum';
import { Gender } from '../../../common/enums/gender.enum';
import { ProfessionalType } from '../../../common/enums/professional-type.enum';

export class UpdateProfileDto {
  // Shared account profile
  @IsOptional()
  @IsString()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  image?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsEnum(ProfessionalType)
  professionalType?: ProfessionalType;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  website?: string;

  // Role profile fields
  @IsOptional()
  @IsString()
  @MaxLength(255)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  designation?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @IsOptional()
  @IsBoolean()
  profileVisibility?: boolean;

  // Investor-only fields
  @IsOptional()
  @IsNumber()
  @Min(0)
  investmentRangeMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  investmentRangeMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredCurrency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessIndustry?: string;

  @IsOptional()
  @IsBoolean()
  accreditedInvestor?: boolean;

  @IsOptional()
  @IsEnum(BusinessStage)
  preferredStage?: BusinessStage;

  // Entrepreneur-only fields
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid LinkedIn URL' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid Facebook URL' })
  facebook?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid X/Twitter URL' })
  twitter?: string;

  // Consultant-only fields
  @IsOptional()
  @IsString()
  @MaxLength(255)
  specialization?: string;

  @IsOptional()
  @IsEnum(ConsultantLevel)
  consultantLevel?: ConsultantLevel;

  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sessionFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  workshopFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  courseFee?: number;
}
