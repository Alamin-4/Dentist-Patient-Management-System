"use client";

import Image from "next/image";
import {
  Badge,
  BadgeCheck,
  Globe2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Dentist } from "../types";

type MapDentistCardProps = {
  dentist: Dentist;
  onConsult?: () => void;
  onViewProfile?: () => void;
};

export default function MapDentistCard({
  dentist,
  onConsult,
  onViewProfile,
}: MapDentistCardProps) {
  return (
    <div className="w-full">
      <div className="flex items-start gap-4">
        {/* Left Side: Avatar & Score */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-50">
            <Image
              src={dentist.image || "/placeholder-avatar.png"}
              alt={dentist.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
              <ShieldCheck className="size-4 text-[#4CA30D]" />
              VERIFIED
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-slate-50 px-3 py-1.5 border border-slate-200">
            <span className="text-xs font-bold text-[#003366] leading-none">
              {dentist.rdvScore}
            </span>
            <span className="text-xs font-medium text-[#6B7280]">Score</span>
          </div>
        </div>

        {/* Center: Info */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[17px] font-extrabold leading-none text-slate-900 tracking-tight">
              {dentist.name}
            </h3>
            <ShieldCheck className="size-3.5 text-[#4CA30D] shrink-0" />
          </div>

          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {dentist.specialty}
          </p>

          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-3",
                    index < Math.floor(dentist.rating)
                      ? "fill-[#E6A400] text-[#E6A400]"
                      : "text-slate-200",
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">
              ({dentist.reviewCount})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full">
            <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-xs font-medium text-[#0E3E65] hover:bg-sky-50">
              <BadgeCheck className="size-4" />
              No Surprise Guarantee
            </Badge>

            <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-xs font-medium text-[#0E3E65] hover:bg-sky-50">
              <Globe2 className="size-3.5" />
              EN - ES
            </Badge>
          </div>
        </div>

        {/* Top Right: Price */}
        <div className="flex flex-col">
          <div className="text-right shrink-0 space-y-1">
            <div className="text-xs text-[#6B7280]">Starting to</div>
            <div className="font-bold text-lg text-[#003366] leading-none">
              ${dentist.price.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="button"
              size={"sm"}
              variant="outline"
              onClick={onViewProfile}
              className="h-10 rounded-md cursor-pointer border border-[#003366] px-3 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-colors"
            >
              View Profile
            </Button>
            <Button
              type="button"
              size={"sm"}
              onClick={onConsult}
              className="h-10 rounded-md cursor-pointer bg-[#003366] px-3 text-xs font-bold text-white hover:bg-[#002850] shadow-sm transition-all active:scale-[0.98]"
            >
              Consult Now
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom: Action Buttons */}
    </div>
  );
}
