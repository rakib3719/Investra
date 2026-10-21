"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  MessageSquare,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionName?: string;
  description?: string;
  targetRole?: "investor" | "entrepreneur" | "consultant";
}

export function SubscriptionRequiredModal({
  isOpen,
  onClose,
  title = "Active Subscription Required",
  actionName = "connect with venture founders",
  description,
  targetRole,
}: SubscriptionRequiredModalProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const role = targetRole || (user?.role?.toLowerCase() as "investor" | "entrepreneur" | "consultant") || "investor";
  const subscriptionPath = `/subscription?role=${role}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white grid place-items-center shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-heading">
              <Sparkles className="w-3 h-3" /> Subscriber Exclusive
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
            {description ||
              `An active ${role.toUpperCase()} subscription is required to ${actionName}, inspect due diligence vaults, and engage in deal rooms.`}
          </p>
        </div>

        {/* Included Privileges */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
            Unlocked with Pro Subscription:
          </p>
          <ul className="space-y-2 text-xs text-slate-600 font-body">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Direct 2-Way Messaging:</strong> Connect directly with founders and discuss allocation terms in private deal rooms.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Confidential Pitch Decks:</strong> Download un-redacted pitch materials, cap tables, and financial projections.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Due Diligence Vault & Matrix:</strong> Compare opportunities side-by-side with institutional-grade analytics.</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/3 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-heading font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Maybe Later
          </button>
          <Link
            href={subscriptionPath}
            onClick={onClose}
            className="w-full sm:w-2/3 py-3 rounded-xl bg-[#064E3B] hover:bg-[#053D2E] text-white font-heading font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-center"
          >
            <span>View Plans & Subscribe</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
