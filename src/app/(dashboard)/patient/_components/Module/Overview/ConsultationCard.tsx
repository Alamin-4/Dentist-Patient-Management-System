"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, Plus, Star } from "lucide-react";
import { AddToCalendarModal } from "./AddToCalendarModal";
import { ConsultationItem } from "@/types";

interface ConsultationCardProps {
  consultation: ConsultationItem;
  onPrimaryAction: () => void;
  onReschedule?: () => void;
}

export function ConsultationCard({
  consultation,
  onPrimaryAction,
  onReschedule,
}: ConsultationCardProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dentistUser = consultation.dentist?.user;
  const dentistDirectory = consultation.dentist?.dentistDirectory || consultation.directoryEntry;

  const doctorName = dentistUser
    ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim()
    : (dentistDirectory?.name ? `Dr. ${dentistDirectory.name}` : "Dentist");
  const specialty = consultation.dentist?.specialty?.name || dentistDirectory?.specialty || "General Dentist";
  const avatarSrc = dentistUser?.image || dentistDirectory?.image || "/images/dentist.png";

  const rating = dentistDirectory?.googleRating || dentistDirectory?.doctoraliaRating || 5;
  const reviewCount = dentistDirectory?.googleReviewCount || dentistDirectory?.doctoraliaReviewCount || 0;
  const rdvScore = consultation.dentist?.dentistVerificationProgress?.rvdScore || 100;

  const procedure = consultation.intake?.procedureNames?.[0] || "Dental Consultation";
  const estimateBudget = consultation.intake?.budget || "N/A";
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

  const isPending = consultation.requestStatus === "PENDING";
  const isAccepted = consultation.requestStatus === "ACCEPTED";
  const showRescheduleAction = consultation.requestStatus === "MISSED";

  let alertMessage = undefined;
  if (showRescheduleAction) {
    alertMessage = "You missed your consultation. You can book any available slot in the next 24 hours. After that, this option will expire.";
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
  }

  return (
    <>
      <div className="rounded-lg border border-[#CEE0F4] bg-white p-5 md:p-6 shadow-[0_1px_0_rgba(17,50,84,0.02)]">
        {alertMessage ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#FACC15]/40 bg-[#FFF7E6] px-4 py-3 text-[12px] leading-relaxed text-[#7A4A00]">
            <div className="mt-0.5 size-5 rounded-full bg-white flex items-center justify-center text-[#F59E0B] shrink-0">
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
                <h3 className="text-[16px] font-bold text-[#1A1A2E]">
                  {doctorName}
                </h3>
                <p className="text-[13px] font-medium text-[#6B7280]">
                  {specialty}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#9CA3AF]">
                <span className="flex items-center gap-1 text-[#113254] font-semibold">
                  <span className="text-[13px]">{rating}</span>
                  <span className="flex items-center gap-0.5 text-[#F5B000]">
                    {Array.from({ length: Math.round(rating) }).map((_, index) => (
                      <Star key={index} className="size-3.5 fill-current" />
                    ))}
                  </span>
                </span>
                <span>({reviewCount} Ratings)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#10B981]">
                <CheckCircle2 className="size-4" />
                Verified
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEE0F4] px-3 py-1.5 text-[#1A1A2E]">
                <span className="text-[14px] font-black">{rdvScore}</span>
                <span className="text-[11px] font-medium text-[#6B7280]">RDV Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Procedure
            </p>
            <p className="text-[15px] font-bold text-[#1A1A2E]">
              {procedure}
            </p>
            <p className="text-[13px] text-[#6B7280]">{timezone}</p>
          </div>

          <div className="space-y-1 lg:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Estimate Budget
            </p>
            <p className="text-[18px] font-bold text-[#113254]">
              {estimateBudget}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-[#EEF2F6] pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-[15px] font-bold text-[#1A1A2E]">{dateStr}</p>
            <p className="text-[13px] font-medium text-[#6B7280]">
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
              className={`w-full rounded-lg px-6 py-3 text-[14px] font-bold text-white transition-all sm:w-auto cursor-pointer ${
                isPending
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
      </div>

      <AddToCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        appointment={appointment}
      />
    </>
  );
}
