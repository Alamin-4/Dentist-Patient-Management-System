"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Video, MessageSquare, CalendarDays } from "lucide-react";

interface ConsultationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  consultation: any;
  onChatClick?: () => void;
}

export function ConsultationDetailsModal({
  open,
  onClose,
  consultation,
  onChatClick,
}: ConsultationDetailsModalProps) {
  if (!consultation) return null;

  const dentist = consultation.dentist;
  const dentistName = dentist?.user
    ? `Dr. ${dentist.user.firstName ?? ""} ${dentist.user.lastName ?? ""}`.trim()
    : consultation.directoryEntry?.name
      ? `Dr. ${consultation.directoryEntry.name}`
      : "Your Dentist";

  const scheduledDateStr = consultation.scheduledDate
    ? new Date(consultation.scheduledDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Not scheduled";

  const scheduledTime = consultation.scheduledTime || "N/A";
  const timezone = consultation.timezone || "UTC";
  const duration = consultation.durationMinutes || 15;
  const procedure = consultation.intake?.procedureNames?.[0] || "Dental Consultation";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
        <DialogTitle className="sr-only">Consultation Details</DialogTitle>
        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
          <div className="size-16 rounded-full bg-[#113254]/5 flex items-center justify-center mb-6 shadow-lg">
            <Video className="size-8 text-[#113254]" />
          </div>

          <h2 className="text-[22px] font-black text-text mb-1">
            Upcoming Consultation
          </h2>
          <p className="text-[13px] text-sec-text">
            Your video session details are below
          </p>

          <div className="w-full mt-6 space-y-3 rounded-xl bg-[#F8FAFC] p-5 border border-gray-100 text-left">
            <div className="flex justify-between items-center text-sm border-b border-slate-100/50 pb-2">
              <span className="text-gray-500 font-medium">Dentist</span>
              <span className="text-text font-semibold">{dentistName}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100/50 pb-2">
              <span className="text-gray-500 font-medium">Procedure</span>
              <span className="text-text font-semibold">{procedure}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100/50 pb-2">
              <span className="text-gray-500 font-medium">Date</span>
              <span className="text-text font-semibold">{scheduledDateStr}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100/50 pb-2">
              <span className="text-gray-500 font-medium">Time</span>
              <span className="text-text font-semibold">{scheduledTime} ({timezone})</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-gray-500 font-medium">Duration</span>
              <span className="text-text font-semibold">{duration} minutes</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 leading-relaxed mt-6">
            The <strong className="text-[#113254] font-bold">Join Consultation</strong> button will appear on your dashboard 5 minutes before the scheduled time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border border-slate-200 text-text hover:bg-slate-50 font-bold text-[15px] rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              Close Details
            </button>
            {onChatClick && (
              <button
                type="button"
                onClick={onChatClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-bold text-[15px] rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquare className="size-4" />
                Chat Now
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
