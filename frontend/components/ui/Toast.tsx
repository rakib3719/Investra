"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { toast, type ToastItem, type ToastType } from "@/lib/toast";

const typeStyles: Record<
  ToastType,
  {
    icon: typeof AlertCircle;
    iconColor: string;
    iconBg: string;
    borderColor: string;
    progressColor: string;
    badgeText: string;
    badgeBg: string;
  }
> = {
  error: {
    icon: AlertCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50 border border-red-200/60",
    borderColor: "border-red-200/80 shadow-red-500/5",
    progressColor: "bg-red-600",
    badgeText: "text-red-700",
    badgeBg: "bg-red-100/60",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border border-emerald-200/60",
    borderColor: "border-emerald-200/80 shadow-emerald-500/5",
    progressColor: "bg-emerald-600",
    badgeText: "text-emerald-700",
    badgeBg: "bg-emerald-100/60",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border border-amber-200/60",
    borderColor: "border-amber-200/80 shadow-amber-500/5",
    progressColor: "bg-amber-500",
    badgeText: "text-amber-700",
    badgeBg: "bg-amber-100/60",
  },
  info: {
    icon: Info,
    iconColor: "text-slate-700",
    iconBg: "bg-slate-100 border border-slate-200/80",
    borderColor: "border-slate-200 shadow-slate-900/5",
    progressColor: "bg-[#064e3b]",
    badgeText: "text-slate-700",
    badgeBg: "bg-slate-100",
  },
};

function ToastCard({ item }: { item: ToastItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(item.duration || 5000);
  const [isExiting, setIsExiting] = useState(false);
  const style = typeStyles[item.type] || typeStyles.info;
  const Icon = style.icon;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDuration = item.duration || 5000;

  const handleDismiss = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      toast.dismiss(item.id);
    }, 200);
  }, [item.id]);

  useEffect(() => {
    if (totalDuration <= 0) return;

    if (!isHovered) {
      const interval = 50;

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          const updated = prev - interval;
          if (updated <= 0) {
            clearInterval(timerRef.current!);
            handleDismiss();
            return 0;
          }
          return updated;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, totalDuration, handleDismiss]);

  const progressPercent = totalDuration > 0 ? (remainingTime / totalDuration) * 100 : 0;

  return (
    <div
      role={item.type === "error" ? "alert" : "status"}
      aria-live={item.type === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${
        style.borderColor
      } ${
        isExiting
          ? "translate-x-12 opacity-0 scale-95"
          : "translate-x-0 opacity-100 scale-100 animate-in fade-in slide-in-from-top-3"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-sm font-bold tracking-tight text-slate-800">
              {item.title || (item.type === "error" ? "Error Occurred" : "Notification")}
            </h4>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badgeBg} ${style.badgeText}`}
            >
              {item.type}
            </span>
          </div>

          <p className="mt-1 text-xs leading-relaxed text-slate-600 break-words font-medium">
            {item.message}
          </p>

          {item.action && (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick();
                handleDismiss();
              }}
              className="mt-2.5 inline-flex items-center text-xs font-bold text-[#064e3b] hover:underline cursor-pointer"
            >
              {item.action.label}
            </button>
          )}
        </div>

        {/* Dismiss / Cross Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close notification"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar for Auto-dismiss */}
      {totalDuration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div
            className={`h-full transition-all duration-75 ease-linear ${style.progressColor}`}
            style={{ width: `${Math.max(0, progressPercent)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe((updated) => {
      setToasts(updated);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed top-5 right-5 z-[99999] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:max-w-md sm:px-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function useToast() {
  return {
    toast,
    dismiss: (id: string) => toast.dismiss(id),
    clearAll: () => toast.clearAll(),
  };
}
