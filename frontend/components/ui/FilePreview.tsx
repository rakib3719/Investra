'use client';

import React from 'react';
import {
  FileText,
  Film,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface FilePreviewProps {
  url?: string | null;
  fileName?: string;
  fileSize?: string | number;
  mimeType?: string;
  status?: 'PENDING_UPLOAD' | 'UPLOADED' | 'ACTIVE' | 'DELETE_PENDING' | 'DELETED';
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  url,
  fileName = 'Attached File',
  fileSize,
  mimeType = '',
  status,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const isImage =
    mimeType.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName) ||
    /\.(jpg|jpeg|png|webp|gif|svg)/i.test(url || '');

  const isPdf =
    mimeType === 'application/pdf' ||
    /\.pdf$/i.test(fileName) ||
    /\.pdf/i.test(url || '');

  const isVideo =
    mimeType.startsWith('video/') ||
    /\.(mp4|webm|mov)$/i.test(fileName) ||
    /\.(mp4|webm|mov)/i.test(url || '');

  const formattedSize =
    typeof fileSize === 'number'
      ? fileSize > 1024 * 1024
        ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
        : `${(fileSize / 1024).toFixed(0)} KB`
      : fileSize;

  return (
    <div
      className={`relative flex items-center justify-between p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all ${className}`}
    >
      <div className="flex items-center space-x-3.5 overflow-hidden">
        {/* Thumbnail or Icon */}
        {isImage && url ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={fileName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : isPdf ? (
          <div className="w-12 h-12 rounded-lg bg-red-950/40 border border-red-800/40 flex items-center justify-center flex-shrink-0 text-red-400">
            <FileText className="w-6 h-6" />
          </div>
        ) : isVideo ? (
          <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center flex-shrink-0 text-purple-400">
            <Film className="w-6 h-6" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0 text-neutral-400">
            <FileText className="w-6 h-6" />
          </div>
        )}

        {/* File Information */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-neutral-200 truncate">
              {fileName}
            </p>
            {status === 'ACTIVE' && (
              <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-1.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
              </span>
            )}
            {status === 'UPLOADED' && (
              <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.5 rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                Ready to Save
              </span>
            )}
          </div>
          {formattedSize && (
            <p className="text-xs text-neutral-400 mt-0.5">{formattedSize}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="View or Download"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
