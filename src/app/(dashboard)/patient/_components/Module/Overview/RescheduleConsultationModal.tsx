"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConsultationItem } from "@/types";
import { useRescheduleConsultation, useScheduleConsultation } from "@/hooks/consultation/useConsultation";
import MiniCalendar from "@/app/(marketing)/schedule/_components/MiniCalendar";

interface RescheduleConsultationModalProps {
  open: boolean;
  onClose: () => void;
  consultation: ConsultationItem;
  onAddToCalendar?: () => void;
  onConfirmed?: () => void;
}

const TIME_ZONES = [
  "Eastern Time (EST, UTC-5)",
  "Central Time (CST, UTC-6)",
  "Mountain Time (MST, UTC-7)",
  "Pacific Time (PST, UTC-8)",
  "Greenwich Mean Time (GMT, UTC+0)",
  "Central European Time (CET, UTC+1)",
  "Mexico City Time (CST, UTC-6)",
  "Australia Eastern (AEST, UTC+10)",
  "GMT+6 Time Zone (BST, GMT+6)",
];

const TIME_SLOTS = [
  "09:40 to 09:55",
  "10:00 to 10:15",
  "10:30 to 10:45",
  "10:45 to 11:00",
  "11:00 to 11:15",
  "11:15 to 11:30",
  "11:30 to 11:45",
  "12:00 to 12:15",
];

export function RescheduleConsultationModal({
  open,
  onClose,
  consultation,
  onAddToCalendar,
  onConfirmed,
}: RescheduleConsultationModalProps) {
  const [phase, setPhase] = useState<"choose" | "success">("choose");
  const [selectedZone, setSelectedZone] = useState(() => {
    try {
      const offsetMinutes = -new Date().getTimezoneOffset();
      const offsetHours = offsetMinutes / 60;
      const sign = offsetHours >= 0 ? "+" : "-";
      const absoluteHours = Math.abs(offsetHours);
      const formattedOffset = `${sign}${absoluteHours}`;

      const matched = TIME_ZONES.find((tz) => 
        tz.includes(`UTC${formattedOffset}`) || 
        tz.includes(`GMT${formattedOffset}`) || 
        tz.includes(`UTC${sign}0${absoluteHours}`) || 
        tz.includes(`GMT${sign}0${absoluteHours}`) ||
        (offsetHours === 0 && (tz.includes("UTC+0") || tz.includes("GMT+0") || tz.includes("UTC-0") || tz.includes("GMT-0")))
      );

      if (matched) return matched;
    } catch (e) {
      console.error("Failed to detect timezone", e);
    }
    return TIME_ZONES[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);

  const rescheduleMutation = useRescheduleConsultation();
  const scheduleMutation = useScheduleConsultation();

  const isInitialScheduling = consultation.requestStatus === "ACCEPTED";
  const activeMutation = isInitialScheduling ? scheduleMutation : rescheduleMutation;

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const selectedDateReadable = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const selectedDateIso = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const dentistUser = consultation.dentist?.user;
  const dentistDirectory = consultation.dentist?.dentistDirectory || consultation.directoryEntry;
  const doctorName = dentistUser
    ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim()
    : (dentistDirectory?.name ? `Dr. ${dentistDirectory.name}` : "Dentist");

  const handleClose = () => {
    setPhase("choose");
    onClose();
  };

  const handleConfirm = () => {
    const tzCode = selectedZone;
    const startTime = selectedSlot.split(" to ")[0]; // e.g. "09:40"
    const payload = isInitialScheduling
      ? {
        scheduledDate: selectedDateIso,
        scheduledTime: startTime,
        timezone: tzCode,
      }
      : {
        newDate: selectedDateIso,
        newTime: startTime,
        timezone: tzCode,
      };

    activeMutation.mutate(
      {
        id: consultation.id,
        payload: payload as any,
      },
      {
        onSuccess: () => {
          setPhase("success");
          onConfirmed?.();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || `Failed to ${isInitialScheduling ? "schedule" : "reschedule"} consultation`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-220 rounded-[28px] border-0 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.2)] bg-white"
        showCloseButton={false}
      >
        {phase === "choose" ? (
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF2F6] px-5 py-4 md:px-6">
              <DialogTitle className="text-[18px] font-bold text-[#1A1A2E]">
                {isInitialScheduling ? "Schedule Consultation" : "Book new slot"}
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                className="size-9 rounded-full flex items-center justify-center text-[#6B7280] transition-colors hover:bg-slate-100 hover:text-[#1A1A2E]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 md:px-6">
              <div>
                <p className="text-[16px] font-bold text-[#1A1A2E]">
                  Pick an available slot
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  {isInitialScheduling
                    ? `Choose a preferred date and time to schedule your video consultation with ${doctorName}.`
                    : `These are ${doctorName}'s available times in the next 24 hours. Choose one to rebook your consultation.`}
                </p>
              </div>

              <div className="rounded-lg border border-[#E6EEF6] bg-white p-0">
                <div className="px-4 py-4 md:px-5 border-b border-[#E6EEF6]">
                  <p className="text-[13px] font-semibold text-[#1A1A2E] mb-3">
                    Select Date
                  </p>
                  <MiniCalendar
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) setSelectedDate(date);
                    }}
                  />
                  <p className="mt-4 text-[15px] font-bold text-[#0F3659]">
                    Selected Date: {selectedDateReadable}
                  </p>
                </div>

                <div className="border-t border-[#E6EEF6] px-4 py-4 md:px-5">
                  <label className="mb-2 block text-[13px] font-semibold text-[#1A1A2E]">
                    Select Time Zone
                  </label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="h-12 rounded-lg border-[#E5E7EB] bg-white text-[14px] text-[#1A1A2E] focus:ring-[#113254]">
                      <SelectValue placeholder="Select Time Zone" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-[#E5E7EB] bg-white">
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone} className="py-3">
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-5">
                    <p className="mb-3 text-[13px] font-semibold text-[#1A1A2E]">
                      Select Time
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = slot === selectedSlot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all cursor-pointer ${isSelected
                              ? "border-[#113254] bg-[#F1F6FB] text-[#113254]"
                              : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#113254]/30"
                              }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-[#EEF2F6] px-5 py-4 md:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={activeMutation.isPending}
                className="rounded-lg bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {activeMutation.isPending ? "Confirming..." : "Confirm Slot"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center md:px-10 md:py-14">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#113254] text-white shadow-[0_8px_24px_rgba(17,50,84,0.25)]">
              <Check className="size-10 stroke-[3px]" />
            </div>
            <h3 className="mt-8 text-[28px] font-bold text-[#1A1A2E]">
              {isInitialScheduling ? "Consultation scheduled" : "New slot confirmed"}
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#64748B]">
              {isInitialScheduling
                ? `Your consultation with ${doctorName} has been successfully scheduled for ${selectedDateReadable} during ${selectedSlot} in ${selectedZone}.`
                : `Your consultation with ${doctorName} is rebooked for ${selectedDateReadable} during ${selectedSlot} in ${selectedZone}. Don't miss it, this is your last chance.`}
            </p>
            <button
              type="button"
              onClick={() => {
                onAddToCalendar?.();
                handleClose();
              }}
              className="mt-8 rounded-lg bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95 cursor-pointer"
            >
              Add to calendar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
