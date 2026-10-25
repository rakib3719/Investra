"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Clock,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import {
  consultationsApi,
  type ConsultationBookingItem,
} from "@/lib/consultations/consultations-api";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";

export function MyConsultationsPage({ user }: { user: AuthUser }) {
  const [bookings, setBookings] = useState<ConsultationBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await consultationsApi.getMyClientBookings();
        setBookings(data);
      } catch (err: any) {
        console.error("Failed to load booked consultations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
            <Video className="w-3.5 h-3.5" />
            <span>1-on-1 Advisory Sessions</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            My Consultations
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-body">
            View your upcoming 1-on-1 expert advisory sessions and join your video meeting room.
          </p>
        </div>

        <Link
          href="/consultants"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold bg-[#064e3b] text-white hover:bg-[#043c2e] transition shadow-md font-heading shrink-0"
        >
          <span>Find Advisors</span>
          <ArrowRight className="w-4 h-4 text-emerald-300" />
        </Link>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-16 flex justify-center bg-white rounded-2xl border border-slate-200">
          <InvestraInlineLoader label="Loading your booked sessions..." />
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Video className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-black text-lg text-slate-900">
              No Booked Consultations Yet
            </h3>
            <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
              Book a 1-on-1 video mentoring or strategy session with vetted venture partners, financial analysts, and legal strategists.
            </p>
          </div>
          <Link
            href="/consultants"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-heading rounded-xl transition"
          >
            Browse Verified Consultants &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const formattedDate = new Date(booking.slot.slotDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const consultantName = `${booking.consultant?.firstName || ""} ${booking.consultant?.lastName || ""}`.trim() || "Verified Advisor";

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.consultant?.image || "/placeholder-avatar.png"}
                      alt={consultantName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-base text-slate-900">
                          {consultantName}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Confirmed
                        </span>
                        {booking.meetingLink ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                            Room Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                            Link Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-body">
                        {booking.consultant?.consultantProfile?.headline || "Strategic Advisor"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-slate-700 font-heading">
                      Fee: ${booking.grossAmount} USD
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Paid via Stripe • Status: {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase font-heading">
                      Scheduled Date &amp; Time
                    </span>
                    <span className="font-bold text-slate-800">
                      {formattedDate} • {booking.slot.startTime} - {booking.slot.endTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase font-heading">
                      Topic / Objective
                    </span>
                    <span className="font-bold text-slate-800 block">{booking.topic}</span>
                    {booking.clientNotes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic">
                        Notes: {booking.clientNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meeting Link Bar */}
                {booking.meetingLink ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-mono text-slate-700 truncate max-w-sm">
                        {booking.meetingLink}
                      </span>
                      <button
                        onClick={() => handleCopyLink(booking.meetingLink!, booking.id)}
                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                        title="Copy meeting link"
                      >
                        {copiedId === booking.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#064e3b] hover:bg-[#043c2e] text-white px-5 py-2.5 rounded-xl text-xs font-bold font-heading transition shadow-xs shrink-0 cursor-pointer"
                    >
                      <span>Join Meeting Room</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                    </a>
                  </div>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-950 font-heading">
                            Meeting Link Pending from Advisor
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 font-body mt-0.5">
                          {consultantName} will provide the Google Meet or Zoom link for this session. You will be notified in-app and via email as soon as it is posted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
