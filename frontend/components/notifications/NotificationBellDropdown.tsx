"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Video,
  Inbox,
  Handshake,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import {
  notificationsApi,
  type InAppNotification,
  type NotificationType,
} from "@/lib/notifications/notifications-api";
import { getChatSocket } from "@/lib/socket/chatSocket";
import { toast } from "@/lib/toast";

export function NotificationBellDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load initial notifications & count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getMyNotifications({ limit: 25 });
      setNotifications(res?.items || []);
      setUnreadCount(res?.unreadCount || 0);
    } catch {
      // User might be unauthenticated or offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Setup real-time socket listener
    const socket = getChatSocket();
    if (socket) {
      const handleNewNotification = (notif: InAppNotification) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
        toast.info(notif.message, {
          title: notif.title,
        });
      };

      socket.on("notification:new", handleNewNotification);

      return () => {
        socket.off("notification:new", handleNewNotification);
      };
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationsApi.deleteNotification(id);
      const wasUnread = notifications.find((n) => n.id === id)?.isRead === false;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif: InAppNotification) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "TERM_SHEET_RECEIVED":
      case "TERM_SHEET_RESPONDED":
        return <Handshake className="w-4 h-4 text-emerald-600" />;
      case "KYC_APPROVED":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "KYC_REJECTED":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "SESSION_BOOKED":
        return <Video className="w-4 h-4 text-teal-600" />;
      case "COURSE_ENROLLED":
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case "INTRO_REQUEST_RECEIVED":
        return <Inbox className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-black font-heading text-white ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-sm text-slate-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-heading cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 bg-white px-3 pt-2 text-xs font-heading font-bold text-slate-500">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                activeTab === "all"
                  ? "border-emerald-600 text-emerald-800 font-black"
                  : "border-transparent hover:text-slate-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-2 px-3 border-b-2 transition cursor-pointer ${
                activeTab === "unread"
                  ? "border-emerald-600 text-emerald-800 font-black"
                  : "border-transparent hover:text-slate-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading notifications...
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Check className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700 font-heading">
                  All caught up!
                </p>
                <p className="text-[11px] text-slate-400 font-body">
                  No {activeTab === "unread" ? "unread" : ""} notifications right now.
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50/80 transition cursor-pointer flex items-start gap-3 group relative ${
                    !notif.isRead ? "bg-emerald-50/30" : "bg-white"
                  }`}
                >
                  {/* Category Icon */}
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white transition shrink-0 mt-0.5 border border-slate-200/60">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`text-xs font-heading truncate ${
                          !notif.isRead
                            ? "font-black text-slate-900"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-body line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span>{getRelativeTime(notif.createdAt)}</span>
                      {notif.actionUrl && (
                        <span className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5">
                          <span>View</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons (Mark Read / Delete) */}
                  <div className="absolute top-3.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded transition"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
