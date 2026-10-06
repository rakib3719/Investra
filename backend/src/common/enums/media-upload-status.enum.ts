export const MediaUploadStatus = {
  PENDING_UPLOAD: 'PENDING_UPLOAD',
  UPLOADED: 'UPLOADED',
  ACTIVE: 'ACTIVE',
  DELETE_PENDING: 'DELETE_PENDING',
  DELETED: 'DELETED',
} as const;

export type MediaUploadStatus = (typeof MediaUploadStatus)[keyof typeof MediaUploadStatus];
