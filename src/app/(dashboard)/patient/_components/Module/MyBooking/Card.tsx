"use client";

import Image from "next/image";
import { Star, Info, CircleCheck, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TreatmentPlan } from "./data";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/providers/StateProvider";

interface CardProps {
  data: TreatmentPlan;
}

const DoctorCard = ({ data }: CardProps) => {
  const router = useRouter();
  const { activeTab } = useStateContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-lg border border-[#CEE0F4] overflow-hidden"
    >
      {/* Main Content Area */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-16 lg:w-20 h-16 lg:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50">
            <Image
              src={data.doctor.image}
              alt={data.doctor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
            <ShieldCheck className="size-4 text-[#4CA30D]" />
            VERIFIED
          </div>
        </div>

        {/* Middle: Doctor Info */}
        <div className="flex-1 space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E]">
            {data.doctor.name}
          </h2>
          <p className="text-base font-medium text-[#475569]">
            {data.doctor.specialty}
          </p>
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[#1A1A2E] font-semibold mr-1">
              {data.doctor.rating}
            </span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < data.doctor.rating
                    ? "fill-[#FBBF24] text-[#FBBF24]"
                    : "text-slate-200",
                )}
              />
            ))}
            <span className="text-slate-400 text-xs ml-1">
              ({data.doctor.reviewCount} Ratings)
            </span>
          </div>
        </div>

        {/* Right: Procedure Info */}
        <div className="flex-1 space-y-1">
          <p className="text-slate-500 text-sm font-medium">Procedure</p>
          <p className="text-lg font-semibold text-[#1A1A2E]">
            {data.procedure.name}
          </p>
        </div>
        {activeTab === "treatment" && data.estimate_status === "accepted" && (
          <div className="flex-1 space-y-1">
            <p className="text-slate-500 text-sm font-medium">Next Step</p>
            <p className="text-lg font-semibold text-[#CA8504]">
              Pending Travel
            </p>
          </div>
        )}

        {/* Action Area: Logic Swaps Here */}
        <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
          {data.estimate_status === "accepted" ? (
            <div className="text-right">
              <p className="text-[#6B7280] text-sm font-medium mb-1">
                Estimate Budget
              </p>
              <p className="lg:text-xl font-bold text-[#0E3E65]">
                ${data.procedure.totalEstimate.toLocaleString()}
              </p>
              {data.payment_status === "paid" && (
                <p className="text-[#4CA30D] text-sm font-bold pt-2">
                  In Escrow
                </p>
              )}
            </div>
          ) : (
            <>
              <button className="w-full md:w-auto bg-[#F79009] hover:bg-[#EA580C] text-white px-4 py-2.5 rounded-lg text-sm transition-all">
                Estimate Pending
              </button>
              <div className="text-right">
                <p className="font-bold text-[#1A1A2E] text-lg tabular-nums">
                  {data.timeline.remainingTime}
                </p>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Time remaining
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-slate-500 text-sm leading-relaxed">
            {data.payment_status === "paid"
              ? "Final price will be within 15% of this estimate. If it exceeds that, you can cancel for a full refund."
              : `${data.doctor.name} is reviewing your case. Estimate expected within 24 hours.`}
          </p>
        </div>
        {data.estimate_status === "accepted" && activeTab === "estimate" && (
          <button
            onClick={() =>
              router.push(`/patient/bookings/review/${data.slug}`)
            }
            className="whitespace-nowrap bg-[#0F3659] hover:bg-[#0A2640] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Review full plan
          </button>
        )}
        {data.payment_status === "paid" && activeTab === "treatment" && (
          <button
            onClick={() =>
              router.push(`/patient/bookings/treatment/${data.slug}`)
            }
            className="whitespace-nowrap bg-[#0F3659] hover:bg-[#0A2640] text-white px-8 py-3 rounded-lg transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorCard;
