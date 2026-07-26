"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";
import { env } from "@/config/env";

export interface ChatMessage {
  id: string;
  consultationId: string;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    image: string | null;
  };
}

export function useConsultationChat(consultationId: string, currentUserId?: string, isChatOpen = false) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientStatus, setRecipientStatus] = useState<"online" | "offline">("offline");
  const socketRef = useRef<Socket | null>(null);

  const isChatOpenRef = useRef(isChatOpen);
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  // 1. Fetch initial message history
  useEffect(() => {
    if (!consultationId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get(endpoints.consultations.messages(consultationId));
        if (res.data?.success) {
          setMessages(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [consultationId]);

  // 2. Establish Socket.io connection
  useEffect(() => {
    if (!consultationId || !currentUserId) return;

    // Get cookie value of accessToken
    const token = typeof document !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1]
      : undefined;

    // Determine socket server URL
    const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
    let socketUrl = "http://localhost:5000";
    if (baseUrl) {
      try {
        socketUrl = new URL(baseUrl).origin;
      } catch (e) {
        // Fallback if URL parsing fails
      }
    }

    const socket = io(socketUrl, {
      withCredentials: true,
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ Connected to Socket.io server");
      // Join the consultation room
      socket.emit("join_room", { consultationId }, (res: any) => {
        if (!res?.success) {
          console.error("Failed to join chat room:", res?.message);
        } else {
          console.log(`Joined chat room for consultation: ${consultationId}`);
          if (res.otherUserStatus) {
            setRecipientStatus(res.otherUserStatus);
          }
        }
      });
    });

    socket.on("new_message", (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);

      // Automatically send read receipt if we receive a message from the other party AND chat is open
      if (newMsg.senderId !== currentUserId && isChatOpenRef.current) {
        socket.emit("message_read", { consultationId, messageId: newMsg.id });
      }
    });

    socket.on("typing", (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(data.isTyping);
      }
    });

    socket.on("user_status", (data: { userId: string; status: "online" | "offline" }) => {
      if (data.userId !== currentUserId) {
        setRecipientStatus(data.status);
      }
    });

    socket.on("message_read", (data: { messageId: string; userId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [consultationId, currentUserId]);

  // 3. Mark all unread messages as read when chat is opened
  useEffect(() => {
    if (isChatOpen && socketRef.current && messages.length > 0) {
      messages.forEach((msg) => {
        if (!msg.isRead && msg.senderId !== currentUserId) {
          socketRef.current?.emit("message_read", { consultationId, messageId: msg.id });
        }
      });
      // Mark as read in local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId !== currentUserId ? { ...msg, isRead: true } : msg
        )
      );
    }
  }, [isChatOpen, currentUserId, consultationId, messages.length]);

  // 4. Send message action
  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim() || !consultationId) return;

      socketRef.current.emit(
        "send_message",
        { consultationId, message: text },
        (res: any) => {
          if (res?.success && res?.data) {
            setMessages((prev) => [...prev, res.data]);
          } else {
            console.error("Failed to send message:", res?.message);
          }
        }
      );
    },
    [consultationId]
  );

  // 5. Send typing indicator action
  const sendTyping = useCallback(
    (typingState: boolean) => {
      if (!socketRef.current || !consultationId) return;
      socketRef.current.emit("typing", { consultationId, isTyping: typingState });
    },
    [consultationId]
  );

  // 6. Mark messages as read manually
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socketRef.current || !consultationId) return;
      socketRef.current.emit("message_read", { consultationId, messageId });
    },
    [consultationId]
  );

  const unreadCount = messages.filter(
    (msg) => !msg.isRead && msg.senderId !== currentUserId
  ).length;

  return {
    messages,
    loading,
    isTyping,
    unreadCount,
    sendMessage,
    sendTyping,
    markAsRead,
    recipientStatus,
  };
}
