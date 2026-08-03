"use client";

import { DentistProfileData } from "./profile.types";
import { useDentistDirectoryReviews } from "@/hooks/dentist/useDentistDirectory";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/shared/section-card";

interface ReviewsPlaceholderProps {
  dentist?: DentistProfileData | null;
}

export function ReviewsPlaceholder({ dentist }: ReviewsPlaceholderProps) {
  const isLicenseVerified = dentist?.dentistLicense?.isVerified || dentist?.dentistLicense?.verificationStatus === "APPROVED";
  const isOperationsVerified = dentist?.dentistOperationsVerifications?.[0]?.isVerified || dentist?.dentistOperationsVerifications?.[0]?.isApproved || dentist?.dentistOperationsVerifications?.[0]?.verificationStatus === "APPROVED";
  const isClinicalVerified = dentist?.dentistClinicDepthVerification?.isVerified || dentist?.dentistClinicDepthVerification?.isApproved || dentist?.dentistClinicDepthVerification?.verificationStatus === "APPROVED";

  const isFullyVerified = isLicenseVerified && isOperationsVerified && isClinicalVerified;

  const { data: reviewsData, isLoading } = useDentistDirectoryReviews(dentist?.slug || "");

  const reviewsList = reviewsData?.data?.reviews || [];
  const metrics = reviewsData?.data?.metrics || {
    communication: 0.0,
    valueForMoney: 0.0,
    followThrough: 0.0,
  };

  const averageRating = reviewsList.length > 0
    ? reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsList.length
    : 0.0;

  if (isLoading) {
    return (
      <SectionCard className="p-6 space-y-6">
        <div className="border-b border-border pb-4">
          <Skeleton className="h-6 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
          <div className="bg-slate-50 rounded-xl p-5 flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-16 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-3.5 w-20 rounded ml-auto" />
                  <Skeleton className="h-3 w-16 rounded ml-auto" />
                </div>
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded mt-1.5" />
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (reviewsList.length > 0) {
    return (
      <SectionCard className="p-6 space-y-8">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-bold text-gray-900">Reviews & Ratings</h3>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
          {/* Left Card: Average score */}
          <div className="bg-slate-50 rounded-xl p-5 text-center flex flex-col justify-center items-center border border-slate-100">
            <span className="text-4xl lg:text-5xl font-extrabold text-brand-medium-navy">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-700 mt-2">Average Score</span>
            <div className="flex gap-0.5 text-amber-400 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(averageRating) ? "fill-current" : "text-slate-200"}`}
                />
              ))}
            </div>
            <span className="text-xs text-sec-text mt-3 font-medium">
              {reviewsList.length} Verified Review{reviewsList.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Right Card: Metrics details */}
          <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-sec-text">Communication</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-medium-navy">{metrics.communication.toFixed(1)}</span>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(metrics.communication) ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-sec-text">Value for money</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-medium-navy">{metrics.valueForMoney.toFixed(1)}</span>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(metrics.valueForMoney) ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-sec-text">Follow-through</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-medium-navy">{metrics.followThrough.toFixed(1)}</span>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(metrics.followThrough) ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100">
          {reviewsList.map((review: any) => (
            <div key={review.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-brand-medium-navy uppercase">
                    {review.user?.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name || "Patient"}
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      (review.user?.firstName?.[0] || review.user?.name?.[0] || "P")
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {review.user?.name || `${review.user?.firstName || "Patient"} ${review.user?.lastName || ""}`}
                    </p>
                    <p className="text-[10px] text-sec-text">Verified Patient</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex gap-0.5 text-amber-400 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${i < Math.round(review.rating) ? "fill-current" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h4 className="mb-2 text-base font-bold text-gray-900">
          {isFullyVerified ? "No reviews yet" : "Reviews will appear after consultations"}
        </h4>
        <p className="max-w-85 text-sm leading-relaxed text-gray-400">
          {isFullyVerified
            ? "Reviews will be displayed here once patients book and complete consultations with you."
            : "Currently your profile is not visible to the public, so patients cannot review or book consultations yet."}
        </p>
      </div>
    </SectionCard>
  );
}
