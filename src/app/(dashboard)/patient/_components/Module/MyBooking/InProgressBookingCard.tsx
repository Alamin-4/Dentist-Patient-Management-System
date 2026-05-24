"use client";

import Image from "next/image";
import { Star, Info, ShieldCheck, CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { InProgressBooking } from "./data";
import { useRouter } from "next/navigation";

interface Props {
  booking: InProgressBooking;
}

export default function InProgressBookingCard({ booking }: Props) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#CEE0F4] rounded-2xl overflow-hidden"
    >
      {/* Top Section */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Avatar + Badges */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100">
            <Image
              src={booking.doctor.image}
              alt={booking.doctor.name}
              fill
              className="object-cover"
            />
          </div>
          {booking.doctor.isVerified && (
            <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
              <ShieldCheck className="size-3.5 text-[#4CA30D]" />
              <span>VERIFIED</span>
            </div>
          )}
          <div className="border border-[#1A1A2E] rounded px-2 py-0.5 text-[11px] font-bold text-[#1A1A2E]">
            {booking.doctor.rdvScore} RDV Score
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-[#1A1A2E] leading-tight">
            {booking.doctor.name}
          </h2>
          <p className="text-sm text-[#475569] mt-0.5">{booking.doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="font-semibold text-sm text-[#1A1A2E] mr-0.5">
              {booking.doctor.rating}
            </span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < booking.doctor.rating
                    ? "fill-[#FBBF24] text-[#FBBF24]"
                    : "fill-slate-200 text-slate-200"
                )}
              />
            ))}
            <span className="text-slate-400 text-xs ml-0.5">
              ({booking.doctor.reviewCount} Ratings)
            </span>
          </div>
        </div>

        {/* Procedure */}
        <div className="shrink-0 space-y-1 min-w-[130px]">
          <p className="text-xs text-slate-500 font-medium">Procedure</p>
          <p className="text-sm font-semibold text-[#1A1A2E]">{booking.procedure}</p>
        </div>

        {/* Appointment Dates */}
        <div className="shrink-0 space-y-1 min-w-[170px]">
          <p className="text-xs text-slate-500 font-medium">Appointment Dates</p>
          <p className="text-sm font-semibold text-[#1A1A2E]">{booking.appointmentDate}</p>
        </div>

        {/* Estimate Budget */}
        <div className="shrink-0 space-y-1 text-right">
          <p className="text-xs text-slate-500 font-medium">Estimate Budget</p>
          <p className="text-xl font-bold text-[#0E3E65]">
            ${booking.estimateBudget.toLocaleString()}
          </p>
          {booking.paymentStatus === "in_escrow" && (
            <p className="text-xs font-bold text-[#CA8504] mt-0.5">In Escrow</p>
          )}
          {booking.paymentStatus === "paid" && (
            <p className="text-xs font-bold text-[#4CA30D] mt-0.5">Paid</p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-t border-slate-100 px-5 md:px-6 py-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {booking.progressSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {step.completed ? (
                <CheckCircle2 className="size-5 fill-[#0F3659] text-white shrink-0" />
              ) : (
                <Circle className="size-5 text-slate-300 shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm whitespace-nowrap",
                  step.completed ? "text-[#1A1A2E] font-medium" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="border-t border-slate-100 px-5 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-2">
          <Info className="size-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500 leading-relaxed">{booking.infoMessage}</p>
        </div>
        <button
          onClick={() => router.push(`/patient/bookings/treatment/${booking.slug}`)}
          className="shrink-0 bg-[#0F3659] hover:bg-[#0A2640] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
