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
      className={`relative flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition-all ${className}`}
    >
      <div className="flex items-center space-x-3.5 overflow-hidden">
        {/* Thumbnail or Icon */}
        {isImage && url ? (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={fileName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : isPdf ? (
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-600">
            <FileText className="w-6 h-6" />
          </div>
        ) : isVideo ? (
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0 text-purple-600">
            <Film className="w-6 h-6" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600">
            <FileText className="w-6 h-6" />
          </div>
        )}

        {/* File Information */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <p className="text-xs font-bold text-slate-800 truncate">
              {fileName}
            </p>
            {status === 'ACTIVE' && (
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                Active
              </span>
            )}
            {status === 'UPLOADED' && (
              <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 mr-1 text-amber-600" />
                Ready to Save
              </span>
            )}
          </div>
          {formattedSize && (
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{formattedSize}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1.5 flex-shrink-0">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
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
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
