"use client";

import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:8080";
}

/**
 * Returns a shared Socket.IO instance configured for Render backend & Vercel frontend.
 * Uses websocket first with polling fallback and dynamic JWT auth.
 */
export function getChatSocket(): Socket {
  if (typeof window === "undefined") {
    // Return dummy socket or throw on SSR
    return null as unknown as Socket;
  }

  if (socketInstance) {
    // If token exists and socket is disconnected, try reconnecting
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  const socketUrl = getSocketUrl();

  socketInstance = io(socketUrl, {
    auth: (cb) => {
      const token = localStorage.getItem("investra_access_token") || "";
      cb({ token });
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });

  socketInstance.on("connect", () => {
    // Connection established
  });

  socketInstance.on("connect_error", (error) => {
    console.warn("[Investra Socket] Connection error:", error.message);
  });

  return socketInstance;
}

/**
 * Disconnect socket cleanly (e.g. on user logout)
 */
export function disconnectChatSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
