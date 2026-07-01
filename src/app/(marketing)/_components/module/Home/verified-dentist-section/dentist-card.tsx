"use client";
import { Star } from "lucide-react";
import { GoShieldCheck } from "react-icons/go";
import { cn } from "@/lib/utils";

export default function DentistCard({
  dentist,
  isCompareMode,
  isSelected,
  onSelect,
  onBookConsultation,
  onRequestConsultation,
}: any) {
  console.log(dentist.image)
  return (
    <div
      className={cn(
        "group relative rounded-lg p-5 sm:p-6 flex flex-col transition-all duration-300 border border-[#CEE0F4] hover:shadow-md bg-white",
        isSelected ? "border-[#10436B] bg-slate-50/20" : "",
        isCompareMode && "pl-10 sm:pl-12"
      )}
    >
      {isCompareMode && (
        <button
          onClick={() => onSelect(dentist.id)}
          className={cn(
            "absolute top-4 left-3 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
            isSelected ? "bg-[#10436B] border-[#10436B]" : "bg-white border-gray-200"
          )}
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full justify-between">
        {/* Avatar + Verified Badge */}
        <div className="relative flex flex-col items-center gap-3 shrink-0">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img
              src={"dentist.image"}
              className="w-full h-full object-cover"
              alt={dentist.name}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <GoShieldCheck className={cn("size-4", dentist.verified === "VERIFIED" || dentist.verified === true ? "text-emerald-500" : dentist.status === "CLAIMED" ? "text-amber-500" : "text-slate-400")} />
            <span className={cn(
              "text-[11px] font-bold uppercase tracking-wider whitespace-nowrap",
              dentist.verified === "VERIFIED" || dentist.verified === true ? "text-emerald-600" : dentist.status === "CLAIMED" ? "text-amber-600" : "text-slate-500"
            )}>
              {dentist.verified === "VERIFIED" || dentist.verified === true ? "VERIFIED" : dentist.status === "CLAIMED" ? "CLAIMED" : "UNCLAIMED"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 mt-2 sm:mt-0">
          <h4 className="font-bold text-[#1A1A2E] lg:text-lg mb-1 truncate">
            {dentist.name}
          </h4>
          <p className="text-[#10436B] text-sm sm:text-base font-semibold mb-2">
            {dentist.specialty}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap text-sm">
            <span className="text-[#10436B] font-bold">{dentist.rating}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(dentist.rating) ? "#E3A32A" : "none"}
                  className={i < Math.floor(dentist.rating) ? "text-[#E3A32A]" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-gray-400 font-medium ml-1">({dentist.reviewCount} Ratings)</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-center sm:text-right shrink-0 mt-3 sm:mt-0">
          <p className="text-[#6B7280] text-xs sm:text-sm font-medium">Starting at</p>
          <p className="text-[#0E3E65] font-extrabold text-lg lg:text-2xl mt-1">
            ${dentist.price ? dentist.price.toLocaleString() : "1,500"}
          </p>
        </div>
      </div>

    </div>
  );
}