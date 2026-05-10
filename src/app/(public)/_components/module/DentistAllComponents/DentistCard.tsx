"use client";

import Image from "next/image";
import { BadgeCheck, Globe2, MapPin, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { Dentist } from "./types";

type DentistCardProps = {
  dentist: Dentist;
  floating?: boolean;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onCompareToggle?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  onPrimaryAction,
  onSecondaryAction,
}: DentistCardProps) {
  return (
    <Card
      className={cn(
        "relative w-full border border-[#B3C6DC] bg-white transition-all duration-300",
        "rounded-lg",
        floating && "w-[min(100%,34rem)] shadow-lg",
        isSelectedForCompare && "border-[#003366] bg-slate-50/20",
      )}
    >
      {isCompareMode && (
        <div className="absolute left-3 top-3 z-20">
          <Checkbox
            checked={isSelectedForCompare}
            onCheckedChange={onCompareToggle}
            className="size-5 rounded border-slate-300 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5 p-4 md:p-6">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={dentist.image || "/placeholder-avatar.png"}
              alt={dentist.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
              <ShieldCheck className="size-4 text-[#4CA30D]" />
              VERIFIED
            </div>

            <div className="w-full rounded-lg border border-slate-200 flex items-center gap-2 py-1.5 px-3 text-center">
              <div className="font-extrabold text-[#0E3E65]">
                {dentist.rdvScore}
              </div>
              <div className="text-xs font-medium text-[#1A1A2E]">
                RDV Score
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                {dentist.name}
              </h3>
              <p className="text-sm text-[#1A1A2E] font-semibold">
                {dentist.specialty}
              </p>
            </div>
          </div>

          <div className=" space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#003366]">{dentist.rating}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < Math.floor(dentist.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-xs">
                ({dentist.reviewCount} Ratings)
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="size-4" />
              <span className="text-sm text-[#6B7280]">{dentist.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#EEF8FF] text-[#0E3E65] hover:bg-sky-50 border-none px-3 py-1 text-xs font-medium gap-1.5">
              <BadgeCheck className="size-4" />
              No Surprise Guarantee
            </Badge>

            <Badge className="bg-[#EEF8FF] text-[#0E3E65] hover:bg-sky-50 border-none px-3 py-1 text-xs font-medium gap-1.5">
              <Globe2 className="size-3.5" />
              EN - ES
            </Badge>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="text-right">
            <div className="text-xs text-[#6B7280]">Starting at</div>
            <div className=" font-bold text-[#0E3E65]">
              ${dentist.price.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-11 rounded-xl border-[#003366] text-[#003366] font-bold hover:bg-slate-50 px-6"
              onClick={onSecondaryAction}
            >
              View Profile
            </Button>
            <Button
              className="flex-1 sm:flex-none h-11 rounded-xl bg-[#003366] text-white font-bold hover:bg-[#002850] px-6 shadow-sm"
              onClick={onPrimaryAction}
            >
              Consult Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
