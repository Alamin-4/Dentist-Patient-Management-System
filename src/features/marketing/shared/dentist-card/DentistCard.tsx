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
import { Can } from "@/core/hooks/auth/usePermissions";
import { setSelectedDentistsForBooking } from "@/lib/storage/bookingService";
import toast from "react-hot-toast";
import type { Dentist } from "@/features/marketing/find-dentists-page-components/types";
import {
  ProfileVerificationStatus,
  ClaimButtonState,
  getClaimButtonState,
  determineVerificationStatus,
} from "@/features/marketing/find-dentists-page-components/directory.types";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { ClaimProfileButton } from "@/features/marketing/shared/ClaimProfileButton";

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
export interface DentistCardProps {
  dentist: Dentist;
  floating?: boolean;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onCompareToggle?: () => void;
  onViewOnMap?: (dentist: Dentist) => void;
  isButtonShow?: boolean;
  mapView?: boolean;
}

export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  isButtonShow = true,
}: DentistCardProps) {
  const router = useRouter();
  const { user } = useMe();
  const queryClient = useQueryClient();

  const handlePrefetchDetails = () => {
    if (!dentist.slug) return;
    queryClient.prefetchQuery({
      queryKey: ["dentistDirectoryDetail", dentist.slug],
      queryFn: () => apiClient.dentists.getDirectoryDetail(dentist.slug),
      staleTime: 5 * 60 * 1000,
    });
  };

  const {
    setSelectedDentistId,
    setShowBookingModal,
    setShowPersonalizeModal,
    setShowSignupModal,
    setBookingMode,
    setDentistsToCompare,
  } = useStateContext();

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

  const phasesApproved = !!(
    dentist.isLicenseVerified &&
    dentist.isOperationsVerified &&
    dentist.isClinicDepthVerified
  );
  const hasActiveSubscription = !!(dentist.membershipPaidAt || dentist.membershipPlan);

  const verificationStatus: ProfileVerificationStatus =
    dentist.status === "VERIFIED" || dentist.verificationStatus === "VERIFIED"
      ? ProfileVerificationStatus.VERIFIED
      : determineVerificationStatus(phasesApproved, hasActiveSubscription);

  const isVerified = verificationStatus === ProfileVerificationStatus.VERIFIED;

  const claimState: ClaimButtonState = getClaimButtonState(
    dentist.isClaimable ?? true,
    dentist.isClaimed ?? !!(dentist as any).claimedByUserId
  );

  const badgeConfig =
    verificationStatus === ProfileVerificationStatus.VERIFIED
      ? { icon: "text-emerald-500", text: "text-emerald-600", label: "VERIFIED", showIcon: true }
      : { icon: "text-slate-400", text: "text-slate-500", label: "UNVERIFIED", showIcon: false };

  const ratingValue =
    dentist.rating.combined ?? dentist.rating.google ?? dentist.rating.doctoralia ?? 0;
  const reviewCount =
    dentist.rating.googleReviewCount ?? dentist.rating.doctoraliaReviewCount ?? 0;

  const formattedLocation = [dentist.location?.city, dentist.location?.country]
    .filter(Boolean)
    .join(", ") || dentist.location?.fullAddress || "";

  return (
    <div
      onClick={() => router.push(`/find-dentists/${dentist.slug}`)}
      onMouseEnter={handlePrefetchDetails}
      className={cn(
        "relative w-full overflow-hidden border border-border bg-white transition-all duration-300 rounded-[12px] cursor-pointer p-4 sm:p-5",
        floating && "w-[min(100%,34rem)]",
        isSelectedForCompare && "border-primary bg-slate-50/40",
      )}
    >
      {isCompareMode && isVerified && (
        <div className="absolute left-3 top-3 z-20" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelectedForCompare}
            onCheckedChange={onCompareToggle}
            className="size-5 rounded border-slate-300 data-[state=checked]:border-[#5f7e9c] data-[state=checked]:bg-primary"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">

        <div className="flex flex-row items-start gap-3.5 sm:gap-4 min-w-0 flex-1 w-full">

          <div className="flex shrink-0 flex-col items-center gap-2 w-20 sm:w-28">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full">
              <Image
                src={dentist.image ?? "/images/man-avatar.png"}
                alt={dentist.name.split(" ")[0] || ""}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium tracking-tight">
              {badgeConfig.showIcon && (
                <ShieldCheck className={cn("size-3.5 shrink-0", badgeConfig.icon)} />
              )}
              <span className={cn("uppercase whitespace-nowrap font-bold", badgeConfig.text)}>
                {badgeConfig.label}
              </span>
            </div>

            <div className="flex items-center justify-center text-[11px] gap-1.5 rounded-md border border-slate-200 px-2 py-0.5 text-center bg-slate-50/50 w-full">
              <span className="text-primary font-bold">
                {dentist.rdvScore > 0 ? dentist.rdvScore : "0"}
              </span>
              <span className="text-slate-600 font-medium truncate">RDV Score</span>
            </div>

            {dentist.accountType !== "CLAIMABLE" && (
              <VerificationDots phase={dentist.verificationPhase} />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-text leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {dentist.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                {dentist.specialty || ""}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-primary">
                {ratingValue > 0 ? ratingValue.toFixed(1) : "0.0"}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < Math.floor(ratingValue || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-sec-text font-medium">
                ({reviewCount} Ratings)
              </span>
            </div>

            {formattedLocation && (
              <div className="flex items-center gap-1.5 text-slate-500 pt-0.5">
                <MapPin className="size-3.5 shrink-0 text-slate-400" />
                <span className="truncate text-xs text-sec-text font-medium">
                  {formattedLocation}
                </span>
              </div>
            )}

            {isButtonShow && dentist.languages && dentist.languages.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-500 pt-0.5">
                <Globe className="size-3.5 shrink-0 text-primary" />
                <span className="truncate text-xs text-slate-600">
                  <span className="font-semibold text-text">Languages:</span>{" "}
                  {dentist.languages.join(", ")}
                </span>
              </div>
            )}

            {isButtonShow && dentist.surpriseGuarantee && (
              <div className="pt-1">
                <Badge className="inline-flex items-center gap-1 whitespace-nowrap border-none bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary hover:bg-sky-100">
                  <BadgeCheck className="size-3.5 text-primary" />
                  No Surprise Guarantee
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "flex shrink-0 w-full sm:w-auto flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100",
          !isButtonShow && "sm:items-end justify-end border-t-0 pt-0"
        )}>
          <div className="text-left sm:text-right">
            <div className="text-[11px] sm:text-xs text-sec-text font-medium">Starting from</div>
            <div className="text-primary font-bold text-lg sm:text-xl lg:text-2xl leading-none mt-0.5">
              ${dentist.price ? dentist.price.toLocaleString() : "0"}
            </div>
            <div className="text-[10px] text-slate-400">Estimate</div>
          </div>

          {isButtonShow && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Button
                variant="outline"
                className="h-9 px-3.5 text-xs font-bold text-primary border-primary hover:bg-slate-50 transition-all cursor-pointer rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/find-dentists/${dentist.slug}`);
                }}
              >
                View Profile
              </Button>

              {isVerified ? (
                <Can action="book_consultation">
                  <Button
                    className="h-9 px-3.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 shadow-xs cursor-pointer transition-all rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookConsultation();
                    }}
                  >
                    Book Consultation
                  </Button>
                </Can>
              ) : (
                (() => {
                  switch (claimState) {
                    case ClaimButtonState.CLAIM_PROFILE:
                      return <ClaimProfileButton slug={dentist.slug} size="sm" />;
                    case ClaimButtonState.CLAIMED:
                      return <ClaimProfileButton slug={dentist.slug} isClaimed={true} size="sm" />;
                    case ClaimButtonState.HIDDEN:
                      return null;
                  }
                })()
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
