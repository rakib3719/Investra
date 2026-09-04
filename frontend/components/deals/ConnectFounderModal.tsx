"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Handshake,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export interface ConnectFounderTarget {
  id: string;
  title: string;
  entrepreneur?: {
    firstName?: string;
    lastName?: string;
    image?: string;
    entrepreneurProfile?: {
      companyName?: string;
      headline?: string;
    };
  };
}

interface ConnectFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: ConnectFounderTarget | null;
}

export function ConnectFounderModal({
  isOpen,
  onClose,
  campaign,
}: ConnectFounderModalProps) {
  const [topic, setTopic] = useState("Introductory Pitch Call");
  const [ticketInterest, setTicketInterest] = useState("$25,000 - $50,000");
  const [meetingFormat, setMeetingFormat] = useState("Virtual Call (Google Meet / Zoom)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !campaign) return null;

  const founderName = campaign.entrepreneur
    ? `${campaign.entrepreneur.firstName || ""} ${campaign.entrepreneur.lastName || ""}`.trim() || "Verified Founder"
    : "Verified Founder";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission for introduction request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Introduction Request Sent
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Your connection request for <strong>{campaign.title}</strong> has been delivered to <strong>{founderName}</strong>. They will review your accredited investor credentials and connect with you directly.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-left text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Verified Direct Introduction</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-normal">
                Investra does not process settlement or escrow payments. All allocations, term sheet exchanges, and closing discussions occur directly between verified stakeholders.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-4 w-full rounded-xl bg-[#065f46] py-3 text-xs font-bold text-white shadow hover:bg-[#044c38] transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Handshake className="h-4 w-4" />
              <span>Direct Founder Outreach</span>
            </div>

            <h2 className="mt-2 text-xl font-bold text-slate-950 sm:text-2xl">
              Connect with Founder
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Express accredited investment interest and request a private discussion.
            </p>

            {/* Campaign / Founder Snippet */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
              <img
                src={
                  campaign.entrepreneur?.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                }
                alt={founderName}
                className="h-10 w-10 rounded-xl object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-bold text-slate-900">
                  {campaign.title}
                </h4>
                <p className="truncate text-[11px] text-slate-500">
                  {founderName} {campaign.entrepreneur?.entrepreneurProfile?.headline ? `· ${campaign.entrepreneur.entrepreneurProfile.headline}` : ""}
                </p>
              </div>
            </div>

            {/* Platform Policy Notice */}
            <div className="mt-4 rounded-xl border border-slate-200/60 bg-white p-3 text-[11px] leading-relaxed text-slate-600 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Zero On-Platform Transactions:</strong> Investra is strictly an introduction, discovery, and evaluation venue. Investment contracts, cap table entries, and bank settlements happen offline directly with the startup.
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Discussion Objective
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                >
                  <option value="Introductory Pitch Call">Introductory Pitch Call</option>
                  <option value="Syndicate Lead Consideration">Syndicate Lead Consideration</option>
                  <option value="Due Diligence Questions">Due Diligence Questions</option>
                  <option value="Strategic Advisory & Co-Investment">Strategic Advisory & Co-Investment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Indicative Ticket Size
                  </label>
                  <select
                    value={ticketInterest}
                    onChange={(e) => setTicketInterest(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  >
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                    <option value="$100,000+">$100,000+</option>
                    <option value="Exploring / Uncommitted">Exploring / Uncommitted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Preferred Format
                  </label>
                  <select
                    value={meetingFormat}
                    onChange={(e) => setMeetingFormat(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  >
                    <option value="Virtual Call (Google Meet / Zoom)">Virtual Call (Zoom/Meet)</option>
                    <option value="Direct Email Correspondence">Direct Email</option>
                    <option value="In-Person Discussion">In-Person Discussion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Introductory Note / Context
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a brief note about your investment thesis, portfolio synergies, or key questions..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-600 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#065f46] py-2.5 text-xs font-bold text-white hover:bg-[#044c38] transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? "Sending..." : "Submit Connection"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
