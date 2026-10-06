"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Lock,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UploadCloud,
  UserCheck,
  XCircle,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { toast } from "@/lib/toast";
import { useMyKycQuery, useSubmitKycMutation } from "@/lib/kyc/kyc-hooks";
import { FileUploadDropzone } from "@/components/ui/FileUploadDropzone";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";

interface KycVerificationCardProps {
  user: AuthUser;
  className?: string;
}

export function KycVerificationCard({
  user,
  className = "",
}: KycVerificationCardProps) {
  const { data: kycData, isLoading, refetch } = useMyKycQuery();
  const submitKycMutation = useSubmitKycMutation();

  const [docType, setDocType] = useState<"NID" | "PASSPORT">("NID");
  const [nidNumber, setNidNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");

  const [frontMedia, setFrontMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [backMedia, setBackMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [selfieMedia, setSelfieMedia] = useState<{ id: string; originalName: string } | null>(null);

  const status = kycData?.status || "PENDING";
  const existingVerification = kycData?.verification;
  const isVerified = status === "VERIFIED";
  const isUnderReview = status === "UNDER_REVIEW" || (status === "PENDING" && Boolean(existingVerification?.hasFront));
  const isRejected = status === "REJECTED";
  const isUnsubmitted = !existingVerification || (!isVerified && !isUnderReview && !isRejected);

  // Role-specific compliance guidance
  const roleTitle =
    user.role === "INVESTOR"
      ? "Accredited Investor Compliance"
      : user.role === "ENTREPRENEUR"
        ? "Startup Founder & Corporate KYC"
        : "Advisory & Consultant Verification";

  const roleHelpText =
    user.role === "INVESTOR"
      ? "As an investor, regulations require verification before you can commit capital, access confidential pitch decks, or sign subscription agreements."
      : user.role === "ENTREPRENEUR"
        ? "As a founder/entrepreneur, institutional vetting is required before raising public campaigns and receiving investor funds."
        : "As a consultant, identity confirmation protects clients and unlocks client advisory engagement features.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontMedia) {
      toast.error("Please upload the front side of your document.");
      return;
    }
    if (!selfieMedia) {
      toast.error("Please upload a selfie photo for liveness confirmation.");
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        nidNumber: docType === "NID" ? nidNumber : undefined,
        passportNumber: docType === "PASSPORT" ? passportNumber : undefined,
        frontMediaId: frontMedia.id,
        backMediaId: backMedia?.id,
        selfieMediaId: selfieMedia.id,
      });

      toast.success(
        "Your KYC application has been safely uploaded and queued for admin review.",
        { title: "Verification Submitted" }
      );
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to submit KYC.";
      toast.error(msg, { title: "Submission Failed" });
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ${className}`}>
        <InvestraLoader label="Loading KYC status" description="Retrieving compliance records from secure vault..." />
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all ${className}`}>
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-black text-lg text-slate-800">
              {roleTitle}
            </h3>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified & Approved
              </span>
            )}
            {isUnderReview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Under Admin Review
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Action Required (Rejected)
              </span>
            )}
            {isUnsubmitted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                Not Submitted
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            {roleHelpText}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Private R2 Storage (Zero Public Access)</span>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="mt-6 rounded-2xl bg-[#182b45]/5 p-4 border border-[#263f6a]/20 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-[#182b45]">
            Cryptographically Encrypted & Isolated Cloudflare R2 Vault
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Your verification files (ID front, back, and selfie) are routed directly to our private storage bucket (<code className="text-[#064e3b] font-mono font-bold text-[10px]">investra-private</code>). Documents have <strong>no public URLs</strong> and can only be inspected via strictly temporary 15-minute presigned tokens by compliance admins.
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3.5 rounded-2xl border transition-all ${
          frontMedia
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              frontMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>1</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Govt ID Details</p>
              <p className="text-[10px] text-slate-500">NID / Passport & Front copy</p>
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${
          backMedia
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              backMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>2</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Back Side (Optional)</p>
              <p className="text-[10px] text-slate-500">Address / Smart card flip</p>
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${
          selfieMedia
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selfieMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>3</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Liveness Selfie</p>
              <p className="text-[10px] text-slate-500">Anti-fraud identity match</p>
            </div>
          </div>
        </div>
      </div>

      {/* State A: Verified */}
      {isVerified && (
        <div className="mt-6 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-black text-slate-800 text-base">Your Identity is Fully Verified</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your documents have been verified by Investra compliance. You now have full operational privileges across the platform.
          </p>
        </div>
      )}

      {/* State B: Under Review */}
      {isUnderReview && (
        <div className="mt-6 p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="font-heading font-black text-slate-800 text-base">Documents Submitted — Awaiting Review</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your verification documents have been received and are currently queued for inspection. Our compliance team will audit your submission within 24–48 business hours.
          </p>
        </div>
      )}

      {/* State C: Rejection Warning */}
      {isRejected && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-800">Verification Rejected by Administrator</p>
            <p className="text-rose-700 mt-0.5">
              Reason: {existingVerification?.rejectionReason || "Uploaded documents were blurry or incomplete."}
            </p>
            <p className="text-rose-600 text-[11px] mt-1">Please re-upload clear and authentic documents below.</p>
          </div>
        </div>
      )}

      {/* State D: Submission / Re-submission Form */}
      {(!isVerified && !isUnderReview) && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Identification Document Type</span>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
              >
                <option value="NID">National Identity Card (NID / Smart ID)</option>
                <option value="PASSPORT">International Passport</option>
              </select>
            </label>

            {docType === "NID" ? (
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">National ID (NID) Number</span>
                <input
                  type="text"
                  placeholder="e.g. 19942692582000123"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                />
              </label>
            ) : (
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Passport Number</span>
                <input
                  type="text"
                  placeholder="e.g. A12345678"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                />
              </label>
            )}
          </div>

          {/* Secure Direct-to-Private-R2 Dropzones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Front */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#064e3b]" />
                Document Front <span className="text-rose-500">*</span>
              </label>
              <FileUploadDropzone
                category="KYC_DOCUMENT"
                isPublic={false}
                label="Front Document Photo/PDF"
                description="JPEG, PNG or PDF (max 20MB)"
                currentMedia={frontMedia ? { id: frontMedia.id, fileName: frontMedia.originalName, status: "UPLOADED" } : undefined}
                onUploadSuccess={(media) => setFrontMedia({ id: media.id, originalName: media.originalName })}
                onRemove={() => setFrontMedia(null)}
              />
            </div>

            {/* Back (Optional for Passport, Recommended for NID) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#064e3b]" />
                Document Back (Optional)
              </label>
              <FileUploadDropzone
                category="KYC_DOCUMENT"
                isPublic={false}
                label="Back Document Photo/PDF"
                description="Required for NID smart cards"
                currentMedia={backMedia ? { id: backMedia.id, fileName: backMedia.originalName, status: "UPLOADED" } : undefined}
                onUploadSuccess={(media) => setBackMedia({ id: media.id, originalName: media.originalName })}
                onRemove={() => setBackMedia(null)}
              />
            </div>

            {/* Selfie / Liveness Check */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                Selfie / Liveness Photo <span className="text-rose-500">*</span>
              </label>
              <FileUploadDropzone
                category="KYC_DOCUMENT"
                isPublic={false}
                label="Selfie Holding Document"
                description="Clear photo of face and card"
                currentMedia={selfieMedia ? { id: selfieMedia.id, fileName: selfieMedia.originalName, status: "UPLOADED" } : undefined}
                onUploadSuccess={(media) => setSelfieMedia({ id: media.id, originalName: media.originalName })}
                onRemove={() => setSelfieMedia(null)}
              />
            </div>
          </div>

          {/* Submission CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Administrative verification takes 24–48 business hours.
            </p>

            <button
              type="submit"
              disabled={submitKycMutation.isPending || !frontMedia || !selfieMedia}
              className="px-6 py-3 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-60 text-white font-heading font-extrabold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              {submitKycMutation.isPending ? (
                <InvestraInlineLoader label="Encrypting & submitting..." />
              ) : (
                <>
                  <Shield className="w-4 h-4 text-emerald-300" />
                  <span>Submit for Compliance Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
