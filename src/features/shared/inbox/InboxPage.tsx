"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, User as UserIcon, MessageSquare, Calendar, Clock, Loader2 } from "lucide-react";
import { useSession, useMe } from "@/hooks/auth/useAuth";
import { usePatientConsultations, useDentistConsultations } from "@/hooks/consultation/useConsultation";
import { ConsultationChat } from "@/app/consultation/components/meeting/ConsultationChat";

const getFriendlyStatus = (status: string) => {
  switch (status) {
    case "ACCEPTED":
    case "SCHEDULED":
      return "Upcoming";
    case "ACTIVE":
      return "Active";
    case "COMPLETED":
      return "Completed";
    case "MISSED":
      return "Missed";
    default:
      return status;
  }
};

const getStatusBadgeCls = (status: string, isSelected: boolean) => {
  if (isSelected) return "bg-white/15 text-white";
  switch (status) {
    case "ACCEPTED":
    case "SCHEDULED":
      return "bg-blue-50 text-blue-700 border border-blue-100";
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse";
    case "COMPLETED":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    case "MISSED":
      return "bg-rose-50 text-rose-700 border border-rose-100";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

export function InboxPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const [selectedId, setSelectedId] = useState<string | null>(chatId);

  useEffect(() => {
    if (chatId) {
      setSelectedId(chatId);
    }
  }, [chatId]);

  const { user } = useMe();
  const sessionQuery = useSession();
  const userId = sessionQuery.data?.user?.id || sessionQuery.data?.id;
  const userRole = user?.role || sessionQuery.data?.user?.role || "";

  // Fetch consultations based on user's role
  const patientRes = usePatientConsultations();
  const dentistRes = useDentistConsultations();

  const isDentist = userRole === "DENTIST";
  const consultationsQuery = isDentist ? dentistRes : patientRes;
  const consultations = consultationsQuery.data?.data || [];
  const isLoading = consultationsQuery.isLoading;

  const [searchTerm, setSearchTerm] = useState("");

  const activeChats = consultations.filter((item: any) => {
    return ["ACCEPTED", "SCHEDULED", "ACTIVE", "COMPLETED", "MISSED"].includes(item.requestStatus);
  });

  // Deduplicate conversations so we only show one thread per user pair,
  // but always preserve the selected/active chat if one is specified.
  const uniqueActiveChats = (() => {
    const groupedChatsMap = new Map<string, any>();
    
    activeChats.forEach((item: any) => {
      const key = isDentist 
        ? (item.patientId || item.intake?.email || item.id) 
        : (item.dentistId || item.directoryEntryId || item.id);
        
      const existing = groupedChatsMap.get(key);
      if (!existing) {
        groupedChatsMap.set(key, item);
      } else {
        if (item.id === selectedId) {
          groupedChatsMap.set(key, item);
        } else if (existing.id !== selectedId) {
          const existingDate = new Date(existing.scheduledDate || existing.createdAt).getTime();
          const itemDate = new Date(item.scheduledDate || item.createdAt).getTime();
          if (itemDate > existingDate) {
            groupedChatsMap.set(key, item);
          }
        }
      }
    });
    
    return Array.from(groupedChatsMap.values());
  })();

  const filteredChats = uniqueActiveChats.filter((item: any) => {
    const patientName = `${item.intake?.firstName || ""} ${item.intake?.lastName || ""}`.trim();
    const dentistName = item.dentist?.user?.name || item.directoryEntry?.name || "";
    const searchTarget = isDentist ? patientName : dentistName;
    return searchTarget.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedChat = activeChats.find((item: any) => item.id === selectedId);

  const getRecipientInfo = (item: any) => {
    const isPatientRole = !isDentist;
    const name = isPatientRole
      ? (item.dentist?.user ? `Dr. ${item.dentist.user.firstName ?? ""} ${item.dentist.user.lastName ?? ""}`.trim() : item.directoryEntry?.name ? `Dr. ${item.directoryEntry.name}` : "Dentist")
      : (item.intake ? `${item.intake.firstName} ${item.intake.lastName}`.trim() : "Patient");

    const avatar = isPatientRole ? (item.dentist?.user?.image || undefined) : undefined;
    const procedure = item.intake?.procedureNames?.[0] || "Dental Consultation";

    return { name, avatar, procedure };
  };

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden ">
      {/* ── LEFT PANEL: CONVERSATIONS LIST ── */}
      <div
        className={`${selectedId ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 flex-none flex flex-col border-r border-slate-100 bg-white`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conversations list container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 className="size-6 animate-spin text-[#163E5C]" />
              <p className="text-xs">Loading chats...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-20 px-4 text-slate-400">
              <p className="text-sm font-semibold">No Conversations Found</p>
              <p className="text-xs text-slate-500 mt-1">
                {searchTerm ? "No results match your search." : "Your accepted consultation chats will appear here."}
              </p>
            </div>
          ) : (
            filteredChats.map((item: any) => {
              const { name, avatar, procedure } = getRecipientInfo(item);
              const isSelected = item.id === selectedId;

              const dateStr = item.scheduledDate
                ? new Date(item.scheduledDate).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
                : "Not Scheduled";

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-3 transition-all flex items-start gap-3 cursor-pointer group ${isSelected
                    ? "bg-[#113254] text-white shadow-md shadow-[#113254]/10"
                    : "hover:bg-slate-100 text-slate-850"
                    }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className={`size-11 rounded-full object-cover border ${isSelected ? "border-white/20" : "border-slate-200"
                          }`}
                      />
                    ) : (
                      <div
                        className={`size-11 rounded-full flex items-center justify-center border ${isSelected
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                      >
                        <UserIcon className="size-5.5" />
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1 gap-1">
                      <h4
                        className={`font-semibold text-[14px] truncate ${isSelected ? "text-white" : "text-slate-800"
                          }`}
                      >
                        {name}
                      </h4>
                      <span
                        className={`text-[10px] whitespace-nowrap ${isSelected ? "text-white/60" : "text-slate-400"
                          }`}
                      >
                        {dateStr}
                      </span>
                    </div>

                    <p
                      className={`text-[12px] truncate ${isSelected ? "text-white/80" : "text-slate-550"
                        }`}
                    >
                      {procedure}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getStatusBadgeCls(item.requestStatus, isSelected)}`}
                      >
                        {getFriendlyStatus(item.requestStatus)}
                      </span>
                      {item.scheduledTime && (
                        <span
                          className={`text-[10px] flex items-center gap-1 ${isSelected ? "text-white/60" : "text-slate-400"
                            }`}
                        >
                          <Clock className="size-3" />
                          {item.scheduledTime}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div
        className={`${selectedId ? "flex" : "hidden md:flex"
          } flex-1 min-w-0 flex flex-col h-full`}
      >
        {selectedChat ? (
          (() => {
            const { name, avatar } = getRecipientInfo(selectedChat);
            return (
              <ConsultationChat
                key={selectedChat.id}
                consultationId={selectedChat.id}
                currentUserId={userId!}
                recipientName={name}
                recipientAvatar={avatar}
                theme="light"
                onBack={() => setSelectedId(null)}
              />
            );
          })()
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-50/20">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-[#113254]">
              <MessageSquare className="size-8 text-slate-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Your Inbox</h3>
            <p className="text-sm text-slate-550 mt-1 max-w-sm leading-relaxed">
              Select a conversation from the left sidebar to start chatting, sending instructions, and sharing messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
