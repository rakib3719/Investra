import { MediaAccessType } from '../enums/media-access-type.enum';
import { MediaCategory } from '../enums/media-category.enum';
import { MediaUploadStatus } from '../enums/media-upload-status.enum';

export interface MediaFileRecord {
  id: string;
  key: string;
  bucket: string;
  originalName: string;
  mimeType: string;
  sizeBytes: bigint;
  accessType: MediaAccessType;
  category: MediaCategory;
  status: MediaUploadStatus;
  uploadedById: string;
  activatedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
