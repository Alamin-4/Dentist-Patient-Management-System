"use client";

import { Star, MapPin, Award } from "lucide-react";
import { GoShieldCheck } from "react-icons/go";
import { cn } from "@/lib/utils";

interface DentistCardProps {
  dentist: {
    id: string;
    name: string;
    slug: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    image: string;
    location: string;
    city: string;
    country: string;
    price: number;
    rdvScore: number;
    verified: string;
    status: string;
    isClaimable: boolean;
    procedures: string[];
    languages: string[];
    experience: number;
  };
  isCompareMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function DentistCard({
  dentist,
  isCompareMode,
  isSelected,
  onSelect,
}: DentistCardProps) {
  const getStatusInfo = () => {
    if (dentist.verified === "VERIFIED") {
      return {
        icon: "text-emerald-500",
        text: "VERIFIED",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
      };
    }
    if (dentist.status === "CLAIMED") {
      return {
        icon: "text-amber-500",
        text: "CLAIMED",
        textColor: "text-amber-600",
        bgColor: "bg-amber-50",
      };
    }
    return {
      icon: "text-slate-400",
      text: "UNCLAIMED",
      textColor: "text-slate-500",
      bgColor: "bg-slate-50",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={cn(
        "group relative rounded-xl p-5 sm:p-6 flex flex-col transition-all duration-300 border border-[#CEE0F4] hover:shadow-md bg-white",
        isSelected ? "border-[#10436B] bg-slate-50/20" : "",
        isCompareMode && "pl-10 sm:pl-12"
      )}
    >
      {/* Compare Checkbox */}
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

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full justify-between">
        {/* Left: Avatar + Status */}
        <div className="relative flex flex-col items-center gap-3 shrink-0">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50">
            <img
              src={dentist.image || `/images/man-avatar.png`}
              className="w-full h-full object-cover"
              alt={dentist.name}
            />
          </div>
          <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full", statusInfo.bgColor)}>
            <GoShieldCheck className={cn("size-4", statusInfo.icon)} />
            <span className={cn("text-[11px] font-bold uppercase tracking-wider whitespace-nowrap", statusInfo.textColor)}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0 mt-2 sm:mt-0 text-center sm:text-left">
          {/* Name */}
          <h4 className="font-bold text-[#1A1A2E] lg:text-lg mb-1 truncate">
            {dentist.name}
          </h4>

          {/* Specialty */}
          <p className="text-[#10436B] text-sm sm:text-base font-semibold mb-3">
            {dentist.specialty}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center sm:justify-start gap-1 flex-wrap text-sm mb-3">
            <span className="text-[#10436B] font-bold">{dentist.rating?.toFixed(1) || "0.0"}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(dentist.rating || 0) ? "#E3A32A" : "none"}
                  className={i < Math.floor(dentist.rating || 0) ? "text-[#E3A32A]" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-gray-400 font-medium ml-1">
              ({dentist.reviewCount || 0} Ratings)
            </span>
          </div>

          {/* RVD Score Badge */}
          {dentist.rdvScore > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-[#10436B]/10 to-[#10436B]/5 rounded-lg mb-3">
              <Award size={14} className="text-[#10436B]" />
              <span className="text-xs font-bold text-[#10436B]">
                RVD Score: {dentist.rdvScore}
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-600 mb-2">
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span className="truncate">
              {dentist.city && dentist.country
                ? `${dentist.city}, ${dentist.country}`
                : dentist.location || "Location not specified"}
            </span>
          </div>

          {/* Experience */}
          {dentist.experience > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-600 mb-2">
              <Award size={14} className="text-gray-400 shrink-0" />
              <span>{dentist.experience} years experience</span>
            </div>
          )}

          {/* Procedures */}
          {dentist.procedures && dentist.procedures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {dentist.procedures.slice(0, 3).map((proc: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#F4F9FD] text-[#10436B] text-xs font-semibold rounded-md"
                >
                  {proc}
                </span>
              ))}
              {dentist.procedures.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-md">
                  +{dentist.procedures.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Price */}
        <div className="text-center sm:text-right shrink-0 mt-3 sm:mt-0">
          <p className="text-[#6B7280] text-xs sm:text-sm font-medium">Starting from</p>
          <p className="text-[#0E3E65] font-extrabold text-lg lg:text-2xl mt-1">
            ${dentist.price ? dentist.price.toLocaleString() : "0"}
          </p>
          <p className="text-[10px] text-gray-400">Estimate</p>
        </div>
      </div>
    </div>
  );
}