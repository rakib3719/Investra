import { IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmUploadDto {
  @IsUUID('4', { message: 'mediaId must be a valid UUID' })
  @IsNotEmpty()
  mediaId!: string;
}
