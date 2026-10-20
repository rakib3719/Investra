"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getChatSocket } from "./chatSocket";
import type { DirectMessageItem } from "@/lib/api/messages";

interface UseChatSocketOptions {
  activeConversationId?: string | null;
  onNewMessage?: (message: DirectMessageItem, conversationId: string) => void;
  onConversationUpdated?: (update: {
    conversationId: string;
    lastMessageText: string;
    lastMessageAt: string;
    unreadCount: number;
    message?: any;
  }) => void;
  onUserTyping?: (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
  onMessagesRead?: (data: { conversationId: string; readByUserId: string }) => void;
}

export function useChatSocket({
  activeConversationId,
  onNewMessage,
  onConversationUpdated,
  onUserTyping,
  onMessagesRead,
}: UseChatSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store callbacks in refs to avoid re-subscribing socket listeners on every render
  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  const onConversationUpdatedRef = useRef(onConversationUpdated);
  onConversationUpdatedRef.current = onConversationUpdated;

  const onUserTypingRef = useRef(onUserTyping);
  onUserTypingRef.current = onUserTyping;

  const onMessagesReadRef = useRef(onMessagesRead);
  onMessagesReadRef.current = onMessagesRead;

  // Active conversation room join & event bindings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = getChatSocket();
    if (!socket) return;

    function handleConnect() {
      setIsConnected(true);
      if (activeConversationId) {
        socket.emit("joinConversation", { conversationId: activeConversationId });
      }
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    function handleNewMessage(data: { conversationId: string; message: DirectMessageItem }) {
      if (onNewMessageRef.current && data?.message) {
        onNewMessageRef.current(data.message, data.conversationId);
      }
    }

    function handleConversationUpdated(data: {
      conversationId: string;
      lastMessageText: string;
      lastMessageAt: string;
      unreadCount: number;
      message?: any;
    }) {
      if (onConversationUpdatedRef.current && data) {
        onConversationUpdatedRef.current(data);
      }
    }

    function handleUserTyping(data: { conversationId: string; userId: string; isTyping: boolean }) {
      if (data.conversationId === activeConversationId) {
        setIsOtherUserTyping(data.isTyping);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (data.isTyping) {
          // Auto-clear typing indicator after 3 seconds of inactivity
          typingTimeoutRef.current = setTimeout(() => {
            setIsOtherUserTyping(false);
          }, 3000);
        }
      }

      if (onUserTypingRef.current) {
        onUserTypingRef.current(data);
      }
    }

    function handleMessagesRead(data: { conversationId: string; readByUserId: string }) {
      if (onMessagesReadRef.current && data) {
        onMessagesReadRef.current(data);
      }
    }

    if (socket.connected) {
      setIsConnected(true);
      if (activeConversationId) {
        socket.emit("joinConversation", { conversationId: activeConversationId });
      }
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("conversationUpdated", handleConversationUpdated);
    socket.on("userTyping", handleUserTyping);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      if (activeConversationId) {
        socket.emit("leaveConversation", { conversationId: activeConversationId });
      }
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("conversationUpdated", handleConversationUpdated);
      socket.off("userTyping", handleUserTyping);
      socket.off("messagesRead", handleMessagesRead);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeConversationId]);

  // Emit typing status
  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeConversationId) return;
      const socket = getChatSocket();
      if (socket?.connected) {
        socket.emit("typing", {
          conversationId: activeConversationId,
          isTyping,
        });
      }
    },
    [activeConversationId]
  );

  // Emit mark as read
  const emitMarkAsRead = useCallback(
    (convId?: string) => {
      const targetId = convId || activeConversationId;
      if (!targetId) return;
      const socket = getChatSocket();
      if (socket?.connected) {
        socket.emit("markAsRead", { conversationId: targetId });
      }
    },
    [activeConversationId]
  );

  return {
    isConnected,
    isOtherUserTyping,
    emitTyping,
    emitMarkAsRead,
  };
}
