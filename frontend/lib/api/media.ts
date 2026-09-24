import { apiClient } from './client';

export type MediaCategory =
  | 'AVATAR'
  | 'CAMPAIGN_COVER'
  | 'CAMPAIGN_GALLERY'
  | 'PITCH_DECK'
  | 'CONFIDENTIAL_PITCH_DECK'
  | 'FINANCIAL_REPORT'
  | 'KYC_DOCUMENT'
  | 'VIDEO';

export interface PresignedUploadResponse {
  mediaId: string;
  uploadUrl: string;
  key: string;
  bucket: string;
  accessType: 'PUBLIC' | 'PRIVATE';
  category: MediaCategory;
  expiresInSeconds: number;
}

export interface ConfirmedMediaResponse {
  id: string;
  key: string;
  bucket: string;
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  accessType: 'PUBLIC' | 'PRIVATE';
  category: MediaCategory;
  status: 'UPLOADED' | 'ACTIVE';
  url: string | null;
  uploadedById: string;
  createdAt: string;
  activatedAt: string | null;
}

export interface SignedUrlResponse {
  url: string;
  isPublic: boolean;
  expiresInSeconds?: number;
  mimeType: string;
  originalName: string;
}

/**
 * 1. Request presigned PUT URL from NestJS backend
 */
export async function requestPresignedUpload(
  file: File,
  category: MediaCategory,
): Promise<PresignedUploadResponse> {
  const response = await apiClient.post<PresignedUploadResponse>(
    '/api/v1/media/presign-upload',
    {
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: file.size,
      category,
    },
  );
  return response.data;
}

/**
 * 2. Upload file directly from browser to Cloudflare R2 using XMLHttpRequest
 * to ensure 100% reliable upload progress events across all browsers.
 */
export function directUploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (progressPercentage: number) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (abortSignal) {
      if (abortSignal.aborted) {
        return reject(new DOMException('Upload aborted by user', 'AbortError'));
      }
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new DOMException('Upload aborted by user', 'AbortError'));
      });
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.min(
          99,
          Math.max(0, Math.round((event.loaded / event.total) * 100)),
        );
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(
          new Error(`Direct storage upload failed with HTTP status ${xhr.status}`),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during direct storage upload. Please check connection and CORS.'));
    };

    xhr.onabort = () => {
      reject(new DOMException('Upload aborted by user', 'AbortError'));
    };

    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.send(file);
  });
}

/**
 * 3. Confirm upload with NestJS backend to verify via HeadObject
 */
export async function confirmUpload(
  mediaId: string,
): Promise<ConfirmedMediaResponse> {
  const response = await apiClient.post<ConfirmedMediaResponse>(
    '/api/v1/media/confirm-upload',
    { mediaId },
  );
  return response.data;
}

/**
 * 4. Explicitly delete media (e.g. unattached UPLOADED file or removed avatar)
 */
export async function deleteMedia(
  mediaId: string,
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/api/v1/media/${mediaId}`,
  );
  return response.data;
}

/**
 * 5. Retrieve signed viewing URL for a private document or public CDN URL
 */
export async function getMediaAccessUrl(
  mediaId: string,
): Promise<SignedUrlResponse> {
  const response = await apiClient.get<SignedUrlResponse>(
    `/api/v1/media/${mediaId}/signed-url`,
  );
  return response.data;
}

/**
 * Convenient pipeline runner: Presign -> Direct Upload -> Confirm
 */
export async function uploadMediaPipeline(
  file: File,
  category: MediaCategory,
  onProgress?: (progressPercentage: number) => void,
  abortSignal?: AbortSignal,
): Promise<ConfirmedMediaResponse> {
  // Step 1: Presign
  const presignData = await requestPresignedUpload(file, category);

  // Step 2: Direct browser PUT to R2
  await directUploadToR2(presignData.uploadUrl, file, onProgress, abortSignal);

  // Step 3: Confirm with backend
  return await confirmUpload(presignData.mediaId);
}
