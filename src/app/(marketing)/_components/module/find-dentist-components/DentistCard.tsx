"use client";

import Image from "next/image";
import { BadgeCheck, MapPin, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { Dentist } from "../DentistAllComponents/types";
import { useRouter } from "next/navigation";
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

// ── Verification phase dots: 3 phases (License → Operations → Clinic) ────────
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

export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  onPrimaryAction,
}: DentistCardProps) {
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

  // ── Badge: what kind of account is this? ─────────────────────────────────
  const badgeLabel = dentist.isVerified
    ? "VERIFIED"
    : dentist.accountType === "CLAIMED"
      ? "CLAIMED"
      : dentist.accountType === "REGISTERED"
        ? "REGISTERED"
        : "UNCLAIMED";

  const badgeIconColor = dentist.isVerified
    ? "text-emerald-500"
    : dentist.accountType === "CLAIMED"
      ? "text-amber-500"
      : dentist.accountType === "REGISTERED"
        ? "text-blue-500"
        : "text-slate-400";

  const badgeTextColor = dentist.isVerified
    ? "text-emerald-600"
    : dentist.accountType === "CLAIMED"
      ? "text-amber-600"
      : dentist.accountType === "REGISTERED"
        ? "text-blue-600"
        : "text-slate-500";

  // ── Rating values ─────────────────────────────────────────────────────────
  const ratingValue = dentist.rating.combined ?? dentist.rating.google ?? dentist.rating.doctoralia ?? 0;
  const reviewCount =
    dentist.rating.googleReviewCount ?? dentist.rating.doctoraliaReviewCount ?? 0;

  // ── Location display ──────────────────────────────────────────────────────
  const locationText =
    dentist.location.fullAddress ?? dentist.location.city ?? dentist.country ?? "";

  return (
    <div
      onClick={onPrimaryAction}
      className={cn(
        "relative w-full overflow-hidden border border-[#CEE0F4] bg-white transition-all duration-300 rounded-lg hover:shadow-md",
        floating && "w-[min(100%,34rem)] shadow-lg",
        isSelectedForCompare && "border-[#10436B] bg-slate-50/20",
        onPrimaryAction && "cursor-pointer",
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
        <div className="flex flex-row gap-4 md:max-w-5/8 w-full">
          {/* ── Avatar + badge + RDV score ────────────────────────────────── */}
          <div className="flex shrink-0 flex-col items-center gap-3 xl:w-35">
            <div className="relative h-15 w-15 md:h-20 md:w-20 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={dentist.image ?? "/images/man-avatar.png"}
                alt={dentist.name.split(" ")[0].slice(0, 4)}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              {/* Account / verification badge */}
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className={cn("size-4", badgeIconColor)} />
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider whitespace-nowrap",
                    badgeTextColor,
                  )}
                >
                  {badgeLabel}
                </span>
              </div>

              {/* RDV score */}
              <div className="flex items-center justify-center text-xs gap-2 rounded-md border border-slate-200 px-3 py-1 text-center">
                <div className="text-[#0E3E65]">
                  {dentist.rdvScore > 0 ? dentist.rdvScore : "—"}
                </div>
                <div className="text-[#1A1A2E]">RDV Score</div>
              </div>

              {/* Verification phase progress: 3 dots (License · Operations · Clinic) */}
              {dentist.accountType !== "CLAIMABLE" && (
                <VerificationDots phase={dentist.verificationPhase} />
              )}
            </div>
          </div>

          {/* ── Main info ──────────────────────────────────────────────────── */}
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="lg:text-lg font-semibold text-[#1A1A2E]">
                  {dentist.name}
                </h3>
                <p className="text-[14px] font-semibold text-[#10436B]">
                  {dentist.specialty ?? "General Dentist"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {/* Star rating */}
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#10436B]">
                  {ratingValue > 0 ? ratingValue.toFixed(1) : "—"}
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
                <span className="text-[12px] text-slate-400">
                  ({reviewCount} Ratings)
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-4 shrink-0" />
                <span className="block truncate text-[14px] text-[#6B7280]">
                  {locationText || "Location not specified"}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {dentist.surpriseGuarantee && (
                <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-[12px] font-medium text-[#0E3E65] hover:bg-sky-50">
                  <BadgeCheck className="size-4" />
                  No Surprise Guarantee
                </Badge>
              )}

            </div>
          </div>
        </div>

        {/* ── Right column: price + actions ───────────────────────────────── */}
        <div className="flex flex-row sm:flex-col items-end justify-between gap-3 xl:min-w-50">
          <div className="text-right">
            <div className="text-[12px] text-[#6B7280]">Starting from</div>
            <div className="text-[#0E3E65] font-bold text-xl lg:text-2xl mt-1">
              ${dentist.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#9CA3AF]">Estimate</div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 sm:w-auto">
            <Button
              variant="outline"
              className="h-10 rounded-lg border-[#003366] px-5 text-xs font-bold text-[#003366] hover:bg-slate-50 transition-all"
              onClick={() => router.push(`/find-dentist/${dentist.slug}`)}
            >
              View Profile
            </Button>

            {dentist.isVerified ? (
              <Button
                className="h-10 rounded-lg bg-[#003366] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#002850] transition-all"
                onClick={handleBookConsultation}
              >
                Book Consultation
              </Button>
            ) : (
              <>
                {/* isClaimable is the single source of truth for showing "Claim Profile" */}
                {dentist.isClaimable && (
                  <Button
                    variant="secondary"
                    className="h-10 rounded-lg border border-amber-300 bg-amber-50 px-5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all"
                    onClick={() =>
                      router.push(`/find-dentist/${dentist.slug}?claim=true`)
                    }
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
