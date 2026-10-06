"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Landmark,
  Lock,
  Receipt,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
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

  // Wizard Step (1: ID & Selfie, 2: Address & Tax, 3: Role-Specific)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Primary Identification
  const [docType, setDocType] = useState<"NID" | "PASSPORT">("NID");
  const [nidNumber, setNidNumber] = useState("");
  const [passportNumber, setPassportNumber] = useState("");

  // Regulatory & Tax Compliance
  const [taxIdNumber, setTaxIdNumber] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");

  // Investment Suitability & AML/CFT Source of Funds
  const [sourceOfFunds, setSourceOfFunds] = useState("SALARY");
  const [annualIncomeRange, setAnnualIncomeRange] = useState("$50k - $100k");
  const [netWorthRange, setNetWorthRange] = useState("$250k - $1M");
  const [pepDeclaration, setPepDeclaration] = useState(false);

  // Private Document Files
  const [frontMedia, setFrontMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [backMedia, setBackMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [selfieMedia, setSelfieMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [poaMedia, setPoaMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [proofOfFundsMedia, setProofOfFundsMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [tradeLicenseMedia, setTradeLicenseMedia] = useState<{ id: string; originalName: string } | null>(null);
  const [tinCertificateMedia, setTinCertificateMedia] = useState<{ id: string; originalName: string } | null>(null);

  const status = kycData?.status || "PENDING";
  const existingVerification = kycData?.verification;
  const isVerified = status === "VERIFIED";
  const isUnderReview = status === "UNDER_REVIEW" || (status === "PENDING" && Boolean(existingVerification?.hasFront));
  const isRejected = status === "REJECTED";
  const isUnsubmitted = !existingVerification || (!isVerified && !isUnderReview && !isRejected);

  // Role title & subtitle
  const roleTitle =
    user.role === "INVESTOR"
      ? "Investor Verification & Accreditation"
      : user.role === "ENTREPRENEUR"
        ? "Founder & Business Verification (KYB)"
        : "Consultant Professional Verification";

  const roleSubtitle =
    user.role === "INVESTOR"
      ? "Verify your identity and investor credentials to participate in private deal rooms and commitments."
      : user.role === "ENTREPRENEUR"
        ? "Verify your identity and company documentation to publish investment campaigns."
        : "Verify your background and credentials to unlock paid corporate advisory mandates.";

  // Step 1 Validation
  const isStep1Valid = Boolean(
    (docType === "NID" ? nidNumber.trim() : passportNumber.trim()) &&
      frontMedia &&
      selfieMedia
  );

  // Step 2 Validation
  const isStep2Valid = Boolean(residentialAddress.trim());

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!frontMedia) {
        toast.error("Please upload the front side of your Government ID.");
        return;
      }
      if (!selfieMedia) {
        toast.error("Please upload a selfie photo for liveness confirmation.");
        return;
      }
      if (docType === "NID" && !nidNumber.trim()) {
        toast.error("Please enter your National ID Number.");
        return;
      }
      if (docType === "PASSPORT" && !passportNumber.trim()) {
        toast.error("Please enter your Passport Number.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!residentialAddress.trim()) {
        toast.error("Please provide your verified residential address.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontMedia || !selfieMedia) {
      toast.error("Government ID Front and Selfie are required.");
      return;
    }
    if (!residentialAddress.trim()) {
      toast.error("Please provide your residential address.");
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        nidNumber: docType === "NID" ? nidNumber : undefined,
        passportNumber: docType === "PASSPORT" ? passportNumber : undefined,
        taxIdNumber: taxIdNumber.trim() || undefined,
        residentialAddress: residentialAddress.trim() || undefined,
        sourceOfFunds,
        annualIncomeRange,
        netWorthRange,
        pepDeclaration,
        tradeLicenseNumber: tradeLicenseNumber.trim() || undefined,
        frontMediaId: frontMedia.id,
        backMediaId: backMedia?.id,
        selfieMediaId: selfieMedia.id,
        poaMediaId: poaMedia?.id,
        proofOfFundsMediaId: proofOfFundsMedia?.id,
        tradeLicenseMediaId: tradeLicenseMedia?.id,
        tinCertificateMediaId: tinCertificateMedia?.id,
      });

      toast.success(
        "Your verification documents have been securely submitted for administrative audit.",
        { title: "Verification Submitted" }
      );
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to submit verification.";
      toast.error(msg, { title: "Submission Failed" });
    }
  };

  if (isLoading) {
    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ${className}`}>
        <InvestraLoader label="Loading KYC compliance vault" description="Querying regulatory credentials from private storage..." />
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all ${className}`}>
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-black text-xl text-slate-800">
              {roleTitle}
            </h3>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified & Regulatory Approved
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
                Unverified
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            {roleSubtitle}
          </p>
        </div>

        {/* Clean Security Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-bit Encrypted Private Vault</span>
          </div>
        </div>
      </div>

      {/* State A: Verified */}
      {isVerified && (
        <div className="mt-6 p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">Your Account is Verified</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your identity and regulatory credentials have been approved. You have full access to platform transactions, deal commitments, and private rooms.
          </p>
        </div>
      )}

      {/* State B: Under Review */}
      {isUnderReview && (
        <div className="mt-6 p-8 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center mx-auto shadow-sm">
            <Clock className="w-6 h-6 animate-pulse text-amber-600" />
          </div>
          <h4 className="font-heading font-black text-slate-900 text-lg">Application Under Review</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your verification packet has been received and queued for review. Our compliance team will audit your credentials within 24–48 business hours.
          </p>
        </div>
      )}

      {/* State C: Rejection Warning */}
      {isRejected && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-rose-800">Verification Requires Attention</p>
            <p className="text-rose-700 mt-0.5">
              Admin note: {existingVerification?.rejectionReason || "Uploaded documents were blurry or incomplete."}
            </p>
            <p className="text-rose-600 text-[11px] mt-1 font-medium">Please review and resubmit using the form below.</p>
          </div>
        </div>
      )}

      {/* State D: Submission Wizard */}
      {!isVerified && !isUnderReview && (
        <div className="mt-6">
          {/* Wizard Step Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                currentStep === 1
                  ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-sm"
                  : isStep1Valid
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    currentStep === 1 || isStep1Valid
                      ? "bg-[#064e3b] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isStep1Valid && currentStep !== 1 ? "✓" : "1"}
                </span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">Identity Proof</p>
                  <p className="text-[10px] text-slate-500 hidden sm:block truncate">ID & Biometrics</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => (isStep1Valid ? setCurrentStep(2) : handleNextStep())}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                currentStep === 2
                  ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-sm"
                  : isStep2Valid
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    currentStep === 2 || isStep2Valid
                      ? "bg-[#064e3b] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isStep2Valid && currentStep !== 2 ? "✓" : "2"}
                </span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">Address & Tax</p>
                  <p className="text-[10px] text-slate-500 hidden sm:block truncate">Residence & TIN</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => (isStep1Valid && isStep2Valid ? setCurrentStep(3) : handleNextStep())}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                currentStep === 3
                  ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 shadow-sm"
                  : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    currentStep === 3
                      ? "bg-[#064e3b] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  3
                </span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user.role === "INVESTOR" ? "Suitability" : "Business / KYB"}
                  </p>
                  <p className="text-[10px] text-slate-500 hidden sm:block truncate">Role Details</p>
                </div>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Identification & Selfie */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#064e3b]" />
                    Step 1: Government Identification & Liveness Check
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a valid government-issued ID and a clear selfie for fraud prevention.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1 block">
                    <span className="text-xs font-bold text-slate-700">Document Type</span>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                    >
                      <option value="NID">National Identity Card (NID / Smart Card)</option>
                      <option value="PASSPORT">International Passport</option>
                    </select>
                  </label>

                  {docType === "NID" ? (
                    <label className="space-y-1 block">
                      <span className="text-xs font-bold text-slate-700">National ID (NID) Number <span className="text-rose-500">*</span></span>
                      <input
                        type="text"
                        placeholder="e.g. 19942692582000123"
                        value={nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                        required
                      />
                    </label>
                  ) : (
                    <label className="space-y-1 block">
                      <span className="text-xs font-bold text-slate-700">Passport Number <span className="text-rose-500">*</span></span>
                      <input
                        type="text"
                        placeholder="e.g. A12345678"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                        required
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#064e3b]" />
                      ID Front Side <span className="text-rose-500">*</span>
                    </label>
                    <FileUploadDropzone
                      category="KYC_DOCUMENT"
                      isPublic={false}
                      label="Upload ID Front"
                      description="JPEG, PNG or PDF (max 20MB)"
                      currentMedia={frontMedia ? { id: frontMedia.id, fileName: frontMedia.originalName, status: "UPLOADED" } : undefined}
                      onUploadSuccess={(media) => setFrontMedia({ id: media.id, originalName: media.originalName })}
                      onRemove={() => setFrontMedia(null)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#064e3b]" />
                      ID Back Side {docType === "NID" && <span className="text-rose-500">*</span>}
                    </label>
                    <FileUploadDropzone
                      category="KYC_DOCUMENT"
                      isPublic={false}
                      label="Upload ID Back"
                      description="Required for NID"
                      currentMedia={backMedia ? { id: backMedia.id, fileName: backMedia.originalName, status: "UPLOADED" } : undefined}
                      onUploadSuccess={(media) => setBackMedia({ id: media.id, originalName: media.originalName })}
                      onRemove={() => setBackMedia(null)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                      Selfie Photo <span className="text-rose-500">*</span>
                    </label>
                    <FileUploadDropzone
                      category="KYC_DOCUMENT"
                      isPublic={false}
                      label="Upload Selfie Match"
                      description="Clear face holding document"
                      currentMedia={selfieMedia ? { id: selfieMedia.id, fileName: selfieMedia.originalName, status: "UPLOADED" } : undefined}
                      onUploadSuccess={(media) => setSelfieMedia({ id: media.id, originalName: media.originalName })}
                      onRemove={() => setSelfieMedia(null)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStep1Valid}
                    className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-50 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Continue to Address & Tax</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Residential Address & Tax ID */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#064e3b]" />
                    Step 2: Residential Address & Tax Identification
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your residential street address and tax identification details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1 block">
                    <span className="text-xs font-bold text-slate-700">
                      Residential Street Address <span className="text-rose-500">*</span>
                    </span>
                    <input
                      type="text"
                      placeholder="Street, Area, City, Postal Code, Country"
                      value={residentialAddress}
                      onChange={(e) => setResidentialAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                      required
                    />
                  </label>

                  <label className="space-y-1 block">
                    <span className="text-xs font-bold text-slate-700">Tax Identification Number (TIN / e-TIN)</span>
                    <input
                      type="text"
                      placeholder="e.g. 12-digit e-TIN or National Tax Number"
                      value={taxIdNumber}
                      onChange={(e) => setTaxIdNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-[#064e3b]" />
                      Proof of Address (Utility Bill / Bank Statement)
                    </label>
                    <FileUploadDropzone
                      category="KYC_DOCUMENT"
                      isPublic={false}
                      label="Upload Utility or Bank Statement"
                      description="Issued within last 90 days (PDF/PNG)"
                      currentMedia={poaMedia ? { id: poaMedia.id, fileName: poaMedia.originalName, status: "UPLOADED" } : undefined}
                      onUploadSuccess={(media) => setPoaMedia({ id: media.id, originalName: media.originalName })}
                      onRemove={() => setPoaMedia(null)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#064e3b]" />
                      Tax / e-TIN Certificate Copy
                    </label>
                    <FileUploadDropzone
                      category="KYC_DOCUMENT"
                      isPublic={false}
                      label="Upload TIN Certificate (PDF/Image)"
                      description="Issued by Tax Authority"
                      currentMedia={tinCertificateMedia ? { id: tinCertificateMedia.id, fileName: tinCertificateMedia.originalName, status: "UPLOADED" } : undefined}
                      onUploadSuccess={(media) => setTinCertificateMedia({ id: media.id, originalName: media.originalName })}
                      onRemove={() => setTinCertificateMedia(null)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStep2Valid}
                    className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-50 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Continue to Step 3</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Role-Specific Details */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                    {user.role === "INVESTOR" ? (
                      <Coins className="w-4 h-4 text-[#064e3b]" />
                    ) : (
                      <Building2 className="w-4 h-4 text-[#064e3b]" />
                    )}
                    Step 3: {user.role === "INVESTOR" ? "Source of Funds & Suitability" : "Business Registration & KYB"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {user.role === "INVESTOR"
                      ? "Declare your primary capital origin and investor accreditation bracket."
                      : "Provide corporate trade license and business registry credentials."}
                  </p>
                </div>

                {user.role === "INVESTOR" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="space-y-1 block">
                        <span className="text-xs font-bold text-slate-700">Primary Source of Funds</span>
                        <select
                          value={sourceOfFunds}
                          onChange={(e) => setSourceOfFunds(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                        >
                          <option value="SALARY">Employment / Salary</option>
                          <option value="BUSINESS_PROFIT">Business Profit / Dividends</option>
                          <option value="INVESTMENTS">Capital Gains / Exits</option>
                          <option value="INHERITANCE">Inheritance / Trust</option>
                          <option value="SAVINGS">Personal Savings</option>
                          <option value="OTHER">Other Qualified Capital</option>
                        </select>
                      </label>

                      <label className="space-y-1 block">
                        <span className="text-xs font-bold text-slate-700">Annual Income</span>
                        <select
                          value={annualIncomeRange}
                          onChange={(e) => setAnnualIncomeRange(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                        >
                          <option value="< $50k">Less than $50,000</option>
                          <option value="$50k - $100k">$50,000 - $100,000</option>
                          <option value="$100k - $250k">$100,000 - $250,000</option>
                          <option value="$250k - $1M">$250,000 - $1,000,000</option>
                          <option value="$1M+">$1,000,000+</option>
                        </select>
                      </label>

                      <label className="space-y-1 block">
                        <span className="text-xs font-bold text-slate-700">Net Worth Bracket</span>
                        <select
                          value={netWorthRange}
                          onChange={(e) => setNetWorthRange(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                        >
                          <option value="< $100k">Under $100,000</option>
                          <option value="$100k - $250k">$100,000 - $250,000</option>
                          <option value="$250k - $1M">$250,000 - $1,000,000</option>
                          <option value="$1M - $5M">$1,000,000 - $5,000,000</option>
                          <option value="$5M+">$5,000,000+</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-[#064e3b]" />
                          Proof of Funds / Bank Solvency (Optional)
                        </label>
                        <FileUploadDropzone
                          category="KYC_DOCUMENT"
                          isPublic={false}
                          label="Upload Solvency or Bank Letter"
                          description="Confirms investing liquidity (PDF/PNG)"
                          currentMedia={proofOfFundsMedia ? { id: proofOfFundsMedia.id, fileName: proofOfFundsMedia.originalName, status: "UPLOADED" } : undefined}
                          onUploadSuccess={(media) => setProofOfFundsMedia({ id: media.id, originalName: media.originalName })}
                          onRemove={() => setProofOfFundsMedia(null)}
                        />
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 mt-4 sm:mt-0">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="pepCheck"
                            checked={pepDeclaration}
                            onChange={(e) => setPepDeclaration(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#064e3b] focus:ring-[#064e3b]"
                          />
                          <label htmlFor="pepCheck" className="text-xs text-slate-700 cursor-pointer">
                            <span className="font-bold text-slate-900 block">Politically Exposed Person (PEP)</span>
                            Check only if you or an immediate family member hold a prominent public office or government role.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="space-y-1 block">
                      <span className="text-xs font-bold text-slate-700">Trade License / Incorporation Number</span>
                      <input
                        type="text"
                        placeholder="e.g. TRAD/DNCC/102948/2024"
                        value={tradeLicenseNumber}
                        onChange={(e) => setTradeLicenseNumber(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                      />
                    </label>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#064e3b]" />
                        Trade License / Certificate of Incorporation
                      </label>
                      <FileUploadDropzone
                        category="KYC_DOCUMENT"
                        isPublic={false}
                        label="Upload Trade License Document"
                        description="PDF or scanned image copy"
                        currentMedia={tradeLicenseMedia ? { id: tradeLicenseMedia.id, fileName: tradeLicenseMedia.originalName, status: "UPLOADED" } : undefined}
                        onUploadSuccess={(media) => setTradeLicenseMedia({ id: media.id, originalName: media.originalName })}
                        onRemove={() => setTradeLicenseMedia(null)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitKycMutation.isPending || !frontMedia || !selfieMedia || !residentialAddress.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-50 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {submitKycMutation.isPending ? (
                      <InvestraInlineLoader label="Encrypting & submitting..." />
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-emerald-300" />
                        <span>Submit Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
