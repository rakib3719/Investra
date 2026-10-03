"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { toast } from "@/lib/toast";

interface KycVerificationCardProps {
  user: AuthUser;
  className?: string;
}

export function KycVerificationCard({
  user,
  className = "",
}: KycVerificationCardProps) {
  const [docType, setDocType] = useState<"NID" | "PASSPORT" | "DRIVING_LICENSE">("NID");
  const [idNumber, setIdNumber] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("Bangladesh");

  const handleSubmitMock = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(
      "Document upload pipeline is configured! KYC submission flow is ready for review.",
      { title: "KYC Compliance Ready" },
    );
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all ${className}`}
    >
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-lg text-slate-800">
              Identity & KYC Verification
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Verification Pending
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            Required by capital market regulations to participate in campaign investments, founder fundraising, and payout distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Private R2 Vault</span>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 p-4 border border-emerald-100 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-800">
            Encrypted & Isolated in Cloudflare R2 Private Bucket
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Your verification files (NID, passport, and selfie) are protected by Cloudflare R2 Private Storage (<code className="text-emerald-800 font-mono text-[10px]">investra-private</code>). They are never publicly accessible and can only be inspected by authorized administrators via temporary 15-minute presigned tokens.
          </p>
        </div>
      </div>

      {/* Form & Upload Preview Grid */}
      <form onSubmit={handleSubmitMock} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1 block">
            <span className="text-xs font-bold text-slate-700">Document Type</span>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
            >
              <option value="NID">National Identity Card (NID / Smart Card)</option>
              <option value="PASSPORT">International Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
            </select>
          </label>

          <label className="space-y-1 block">
            <span className="text-xs font-bold text-slate-700">ID / Document Number</span>
            <input
              type="text"
              placeholder="e.g. 19942692582000123"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-xs font-bold text-slate-700">Issuing Country</span>
            <input
              type="text"
              value={issuingCountry}
              onChange={(e) => setIssuingCountry(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
            />
          </label>
        </div>

        {/* Document Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Front */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600 transition-all cursor-pointer space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 grid place-items-center mx-auto text-emerald-700">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Document Front</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Clear photo of the front side showing photo and NID number.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1">
              JPG, PNG or PDF (Max 20MB)
            </span>
          </div>

          {/* Back */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600 transition-all cursor-pointer space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 grid place-items-center mx-auto text-emerald-700">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Document Back</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Back side of the NID or official endorsement page.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1">
              JPG, PNG or PDF (Max 20MB)
            </span>
          </div>

          {/* Selfie */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600 transition-all cursor-pointer space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 grid place-items-center mx-auto text-emerald-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Liveness / Selfie</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Clear selfie holding your document next to your face.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-1">
              Live Photo (Max 20MB)
            </span>
          </div>
        </div>

        {/* Review Footnote */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Administrative verification is reviewed within 24-48 business hours.
          </p>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] text-white font-heading font-bold text-xs transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            Submit for Admin Verification
          </button>
        </div>
      </form>
    </div>
  );
}
