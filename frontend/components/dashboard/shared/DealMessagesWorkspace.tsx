"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  CircleDollarSign,
  FileText,
  MessageSquare,
  Paperclip,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Video,
} from "lucide-react";
import {
  ConversationDetail,
  ConversationSummary,
  DirectMessageItem,
  MessagesApi,
} from "@/lib/api/messages";
import { uploadMediaPipeline } from "@/lib/api/media";
import { toast } from "@/lib/toast";
import { InvestraInlineLoader } from "@/components/ui/InvestraLoader";
import { IssueTermSheetModal } from "@/components/deals/IssueTermSheetModal";
import { useCurrentUserQuery } from "@/lib/auth/auth-hooks";
import { useChatSocket } from "@/lib/socket/useChatSocket";

interface DealMessagesWorkspaceProps {
  userRole: "INVESTOR" | "ENTREPRENEUR" | "CONSULTANT";
  initialConversationId?: string | null;
}

export function DealMessagesWorkspace({
  userRole,
  initialConversationId,
}: DealMessagesWorkspaceProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [activeConversation, setActiveConversation] = useState<ConversationDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachment, setAttachment] = useState<{
    fileUrl: string;
    fileName: string;
    mediaFileId?: string;
  } | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [isTermSheetModalOpen, setIsTermSheetModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: currentUser } = useCurrentUserQuery();
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { isConnected, isOtherUserTyping, emitTyping, emitMarkAsRead } = useChatSocket({
    activeConversationId,
    onNewMessage: (newMsg, conversationId) => {
      const isForActive = conversationId === activeConversationId;
      const isMe = currentUser?.id ? newMsg.senderId === currentUser.id : newMsg.isMe;

      if (isForActive) {
        setActiveConversation((prev) => {
          if (!prev) return prev;
          if (prev.messages.some((m) => m.id === newMsg.id)) return prev;
          return {
            ...prev,
            lastMessageText: newMsg.content,
            lastMessageAt: newMsg.createdAt,
            messages: [...prev.messages, { ...newMsg, isMe }],
          };
        });

        if (!isMe) {
          emitMarkAsRead(conversationId);
        }
      }

      setConversations((prev) => {
        const found = prev.find((c) => c.id === conversationId);
        if (!found) {
          loadConversations(true);
          return prev;
        }
        return prev
          .map((c) => {
            if (c.id === conversationId) {
              const unread = isForActive || isMe ? 0 : c.unreadCount + 1;
              return {
                ...c,
                lastMessageText: newMsg.content,
                lastMessageAt: newMsg.createdAt,
                unreadCount: unread,
              };
            }
            return c;
          })
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt || 0).getTime() -
              new Date(a.lastMessageAt || 0).getTime()
          );
      });
    },
    onConversationUpdated: (update) => {
      setConversations((prev) => {
        const found = prev.find((c) => c.id === update.conversationId);
        if (!found) {
          loadConversations(true);
          return prev;
        }
        return prev
          .map((c) =>
            c.id === update.conversationId
              ? {
                  ...c,
                  lastMessageText: update.lastMessageText,
                  lastMessageAt: update.lastMessageAt,
                  unreadCount:
                    c.id === activeConversationId ? 0 : update.unreadCount,
                }
              : c
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt || 0).getTime() -
              new Date(a.lastMessageAt || 0).getTime()
          );
      });
    },
    onMessagesRead: (data) => {
      if (data.conversationId === activeConversationId) {
        setActiveConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map((m) => ({ ...m, isRead: true })),
          };
        });
      }
    },
  });

  // Handle typing input with debounce
  function handleMessageInputChange(val: string) {
    setMessageInput(val);
    emitTyping(true);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2500);
  }

  // Load conversations list
  async function loadConversations(keepActive = true) {
    try {
      const list = await MessagesApi.getConversations();
      setConversations(list);

      // If no active conversation yet or initial specified, select first
      if (!keepActive || !activeConversationId) {
        if (initialConversationId && list.some((c) => c.id === initialConversationId)) {
          setActiveConversationId(initialConversationId);
        } else if (list.length > 0) {
          setActiveConversationId(list[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setIsLoadingList(false);
    }
  }

  // Load specific conversation messages
  async function loadActiveConversation(convId: string) {
    setIsLoadingDetail(true);
    try {
      const detail = await MessagesApi.getConversation(convId);
      setActiveConversation(detail);
      // Update local unread in list
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
      emitMarkAsRead(convId);
    } catch (err: any) {
      console.error("Failed to load conversation details", err);
      toast.error("Failed to load message thread");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  // Initial load & gentle 30-second fallback sync
  useEffect(() => {
    loadConversations(false);
    const interval = setInterval(() => {
      loadConversations(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // When active conversation ID changes, load messages
  useEffect(() => {
    if (activeConversationId) {
      loadActiveConversation(activeConversationId);
    } else {
      setActiveConversation(null);
    }
  }, [activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Handle file attachment upload
  async function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttachment(true);
    try {
      const confirmed = await uploadMediaPipeline(file, "CHAT_ATTACHMENT");
      setAttachment({
        fileUrl: confirmed.url || "",
        fileName: file.name,
        mediaFileId: confirmed.id,
      });
      toast.success(`Attached "${file.name}"`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload file");
    } finally {
      setIsUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Send message
  async function handleSendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!activeConversationId) return;
    const trimmed = messageInput.trim();
    if (!trimmed && !attachment) return;

    setIsSending(true);
    try {
      const newMsg = await MessagesApi.sendMessage(activeConversationId, {
        content: trimmed || (attachment ? `Attached file: ${attachment.fileName}` : ""),
        attachmentName: attachment?.fileName,
        attachmentUrl: attachment?.fileUrl,
        mediaFileId: attachment?.mediaFileId,
      });

      // Append locally
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessageText: newMsg.content,
              lastMessageAt: newMsg.createdAt,
              messages: [...prev.messages, newMsg],
            }
          : prev
      );

      // Update in conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessageText: newMsg.content,
                lastMessageAt: newMsg.createdAt,
              }
            : c
        )
      );

      setMessageInput("");
      setAttachment(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = c.otherParticipant?.fullName?.toLowerCase().includes(q);
    const subjectMatch = c.subject?.toLowerCase().includes(q);
    const companyMatch = c.otherParticipant?.company?.toLowerCase().includes(q);
    return nameMatch || subjectMatch || companyMatch;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[740px] flex flex-col">
      <div className="grid flex-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left Sidebar: Conversations List */}
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r flex flex-col bg-slate-50/50">
          <div className="border-b border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif">Deal Rooms & Inbox</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {conversations.length} active discussion{conversations.length === 1 ? "" : "s"}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition ${
                  isConnected
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
                title={isConnected ? "Real-time socket active" : "Connecting real-time socket..."}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"
                  }`}
                />
                {isConnected ? "Live Socket" : "Connecting..."}
              </span>
            </div>

            <label className="mt-3.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search deals, founders, or investors..."
              />
            </label>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[660px]">
            {isLoadingList ? (
              <div className="p-8 text-center">
                <InvestraInlineLoader className="text-emerald-700" />
                <p className="mt-2 text-xs text-slate-500">Loading deal rooms...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No conversations yet</p>
                <p className="text-[11px] text-slate-400">
                  When a pitch introduction is accepted, your direct diligence deal room will appear here.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                const other = conv.otherParticipant;
                const initials = other?.fullName
                  ? other.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "U";

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`flex w-full gap-3 p-4 text-left transition ${
                      isActive ? "bg-emerald-50/70 border-l-4 border-l-emerald-600" : "hover:bg-slate-100/60"
                    }`}
                  >
                    {other?.image ? (
                      <img
                        src={other.image}
                        alt={other.fullName}
                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          isActive
                            ? "bg-emerald-700 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {initials}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="truncate text-xs font-bold text-slate-900">
                          {other?.fullName || "Member"}
                        </strong>
                        <span className="whitespace-nowrap text-[10px] text-slate-400">
                          {new Date(conv.lastMessageAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="truncate text-[11px] font-semibold text-emerald-800 mt-0.5">
                        {other?.company || conv.subject || other?.role}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
                          {conv.lastMessageText || "No messages yet"}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-emerald-600 px-1.5 text-[9px] font-bold text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Area: Active Message Thread */}
        <section className="flex flex-col bg-white">
          {isLoadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <InvestraInlineLoader className="text-emerald-700" />
              <p className="mt-3 text-xs text-slate-500">Opening deal room...</p>
            </div>
          ) : !activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <MessageSquare className="h-12 w-12 text-slate-300 stroke-[1.5]" />
              <h3 className="mt-3 text-sm font-bold text-slate-700">Select a Conversation</h3>
              <p className="mt-1 text-xs max-w-sm text-slate-500">
                Choose a conversation from the sidebar to review pitch discussion, share diligence documents, and negotiate terms.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                  {activeConversation.otherParticipant?.image ? (
                    <img
                      src={activeConversation.otherParticipant.image}
                      alt={activeConversation.otherParticipant.fullName}
                      className="h-11 w-11 rounded-full object-cover border border-emerald-200"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                      {activeConversation.otherParticipant?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "U"}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeConversation.otherParticipant?.fullName}
                      </h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                        {activeConversation.otherParticipant?.role === "INVESTOR"
                          ? "Verified Investor"
                          : "Verified Founder"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {activeConversation.otherParticipant?.company || activeConversation.subject} · {activeConversation.otherParticipant?.designation || "Executive"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* If user is Investor, allow Issuing Term Sheet right from chat! */}
                  {userRole === "INVESTOR" && (
                    <button
                      type="button"
                      onClick={() => setIsTermSheetModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
                    >
                      <Scale className="h-3.5 w-3.5" /> Issue Term Sheet
                    </button>
                  )}
                  <a
                    href={`mailto:${activeConversation.otherParticipant?.email}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Email
                  </a>
                </div>
              </header>

              {/* Deal Intro Summary Banner (If connected to an intro request) */}
              {activeConversation.introRequest && (
                <div className="bg-emerald-50/60 border-b border-emerald-100/80 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-emerald-700" />
                    <span>
                      <strong>Deal Target:</strong> {activeConversation.introRequest.startupName}
                      {activeConversation.introRequest.raisingAmount && ` · Round: ${activeConversation.introRequest.raisingAmount}`}
                      {activeConversation.introRequest.targetSector && ` (${activeConversation.introRequest.targetSector})`}
                    </span>
                  </div>
                  {activeConversation.introRequest.deckUrl && (
                    <a
                      href={activeConversation.introRequest.deckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 underline hover:text-emerald-900"
                    >
                      <FileText className="h-3.5 w-3.5" /> View Pitch Deck
                    </a>
                  )}
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-6 min-h-[380px] max-h-[500px]">
                {activeConversation.messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <p>No messages in this deal room yet. Send a note below to begin diligence discussions.</p>
                  </div>
                ) : (
                  activeConversation.messages.map((msg) => {
                    const isMe = msg.isMe || (currentUser?.id ? msg.senderId === currentUser.id : false);
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[82%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                      >
                        {!isMe && (
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                            {msg.senderName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </span>
                        )}

                        <div className={`space-y-1 ${isMe ? "text-right" : ""}`}>
                          <div
                            className={`p-4 text-xs leading-5 rounded-2xl shadow-sm text-left ${
                              isMe
                                ? "bg-[#065f46] text-white rounded-tr-sm"
                                : "bg-white text-slate-800 border border-slate-100 rounded-tl-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {/* Attachment Card */}
                            {msg.attachmentUrl && (
                              <a
                                href={msg.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-3 flex items-center gap-3 rounded-xl p-2.5 transition border ${
                                  isMe
                                    ? "bg-emerald-900/40 border-emerald-700/50 text-white hover:bg-emerald-900/60"
                                    : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                                }`}
                              >
                                <span className={`grid h-8 w-8 place-items-center rounded-lg ${isMe ? "bg-white/10" : "bg-emerald-100 text-emerald-800"}`}>
                                  <FileText className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <strong className="block text-xs truncate">
                                    {msg.attachmentName || "Attached Document"}
                                  </strong>
                                  <span className={`text-[10px] ${isMe ? "text-emerald-200" : "text-slate-400"}`}>
                                    Click to preview & download
                                  </span>
                                </div>
                              </a>
                            )}
                          </div>

                          <span className="block text-[10px] text-slate-400 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isMe && (
                              <CheckCheck
                                className={`inline-block ml-1 h-3 w-3 ${
                                  msg.isRead ? "text-emerald-600" : "text-slate-400"
                                }`}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Real-time Other Participant Typing Indicator */}
                {isOtherUserTyping && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/90 px-3.5 py-1.5 rounded-full w-fit border border-emerald-200/80 shadow-xs animate-pulse">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                    </span>
                    <span className="font-medium text-[11px]">
                      {activeConversation.otherParticipant?.fullName || "Participant"} is typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Footer */}
              <footer className="border-t border-slate-200 p-4 bg-white">
                {attachment && (
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold truncate max-w-xs">{attachment.fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  End-to-end encrypted deal room. Files stored in secure Cloudflare R2 vault.
                </div>

                <form onSubmit={handleSendMessage} className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 focus-within:border-emerald-600">
                  <label className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition">
                    <Paperclip className="h-4 w-4" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleAttachmentChange}
                      disabled={isUploadingAttachment}
                    />
                  </label>

                  <textarea
                    rows={1}
                    value={messageInput}
                    onChange={(e) => handleMessageInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      isUploadingAttachment
                        ? "Encrypting attachment..."
                        : "Write a message or press Enter to send..."
                    }
                    className="min-h-10 flex-1 resize-none py-2.5 text-xs text-slate-800 outline-none"
                    disabled={isUploadingAttachment || isSending}
                  />

                  <button
                    type="submit"
                    disabled={(!messageInput.trim() && !attachment) || isSending || isUploadingAttachment}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-[#065f46] hover:bg-[#044e39] text-white disabled:opacity-40 transition"
                  >
                    {isSending ? (
                      <InvestraInlineLoader className="text-white h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </footer>
            </>
          )}
        </section>
      </div>

      {/* Term Sheet Modal for Investor */}
      {isTermSheetModalOpen && activeConversation && (
        <IssueTermSheetModal
          isOpen={isTermSheetModalOpen}
          onClose={() => setIsTermSheetModalOpen(false)}
          defaultEntrepreneurId={activeConversation.otherParticipant?.id}
          defaultStartupName={activeConversation.introRequest?.startupName || activeConversation.subject}
          defaultIntroRequestId={activeConversation.introRequestId || undefined}
          onSuccess={() => {
            if (activeConversationId) {
              loadActiveConversation(activeConversationId);
            }
          }}
        />
      )}
    </div>
  );
}
