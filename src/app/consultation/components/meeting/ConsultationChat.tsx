"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User as UserIcon, Loader2, Check, CheckCheck, ArrowLeft } from "lucide-react";
import { useConsultationChat } from "@/hooks/consultation/useConsultationChat";
import { Button } from "@/components/ui/button";

interface ConsultationChatProps {
  consultationId: string;
  currentUserId: string;
  recipientName: string;
  recipientAvatar?: string;
  onClose?: () => void;
  onBack?: () => void;
  theme?: "light" | "dark";

  // Lifted state/functions
  messages?: any[];
  loading?: boolean;
  isTyping?: boolean;
  sendMessage?: (text: string) => void;
  sendTyping?: (typingState: boolean) => void;
  recipientStatus?: "online" | "offline";
}

export function ConsultationChat({
  consultationId,
  currentUserId,
  recipientName,
  recipientAvatar,
  onClose,
  onBack,
  theme = "dark",
  messages: propMessages,
  loading: propLoading,
  isTyping: propIsTyping,
  sendMessage: propSendMessage,
  sendTyping: propSendTyping,
  recipientStatus: propRecipientStatus,
}: ConsultationChatProps) {
  // Call useConsultationChat conditionally if props are not provided
  const localChat = useConsultationChat(
    propMessages ? "" : consultationId,
    propMessages ? "" : currentUserId
  );

  const messages = propMessages !== undefined ? propMessages : localChat.messages;
  const loading = propLoading !== undefined ? propLoading : localChat.loading;
  const isTyping = propIsTyping !== undefined ? propIsTyping : localChat.isTyping;
  const sendMessage = propSendMessage !== undefined ? propSendMessage : localChat.sendMessage;
  const sendTyping = propSendTyping !== undefined ? propSendTyping : localChat.sendTyping;
  const recipientStatus = propRecipientStatus !== undefined ? propRecipientStatus : localChat.recipientStatus;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isLight = theme === "light";

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input.trim());
    setInput("");

    // Stop typing immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Trigger typing event
    sendTyping(true);

    // Debounce stop typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1500);
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full relative ${isLight
        ? "bg-white border-l border-slate-100 text-slate-800"
        : "bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl"
        }`}
    >
      {/* ── HEADER ── */}
      <div
        className={`flex items-center justify-between p-4 border-b backdrop-blur-md ${isLight
          ? "border-slate-100 bg-white"
          : "border-slate-800 bg-slate-950/80"
          }`}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className={`md:hidden size-8 p-0 rounded-lg mr-1 ${isLight
                ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}

          <div className="relative">
            {recipientAvatar ? (
              <img
                src={recipientAvatar}
                alt={recipientName}
                className={`size-10 rounded-full object-cover border ${isLight ? "border-slate-200" : "border-slate-700"
                  }`}
              />
            ) : (
              <div
                className={`size-10 rounded-full flex items-center justify-center border ${isLight
                  ? "bg-[#113254]/10 border-[#113254]/25 text-[#113254]"
                  : "bg-[#113254] border-slate-700 text-white/80"
                  }`}
              >
                <UserIcon className="size-5" />
              </div>
            )}
            {recipientStatus === "online" ? (
              <span className={`absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 animate-pulse ${isLight ? "border-white" : "border-slate-950"}`} />
            ) : (
              <span className={`absolute bottom-0 right-0 size-3 rounded-full bg-slate-400 border-2 ${isLight ? "border-white" : "border-slate-950"}`} />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight">{recipientName}</h4>
            {recipientStatus === "online" ? (
              <p
                className={`text-[10px] font-semibold mt-0.5 ${isLight ? "text-emerald-600" : "text-emerald-400"
                  }`}
              >
                Live Chat Connected
              </p>
            ) : (
              <p
                className={`text-[10px] font-semibold mt-0.5 ${isLight ? "text-slate-400" : "text-slate-550"
                  }`}
              >
                Offline
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            className={`size-8 p-0 rounded-lg ${isLight
              ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
          >
            ✕
          </Button>
        )}
      </div>

      {/* ── MESSAGES PANE ── */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent ${isLight ? "scrollbar-thumb-slate-200" : "scrollbar-thumb-slate-800"
          } ${(loading || messages.length === 0) ? "flex flex-col justify-center items-center" : ""}`}
      >
        {loading ? (
          <div
            className={`flex flex-col items-center justify-center gap-2 ${isLight ? "text-slate-400" : "text-slate-400"}`}
          >
            <Loader2
              className={`size-6 animate-spin ${isLight ? "text-[#113254]" : "text-blue-400"}`}
            />
            <p className="text-xs">Loading message history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center text-center p-6 max-w-60 ${isLight ? "text-slate-400" : "text-slate-500"
              }`}
          >
            <div
              className={`size-12 rounded-full flex items-center justify-center mb-3 ${isLight ? "bg-slate-100" : "bg-slate-800/40"
                }`}
            >
              💬
            </div>
            <h5 className="font-semibold text-sm">No Messages Yet</h5>
            <p className="text-xs mt-1 leading-relaxed">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${isMe
                    ? "bg-[#113254] text-white rounded-tr-none border border-blue-500/10"
                    : isLight
                      ? "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                      : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50"
                    }`}
                >
                  <p className="whitespace-pre-wrap break-all">{msg.message}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 mt-1 text-[10px] px-1 ${isLight ? "text-slate-400" : "text-slate-500"
                    }`}
                >
                  <span>{formatTime(msg.createdAt)}</span>
                  {isMe && (
                    <span>
                      {msg.isRead ? (
                        <CheckCheck
                          className={`size-3 ${isLight ? "text-blue-500" : "text-blue-400"
                            }`}
                        />
                      ) : (
                        <Check
                          className={`size-3 ${isLight ? "text-slate-350" : "text-slate-500"
                            }`}
                        />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* ── TYPING INDICATOR ── */}
        {isTyping && (
          <div
            className={`flex items-center gap-2 text-xs px-1 animate-pulse ${isLight ? "text-slate-500" : "text-slate-400"
              }`}
          >
            <div className="flex gap-1">
              <span className="size-1.5 rounded-full bg-slate-400 animate-bounce delay-75" />
              <span className="size-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
              <span className="size-1.5 rounded-full bg-slate-400 animate-bounce delay-300" />
            </div>
            <span>{recipientName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT FOOTER ── */}
      <form
        onSubmit={handleSend}
        className={`p-3 border-t flex items-center gap-2 ${isLight ? "border-slate-100 bg-slate-50/50" : "border-slate-800 bg-slate-950/40"
          }`}
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className={`flex-1 rounded px-6 py-3 text-[13px] transition-colors focus:outline-none focus:ring-1 focus:ring-[#113254]/20 focus:border-[#113254] ${isLight
            ? "bg-white border border-slate-200 text-slate-800 placeholder-slate-400"
            : "bg-slate-800 border border-slate-700/50 text-slate-100 placeholder-slate-500"
            }`}
        />
        <Button
          type="submit"
          disabled={!input.trim()}
          className="size-9 p-0 bg-[#113254] hover:bg-[#0e2a47] rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-all shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}