"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  User,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Save,
  Sparkles,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import {
  consultationsApi,
  type ConsultantSlotItem,
  type ConsultationBookingItem,
} from "@/lib/consultations/consultations-api";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";

export function ConsultantSessionsPage({ user }: { user: AuthUser }) {
  const [slots, setSlots] = useState<ConsultantSlotItem[]>([]);
  const [sessions, setSessions] = useState<ConsultationBookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New slot form state
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isSavingSlot, setIsSavingSlot] = useState(false);

  // Default meeting link preference
  const [defaultMeetingLink, setDefaultMeetingLink] = useState("");
  const [isSavingMeetingPref, setIsSavingMeetingPref] = useState(false);
  const [isEditingMeetingPref, setIsEditingMeetingPref] = useState(false);

  // Edit specific booking meeting link
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [customMeetingLink, setCustomMeetingLink] = useState("");
  const [isUpdatingBookingLink, setIsUpdatingBookingLink] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedSlots, fetchedSessions, earningsData] = await Promise.all([
        consultationsApi.getMySlots(),
        consultationsApi.getMyConsultantSessions(),
        consultationsApi.getEarningsBreakdown(),
      ]);

      setSlots(fetchedSlots);
      setSessions(fetchedSessions);
      if (earningsData?.profile?.defaultMeetingLink) {
        setDefaultMeetingLink(earningsData.profile.defaultMeetingLink);
      }
    } catch (err: any) {
      console.error("Failed to load sessions data", err);
      toast.apiError(err, "Failed to load consultation sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !startTime || !endTime) {
      toast.error("Please fill in slot date, start time, and end time.");
      return;
    }

    try {
      setIsSavingSlot(true);
      await consultationsApi.createSlot({
        slotDate,
        startTime,
        endTime,
        durationMinutes: Number(durationMinutes) || 60,
      });

      toast.success("Time slot added successfully!");
      setIsAddSlotOpen(false);
      setSlotDate("");
      loadData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create slot.";
      toast.error(msg);
    } finally {
      setIsSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to remove this availability slot?")) return;

    try {
      await consultationsApi.deleteSlot(slotId);
      toast.success("Availability slot removed.");
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete slot.";
      toast.error(msg);
    }
  };

  const handleSaveDefaultMeetingPreference = async () => {
    try {
      setIsSavingMeetingPref(true);
      await consultationsApi.updateDefaultMeetingPreference(defaultMeetingLink.trim());
      toast.success("Default meeting link updated!");
      setIsEditingMeetingPref(false);
    } catch (err: any) {
      toast.error("Failed to update meeting link preference.");
    } finally {
      setIsSavingMeetingPref(false);
    }
  };

  const handleSaveBookingMeetingLink = async (bookingId: string) => {
    if (!customMeetingLink.trim()) return;

    try {
      setIsUpdatingBookingLink(true);
      await consultationsApi.updateMeetingLink(bookingId, {
        meetingLink: customMeetingLink.trim(),
      });
      toast.success("Meeting link updated for this session!");
      setEditingBookingId(null);
      setCustomMeetingLink("");
      loadData();
    } catch (err: any) {
      toast.error("Failed to update meeting link.");
    } finally {
      setIsUpdatingBookingLink(false);
    }
  };

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Meeting link copied!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 font-heading">
            <Video className="w-3.5 h-3.5" />
            <span>1-on-1 Mentoring &amp; Live Sessions</span>
          </div>
          <h1 className="font-heading text-2xl font-black text-slate-900">
            Consultation Sessions &amp; Time Slots
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-body">
            Set your availability slots, manage video meeting links (Google Meet/Zoom), and join confirmed client sessions.
          </p>
        </div>

        <button
          onClick={() => setIsAddSlotOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold bg-[#064e3b] text-white hover:bg-[#043c2e] transition shadow-md cursor-pointer font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>Add Availability Slot</span>
        </button>
      </div>

      {/* Meeting Link Preference Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Default Video Meeting Preference (Google Meet / Zoom)
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Personal Video Meeting Room
            </h3>
            <p className="text-xs text-slate-500 font-body max-w-xl">
              Paste your standard Google Meet link (e.g. <code>meet.google.com/abc-defg-hij</code>) or personal Zoom link.
              New bookings will automatically use this room! (If left empty, a secure instant room is generated automatically).
            </p>
          </div>

          {!isEditingMeetingPref ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl max-w-xs truncate">
                {defaultMeetingLink || "Automatic Secure Room Generated"}
              </span>
              <button
                onClick={() => {
                  setIsEditingMeetingPref(true);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition font-heading flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="url"
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                value={defaultMeetingLink}
                onChange={(e) => setDefaultMeetingLink(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 w-full sm:w-72 font-mono"
              />
              <button
                onClick={handleSaveDefaultMeetingPreference}
                disabled={isSavingMeetingPref}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-heading transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setIsEditingMeetingPref(false)}
                className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-bold transition font-heading cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booked Client Sessions */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-lg text-slate-900">
              Confirmed Client Sessions ({sessions.length})
            </h2>
            <p className="text-xs text-slate-500 font-body">
              Clients who have booked and paid for 1-on-1 consultations with you.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <InvestraInlineLoader label="Loading booked client sessions..." />
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Video className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-heading font-bold text-sm text-slate-800">
              No sessions booked yet
            </h4>
            <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
              Once investors or entrepreneurs book an available slot, their details, agenda, and video call link will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((sess) => {
              const formattedDate = new Date(sess.slot.slotDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const isEditingLink = editingBookingId === sess.id;

              return (
                <div
                  key={sess.id}
                  className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition bg-white shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={sess.client?.image || "/placeholder-avatar.png"}
                        alt={sess.client?.firstName || "Client"}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-900">
                            {sess.client?.firstName} {sess.client?.lastName}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {sess.client?.role || "CLIENT"}
                          </span>
                          {sess.meetingLink ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                              Link Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                              Link Needed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-body">{sess.client?.email}</p>
                      </div>
                    </div>

                    {/* Financial split badge */}
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-heading">
                        Earned ${sess.consultantEarnings} (90%)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Gross ${sess.grossAmount} • 10% Platform Fee (${sess.platformFeeAmount})
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-heading">
                        Session Date &amp; Time
                      </span>
                      <span className="font-bold text-slate-800">
                        {formattedDate} • {sess.slot.startTime} - {sess.slot.endTime}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase font-heading">
                        Consultation Topic / Objective
                      </span>
                      <span className="font-bold text-slate-800 block">{sess.topic}</span>
                      {sess.clientNotes && (
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">
                          &ldquo;{sess.clientNotes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meeting Room Action Bar */}
                  {!sess.meetingLink ? (
                    <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-xs font-bold text-amber-950 font-heading">
                            Meeting Link Required: Add Link for this Session
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Action Needed
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 font-body">
                        Please provide a Google Meet or Zoom link for this session so {sess.client?.firstName || "the client"} can join. They will receive an instant notification once saved.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <input
                          type="url"
                          placeholder="https://meet.google.com/xxx-yyyy-zzz or Zoom link"
                          value={editingBookingId === sess.id ? customMeetingLink : ""}
                          onFocus={() => {
                            if (editingBookingId !== sess.id) {
                              setEditingBookingId(sess.id);
                              setCustomMeetingLink("");
                            }
                          }}
                          onChange={(e) => {
                            setEditingBookingId(sess.id);
                            setCustomMeetingLink(e.target.value);
                          }}
                          className="text-xs px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:border-emerald-600 bg-white w-full font-mono"
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          {defaultMeetingLink && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBookingId(sess.id);
                                setCustomMeetingLink(defaultMeetingLink);
                              }}
                              className="px-2.5 py-2 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition font-heading cursor-pointer whitespace-nowrap"
                              title="Paste default meeting preference"
                            >
                              Use Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSaveBookingMeetingLink(sess.id)}
                            disabled={isUpdatingBookingLink || (editingBookingId === sess.id && !customMeetingLink.trim())}
                            className="w-full sm:w-auto px-4 py-2 bg-[#064e3b] hover:bg-[#043c2e] text-white rounded-xl text-xs font-bold font-heading transition shrink-0 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Save &amp; Send to Client</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        {!isEditingLink ? (
                          <>
                            <span className="text-xs font-mono text-slate-700 truncate max-w-sm">
                              {sess.meetingLink}
                            </span>
                            <button
                              onClick={() => handleCopyLink(sess.meetingLink!, sess.id)}
                              className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                              title="Copy link"
                            >
                              {copiedId === sess.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingBookingId(sess.id);
                                setCustomMeetingLink(sess.meetingLink || "");
                              }}
                              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline ml-1 cursor-pointer font-heading"
                            >
                              Change Link
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="url"
                              value={customMeetingLink}
                              onChange={(e) => setCustomMeetingLink(e.target.value)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 w-full font-mono bg-white"
                            />
                            <button
                              onClick={() => handleSaveBookingMeetingLink(sess.id)}
                              disabled={isUpdatingBookingLink}
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold font-heading cursor-pointer disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingBookingId(null);
                                setCustomMeetingLink("");
                              }}
                              className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-bold cursor-pointer font-heading"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-[#064e3b] hover:bg-[#043c2e] text-white px-4 py-2 rounded-xl text-xs font-bold font-heading transition shadow-xs shrink-0 cursor-pointer"
                      >
                        <span>Join Meeting Room</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability Slots Management */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-lg text-slate-900">
              Your Open Time Slots ({slots.filter((s) => s.status === "AVAILABLE").length} Open)
            </h2>
            <p className="text-xs text-slate-500 font-body">
              These are the time slots visible to prospective clients on your public consultant page.
            </p>
          </div>
        </div>

        {slots.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-heading font-bold text-sm text-slate-800">
              No availability slots created
            </h4>
            <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
              Add your available dates and hours so investors and startups can book 1-on-1 sessions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((slot) => {
              const formattedDate = new Date(slot.slotDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              const isBooked = slot.status === "BOOKED";

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                    isBooked
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-slate-900">
                        {formattedDate}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isBooked
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-body">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{slot.startTime} - {slot.endTime} ({slot.durationMinutes}m)</span>
                    </div>
                  </div>

                  {!isBooked && (
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="self-end text-xs font-bold text-slate-400 hover:text-red-600 transition flex items-center gap-1 cursor-pointer font-heading"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-heading">
                Availability Manager
              </span>
              <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                Add Free Time Slot
              </h3>
              <p className="text-xs text-slate-500 font-body mt-1">
                Clients can book this slot until it is filled.
              </p>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                  Slot Date
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                    Start Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                    End Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 font-heading mb-1">
                  Session Duration (Minutes)
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (Standard)</option>
                  <option value={90}>90 Minutes</option>
                  <option value={120}>120 Minutes (Workshop)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingSlot}
                  className="w-full bg-[#064e3b] hover:bg-[#043c2e] text-white font-heading font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingSlot ? (
                    <InvestraInlineLoader label="Saving Slot..." />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Availability Slot</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-heading font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
