"use client";

import Image from "next/image";
import { Star, Info, ShieldCheck, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";
import { TreatmentPlanItem } from "@/types";

interface CardProps {
  data: TreatmentPlanItem;
}

const DoctorCard = ({ data }: CardProps) => {
  const router = useRouter();
  const stateContext = useStateContext() as { activeTab: string } | null;
  const activeTab = stateContext?.activeTab || "estimate";

  const dentistUser = data.dentist?.user;
  const doctorName = dentistUser ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim() : "Dentist";
  const specialty = data.dentist?.specialty?.name || "Dentist";
  const avatarSrc = dentistUser?.image || "/images/dentist.png";

  const dentistDirectory = data.dentist?.dentistDirectory;
  const rating = dentistDirectory?.googleRating || dentistDirectory?.doctoraliaRating || 5;
  const reviewCount = dentistDirectory?.googleReviewCount || dentistDirectory?.doctoraliaReviewCount || 0;

  const totalEstimate = data.lineItems
    ? data.lineItems.reduce((acc: number, item) => acc + Number(item.unitPrice), 0)
    : 0;

  const procedureName = data.lineItems?.[0]?.globalProcedure?.name || "Dental Treatment";

  let estimateStatus = "pending";
  let paymentStatus = "pending";

  if (data.status === "PROPOSED") {
    estimateStatus = "accepted";
    paymentStatus = "pending";
  } else if (data.status === "ACTIVE" || data.status === "COMPLETED") {
    estimateStatus = "accepted";
    paymentStatus = "paid";
  } else if (data.status === "CANCELLED") {
    estimateStatus = "rejected";
  }

  const isPaid = paymentStatus === "paid";
  const isAccepted = estimateStatus === "accepted";
  const slug = data.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-lg border border-border overflow-hidden"
    >
      {/* Main Content Area */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-16 lg:w-20 h-16 lg:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50">
            <Image
              src={avatarSrc}
              alt={doctorName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-text">
            <ShieldCheck className="size-4 text-badge" />
            VERIFIED
          </div>
        </div>

        {/* Middle: Doctor Info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-text">
              {doctorName}
            </h2>
            {(data.consultationId || data.consultation?.id) && (
              <button
                onClick={() =>
                  router.push(`/patient/messages?chatId=${data.consultationId || data.consultation?.id}`)
                }
                title="Message Dentist"
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-[#113254] rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
              >
                <MessageSquare size={14} />
              </button>
            )}
          </div>
          <p className="text-base font-medium text-[#475569]">
            {specialty}
          </p>
          <div className="flex items-center gap-1 pt-1">
            <span className="text-text font-semibold mr-1">
              {rating}
            </span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < rating
                    ? "fill-[#FBBF24] text-[#FBBF24]"
                    : "text-slate-200"
                )}
              />
            ))}
            <span className="text-slate-400 text-xs ml-1">
              ({reviewCount} Ratings)
            </span>
          </div>
        </div>

        {/* Right: Procedure Info */}
        <div className="flex-1 space-y-1">
          <p className="text-slate-500 text-sm font-medium">Procedure</p>
          <p className="text-lg font-semibold text-text">
            {procedureName}
          </p>
        </div>
        {activeTab === "treatment" && isAccepted && (
          <div className="flex-1 space-y-1">
            <p className="text-slate-500 text-sm font-medium">Next Step</p>
            <p className="text-lg font-semibold text-[#CA8504]">
              Pending Travel
            </p>
          </div>
        )}

        {/* Action Area: Logic Swaps Here */}
        <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
          {isAccepted ? (
            <div className="text-right">
              <p className="text-sec-text text-sm font-medium mb-1">
                Estimate Budget
              </p>
              <p className="lg:text-xl font-bold text-primary">
                ${totalEstimate.toLocaleString()}
              </p>
              {isPaid && (
                <p className="text-badge text-sm font-bold pt-2">
                  In Escrow
                </p>
              )}
            </div>
          ) : (
            <div className="text-right">
              <button className="w-full md:w-auto bg-[#F79009] hover:bg-[#EA580C] text-white px-4 py-2.5 rounded-lg text-sm transition-all">
                Estimate Pending
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-slate-500 text-sm leading-relaxed">
            {isPaid
              ? "Final price will be within 15% of this estimate. If it exceeds that, you can cancel for a full refund."
              : `${doctorName} is reviewing your case. Estimate expected within 24 hours.`}
          </p>
        </div>
        {isAccepted && activeTab === "estimate" && (
          <button
            onClick={() =>
              router.push(`/patient/bookings/review/${slug}`)
            }
            className="whitespace-nowrap bg-[#0F3659] hover:bg-[#0A2640] text-white px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Review full plan
          </button>
        )}
        {isPaid && activeTab === "treatment" && (
          <button
            onClick={() =>
              router.push(`/patient/bookings/treatment/${slug}`)
            }
            className="whitespace-nowrap bg-[#0F3659] hover:bg-[#0A2640] text-white px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorCard;