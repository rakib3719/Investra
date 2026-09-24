import React from "react";
import { AlertCircle } from "lucide-react";

interface InputErrorProps {
  message?: string | null;
  id?: string;
  className?: string;
}

export function InputError({ message, id, className = "" }: InputErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      className={`flex items-center gap-1.5 pt-1 text-xs font-semibold text-red-600 transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${className}`}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

/**
 * Helper to generate input border and ring styles based on error state
 */
export function getFieldStateClass(hasError: boolean | unknown, baseClasses = ""): string {
  if (hasError) {
    return `border-red-400 bg-red-50/25 text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 placeholder:text-red-300 ${baseClasses}`;
  }
  return `border-slate-200 bg-slate-50 text-slate-900 focus:border-[#064e3b] focus:ring-2 focus:ring-[#064e3b]/10 placeholder:text-slate-400 ${baseClasses}`;
}
