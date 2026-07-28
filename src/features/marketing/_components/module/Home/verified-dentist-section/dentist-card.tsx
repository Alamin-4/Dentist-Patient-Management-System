"use client";

import { Star, MapPin, Award, Globe } from "lucide-react";
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
    if (dentist.verified === "VERIFIED" || dentist.status === "VERIFIED") {
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
  console.log("dentist from home:", dentist)
  const isVerified = dentist.verified === "VERIFIED" || dentist.status === "VERIFIED";

  return (
    <div
      className={cn(
        "group relative rounded-xl p-4 sm:p-6 flex flex-col transition-all duration-300 border border-border hover:shadow-md bg-white",
        isSelected ? "border-[#10436B] bg-slate-50/20 ring-1 ring-[#10436B]/20" : "",
        isCompareMode && isVerified && "pl-10 sm:pl-12"
      )}
    >
      {isCompareMode && isVerified && (
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

      <div className="flex flex-col gap-4 w-full">

        <div className="flex items-start gap-3 sm:gap-4">

          <div className="relative flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50">
              <img
                src={dentist.image || `/images/man-avatar.png`}
                className="w-full h-full object-cover"
                alt={dentist.name}
              />
            </div>
            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-full", statusInfo.bgColor)}>
              {statusInfo.text !== "UNCLAIMED" && (
                <GoShieldCheck className={cn("size-3 sm:size-4", statusInfo.icon)} />
              )}
              <span className={cn("text-[9px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap", statusInfo.textColor)}>
                {dentist.status}
              </span>
            </div>
            {dentist.rdvScore > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-linear-to-r from-[#10436B]/10 to-[#10436B]/5 rounded-lg">
                <Award size={12} className="text-[#10436B]" />
                <span className="text-[10px] sm:text-xs font-bold text-[#10436B]">
                  RDV: {dentist.rdvScore}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <h4 className="font-bold text-text text-base sm:text-lg mb-0.5 truncate">
              {dentist.name}
            </h4>
            <p className="text-[#10436B] text-xs sm:text-sm font-semibold mb-2 truncate">
              {dentist.specialty}
            </p>

            <div className="flex items-center gap-1 flex-wrap text-xs sm:text-sm mb-2">
              <span className="text-[#10436B] font-bold">{dentist.rating?.toFixed(1) || "0.0"}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(dentist.rating || 0) ? "#E3A32A" : "none"}
                    className={i < Math.floor(dentist.rating || 0) ? "text-[#E3A32A]" : "text-slate-200"}
                  />
                ))}
              </div>
              <span className="text-gray-400 font-medium ml-1">
                ({dentist.reviewCount || 0})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 mb-1">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              <span className="truncate">
                {dentist.city && dentist.country
                  ? `${dentist.city}, ${dentist.country}`
                  : dentist.location || "Location not specified"}
              </span>
            </div>

            {dentist.languages && dentist.languages.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Globe size={12} className="text-[#10436B] shrink-0" />
                <span className="truncate">
                  <span className="font-semibold text-slate-800">Languages:</span>{" "}
                  {dentist.languages.join(", ")}
                </span>
              </div>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="text-sec-text text-[10px] sm:text-xs font-medium">Starting from</p>
            <p className="text-primary font-extrabold text-lg sm:text-xl lg:text-2xl mt-0.5">
              ${dentist.price ? dentist.price.toLocaleString() : "0"}
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-400">Estimate</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

            {dentist.experience > 0 && (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                <Award size={12} className="text-gray-400 shrink-0" />
                <span>{dentist.experience} yrs exp</span>
              </div>
            )}
          </div>

          {dentist.procedures && dentist.procedures.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dentist.procedures.slice(0, 3).map((proc: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#F4F9FD] text-[#10436B] text-[10px] sm:text-xs font-semibold rounded-md"
                >
                  {proc}
                </span>
              ))}
              {dentist.procedures.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] sm:text-xs font-semibold rounded-md">
                  +{dentist.procedures.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}