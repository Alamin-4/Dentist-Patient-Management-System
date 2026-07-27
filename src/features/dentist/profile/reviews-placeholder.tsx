"use client";

import { DentistProfileData } from "./profile.types";
import { useDentistDirectoryReviews } from "@/hooks/dentist/useDentistDirectory";
import { Star, Loader2 } from "lucide-react";

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
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden p-6">
        <div className="py-12 flex justify-center items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin size-6 text-[#163E5C]" />
          <span>Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (reviewsList.length > 0) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden p-6 space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Reviews & Ratings</h3>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
          {/* Left Card: Average score */}
          <div className="bg-slate-50 rounded-xl p-5 text-center flex flex-col justify-center items-center border border-slate-100">
            <span className="text-4xl lg:text-5xl font-extrabold text-[#163E5C]">
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
            <span className="text-xs text-[#6B7280] mt-3 font-medium">
              {reviewsList.length} Verified Review{reviewsList.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Right Card: Metrics details */}
          <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-[#6B7280]">Communication</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#163E5C]">{metrics.communication.toFixed(1)}</span>
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
              <span className="text-[#6B7280]">Value for money</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#163E5C]">{metrics.valueForMoney.toFixed(1)}</span>
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
              <span className="text-[#6B7280]">Follow-through</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#163E5C]">{metrics.followThrough.toFixed(1)}</span>
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
                  <div className="size-9 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-xs font-bold text-[#163E5C] uppercase">
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
                    <p className="text-[10px] text-[#6B7280]">Verified Patient</p>
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
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
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
    </div>
  );
}
