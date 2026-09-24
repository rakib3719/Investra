import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { MediaCategory } from '../../../common/enums/media-category.enum';

export class PresignUploadDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;

  @IsInt()
  @IsPositive()
  fileSize!: number;

  @IsEnum(MediaCategory, {
    message:
      'category must be a valid MediaCategory (AVATAR, CAMPAIGN_COVER, CAMPAIGN_GALLERY, PITCH_DECK, CONFIDENTIAL_PITCH_DECK, FINANCIAL_REPORT, KYC_DOCUMENT, VIDEO)',
  })
  category!: MediaCategory;
}
