"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMe } from "@/hooks/auth/useAuth";
import { useStateContext } from "@/providers/StateProvider";
import { setSelectedDentistsForBooking } from "@/lib/storage/bookingService";

interface BookingSidebarProps {
  dentist: {
    id: string;
    backendId?: string;
    slug: string;
    name: string;
    image?: string;
    verified?: boolean;
    status?: string;
    isClaimable?: boolean;
    isClaimed?: boolean;
    claimedByUserId?: string;
    userId?: string;
    googleRating?: number;
    rating?: number;
    rdvScore?: number;
    price?: number;
  };
}

export default function BookingSidebar({ dentist }: BookingSidebarProps) {
  const { user } = useMe();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    setShowSigninModal,
    setShowSignupModal,
    setShowBookingModal,
    setShowPersonalizeModal,
    setSelectedDentistId,
    setBookingMode,
    setDentistsToCompare,
  } = useStateContext();

  const isOwnProfile =
    !!user &&
    (user.id === dentist.claimedByUserId ||
      (!!dentist.userId && user.id === dentist.userId));

  const rating = dentist.googleRating ?? dentist.rating ?? 5.0;
  const roundedRating = Math.round(rating);

  useEffect(() => {
    const claim = searchParams.get("claim");
    const cancelled = searchParams.get("cancelled");
    if (claim === "true" || cancelled === "true") {
      router.push(`/find-dentists/${dentist.slug}/claim`);
    }
  }, [searchParams, router, dentist.slug]);

  const initiateBooking = (mode: "book" | "request") => {
    if (user?.role === "DENTIST") {
      toast.error("Dentists cannot request or book consultations. Please sign in with a patient account.");
      return;
    }

    if (isOwnProfile) {
      toast.error("Dentists cannot book consultations on their own profiles.");
      return;
    }

    setDentistsToCompare([]);
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking(
      [dentist.id],
      [dentist.backendId || dentist.id]
    );
    setBookingMode(mode);

    if (!user) {
      setShowSignupModal(true);
      return;
    }

    const hasProfileDetails = !!(
      user.firstName ||
      user.name ||
      (user as Record<string, unknown>).first_name
    );

    if (hasProfileDetails) {
      setShowBookingModal("startBooking");
    } else {
      setShowPersonalizeModal(true);
    }
  };

  return (
    <aside className="lg:sticky lg:top-24 w-full rounded-lg border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex gap-3 sm:gap-5 mb-5 sm:mb-6 items-start">
        <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-50 bg-slate-100">
          <Image
            src={dentist.image || "/images/man-avatar.png"}
            alt={dentist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0E3E65] truncate leading-tight">
            {dentist.name}
          </h3>
          <p className="text-xs text-[#6B7280] font-medium leading-none">
            Dentist
          </p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="font-bold text-sm text-[#0E3E65]">
              {rating.toFixed(1)}
            </span>
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-3 sm:size-3.5 ${i < roundedRating
                    ? "fill-current text-amber-400"
                    : "text-slate-200"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
        {dentist.verified ? (
          <TrustPill color="green" icon>
            Verified
          </TrustPill>
        ) : dentist.status === "CLAIMED" ? (
          <TrustPill color="amber">Claimed</TrustPill>
        ) : (
          <TrustPill color="slate">Directory</TrustPill>
        )}

        <TrustPill color="blue">
          <span className="font-extrabold">
            {dentist.verified ? dentist.rdvScore : "0"}
          </span>{" "}
          RDV score
        </TrustPill>

        <TrustPill color="slate" icon>
          No Surprise Guarantee
        </TrustPill>

        <TrustPill color="slate" icon>
          Escrow
        </TrustPill>
      </div>

      <div className="mt-6 sm:mt-10 flex items-center justify-between gap-3 sm:gap-6">
        <div className="shrink-0">
          <p className="text-xs text-[#6B7280]">Starting from</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0E3E65]">
            ${dentist.price ? dentist.price.toLocaleString() : "0"}
          </p>
          <p className="text-[10px] text-[#9CA3AF]">Estimate</p>
        </div>

        {!isOwnProfile &&
          (dentist.verified ? (
            <Button
              onClick={() => initiateBooking("book")}
              className="h-12 sm:h-14 flex-1 bg-[#0E3E65] text-sm sm:text-base font-semibold text-white hover:bg-[#002850]"
            >
              Book consultation
            </Button>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              {dentist.isClaimable && (
                <Button
                  variant="outline"
                  className="h-10 sm:h-11 text-xs sm:text-sm border-amber-500 text-amber-700 bg-amber-50/50 hover:bg-amber-50 font-bold"
                  onClick={() =>
                    router.push(`/find-dentists/${dentist.slug}/claim`)
                  }
                >
                  Claim Profile
                </Button>
              )}
              {(dentist.status === "CLAIMED" || dentist.isClaimed) && (
                <Button
                  className="h-10 sm:h-11 text-xs sm:text-sm bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]"
                  onClick={() => initiateBooking("request")}
                >
                  Request Consultation
                </Button>
              )}
            </div>
          ))}
      </div>
    </aside>
  );
}

function TrustPill({
  children,
  color,
  icon = false,
}: {
  children: React.ReactNode;
  color: "green" | "amber" | "slate" | "blue";
  icon?: boolean;
}) {
  const styles: Record<string, string> = {
    green:
      "text-[#4CA30D] bg-green-50 border-[#4CA30D]/20",
    amber:
      "text-amber-600 bg-amber-50 border-amber-200",
    slate:
      "text-slate-600 bg-slate-50 border-slate-200",
    blue: "text-[#003366] bg-[#EEF8FF] border-[#003366]/10",
  };

  const iconColor: Record<string, string> = {
    green: "text-[#4CA30D]",
    amber: "text-amber-500",
    slate: "text-slate-400",
    blue: "text-[#003366]",
  };

  return (
    <div
      className={`flex items-center gap-1 text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-full border ${styles[color]}`}
    >
      {icon && <ShieldCheck className={`size-3 ${iconColor[color]}`} />}
      {children}
    </div>
  );
}