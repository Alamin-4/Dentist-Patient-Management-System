"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Video } from "lucide-react";
import Image from "next/image";
import { Dentist } from "@/features/marketing/find-dentists-page-components/types";
import { DentistSelection, formatSlotToAmPm } from "./DentistScheduleCard";

interface ScheduleSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentists: Dentist[];
  selections: DentistSelection[];
  formatDate: (date: Date) => string;
  onGoToBookings: () => void;
}

export default function ScheduleSuccessModal({
  open,
  onOpenChange,
  dentists,
  selections,
  formatDate,
  onGoToBookings,
}: ScheduleSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
        <DialogTitle className="sr-only">Booking confirmed</DialogTitle>

        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Check icon */}
          <div className="size-16 rounded-full bg-[#113254] flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="size-9 text-white fill-white stroke-[#113254]" />
          </div>

          {/* Title */}
          <h2 className="text-[22px] font-black text-text mb-2">
            You&apos;re booked with{" "}
            {dentists
              .map((d, i) => (i === 0 ? d.name : `Dr ${d.name.split(" ").slice(-1)[0]}`))
              .join(" and ")}
          </h2>
          <p className="text-[14px] text-sec-text leading-relaxed max-w-sm">
            Your dentist will review your details before the consultation.
            Please have your photos, any X-rays, and a list of questions ready.
          </p>

          {/* Booked appointments */}
          <div className="w-full mt-6 rounded-lg border border-stroke overflow-hidden">
            {dentists.map((doc, i) => {
              const sel = selections[i];
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-4 p-4 border-b border-[#F3F4F6] last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={doc.image ?? "/images/man-avatar.png"}
                      alt={doc.name}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover shrink-0 bg-gray-100"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-text truncate">
                        {doc.name}
                      </p>
                      <p className="text-[12px] text-sec-text">
                        {doc.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-text">
                      {sel?.date ? formatDate(sel.date) : "0"}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF] flex items-center justify-end gap-1 mt-0.5">
                      {sel?.timeSlot
                        ? `${formatSlotToAmPm(sel.timeSlot)} ${sel.timezone ? "· " + sel.timezone.split(" ")[0] : ""}`.trim()
                        : ""}
                      {" · "}
                      <Video className="size-3.5 inline" /> 15-min video call
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onGoToBookings}
            className="mt-6 px-6 py-2 lg:px-8 lg:py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-medium rounded-lg active:scale-95 transition-all"
          >
            Go to My Consultation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
