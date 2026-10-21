"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  Handshake,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { MessagesApi } from "@/lib/api/messages";
import { toast } from "@/lib/toast";

export interface ConnectFounderTarget {
  id: string;
  title: string;
  entrepreneurId?: string;
  entrepreneur?: {
    id?: string;
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
  const router = useRouter();
  const [topic, setTopic] = useState("Introductory Pitch Call");
  const [ticketInterest, setTicketInterest] = useState("$25,000 - $50,000");
  const [meetingFormat, setMeetingFormat] = useState("Virtual Call (Google Meet / Zoom)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [subscriptionRequiredError, setSubscriptionRequiredError] = useState<string | null>(null);

  if (!isOpen || !campaign) return null;

  const founderName = campaign.entrepreneur
    ? `${campaign.entrepreneur.firstName || ""} ${campaign.entrepreneur.lastName || ""}`.trim() || "Verified Founder"
    : "Verified Founder";

  const recipientId = campaign.entrepreneurId || campaign.entrepreneur?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId) {
      toast.error("Unable to identify the founder account for this campaign.");
      return;
    }

    setIsSubmitting(true);
    setSubscriptionRequiredError(null);

    try {
      const fullNote = `[Deal Connection Request for ${campaign.title}]\nTopic: ${topic}\nTarget Ticket: ${ticketInterest}\nFormat Preference: ${meetingFormat}\n\nNote:\n${message.trim()}`;

      const conv = await MessagesApi.initiateConversation({
        recipientId,
        subject: `Deal Room: ${campaign.title}`,
        initialMessage: fullNote,
      });

      setConversationId(conv.id);
      setIsSuccess(true);
      toast.success("Introduction message delivered to founder!");
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const status = errorObj?.response?.status;
      const errorMsg = errorObj?.response?.data?.message || errorObj?.message || "Failed to connect with founder";

      if (status === 403 || errorMsg.toLowerCase().includes("subscription")) {
        setSubscriptionRequiredError(errorMsg);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setMessage("");
    setConversationId(null);
    setSubscriptionRequiredError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {subscriptionRequiredError ? (
          <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md">
              <Crown className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                Subscription Required
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Investor Subscription Needed
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 font-body max-w-sm mx-auto">
                {subscriptionRequiredError}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-left text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">Pro subscribers get full access to:</p>
              <ul className="space-y-1 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct 2-way messaging with all founders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confidential pitch deck & due diligence downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Term sheet discussions and deal room workspaces</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/subscription?role=investor"
                onClick={handleResetAndClose}
                className="w-full sm:w-2/3 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053D2E] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Upgrade to Investor Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Deal Room Initialized!
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-body">
                Your connection note for <strong>{campaign.title}</strong> has been delivered directly to <strong>{founderName}</strong>. A private Deal Room conversation has been opened.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-left text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold font-heading">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Private Deal Discussion Room</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-normal font-body">
                You can now message each other in real-time, attach diligence materials, request virtual meetings, and discuss allocation terms.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-1/3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              {conversationId ? (
                <Link
                  href={`/dashboard/investor/messages?conversationId=${conversationId}`}
                  onClick={handleResetAndClose}
                  className="w-full sm:w-2/3 py-2.5 rounded-xl bg-[#065f46] hover:bg-[#044c38] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Deal Room & Messages</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-2/3 py-2.5 rounded-xl bg-[#065f46] text-white font-bold text-xs"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider font-heading">
              <Handshake className="h-4 w-4" />
              <span>Direct Founder Outreach</span>
            </div>

            <h2 className="mt-2 text-xl font-bold text-slate-950 sm:text-2xl font-heading">
              Connect with Founder
            </h2>
            <p className="mt-1 text-xs text-slate-500 font-body">
              Initiate a verified investment discussion and open a private deal room.
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
                <h4 className="truncate text-xs font-bold text-slate-900 font-heading">
                  {campaign.title}
                </h4>
                <p className="truncate text-[11px] text-slate-500 font-body">
                  {founderName} {campaign.entrepreneur?.entrepreneurProfile?.headline ? `· ${campaign.entrepreneur.entrepreneurProfile.headline}` : ""}
                </p>
              </div>
            </div>

            {/* Platform Policy Notice */}
            <div className="mt-3.5 rounded-xl border border-slate-200/60 bg-white p-3 text-[11px] leading-relaxed text-slate-600 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="font-body">
                <strong>Direct Collaboration Hub:</strong> Investra connects accredited investors with verified founders. Term negotiations, due diligence, and capital allocations happen directly between stakeholders.
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-heading">
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-heading">
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-heading">
                    Preferred Format
                  </label>
                  <select
                    value={meetingFormat}
                    onChange={(e) => setMeetingFormat(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                  >
                    <option value="Virtual Call (Google Meet / Zoom)">Virtual Call (Zoom/Meet)</option>
                    <option value="In-Platform Deal Room Chat">In-Platform Deal Room Chat</option>
                    <option value="Direct Email Correspondence">Direct Email</option>
                    <option value="In-Person Discussion">In-Person Discussion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 font-heading">
                  Introductory Note / Message to Founder *
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself, share your investment focus, or outline questions about this venture..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-600 resize-none font-body"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#065f46] py-2.5 text-xs font-bold text-white hover:bg-[#044c38] transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
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
