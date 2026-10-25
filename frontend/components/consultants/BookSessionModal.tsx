"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  DollarSign,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  consultationsApi,
  type ConsultantSlotItem,
  type ConsultationBookingItem,
} from "@/lib/consultations/consultations-api";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";
import { useCurrentUserQuery } from "@/lib/auth/auth-hooks";

export interface BookSessionConsultant {
  id: string;
  name: string;
  role: string;
  hourlyRate: string;
  avatar: string;
  isDbVerified?: boolean;
}

interface BookSessionModalProps {
  consultant: BookSessionConsultant;
  onClose: () => void;
}

export function BookSessionModal({ consultant, onClose }: BookSessionModalProps) {
  const { data: currentUser } = useCurrentUserQuery();
  const [slots, setSlots] = useState<ConsultantSlotItem[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [platform, setPlatform] = useState<"GOOGLE_MEET" | "ZOOM">("GOOGLE_MEET");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBookingItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      try {
        setIsLoadingSlots(true);
        const availableSlots = await consultationsApi.getPublicSlots(consultant.id);
        if (isMounted) {
          setSlots(availableSlots);
          if (availableSlots.length > 0) {
            setSelectedSlotId(availableSlots[0].id);
          }
        }
      } catch (err: any) {
        console.error("Failed to load availability slots", err);
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [consultant.id]);

  const handleCopyLink = () => {
    if (confirmedBooking?.meetingLink) {
      navigator.clipboard.writeText(confirmedBooking.meetingLink);
      setIsCopied(true);
      toast.success("Meeting link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login or register to book a consultation session.");
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!selectedSlotId) {
      toast.error("Please select an available date and time slot.");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a consultation topic or objective.");
      return;
    }

    try {
      setIsSubmitting(true);
      const booking = await consultationsApi.bookSession({
        slotId: selectedSlotId,
        topic: topic.trim(),
        clientNotes: clientNotes.trim() || undefined,
        meetingPlatform: platform,
      });

      setConfirmedBooking(booking);
      toast.success("Session successfully booked & confirmed! Email notification sent.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to book session.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmed Screen */}
        {confirmedBooking ? (
          <div className="text-center space-y-6 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 font-heading">
                Booking Confirmed
              </span>
              <h3 className="font-heading font-black text-2xl text-slate-900 mt-1">
                You&apos;re All Set for Your 1-on-1 Session!
              </h3>
              <p className="text-xs text-slate-500 font-body mt-1">
                A calendar invitation and confirmation email with join details have been dispatched to you and {consultant.name}.
              </p>
            </div>

            {/* Session Summary Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={consultant.avatar || "/placeholder-avatar.png"}
                    alt={consultant.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{consultant.name}</h4>
                    <p className="text-xs text-slate-500 font-body">{consultant.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Paid ${confirmedBooking.grossAmount}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Date & Time</span>
                  <span className="font-bold text-slate-800">
                    {new Date(confirmedBooking.slot.slotDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {confirmedBooking.slot.startTime} - {confirmedBooking.slot.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Topic</span>
                  <span className="font-bold text-slate-800 line-clamp-1">{confirmedBooking.topic}</span>
                </div>
              </div>

              {/* Direct Video Call Meeting Link */}
              <div className="pt-2">
                <span className="text-slate-500 font-bold block text-[11px] uppercase mb-1.5 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  Your Video Call Meeting Room
                </span>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-2">
                  <input
                    type="text"
                    readOnly
                    value={confirmedBooking.meetingLink}
                    className="text-xs text-slate-700 bg-transparent flex-1 outline-none font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    title="Copy Link"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={confirmedBooking.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition"
                  >
                    <span>Join Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white font-heading font-bold py-3 rounded-xl text-xs transition"
            >
              Done & Return to Marketplace
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            {/* Header / Consultant Banner */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <img
                src={consultant.avatar || "/placeholder-avatar.png"}
                alt={consultant.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-heading">
                    1-on-1 Consultation
                  </span>
                  {consultant.isDbVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-black text-xl text-slate-900 truncate">
                  {consultant.name}
                </h3>
                <p className="text-xs text-slate-500 font-body truncate">{consultant.role}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-heading text-slate-900">{consultant.hourlyRate}</span>
                <span className="text-[10px] text-slate-400 font-body block">/ session</span>
              </div>
            </div>

            {/* Step 1: Time Slot Selection */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 font-heading">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Select Free Time Slot
                </span>
                <span className="text-[11px] font-normal text-slate-500 font-body">
                  {slots.length} slots available
                </span>
              </label>

              {isLoadingSlots ? (
                <div className="py-6 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
                  <InvestraInlineLoader label="Loading real-time availability..." />
                </div>
              ) : slots.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-center space-y-1">
                  <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-amber-800 font-heading">
                    No open availability slots for this consultant right now.
                  </p>
                  <p className="text-[11px] text-amber-700 font-body">
                    Please check back soon or browse another verified advisor.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const formattedDate = new Date(slot.slotDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-0.5 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-[11px] font-bold font-heading ${isSelected ? "text-emerald-800" : "text-slate-800"}`}>
                          {formattedDate}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-body">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Session Topic & Agenda */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                  Consultation Topic / Goal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Series A Pitch Review, Valuation & Cap Table Structuring"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                  Additional Context or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe your company, current funding progress, or specific challenges..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition resize-none"
                />
              </div>

              {/* Video Platform Choice */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 font-heading mb-1.5">
                  Preferred Meeting Platform
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform("GOOGLE_MEET")}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-heading flex items-center justify-center gap-2 transition cursor-pointer ${
                      platform === "GOOGLE_MEET"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform("ZOOM")}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-heading flex items-center justify-center gap-2 transition cursor-pointer ${
                      platform === "ZOOM"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Zoom Meeting</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Transparent Financial Ledger Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-body text-slate-600">
                <span>Session Fee</span>
                <span className="font-semibold text-slate-800">{consultant.hourlyRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-body text-slate-600">
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Platform Security & Admin Telemetry (10%)
                </span>
                <span className="font-semibold text-emerald-700">Included</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-heading font-black text-slate-900 text-sm">
                <span>Total Due</span>
                <span className="text-emerald-700">{consultant.hourlyRate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting || slots.length === 0}
                className="w-full bg-[#064e3b] hover:bg-[#043c2e] disabled:opacity-50 text-white font-heading font-bold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <InvestraInlineLoader label="Confirming Session & Generating Room..." />
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 text-[#10b981]" />
                    <span>Confirm & Book Session ({consultant.hourlyRate})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-heading font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
