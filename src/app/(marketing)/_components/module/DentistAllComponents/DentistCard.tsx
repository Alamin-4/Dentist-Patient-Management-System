"use client";

import Image from "next/image";
import { BadgeCheck, Globe2, MapPin, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { Dentist } from "./types";
import { useRouter, usePathname } from "next/navigation";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";

type DentistCardProps = {
  dentist: Dentist;
  floating?: boolean;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onCompareToggle?: () => void;
  onPrimaryAction?: () => void;
};

export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  onPrimaryAction,
}: DentistCardProps) {
  const pathName = usePathname();
  const router = useRouter();
  const { user } = useMe();
  const {
    setSelectedDentistId,
    setShowBookingModal,
    setShowPersonalizeModal,
    setShowSignupModal,
    setRequestConsultationDentist,
    setShowRequestConsultationModal,
  } = useStateContext();

  const handleBookConsultation = () => {
    setSelectedDentistId(dentist.id);
    if (user) {
      const hasProfileDetails = !!(user?.firstName || user?.name || user?.first_name);
      if (hasProfileDetails) {
        setShowBookingModal("startBooking");
      } else {
        setShowPersonalizeModal(true);
      }
    } else {
      setShowSignupModal(true);
    }
  };

  const handleRequestConsultation = () => {
    setRequestConsultationDentist(dentist as any);
    setShowRequestConsultationModal(true);
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-[#CEE0F4] bg-white transition-all duration-300 rounded-lg hover:shadow-md",
        floating && "w-[min(100%,34rem)] shadow-lg",
        isSelectedForCompare && "border-[#10436B] bg-slate-50/20",
      )}
    >
      {isCompareMode && (
        <div className="absolute left-3 top-3 z-20">
          <Checkbox
            checked={isSelectedForCompare}
            onCheckedChange={onCompareToggle}
            className="size-5 rounded border-slate-300 data-[state=checked]:border-[#5f7e9c] data-[state=checked]:bg-[#10436B]"
          />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 p-4 xl:flex-row xl:gap-5 xl:p-6">
        <div className="flex flex-row gap-4 max-w-180 w-full">
          <div className="flex shrink-0 flex-col items-center gap-3 xl:w-35">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={dentist.image || "/placeholder-avatar.png"}
                alt={dentist.name.split(' ')[0].slice(0,4)}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className={cn("size-4", dentist.verified ? "text-emerald-500" : dentist.status === "CLAIMED" ? "text-amber-500" : "text-slate-400")} />
                <span className={cn(
                  "text-[11px] font-bold uppercase tracking-wider whitespace-nowrap",
                  dentist.verified ? "text-emerald-600" : dentist.status === "CLAIMED" ? "text-amber-600" : "text-slate-500"
                )}>
                  {dentist.verified ? "VERIFIED" : dentist.status === "CLAIMED" ? "CLAIMED" : "UNCLAIMED"}
                </span>
              </div>

              <div className="flex items-center justify-center text-xs gap-2 rounded-md border border-slate-200 px-3 py-1 text-center">
                <div className="text-[#0E3E65]">
                  {dentist.verified ? dentist.rdvScore : "0"}
                </div>
                <div className=" text-[#1A1A2E]">
                  RDV Score
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="lg:text-lg font-semibold text-[#1A1A2E]">
                  {dentist.name}
                </h3>
                <p className="text-[14px] font-semibold text-[#10436B]">
                  {dentist.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#10436B]">
                  {dentist.rating}
                </span>
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
                <span className="text-[12px] text-slate-400">
                  ({dentist.reviewCount} Ratings)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-4 shrink-0" />
                <span className="block truncate text-[14px] text-[#6B7280]">
                  {dentist.location}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-[12px] font-medium text-[#0E3E65] hover:bg-sky-50">
                <BadgeCheck className="size-4" />
                No Surprise Guarantee
              </Badge>

              <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-[12px] font-medium text-[#0E3E65] hover:bg-sky-50">
                <Globe2 className="size-3.5" />
                {dentist.languages.join(" - ") || "EN - ES"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-end justify-between gap-3 xl:min-w-42.5">
          <div className="text-right">
            <div className="text-[12px] text-[#6B7280]">Starting at</div>
            <div className="text-[#0E3E65] font-bold text-xl lg:text-2xl mt-1">
              ${dentist.price.toLocaleString()}
            </div>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-end justify-end gap-2 sm:w-auto",
            )}
          >
            <Button
              variant="outline"
              className="h-10 rounded-lg border-[#003366] px-5 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-all"
              onClick={() => router.push(`/find-dentist/${dentist.slug}`)}
            >
              View Profile
            </Button>
            {dentist.verified ? (
              <Button
                className="h-10 rounded-lg bg-[#003366] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#002850] transition-all"
                onClick={handleBookConsultation}
              >
                Book Consultation
              </Button>
            ) : (
              <>
                {dentist.isClaimable && dentist.status === "UNVERIFIED" && (
                  <Button
                    variant="secondary"
                    className="h-10 rounded-lg border border-amber-300 bg-amber-50 px-5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all"
                    onClick={() => router.push(`/find-dentist/${dentist.slug}?claim=true`)}
                  >
                    Claim Profile
                  </Button>
                )}
                <Button
                  className="h-10 rounded-lg bg-[#003366] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#002850] transition-all"
                  onClick={handleRequestConsultation}
                >
                  Request Consultation
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
