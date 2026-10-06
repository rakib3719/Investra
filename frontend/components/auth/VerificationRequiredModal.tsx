"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, ArrowRight, X, Lock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMyKycQuery } from "@/lib/kyc/kyc-hooks";

interface VerificationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actionName?: string;
  description?: string;
}

export function VerificationRequiredModal({
  isOpen,
  onClose,
  title = "Identity Verification Required",
  actionName = "this action",
  description,
}: VerificationRequiredModalProps) {
  const { user } = useAuth();
  const { data: kycData } = useMyKycQuery();

  if (!isOpen) return null;

  const role = user?.role?.toLowerCase() || "investor";
  const kycPath = `/dashboard/${role}/kyc`;
  const kycStatus = kycData?.status;
  const isUnderReview =
    kycStatus === "UNDER_REVIEW" ||
    (kycStatus === "PENDING" && Boolean(kycData?.verification?.hasFront));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 grid place-items-center">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {description ||
              `To comply with investment platform regulations and protect our community, you must verify your identity before initiating ${actionName}.`}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Verification is private, encrypted with 256-bit AES in our Cloudflare R2 vault, and audited by compliance officers.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <Link
            href={kycPath}
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] text-white font-heading font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span>{isUnderReview ? "Check Status" : "Complete KYC"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
