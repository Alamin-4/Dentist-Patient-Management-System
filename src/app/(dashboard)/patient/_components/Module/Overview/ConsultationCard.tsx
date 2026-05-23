"use client";

import { useState } from "react";
import { Star, CheckCircle2, Plus } from "lucide-react";
import { AddToCalendarModal } from "./AddToCalendarModal";

export const ConsultationCard = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const appointment = {
    doctorName: "Dr. Eliza Mick",
    specialty: "Orthodontist",
    avatarSrc: "https://i.pravatar.cc/150?u=eliza-mick",
    date: "Tuesday, 29 April 2025",
    time: "10:30 AM EST",
    durationLabel: "15-min video call",
    isoDate: "2025-04-29",
  };

  return (
    <>
      <div className="bg-white border border-[#CEE0F4] rounded-lg p-6 last:mb-0 hover:border-[#113254]/30 transition-colors">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-gray-100">
          {/* Doctor profile */}
          <div className="flex gap-4">
            <div className="size-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
              <img
                src={appointment.avatarSrc}
                alt={appointment.doctorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#1A1A2E]">
                {appointment.doctorName}
              </h4>
              <p className="text-sm font-medium text-[#6B7280]">
                {appointment.specialty}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[#113254] font-bold text-sm">5</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-[#9CA3AF] text-xs font-medium ml-1">
                  (8 Ratings)
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  Verified
                </span>
              </div>
              {/* RDV Score badge */}
              <div className="inline-flex items-center gap-1.5 mt-2 border border-[#E5E7EB] rounded-lg px-3 py-1">
                <span className="text-[14px] font-black text-[#1A1A2E]">100</span>
                <span className="text-[11px] font-medium text-[#6B7280]">
                  RDV Score
                </span>
              </div>
            </div>
          </div>

          {/* Procedure */}
          <div className="flex flex-col lg:items-center">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Procedure
            </p>
            <p className="text-[15px] font-bold text-[#1A1A2E] mt-1">
              All-on-4 Full Arch
            </p>
          </div>

          {/* Budget */}
          <div className="lg:text-right">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Estimate Budget
            </p>
            <p className="text-[18px] font-bold text-[#113254] mt-1">
              $3,760 – $4,300
            </p>
            <div className="inline-block bg-[#F3F4F6] px-2.5 py-0.5 rounded-full mt-1">
              <span className="text-[11px] font-bold text-[#6B7280]">
                96%{" "}
                <span className="font-medium">Accuracy</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 gap-4">
          <div className="space-y-1">
            <p className="text-[15px] font-bold text-[#1A1A2E]">
              {appointment.date}
            </p>
            <p className="text-sm font-medium text-[#6B7280]">
              {appointment.time} · {appointment.durationLabel}
            </p>
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="flex items-center gap-1 text-[#113254] text-sm font-bold mt-1.5 hover:underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              <Plus className="w-4 h-4" />
              Add to calendar
            </button>
          </div>
          <button
            type="button"
            className="w-full sm:w-auto px-8 py-3 bg-[#113254] text-white font-bold text-[14px] rounded-xl hover:bg-[#0d2844] active:scale-95 transition-all"
          >
            Join Consultation
          </button>
        </div>
      </div>

      <AddToCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        appointment={appointment}
      />
    </>
  );
};
