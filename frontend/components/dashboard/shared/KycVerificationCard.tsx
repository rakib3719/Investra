"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  HelpCircle,
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

  // Role-specific compliance guidance
  const roleTitle =
    user.role === "INVESTOR"
      ? "Accredited Investor & AML/CFT Compliance Vault"
      : user.role === "ENTREPRENEUR"
        ? "Startup Founder & Institutional KYB Verification"
        : "Certified Advisory & Consultant Credential Vault";

  const roleHelpText =
    user.role === "INVESTOR"
      ? "Under SEC / AML regulations for capital markets, high-value investment platforms require verification of identity, address, tax identification, and source of funds prior to capital disbursement and deal room access."
      : user.role === "ENTREPRENEUR"
        ? "To protect retail and angel investors against fraudulent campaigns, founders must submit verified government credentials, corporate registration / trade license, and business TIN."
        : "Verified consultants advise corporate funds and evaluate private rounds. Platform compliance mandates background identity and professional accreditation review.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontMedia) {
      toast.error("Please upload the front side of your Government ID.");
      return;
    }
    if (!selfieMedia) {
      toast.error("Please upload a selfie photo for liveness and anti-fraud confirmation.");
      return;
    }
    if (!residentialAddress.trim()) {
      toast.error("Please provide your verified residential street address.");
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
        "Your institutional KYC compliance packet has been securely submitted for administrative audit.",
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
        <InvestraLoader label="Loading KYC compliance vault" description="Querying regulatory credentials from private storage..." />
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
                Incomplete / Not Submitted
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
            <span>Private R2 Bucket (<code className="text-[#064e3b] font-mono text-[10px]">investra-private</code>)</span>
          </div>
        </div>
      </div>

      {/* Security & Regulatory Compliance Banner */}
      <div className="mt-6 rounded-2xl bg-[#064e3b]/5 p-4 border border-[#064e3b]/20 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-[#064e3b]">
            Institutional Tier-3 Anti-Money Laundering (AML) & KYC Safeguard
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Financial regulations dictate zero unauthorized access. All uploaded PDFs, bank statements, tax IDs, and biometric selfies are encrypted at rest and isolated from public web traffic. Documents are solely reviewable by certified compliance admins with audit logs.
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-2xl border transition-all ${
          frontMedia ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              frontMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>1</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Govt ID Proof</p>
              <p className="text-[10px] text-slate-500">NID / Passport</p>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          selfieMedia ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              selfieMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>2</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Biometric Check</p>
              <p className="text-[10px] text-slate-500">Live Selfie Match</p>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          poaMedia ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              poaMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>3</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Proof of Address</p>
              <p className="text-[10px] text-slate-500">Utility / Statement</p>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-2xl border transition-all ${
          proofOfFundsMedia || tinCertificateMedia ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50/60"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              proofOfFundsMedia || tinCertificateMedia ? "bg-[#064e3b] text-white" : "bg-slate-200 text-slate-600"
            }`}>4</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Financial / Tax</p>
              <p className="text-[10px] text-slate-500">Funds & TIN Proof</p>
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
          <h4 className="font-heading font-black text-slate-800 text-base">Your Identity is Fully Verified & Accredited</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your government documents, financial standing, and address records have been audited by Investra compliance. You now have full operational privileges across the investment platform.
          </p>
        </div>
      )}

      {/* State B: Under Review */}
      {isUnderReview && (
        <div className="mt-6 p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="font-heading font-black text-slate-800 text-base">Compliance Packet Submitted — Awaiting Review</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your verification packet is currently queued in our compliance backlog. Our compliance officers will audit your identification, tax records, and supporting files within 24–48 business hours.
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
            <p className="text-rose-600 text-[11px] mt-1">Please provide updated, clear documentation below.</p>
          </div>
        </div>
      )}

      {/* State D: Submission / Re-submission Form */}
      {(!isVerified && !isUnderReview) && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* SECTION 1: Government Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Scale className="w-4 h-4 text-[#064e3b]" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                1. Government Identification & Living Biometrics
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Identification Document Type</span>
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

            {/* Dropzones for Front, Back, Selfie */}
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
                  ID Back Side (Optional for Passport)
                </label>
                <FileUploadDropzone
                  category="KYC_DOCUMENT"
                  isPublic={false}
                  label="Upload ID Back"
                  description="Required for Smart NID"
                  currentMedia={backMedia ? { id: backMedia.id, fileName: backMedia.originalName, status: "UPLOADED" } : undefined}
                  onUploadSuccess={(media) => setBackMedia({ id: media.id, originalName: media.originalName })}
                  onRemove={() => setBackMedia(null)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                  Anti-Fraud Selfie Liveness <span className="text-rose-500">*</span>
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
          </div>

          {/* SECTION 2: Proof of Address & Residence */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Landmark className="w-4 h-4 text-[#064e3b]" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                2. Residential Street Address & Proof of Residence (PoA)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Permanent / Residential Street Address <span className="text-rose-500">*</span></span>
                <input
                  type="text"
                  placeholder="House / Road, Area, City, Postal Code, Country"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                  required
                />
              </label>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#064e3b]" />
                  Proof of Address Document (Utility Bill / Bank Statement)
                </label>
                <FileUploadDropzone
                  category="KYC_DOCUMENT"
                  isPublic={false}
                  label="Upload Recent Utility / Bank Bill"
                  description="Must be issued within last 90 days (PDF/PNG)"
                  currentMedia={poaMedia ? { id: poaMedia.id, fileName: poaMedia.originalName, status: "UPLOADED" } : undefined}
                  onUploadSuccess={(media) => setPoaMedia({ id: media.id, originalName: media.originalName })}
                  onRemove={() => setPoaMedia(null)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Tax Identification & Corporate Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#064e3b]" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                3. Tax Compliance & Business Registration (TIN & Trade License)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Trade License / Incorporation Reg Number (For Founders/Consultants)</span>
                <input
                  type="text"
                  placeholder="e.g. TRAD/DNCC/102948/2024"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#064e3b]" />
                  Tax / e-TIN Certificate Copy
                </label>
                <FileUploadDropzone
                  category="KYC_DOCUMENT"
                  isPublic={false}
                  label="Upload TIN Certificate (PDF/Image)"
                  description="Issued by National Board of Revenue / IRS"
                  currentMedia={tinCertificateMedia ? { id: tinCertificateMedia.id, fileName: tinCertificateMedia.originalName, status: "UPLOADED" } : undefined}
                  onUploadSuccess={(media) => setTinCertificateMedia({ id: media.id, originalName: media.originalName })}
                  onRemove={() => setTinCertificateMedia(null)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#064e3b]" />
                  Trade License / Incorporation Certificate
                </label>
                <FileUploadDropzone
                  category="KYC_DOCUMENT"
                  isPublic={false}
                  label="Upload Trade License Document"
                  description="For startups & registered consultants"
                  currentMedia={tradeLicenseMedia ? { id: tradeLicenseMedia.id, fileName: tradeLicenseMedia.originalName, status: "UPLOADED" } : undefined}
                  onUploadSuccess={(media) => setTradeLicenseMedia({ id: media.id, originalName: media.originalName })}
                  onRemove={() => setTradeLicenseMedia(null)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: AML/CFT Source of Funds & Wealth Suitability */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Coins className="w-4 h-4 text-[#064e3b]" />
              <h4 className="font-heading font-bold text-sm text-slate-900">
                4. Source of Investment Funds & Financial Suitability
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Primary Source of Funds</span>
                <select
                  value={sourceOfFunds}
                  onChange={(e) => setSourceOfFunds(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                >
                  <option value="SALARY">Employment / Salary</option>
                  <option value="BUSINESS_PROFIT">Business Ownership / Dividends</option>
                  <option value="INVESTMENTS">Capital Gains / Equity Exits</option>
                  <option value="INHERITANCE">Inheritance / Family Trust</option>
                  <option value="SAVINGS">Accumulated Personal Savings</option>
                  <option value="OTHER">Other Qualified Capital</option>
                </select>
              </label>

              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-700">Annual Income Range</span>
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
                <span className="text-xs font-bold text-slate-700">Estimated Net Worth</span>
                <select
                  value={netWorthRange}
                  onChange={(e) => setNetWorthRange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b] focus:bg-white"
                >
                  <option value="< $100k">Under $100,000</option>
                  <option value="$100k - $250k">$100,000 - $250,000</option>
                  <option value="$250k - $1M">$250,000 - $1,000,000 (Accredited)</option>
                  <option value="$1M - $5M">$1,000,000 - $5,000,000 (High Net Worth)</option>
                  <option value="$5M+">$5,000,000+ (Ultra High Net Worth)</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-[#064e3b]" />
                  Proof of Funds / Bank Solvency Letter (Recommended for Investors)
                </label>
                <FileUploadDropzone
                  category="KYC_DOCUMENT"
                  isPublic={false}
                  label="Upload Bank Statement or Solvency Letter"
                  description="Confirms investing liquidity (PDF/PNG)"
                  currentMedia={proofOfFundsMedia ? { id: proofOfFundsMedia.id, fileName: proofOfFundsMedia.originalName, status: "UPLOADED" } : undefined}
                  onUploadSuccess={(media) => setProofOfFundsMedia({ id: media.id, originalName: media.originalName })}
                  onRemove={() => setProofOfFundsMedia(null)}
                />
              </div>

              {/* PEP Declaration Box */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2 mt-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="pepCheck"
                    checked={pepDeclaration}
                    onChange={(e) => setPepDeclaration(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#064e3b] focus:ring-[#064e3b]"
                  />
                  <label htmlFor="pepCheck" className="text-xs font-semibold text-slate-800 leading-snug cursor-pointer">
                    <span className="font-bold text-amber-900 block">Politically Exposed Person (PEP) Declaration</span>
                    Check this box only if you, or an immediate family member, hold or have held a prominent public function (government official, senior military officer, state-owned enterprise executive, or central bank member).
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submission CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Administrative audit takes 24–48 business hours. You will receive an email upon approval.
            </p>

            <button
              type="submit"
              disabled={submitKycMutation.isPending || !frontMedia || !selfieMedia || !residentialAddress.trim()}
              className="px-6 py-3 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-60 text-white font-heading font-extrabold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              {submitKycMutation.isPending ? (
                <InvestraInlineLoader label="Encrypting & submitting packet..." />
              ) : (
                <>
                  <Shield className="w-4 h-4 text-emerald-300" />
                  <span>Submit Full KYC Compliance Packet</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
