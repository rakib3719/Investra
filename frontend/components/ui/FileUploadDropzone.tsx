'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import {
  uploadMediaPipeline,
  deleteMedia,
  ConfirmedMediaResponse,
  MediaCategory,
} from '@/lib/api/media';
import { toast } from '@/lib/toast';
import { FilePreview } from './FilePreview';

interface FileUploadDropzoneProps {
  category: MediaCategory;
  onUploadSuccess: (media: ConfirmedMediaResponse) => void;
  onRemove?: () => void;
  currentMedia?: {
    id?: string;
    url?: string | null;
    fileName?: string;
    status?: 'PENDING_UPLOAD' | 'UPLOADED' | 'ACTIVE' | 'DELETE_PENDING' | 'DELETED';
    mimeType?: string;
  };
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
  description?: string;
  className?: string;
}

const CATEGORY_LIMITS: Record<MediaCategory, { maxBytes: number; label: string; accept: string }> = {
  AVATAR: {
    maxBytes: 5 * 1024 * 1024,
    label: 'Upload Avatar (JPEG, PNG, WebP up to 5MB)',
    accept: 'image/jpeg,image/png,image/webp',
  },
  CAMPAIGN_COVER: {
    maxBytes: 10 * 1024 * 1024,
    label: 'Upload Campaign Cover (JPEG, PNG, WebP up to 10MB)',
    accept: 'image/jpeg,image/png,image/webp',
  },
  CAMPAIGN_GALLERY: {
    maxBytes: 10 * 1024 * 1024,
    label: 'Upload Gallery Image (JPEG, PNG, WebP up to 10MB)',
    accept: 'image/jpeg,image/png,image/webp',
  },
  PITCH_DECK: {
    maxBytes: 50 * 1024 * 1024,
    label: 'Upload Pitch Deck (PDF up to 50MB)',
    accept: 'application/pdf',
  },
  CONFIDENTIAL_PITCH_DECK: {
    maxBytes: 50 * 1024 * 1024,
    label: 'Upload Confidential Pitch Deck (Private PDF up to 50MB)',
    accept: 'application/pdf',
  },
  FINANCIAL_REPORT: {
    maxBytes: 50 * 1024 * 1024,
    label: 'Upload Financial Report (PDF, Excel up to 50MB)',
    accept: 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  KYC_DOCUMENT: {
    maxBytes: 20 * 1024 * 1024,
    label: 'Upload Identity / KYC Document (PDF, JPEG, PNG up to 20MB)',
    accept: 'application/pdf,image/jpeg,image/png',
  },
  VIDEO: {
    maxBytes: 100 * 1024 * 1024,
    label: 'Upload Short Video (MP4, WebM up to 100MB)',
    accept: 'video/mp4,video/webm',
  },
};

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  category,
  onUploadSuccess,
  onRemove,
  currentMedia,
  accept,
  maxSizeBytes,
  label,
  description,
  className = '',
}) => {
  const categoryConfig = CATEGORY_LIMITS[category] || {
    maxBytes: 10 * 1024 * 1024,
    label: 'Upload File',
    accept: '*/*',
  };

  const effectiveMaxBytes = maxSizeBytes || categoryConfig.maxBytes;
  const effectiveAccept = accept || categoryConfig.accept;
  const effectiveLabel = label || categoryConfig.label;

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedMedia, setUploadedMedia] = useState<ConfirmedMediaResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > effectiveMaxBytes) {
      const maxMb = (effectiveMaxBytes / (1024 * 1024)).toFixed(0);
      return `File exceeds the maximum size limit of ${maxMb}MB.`;
    }

    if (effectiveAccept !== '*/*') {
      const acceptedTypes = effectiveAccept.split(',').map((t) => t.trim().toLowerCase());
      const fileType = (file.type || '').toLowerCase();
      const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '';

      const isAllowed = acceptedTypes.some((type) => {
        if (type.startsWith('.')) return ext === type;
        if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
        return fileType === type;
      });

      if (!isAllowed) {
        return `Unsupported file format. Accepted formats: ${effectiveAccept}`;
      }
    }

    return null;
  };

  const processUpload = async (file: File) => {
    setErrorMsg(null);
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      toast.error(validationError, { title: 'Upload Rejected' });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const confirmed = await uploadMediaPipeline(
        file,
        category,
        (pct) => setProgress(pct),
        abortControllerRef.current.signal,
      );

      setUploadedMedia(confirmed);
      onUploadSuccess(confirmed);
      toast.success(`${file.name} uploaded successfully.`, { title: 'Upload Complete' });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.info('File upload was halted.', { title: 'Upload Cancelled' });
      } else {
        const msg = err.response?.data?.message || err.message || 'Direct storage upload failed';
        setErrorMsg(msg);
        toast.error(msg, { title: 'Upload Failed' });
      }
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRemoveMedia = async () => {
    // If a temporary media was uploaded in this session, call backend delete
    if (uploadedMedia?.id) {
      try {
        await deleteMedia(uploadedMedia.id);
      } catch (e) {
        console.warn('Could not clean up temporary media on server', e);
      }
    }

    setUploadedMedia(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  // Check if we have an active or newly uploaded media to preview
  const displayMedia = uploadedMedia || currentMedia;

  if (displayMedia && (displayMedia.url || (displayMedia as ConfirmedMediaResponse).id)) {
    return (
      <div className={`space-y-2 ${className}`}>
        <FilePreview
          url={displayMedia.url}
          fileName={(displayMedia as any).originalName || (displayMedia as any).fileName || 'Uploaded Media'}
          fileSize={(displayMedia as any).sizeBytes}
          mimeType={(displayMedia as any).mimeType}
          status={(displayMedia as any).status || 'ACTIVE'}
          onRemove={handleRemoveMedia}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium cursor-pointer"
          >
            Replace with another file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={effectiveAccept}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-brand-500 bg-brand-950/20'
            : isUploading
              ? 'border-neutral-700 bg-neutral-900/60 cursor-default'
              : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={effectiveAccept}
          onChange={handleFileInputChange}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-center space-x-2 text-brand-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-semibold">Direct Uploading to Cloudflare R2...</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-500 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>{progress}% Completed</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelUpload();
                }}
                className="text-red-400 hover:text-red-300 font-medium inline-flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Upload</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-3">
            <div className="mx-auto w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center text-neutral-300">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="text-sm font-medium text-neutral-200">
              {effectiveLabel}
            </div>

            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {description || 'Drag and drop your file here, or click to browse from device.'}
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-2.5 flex items-center space-x-2 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
