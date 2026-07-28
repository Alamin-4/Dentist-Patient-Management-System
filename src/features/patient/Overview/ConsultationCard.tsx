"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, Plus, Star, Info, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddToCalendarModal } from "./AddToCalendarModal";
import { ConsultationItem } from "@/types";

interface ConsultationCardProps {
  consultation: ConsultationItem;
  onPrimaryAction: () => void;
  onReschedule?: () => void;
  completedCount?: number;
}

const parseTimezoneOffsetMinutes = (tzStr?: string | null): number => {
  if (!tzStr) return 0;
  const regex = /(?:UTC|GMT)\s*([+-])\s*(\d+)(?::(\d+))?/;
  const match = tzStr.match(regex);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
  }
  if (tzStr.includes("EST")) return -5 * 60;
  if (tzStr.includes("CST")) return -6 * 60;
  if (tzStr.includes("MST")) return -7 * 60;
  if (tzStr.includes("PST")) return -8 * 60;
  if (tzStr.includes("CET")) return 1 * 60;
  if (tzStr.includes("AEST")) return 10 * 60;
  if (tzStr.includes("BST")) return 6 * 60;
  return 0;
};

const getConsultationStartUtcMs = (scheduledDate: string | Date, scheduledTime: string, timezoneStr?: string | null): number => {
  const dObj = new Date(scheduledDate);
  const year = dObj.getUTCFullYear();
  const month = dObj.getUTCMonth();
  const day = dObj.getUTCDate();

  const timeParts = scheduledTime.split(":");
  let hours = parseInt(timeParts[0], 10);
  let minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

  if (scheduledTime.toUpperCase().includes("PM") && hours < 12) {
    hours += 12;
  } else if (scheduledTime.toUpperCase().includes("AM") && hours === 12) {
    hours = 0;
  }

  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;

  const localUtcMs = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const offsetMinutes = parseTimezoneOffsetMinutes(timezoneStr);
  return localUtcMs - offsetMinutes * 60 * 1000;
};

export function ConsultationCard({
  consultation,
  onPrimaryAction,
  onReschedule,
  completedCount,
}: ConsultationCardProps) {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("24:00:00");

  const statusUpper = consultation.requestStatus?.toUpperCase();
  const isCompleted = statusUpper === "COMPLETED";

  useEffect(() => {
    if (!isCompleted || !consultation.scheduledDate || !consultation.scheduledTime) return;

    const startUtcMs = getConsultationStartUtcMs(
      consultation.scheduledDate,
      consultation.scheduledTime,
      consultation.timezone
    );
    const deadlineMs = startUtcMs + 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const diff = deadlineMs - Date.now();
      if (diff <= 0) {
        setTimeRemaining("00:00:00");
      } else {
        const hrs = Math.floor(diff / (3600 * 1000));
        const mins = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
        const secs = Math.floor((diff % (60 * 1000)) / 1000);

        const pad = (num: number) => String(num).padStart(2, '0');
        setTimeRemaining(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, consultation]);

  const dentistUser = consultation.dentist?.user;
  const dentistDirectory = consultation.dentist?.dentistDirectory || consultation.directoryEntry;

  const doctorName = dentistUser
    ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim()
    : (dentistDirectory?.name ? `Dr. ${dentistDirectory.name}` : "Dentist");
  const specialty = consultation.dentist?.specialty?.name || dentistDirectory?.specialty || "General Dentist";
  const avatarSrc = dentistUser?.image || dentistDirectory?.image || "/images/dentist.png";

  const rating = dentistDirectory?.googleRating || dentistDirectory?.doctoraliaRating || undefined;
  const reviewCount = dentistDirectory?.googleReviewCount || dentistDirectory?.doctoraliaReviewCount || 0;
  const rdvScore = consultation.dentist?.dentistVerificationProgress?.rvdScore || 100;

  const procedure = consultation?.intake?.procedureNames?.[0] || "Dental Consultation";
  const estimateBudget = consultation?.intake?.budget || "N/A";
  const timezone = consultation.timezone || "UTC";

  const dateStr = consultation.scheduledDate ? new Date(consultation.scheduledDate).toLocaleDateString() : "Not Scheduled";
  const timeStr = consultation.scheduledTime || "N/A";
  const duration = `${consultation.durationMinutes || 15}-minute video call`;

  const appointment = {
    doctorName,
    specialty,
    avatarSrc,
    date: dateStr,
    time: timeStr,
    durationLabel: duration,
    isoDate: consultation.scheduledDate || "",
  };

  const isPending = statusUpper === "PENDING";
  const isAccepted = statusUpper === "ACCEPTED";

  // Check if the scheduled time window has already passed
  const isExpired = (() => {
    if (isCompleted || statusUpper === "MISSED" || statusUpper === "CANCELLED") return false;
    if (!consultation.scheduledDate || !consultation.scheduledTime) return false;

    const startUtcMs = getConsultationStartUtcMs(
      consultation.scheduledDate,
      consultation.scheduledTime,
      consultation.timezone
    );
    const durationMin = consultation.durationMinutes || 15;
    const endMs = startUtcMs + durationMin * 60 * 1000;
    return Date.now() > endMs;
  })();

  const isWithinWindow = (() => {
    if (statusUpper !== "SCHEDULED" && statusUpper !== "ACTIVE") return false;
    if (!consultation.scheduledDate || !consultation.scheduledTime) return false;

    const startUtcMs = getConsultationStartUtcMs(
      consultation.scheduledDate,
      consultation.scheduledTime,
      consultation.timezone
    );
    const durationMin = consultation.durationMinutes || 15;
    const earlyMs = 5 * 60 * 1000;
    const now = Date.now();
    return now >= startUtcMs - earlyMs && now <= startUtcMs + durationMin * 60 * 1000;
  })();

  const showRescheduleAction = statusUpper === "MISSED" || isExpired;

  let alertMessage = undefined;
  if (showRescheduleAction) {
    alertMessage = `You missed your consultation. You can book any available slot ${doctorName} has in the next 24 hours. After that, this option will expire.`;
  } else if (isAccepted) {
    alertMessage = "Your consultation request has been approved by the doctor! Please select your preferred date and time to secure your slot.";
  } else if (isPending) {
    alertMessage = "Your request has been sent to the doctor and is awaiting review. We will notify you here once they approve it.";
  }

  let primaryActionLabel = "Join Consultation";
  if (showRescheduleAction) {
    primaryActionLabel = "Reschedule";
  } else if (isAccepted) {
    primaryActionLabel = "Schedule Slot";
  } else if (isPending) {
    primaryActionLabel = "Awaiting Approval";
  } else if (isCompleted) {
    primaryActionLabel = "Book New Slot";
  } else if (statusUpper === "SCHEDULED" && !isWithinWindow) {
    primaryActionLabel = "View Details";
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-white p-5 md:p-6 shadow-[0_1px_0_rgba(17,50,84,0.02)]">
        {alertMessage ? (
          <div className={`mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-[12px] leading-relaxed ${isCompleted
            ? "border-[#10B981]/30 bg-[#E8F8F5] text-[#065F46]"
            : "border-[#FACC15]/40 bg-[#FFF7E6] text-[#7A4A00]"
            }`}>
            <div className={`mt-0.5 size-5 rounded-full bg-white flex items-center justify-center shrink-0 ${isCompleted ? "text-[#10B981]" : "text-[#F59E0B]"
              }`}>
              <CalendarDays className="size-3.5" />
            </div>
            <p>{alertMessage}</p>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr_0.9fr] lg:items-start">
          <div className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F8FAFC]">
              <Image
                src={avatarSrc}
                alt={doctorName}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-text">
                    {doctorName}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/patient/messages?chatId=${consultation.id}`);
                    }}
                    title="Message Dentist"
                    className="p-1 bg-slate-50 hover:bg-slate-100 text-[#113254] rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
                <p className="text-[13px] font-medium text-sec-text">
                  {specialty}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#9CA3AF]">
                {rating !== undefined ? (
                  <>
                    <span className="flex items-center gap-1 text-[#113254] font-semibold">
                      <span className="text-[13px]">{rating}</span>
                      <span className="flex items-center gap-0.5 text-[#F5B000]">
                        {Array.from({ length: Math.round(rating) }).map((_, index) => (
                          <Star key={index} className="size-3.5 fill-current" />
                        ))}
                      </span>
                    </span>
                    <span>({reviewCount} Ratings)</span>
                  </>
                ) : (
                  <span className="text-[#9CA3AF]">No ratings yet</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#10B981]">
                <CheckCircle2 className="size-4" />
                Verified
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-text">
                  <span className="text-[14px] font-black">{rdvScore}</span>
                  <span className="text-[11px] font-medium text-sec-text">RDV Score</span>
                </div>

                {completedCount !== undefined && completedCount > 0 && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 text-emerald-800 shadow-[0_1px_2px_rgba(16,185,129,0.05)]">
                    <span className="text-[14px] font-black">{completedCount}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Completed Sessions</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Procedure
            </p>
            <p className="text-[15px] font-bold text-text">
              {procedure}
            </p>
            <p className="text-[13px] text-sec-text">{timezone}</p>
          </div>

          {isCompleted ? (
            <div className="flex flex-col items-end gap-1 lg:text-right">
              <span className="inline-flex items-center rounded-lg bg-[#FFF7E6] px-3 py-1.5 text-[12px] font-bold text-[#F79009] border border-[#FACC15]/20">
                Estimate Pending
              </span>
              <p className="text-[18px] font-mono font-bold text-text mt-1 leading-none">
                {timeRemaining}
              </p>
              <p className="text-[11px] font-medium text-[#9CA3AF]">
                Time remaining
              </p>
            </div>
          ) : (
            <div className="space-y-1 lg:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
                Estimate Budget
              </p>
              <p className="text-[18px] font-bold text-[#113254]">
                {estimateBudget}
              </p>
            </div>
          )}
        </div>

        {isCompleted ? (
          <div className="mt-5 flex items-start gap-3 border-t border-[#EEF2F6] pt-5">
            <div className="mt-0.5 size-5 rounded-full bg-slate-550/10 flex items-center justify-center shrink-0 text-slate-400">
              <Info className="size-3.5" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dr. {dentistUser?.lastName || dentistDirectory?.name?.split(" ").pop() || "dentist"} is reviewing your case. Estimate expected within 24 hours.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4 border-t border-[#EEF2F6] pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-[15px] font-bold text-text">{dateStr}</p>
              <p className="text-[13px] font-medium text-sec-text">
                {timeStr === "N/A" && (isPending || isAccepted) ? "Awaiting scheduling" : timeStr} · {duration}
              </p>
              {!isPending && !isAccepted && consultation.scheduledDate && (
                <button
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#113254] transition-opacity hover:opacity-80 cursor-pointer"
                >
                  <Plus className="size-4" />
                  Add to calendar
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <button
                type="button"
                onClick={onPrimaryAction}
                disabled={isPending}
                className={`w-full rounded-lg px-6 py-3 text-[14px] font-bold text-white transition-all sm:w-auto cursor-pointer ${isPending
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  : "bg-[#113254] hover:bg-[#0d2844] active:scale-95"
                  }`}
              >
                {primaryActionLabel}
              </button>
              {onReschedule && !isPending && !isAccepted ? (
                <button
                  type="button"
                  onClick={onReschedule}
                  className="text-[13px] font-semibold text-[#113254] transition-colors hover:text-[#0d2844] cursor-pointer"
                >
                  Need another slot?
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <AddToCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        appointment={appointment}
      />
    </>
  );
}
