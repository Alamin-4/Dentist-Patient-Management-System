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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";
import MiniCalendar from "@/app/(marketing)/schedule/_components/MiniCalendar";
import { normalizeApiError } from "@/core/api/error-handler";

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

interface TimeSlot {
  display: string;
  value: string;
}

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = 9 * 60 + 40; // 09:40 AM
  const endMinutes = 17 * 60;       // 05:00 PM
  const step = 15;

  const toAmPm = (h: number, m: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const to24h = (h: number, m: number) =>
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

  for (let m = startMinutes; m < endMinutes; m += step) {
    const startH = Math.floor(m / 60);
    const startM = m % 60;
    const endMTotal = m + step;
    const endH = Math.floor(endMTotal / 60);
    const endM = endMTotal % 60;

    slots.push({
      display: `${toAmPm(startH, startM)} to ${toAmPm(endH, endM)}`,
      value: `${to24h(startH, startM)} to ${to24h(endH, endM)}`,
    });
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

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
  const [selectedSlot, setSelectedSlot] = useState<string>(() => TIME_SLOTS[0].value);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedSlotDisplay = useMemo(() => {
    return TIME_SLOTS.find((s) => s.value === selectedSlot)?.display || selectedSlot;
  }, [selectedSlot]);

  const rescheduleMutation = useRescheduleConsultation();
  const scheduleMutation = useScheduleConsultation();

  const isInitialScheduling = consultation.requestStatus === "ACCEPTED";
  const isBookNewSlot = consultation.requestStatus === "COMPLETED";
  const activeMutation = isInitialScheduling ? scheduleMutation : rescheduleMutation;

  const queryClient = useQueryClient();
  const bookNewSlotMutation = useMutation({
    mutationFn: async (payload: {
      intakeId: string;
      dentistId: string;
      date: string;
      timeSlot: string;
      timezone: string;
    }) => {
      const response = await api.post(endpoints.consultations.confirm, {
        intakeId: payload.intakeId,
        scheduleSelections: [
          {
            dentistId: payload.dentistId,
            date: payload.date,
            timeSlot: payload.timeSlot,
            timezone: payload.timezone,
          },
        ],
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });

  const isPending = activeMutation.isPending || bookNewSlotMutation.isPending;

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
    setErrorMsg(null);
    onClose();
  };

  const handleConfirm = () => {
    setErrorMsg(null);
    const tzCode = selectedZone;
    const startTime = selectedSlot.split(" to ")[0]; // e.g. "09:40"

    if (isBookNewSlot) {
      const dentistId = consultation.dentistId || consultation.directoryEntryId;
      if (!dentistId) {
        toast.error("Dentist identifier not found");
        return;
      }
      bookNewSlotMutation.mutate(
        {
          intakeId: consultation.intakeId,
          dentistId: dentistId,
          date: selectedDateIso,
          timeSlot: selectedSlot,
          timezone: tzCode,
        },
        {
          onSuccess: () => {
            setPhase("success");
            onConfirmed?.();
          },
          onError: (err: any) => {
            const errMsg = normalizeApiError(err).message;
            setErrorMsg(errMsg);
            toast.error(errMsg);
          },
        }
      );
      return;
    }

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
          const errMsg = normalizeApiError(err).message;
          setErrorMsg(errMsg);
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-220 rounded-[28px] border-0 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.2)] bg-white max-h-[90vh] flex flex-col"
        showCloseButton={false}
      >
        {phase === "choose" ? (
          <div className="flex flex-col flex-1 overflow-hidden">
             <div className="flex items-center justify-between border-b border-[#EEF2F6] px-5 py-4 md:px-6 shrink-0">
              <DialogTitle className="text-[18px] font-bold text-[#1A1A2E]">
                {isBookNewSlot
                  ? "Book New Consultation"
                  : (isInitialScheduling ? "Schedule Consultation" : "Book new slot")}
              </DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                className="size-9 rounded-full flex items-center justify-center text-[#6B7280] transition-colors hover:bg-slate-100 hover:text-[#1A1A2E]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 px-5 py-5 md:px-6">
              <div>
                <p className="text-[16px] font-bold text-[#1A1A2E]">
                  Pick an available slot
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  {isBookNewSlot
                    ? `Choose a preferred date and time to book your new video consultation with ${doctorName}.`
                    : (isInitialScheduling
                        ? `Choose a preferred date and time to schedule your video consultation with ${doctorName}.`
                        : `These are ${doctorName}'s available times in the next 24 hours. Choose one to rebook your consultation.`)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left column: Select Date */}
                <div className="md:col-span-7 rounded-2xl border border-[#E6EEF6] bg-white p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A2E] mb-3">
                      Select Date
                    </p>
                    <MiniCalendar
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setErrorMsg(null);
                        }
                      }}
                      fullWidth
                      className="w-full border-0 p-0 shadow-none"
                    />
                  </div>
                  <p className="mt-4 text-[13px] sm:text-[14px] font-bold text-[#0F3659] bg-[#F1F6FB] px-3.5 py-2.5 rounded-lg text-center md:text-left">
                    Selected Date: {selectedDateReadable}
                  </p>
                </div>

                {/* Right column: Timezone and Time Slots */}
                <div className="md:col-span-5 rounded-2xl border border-[#E6EEF6] bg-white p-4 flex flex-col justify-between min-h-[300px] md:min-h-auto">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#1A1A2E]">
                        Select Time Zone
                      </label>
                      <Select
                        value={selectedZone}
                        onValueChange={(val) => {
                          setSelectedZone(val);
                          setErrorMsg(null);
                        }}
                      >
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white text-[13px] text-[#1A1A2E] focus:ring-[#113254]">
                          <SelectValue placeholder="Select Time Zone" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-[#E5E7EB] bg-white">
                          {TIME_ZONES.map((zone) => (
                            <SelectItem key={zone} value={zone} className="py-2.5 text-xs">
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <p className="mb-2.5 text-[13px] font-semibold text-[#1A1A2E]">
                        Select Time
                      </p>
                      <div className="flex flex-wrap gap-2 max-h-56 md:max-h-64 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = slot.value === selectedSlot;
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot.value);
                                setErrorMsg(null);
                              }}
                              className={`rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${isSelected
                                ? "border-[#113254] bg-[#F1F6FB] text-[#113254]"
                                : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#113254]/30"
                                }`}
                            >
                              {slot.display}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2">
                      <span className="font-semibold shrink-0">Error:</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-[#EEF2F6] px-5 py-4 md:px-6 shrink-0">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="rounded-lg bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Confirming..." : "Confirm Slot"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center md:px-10 md:py-14">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#113254] text-white shadow-[0_8px_24px_rgba(17,50,84,0.25)]">
              <Check className="size-10 stroke-[3px]" />
            </div>
            <h3 className="mt-8 text-[28px] font-bold text-[#1A1A2E]">
              {isBookNewSlot
                ? "New consultation booked"
                : (isInitialScheduling ? "Consultation scheduled" : "New slot confirmed")}
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#64748B]">
              {isBookNewSlot
                ? `Your new consultation slot with ${doctorName} has been successfully booked for ${selectedDateReadable} during ${selectedSlotDisplay} in ${selectedZone}.`
                : (isInitialScheduling
                    ? `Your consultation with ${doctorName} has been successfully scheduled for ${selectedDateReadable} during ${selectedSlotDisplay} in ${selectedZone}.`
                    : `Your consultation with ${doctorName} is rebooked for ${selectedDateReadable} during ${selectedSlotDisplay} in ${selectedZone}. Don't miss it, this is your last chance.`
                  )
              }
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
