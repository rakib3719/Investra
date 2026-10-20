import { MediaAccessType } from '../../common/enums/media-access-type.enum';
import { MediaCategory } from '../../common/enums/media-category.enum';

export interface CategoryPolicy {
  accessType: MediaAccessType;
  targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME' | 'R2_PRIVATE_BUCKET_NAME';
  maxSizeBytes: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  keyPrefix: string;
}

export const MEDIA_POLICY: Record<MediaCategory, CategoryPolicy> = {
  AVATAR: {
    accessType: MediaAccessType.PUBLIC,
    targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME',
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    keyPrefix: 'users',
  },
  CAMPAIGN_COVER: {
    accessType: MediaAccessType.PUBLIC,
    targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME',
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    keyPrefix: 'campaigns',
  },
  CAMPAIGN_GALLERY: {
    accessType: MediaAccessType.PUBLIC,
    targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME',
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    keyPrefix: 'campaigns',
  },
  PITCH_DECK: {
    accessType: MediaAccessType.PUBLIC,
    targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME',
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    allowedExtensions: ['pdf', 'ppt', 'pptx'],
    keyPrefix: 'campaigns',
  },
  CONFIDENTIAL_PITCH_DECK: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    allowedExtensions: ['pdf', 'ppt', 'pptx'],
    keyPrefix: 'campaigns',
  },
  FINANCIAL_REPORT: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    allowedExtensions: ['pdf', 'xls', 'xlsx'],
    keyPrefix: 'campaigns',
  },
  KYC_DOCUMENT: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 20 * 1024 * 1024, // 20 MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    keyPrefix: 'kyc',
  },
  VIDEO: {
    accessType: MediaAccessType.PUBLIC,
    targetBucketEnv: 'R2_PUBLIC_BUCKET_NAME',
    maxSizeBytes: 100 * 1024 * 1024, // 100 MB
    allowedMimeTypes: ['video/mp4', 'video/webm'],
    allowedExtensions: ['mp4', 'webm'],
    keyPrefix: 'campaigns',
  },
  PORTFOLIO_CERTIFICATE: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 20 * 1024 * 1024, // 20 MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
    keyPrefix: 'portfolio/certificates',
  },
  PORTFOLIO_DOCUMENT: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
    keyPrefix: 'portfolio/documents',
  },
  PORTFOLIO_VIDEO: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 150 * 1024 * 1024, // 150 MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['mp4', 'webm', 'mov'],
    keyPrefix: 'portfolio/videos',
  },
  CHAT_ATTACHMENT: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'zip', 'docx', 'doc'],
    keyPrefix: 'chat/attachments',
  },
  TERM_SHEET_DOCUMENT: {
    accessType: MediaAccessType.PRIVATE,
    targetBucketEnv: 'R2_PRIVATE_BUCKET_NAME',
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ],
    allowedExtensions: ['pdf', 'docx', 'doc'],
    keyPrefix: 'commitments/termsheets',
  },
};

/**
 * Validates metadata against the centralized policy for a given category.
 * Throws a formatted error message if validation fails.
 */
export function validateMediaPolicy(
  category: MediaCategory,
  mimeType: string,
  fileSize: number,
  originalName: string,
): { policy: CategoryPolicy; extension: string } {
  const policy = MEDIA_POLICY[category];
  if (!policy) {
    throw new Error(`Unsupported media category: ${category}`);
  }

  // Validate File Size
  if (fileSize > policy.maxSizeBytes) {
    const maxMb = (policy.maxSizeBytes / (1024 * 1024)).toFixed(0);
    throw new Error(
      `File size exceeds maximum limit of ${maxMb}MB for ${category}.`,
    );
  }

  // Validate MIME Type
  const normalizedMime = mimeType.toLowerCase().trim();
  if (!policy.allowedMimeTypes.includes(normalizedMime)) {
    throw new Error(
      `Unsupported MIME type "${mimeType}". Allowed types: ${policy.allowedMimeTypes.join(', ')}`,
    );
  }

  // Validate Extension
  const extensionMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';
  if (!extension || !policy.allowedExtensions.includes(extension)) {
    throw new Error(
      `Invalid or disallowed file extension ".${extension}". Allowed extensions: ${policy.allowedExtensions.join(', ')}`,
    );
  }

  return { policy, extension };
}
