"use client";

import { useState } from "react";
import {
  CircleDollarSign,
  FileText,
  Lock,
  Percent,
  Scale,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import {
  CommitmentsApi,
  InvestmentInstrument,
} from "@/lib/api/commitments";
import { uploadMediaPipeline } from "@/lib/api/media";
import { toast } from "@/lib/toast";
import { InvestraInlineLoader } from "../ui/InvestraLoader";

interface IssueTermSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultEntrepreneurId?: string;
  defaultStartupName?: string;
  defaultIntroRequestId?: string;
  defaultBusinessId?: string;
  defaultAmount?: number;
}

export function IssueTermSheetModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEntrepreneurId = "",
  defaultStartupName = "",
  defaultIntroRequestId,
  defaultBusinessId,
  defaultAmount = 50000,
}: IssueTermSheetModalProps) {
  const [startupName, setStartupName] = useState(defaultStartupName);
  const [entrepreneurId, setEntrepreneurId] = useState(defaultEntrepreneurId);
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [instrument, setInstrument] = useState<InvestmentInstrument>("SAFE");
  const [valuation, setValuation] = useState<string>("");
  const [equityPercentage, setEquityPercentage] = useState<string>("");
  const [termsSummary, setTermsSummary] = useState(
    "Standard YC post-money SAFE instrument with pro-rata information rights, quarterly KPI reporting, and standard milestone disbursement tranches."
  );
  const [investorNotes, setInvestorNotes] = useState(
    "We are excited about your traction and would love to back your vision. Please review our term sheet."
  );
  const [termSheetDocUrl, setTermSheetDocUrl] = useState<string>("");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docFileName, setDocFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    try {
      const confirmed = await uploadMediaPipeline(file, "TERM_SHEET_DOCUMENT");
      setTermSheetDocUrl(confirmed.url || "");
      setDocFileName(file.name);
      toast.success("Term sheet document securely uploaded to Cloudflare R2");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload document");
    } finally {
      setIsUploadingDoc(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startupName.trim()) {
      toast.error("Startup name is required");
      return;
    }
    if (!entrepreneurId.trim()) {
      toast.error("Entrepreneur ID is required");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid investment commitment amount");
      return;
    }
    if (!termsSummary.trim()) {
      toast.error("Terms summary is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await CommitmentsApi.createCommitment({
        entrepreneurId,
        businessId: defaultBusinessId,
        introRequestId: defaultIntroRequestId,
        startupName: startupName.trim(),
        amount: Number(amount),
        currency: "USD",
        instrument,
        valuation: valuation ? Number(valuation) : undefined,
        equityPercentage: equityPercentage ? Number(equityPercentage) : undefined,
        termsSummary: termsSummary.trim(),
        termSheetDocUrl: termSheetDocUrl || undefined,
        investorNotes: investorNotes.trim() || undefined,
      });

      toast.success(`Term sheet for ${startupName} successfully issued!`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to issue term sheet"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Issue Term Sheet & Soft Commitment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Formalize deal terms, equity valuation, and investment allocation for {startupName || "founder"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Company & Amount Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Startup Name
              </label>
              <input
                type="text"
                required
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="e.g. Apex Ledger"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Commitment Ticket Size (USD)
              </label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Instrument & Ownership */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Instrument Type
              </label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as InvestmentInstrument)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="SAFE">SAFE (Post-Money)</option>
                <option value="EQUITY">Priced Equity (Preferred)</option>
                <option value="CONVERTIBLE_NOTE">Convertible Promissory Note</option>
                <option value="DEBT">Venture Debt</option>
                <option value="REVENUE_SHARE">Revenue Share</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Valuation Cap (USD)
              </label>
              <input
                type="number"
                min={0}
                value={valuation}
                onChange={(e) => setValuation(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Ownership %
              </label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  max={100}
                  value={equityPercentage}
                  onChange={(e) => setEquityPercentage(e.target.value)}
                  placeholder="e.g. 7.5"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Terms Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Terms & Conditions Summary
            </label>
            <textarea
              rows={3}
              required
              value={termsSummary}
              onChange={(e) => setTermsSummary(e.target.value)}
              placeholder="Outline pro-rata rights, board representation, governance covenants, and milestone release tranches..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-5 text-slate-800 focus:border-emerald-600 focus:outline-none resize-none"
            />
          </div>

          {/* Term Sheet Document (R2 Upload) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attach Formal Term Sheet Document (PDF)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/50 px-4 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/60 cursor-pointer transition">
                <Upload className="h-4 w-4" />
                {isUploadingDoc ? "Encrypting & Uploading to R2..." : "Upload Term Sheet PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploadingDoc}
                />
              </label>
              {docFileName && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-semibold truncate max-w-[200px]">{docFileName}</span>
                  <span className="text-[10px] text-emerald-600">✓ Uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Personal Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Investor Note to Founder
            </label>
            <textarea
              rows={2}
              value={investorNotes}
              onChange={(e) => setInvestorNotes(e.target.value)}
              placeholder="Add personal notes or availability for an introductory diligence call..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-5 text-slate-800 focus:border-emerald-600 focus:outline-none resize-none"
            />
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Term sheets issued on Investra represent non-binding indicative soft commitments subject to definitive legal documentation and mutual KYC clearance.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingDoc}
              className="inline-flex items-center gap-2 rounded-xl bg-[#065f46] hover:bg-[#044e39] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <InvestraInlineLoader className="text-white" />
                  Issuing Term Sheet...
                </>
              ) : (
                <>
                  <Scale className="h-4 w-4" />
                  Confirm & Issue Term Sheet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
