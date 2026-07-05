"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";

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

export function useConsultationChat(consultationId: string, currentUserId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
        }
      });
    });

    socket.on("new_message", (newMsg: ChatMessage) => {
      setMessages((prev) => [...prev, newMsg]);

      // Automatically send read receipt if we receive a message from the other party
      if (newMsg.senderId !== currentUserId) {
        socket.emit("message_read", { consultationId, messageId: newMsg.id });
      }
    });

    socket.on("typing", (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(data.isTyping);
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

  // 3. Send message action
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

  // 4. Send typing indicator action
  const sendTyping = useCallback(
    (typingState: boolean) => {
      if (!socketRef.current || !consultationId) return;
      socketRef.current.emit("typing", { consultationId, isTyping: typingState });
    },
    [consultationId]
  );

  // 5. Mark messages as read
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socketRef.current || !consultationId) return;
      socketRef.current.emit("message_read", { consultationId, messageId });
    },
    [consultationId]
  );

  return {
    messages,
    loading,
    isTyping,
    sendMessage,
    sendTyping,
    markAsRead,
  };
}
