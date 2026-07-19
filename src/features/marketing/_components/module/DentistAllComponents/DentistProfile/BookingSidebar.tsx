"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Star, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMe } from "@/hooks/auth/useAuth";
import { useStateContext } from "@/providers/StateProvider";
import { setSelectedDentistsForBooking } from "@/lib/storage/bookingService";

export default function BookingSidebar({
  dentist,
  setIsReviewModalOpen,
}: {
  dentist: any;
  setIsReviewModalOpen: (open: boolean) => void;
}) {
  const { user } = useMe();
  const isOwnProfile = user && (user.id === dentist.claimedByUserId || (dentist.userId && user.id === dentist.userId));
  const {
    setShowSigninModal,
    setShowSignupModal,
    setShowBookingModal,
    setShowPersonalizeModal,
    setSelectedDentistId,
    setBookingMode,
  } = useStateContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("claim") === "true" || searchParams.get("cancelled") === "true") {
      router.push(`/find-dentists/${dentist.slug}/claim`);
    }
  }, [searchParams, router, dentist.slug]);

  const handleBookConsultation = () => {
    if (isOwnProfile) {
      toast.error("Dentists cannot book consultations on their own profiles.");
      return;
    }
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("book");
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
    if (isOwnProfile) {
      toast.error("Dentists cannot book consultations on their own profiles.");
      return;
    }
    setSelectedDentistId(dentist.id);
    setSelectedDentistsForBooking([dentist.id], [dentist.backendId || dentist.id]);
    setBookingMode("request");
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

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.error("Please sign in to write a review.");
      setShowSigninModal(true);
      return;
    }
    const isOwnProfile = user.id === dentist.claimedByUserId || (dentist.userId && user.id === dentist.userId);
    if (isOwnProfile) {
      toast.error("Dentists cannot write a review on their own profile.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  return (
    <aside className="lg:sticky lg:top-24 w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {/* Figma Row 1: Profile Avatar and details */}
      <div className="flex gap-5 mb-6 items-start">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-50 bg-slate-100">
          <Image
            src={dentist.image || "/images/man-avatar.png"}
            alt={dentist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-bold text-[#0E3E65] truncate leading-tight">
            {dentist.name}
          </h3>
          <p className="text-xs text-[#6B7280] font-medium leading-none">Dentist</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="font-bold text-sm text-[#0E3E65]">
              {(dentist.googleRating ?? dentist.rating ?? 5.0).toFixed(1)}
            </span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${i < Math.round(dentist.googleRating ?? dentist.rating ?? 5.0)
                    ? "fill-current text-amber-400"
                    : "text-slate-200"
                    }`}
                />
              ))}
            </div>
            {!isOwnProfile && (
              <button
                onClick={handleWriteReviewClick}
                className="text-[11px] font-semibold text-[#003366] hover:underline cursor-pointer flex items-center gap-0.5 ml-1.5"
              >
                <Pen size={10} /> Write a review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Figma Row 2: Trust pill row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Verified Status */}
        {dentist.verified ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#4CA30D] bg-green-50 border border-[#4CA30D]/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="size-3 text-[#4CA30D]" />
            Verified
          </div>
        ) : dentist.status === "CLAIMED" ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Claimed
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
            Directory
          </div>
        )}

        {/* RDV score badge */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#003366] bg-[#EEF8FF] border border-[#003366]/10 px-2.5 py-1 rounded-full">
          <span className="font-extrabold">{dentist.verified ? dentist.rdvScore : "0"}</span> RDV score
        </div>

        {/* No Surprise Guarantee */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          <ShieldCheck className="size-3 text-slate-400" />
          No Surprise Guarantee
        </div>

        {/* Escrow Badge */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          <ShieldCheck className="size-3 text-slate-400" />
          Escrow
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <div>
          <p className="text-xs text-[#6B7280]">Starting from</p>
          <p className="text-xl lg:text-2xl font-extrabold text-[#0E3E65]">
            ${dentist.price ? dentist.price.toLocaleString() : "0"}
          </p>
          <p className="text-[10px] text-[#9CA3AF]">Estimate</p>
        </div>

        {!isOwnProfile && (
          dentist.verified ? (
            <Button
              onClick={handleBookConsultation}
              className="h-14 flex-1 bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]"
            >
              Book consultation
            </Button>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              {dentist.isClaimable && (
                <Button
                  variant="outline"
                  className="h-11 border-amber-500 text-amber-700 bg-amber-50/50 hover:bg-amber-50 font-bold"
                  onClick={() => router.push(`/find-dentists/${dentist.slug}/claim`)}
                >
                  Claim Profile
                </Button>
              )}
              {(dentist.status === "CLAIMED" || dentist.isClaimed) && (
                <Button
                  className="h-11 bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]"
                  onClick={handleRequestConsultation}
                >
                  Request Consultation
                </Button>
              )}
            </div>
          )
        )}
      </div>
    </aside>
  );
}
