import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Globe, ShieldCheck, Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Dentist } from "../types";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { setSelectedDentistsForBooking } from "@/lib/storage/bookingService";
import toast from "react-hot-toast";

type MapDentistCardProps = {
  dentist: Dentist;
  onCloseCard?: () => void;
};

export default function MapDentistCard({
  dentist,
  onCloseCard,
}: MapDentistCardProps) {
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

  const handleBookConsultation = () => {
    if (user?.role === "DENTIST") {
      toast.error("Dentists cannot request or book consultations. Please sign in with a patient account.");
      return;
    }
    setDentistsToCompare([]);
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("book");
    if (onCloseCard) onCloseCard();
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
    if (user?.role === "DENTIST") {
      toast.error("Dentists cannot request or book consultations. Please sign in with a patient account.");
      return;
    }
    setDentistsToCompare([]);
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("request");
    if (onCloseCard) onCloseCard();
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

  const handleViewProfile = () => {
    if (onCloseCard) onCloseCard();
    router.push(`/find-dentists/${dentist.slug}`);
  };

  const handleClaimProfile = () => {
    if (onCloseCard) onCloseCard();
    router.push(`/find-dentists/${dentist.slug}/claim`);
  };

  const badgeConfig = dentist.verificationStatus === 'VERIFIED'
    ? { icon: 'text-emerald-500', text: 'text-emerald-600', label: 'VERIFIED', showIcon: true }
    : { icon: 'text-[#505050]', text: 'text-[#505050]', label: 'UNVERIFIED', showIcon: false };

  const ratingValue = dentist.rating.combined ?? dentist.rating.google ?? dentist.rating.doctoralia ?? 0;
  const reviewCount =
    dentist.rating.googleReviewCount ?? dentist.rating.doctoraliaReviewCount ?? 0;

  const isClaimableProfile = dentist.accountType === "CLAIMABLE" && !dentist.isClaimed;

  return (
    <div className="w-full">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-50">
            <Image
              src={dentist.image || "/images/man-avatar.png"}
              alt={dentist.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-text">
              {badgeConfig.showIcon && (
                <ShieldCheck className={cn("size-3.5", badgeConfig.icon)} />
              )}
              <span className={cn("font-bold uppercase tracking-wider whitespace-nowrap", badgeConfig.text)}>
                {badgeConfig.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-slate-50 px-2.5 py-1 border border-slate-200">
            <span className="text-xs font-bold text-brand-medium-navy leading-none">
              {dentist.rdvScore > 0 ? dentist.rdvScore : "0"}
            </span>
            <span className="text-[10px] font-medium text-sec-text">Score</span>
          </div>
        </div>

        {/* Center: Info */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-extrabold leading-none text-slate-900 tracking-tight">
              {dentist.name}
            </h3>
            {dentist.isVerified && (
              <ShieldCheck className="size-3.5 text-badge shrink-0" />
            )}
          </div>

          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            {dentist.specialty ?? "General Dentist"}
          </p>

          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-primary">
              {ratingValue > 0 ? ratingValue.toFixed(1) : "0"}
            </span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-3.5",
                    index < Math.floor(ratingValue)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200",
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400">
              ({reviewCount})
            </span>
          </div>

          {/* Languages */}
          {dentist.languages && dentist.languages.length > 0 && (
            <div className="flex items-center gap-1 text-slate-500">
              <Globe className="size-3.5 shrink-0 text-primary" />
              <span className="truncate text-[11px] text-[#4B5563]">
                <span className="font-semibold text-text">Languages:</span>{" "}
                {dentist.languages.join(", ")}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 w-full">
            {dentist.surpriseGuarantee && (
              <Badge className="whitespace-nowrap border-none bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-sky-50">
                <BadgeCheck className="size-3.5" />
                No Surprise Guarantee
              </Badge>
            )}
          </div>
        </div>

        {/* Top Right: Price */}
        <div className="flex flex-col">
          <div className="text-right shrink-0 space-y-1">
            <div className="text-[10px] text-sec-text">Starting from</div>
            <div className="font-bold text-base text-brand-medium-navy leading-none">
              ${dentist.price.toLocaleString()}
            </div>
            <div className="text-[9px] text-[#9CA3AF]">Estimate</div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="button"
              size={"sm"}
              variant="outline"
              onClick={handleViewProfile}
              className="h-9 rounded-md cursor-pointer border border-brand-medium-navy px-2.5 text-xs font-bold text-brand-medium-navy hover:bg-slate-50 transition-colors"
            >
              View Profile
            </Button>
            {dentist.isVerified ? (
              <Button
                type="button"
                size={"sm"}
                onClick={handleBookConsultation}
                className="h-9 rounded-md cursor-pointer bg-brand-medium-navy px-2.5 text-xs font-bold text-white hover:bg-brand-medium-navy-hover shadow-sm transition-all active:scale-[0.98]"
              >
                Book Consultation
              </Button>
            ) : (
              <>
                {isClaimableProfile ? (
                  <Button
                    type="button"
                    size={"sm"}
                    variant="secondary"
                    onClick={handleClaimProfile}
                    className="h-9 rounded-md cursor-pointer border border-amber-300 bg-amber-50 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    Claim Profile
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={handleRequestConsultation}
                    className="h-9 rounded-md cursor-pointer bg-brand-medium-navy px-2.5 text-xs font-bold text-white hover:bg-brand-medium-navy-hover shadow-sm transition-all active:scale-[0.98]"
                  >
                    Request Consultation
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
