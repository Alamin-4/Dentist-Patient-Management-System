"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, Globe, MapPin, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { setSelectedDentistsForBooking } from "@/lib/storage/bookingService";
import toast from "react-hot-toast";
import type { Dentist } from "@/features/marketing/_components/find-dentists-page-components/types";

// ─────────────────────────────────────────────────────────────────────────────
// Verification phase dots
// ─────────────────────────────────────────────────────────────────────────────
function VerificationDots({ phase }: { phase: Dentist["verificationPhase"] }) {
  if (!phase) return null;
  const states = [
    phase.isLicenseVerified,
    phase.isOperationsVerified,
    phase.isClinicDepthVerified,
  ];
  const labels = ["License", "Operations", "Clinic"];
  return (
    <div className="mt-1 flex justify-center gap-1">
      {states.map((done, i) => (
        <div
          key={i}
          title={`${labels[i]}: ${done ? "verified" : "pending"}`}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            done ? "bg-emerald-400" : "bg-slate-200",
          )}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
export interface DentistCardProps {
  dentist: Dentist;
  floating?: boolean;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onCompareToggle?: () => void;
  onViewOnMap?: (dentist: Dentist) => void;
  isButtonShow?: boolean;
  mapView?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  onViewOnMap,
  isButtonShow,
  mapView
}: DentistCardProps) {
  const router = useRouter();
  const { user } = useMe();
  const {
    setSelectedDentistId,
    setShowBookingModal,
    setShowPersonalizeModal,
    setShowSignupModal,
    setBookingMode,
    setDentistsToCompare,
  } = useStateContext();

  // ── Booking handlers ────────────────────────────────────────────────────────
  const handleBookConsultation = () => {
    if (user?.role === "DENTIST") {
      toast.error("Dentists cannot request or book consultations. Please sign in with a patient account.");
      return;
    }
    setDentistsToCompare([]);
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("book");
    if (user) {
      const hasProfileDetails = !!(user?.firstName || user?.name || user?.first_name);
      if (hasProfileDetails) setShowBookingModal("startBooking");
      else setShowPersonalizeModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const handleRequestConsultation = () => {
    if (user?.role === "DENTIST") {
      toast.error("Dentists cannot request or book consultations. Please sign in with a patient account.");
      return;
    }
    setDentistsToCompare([]);
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("request");
    if (user) {
      const hasProfileDetails = !!(user?.firstName || user?.name || user?.first_name);
      if (hasProfileDetails) setShowBookingModal("startBooking");
      else setShowPersonalizeModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const isVerified = dentist.status === "VERIFIED";
  const isClaimableProfile = dentist.accountType === "CLAIMABLE" && !dentist.isClaimed;

  const badgeConfig =
    dentist.status === "VERIFIED"
      ? { icon: "text-emerald-500", text: "text-emerald-600", showIcon: true }
      : dentist.status === "CLAIMED"
        ? { icon: "text-amber-500", text: "text-amber-600", showIcon: true }
        : { icon: "text-[#505050]", text: "text-[#505050]", showIcon: false };

  const ratingValue =
    dentist.rating.combined ?? dentist.rating.google ?? dentist.rating.doctoralia ?? 0;
  const reviewCount =
    dentist.rating.googleReviewCount ?? dentist.rating.doctoraliaReviewCount ?? 0;

  const locationText =
    dentist.location?.fullAddress ?? dentist.location?.city ?? dentist.country ?? "";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => router.push(`/find-dentists/${dentist.slug}`)}
      className={cn(
        "relative w-full overflow-hidden border border-border bg-white transition-all duration-300 rounded-[10px] shadow-[0px_0px_12px_0px_#EEF8FF] cursor-pointer",
        floating && "w-[min(100%,34rem)] shadow-lg",
        isSelectedForCompare && "border-[#10436B] bg-slate-50/20",
      )}
    >
      {isCompareMode && dentist.status === "VERIFIED" && (
        <div className="absolute left-3 top-3 z-20" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelectedForCompare}
            onCheckedChange={onCompareToggle}
            className="size-5 rounded border-slate-300 data-[state=checked]:border-[#5f7e9c] data-[state=checked]:bg-[#10436B]"
          />
        </div>
      )}

      <div className={cn("flex flex-col  justify-between gap-4 p-4 xl:p-6", mapView ? "xl:flex-row" : "2xl:flex-row")}>
        <div className="flex flex-row gap-4 max-w-sm w-fit">
          <div className="flex shrink-0 flex-col items-center gap-3 xl:w-35">
            <div className="relative h-15 w-15 md:h-20 md:w-20 overflow-hidden rounded-full bg-white">
              <Image
                src={dentist.image ?? "/images/man-avatar.png"}
                alt={dentist.name.split(" ")[0].slice(0, 4)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {badgeConfig.showIcon && (
                  <ShieldCheck className={cn("size-4", badgeConfig.icon)} />
                )}
                <span className={cn("text-xs uppercase whitespace-nowrap", badgeConfig.text)}>
                  {dentist.status}
                </span>
              </div>

              <div className="flex items-center justify-center text-xs gap-2 rounded-sm border border-border px-3 py-1 text-center">
                <div className="text-primary font-semibold">
                  {dentist.rdvScore > 0 ? dentist.rdvScore : "0"}
                </div>
                <div className="text-text">RDV Score</div>
              </div>

              {dentist.accountType !== "CLAIMABLE" && (
                <VerificationDots phase={dentist.verificationPhase} />
              )}
            </div>
          </div>

          <div className="min-w-0 w-full space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="lg:text-lg font-semibold text-text">
                  {dentist.name}
                </h3>
                <p className="text-[14px] font-semibold text-[#10436B]">
                  {dentist.specialty ?? ""}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#10436B]">
                  {ratingValue > 0 ? ratingValue.toFixed(1) : "0"}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.floor(ratingValue)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs truncate text-sec-text">
                  ({reviewCount} Ratings)
                </span>
              </div>

              {/* Location */}
              {
                isButtonShow && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="size-4 shrink-0" />
                    <span className="block truncate text-[14px] text-sec-text">
                      {dentist.location.country} {dentist.location.country && ","}  {dentist.location.city}
                    </span>

                  </div>
                )
              }


              {/* Languages */}
              {dentist.languages && dentist.languages.length > 0 && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Globe className="size-4 shrink-0 text-[#10436B]" />
                  <span className="block truncate text-[13px] text-[#4B5563]">
                    <span className="font-semibold text-text">Languages:</span>{" "}
                    {dentist.languages.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {dentist.surpriseGuarantee && (
                <Badge className="whitespace-nowrap border-none bg-secondary px-3 py-1 text-[12px] font-medium text-primary hover:bg-sky-50">
                  <BadgeCheck className="size-4" />
                  No Surprise Guarantee
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className={
          cn("flex flex-row xl:flex-col items-end gap-3", isButtonShow ? "justify-between " : "justify-end")
        }>
          <div className="text-right">
            <div className="text-[12px] text-sec-text truncate">Starting from</div>
            <div className="text-primary font-bold text-xl lg:text-2xl mt-1">
              ${dentist.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#9CA3AF]">Estimate</div>
          </div>
          {
            isButtonShow && (
              <div className="flex flex-wrap items-end justify-end gap-2 sm:w-auto">
                {/* View Profile — always shown */}
                <Button
                  variant="outline"
                  className="h-10 rounded-lg border-[#003366] px-5 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/find-dentists/${dentist.slug}`);
                  }}
                >
                  View Profile
                </Button>

                {/* Primary CTA */}
                {isVerified ? (
                  <Button
                    className="h-10 rounded-lg bg-primary px-5 text-xs font-bold text-white shadow-sm hover:bg-primary/95 cursor-pointer transition-all"
                    onClick={(e) => { e.stopPropagation(); handleBookConsultation(); }}
                  >
                    Book Consultation
                  </Button>
                ) : isClaimableProfile ? (
                  <Button
                    variant="secondary"
                    className="h-10 rounded-lg border border-accent bg-amber-50 px-5 text-xs font-bold text-accent hover:bg-accent/5 cursor-pointer transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/find-dentists/${dentist.slug}/claim`);
                    }}
                  >
                    Claim Profile
                  </Button>
                ) : (
                  <Button
                    className="h-10 rounded-lg bg-[#003366] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#002850] transition-all"
                    onClick={(e) => { e.stopPropagation(); handleRequestConsultation(); }}
                  >
                    Request Consultation
                  </Button>
                )}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
