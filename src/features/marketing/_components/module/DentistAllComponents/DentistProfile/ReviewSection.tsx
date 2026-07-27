"use client";

import { Star, Pen, Loader2, MessageSquare } from "lucide-react";
import { useMe } from "@/hooks/auth/useAuth";
import { useStateContext } from "@/providers/StateProvider";
import { useDentistDirectoryReviews } from "@/hooks/dentist/useDentistDirectory";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ReviewSection({
  slug,
  dentist,
  setIsReviewModalOpen,
  onSeeAllReviews,
}: {
  slug: string;
  dentist: any;
  googleRating?: number;
  googleReviewCount?: number;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  onSeeAllReviews?: () => void;
}) {
  const { user } = useMe();
  const isOwnProfile = user && (user.id === dentist.claimedByUserId || (dentist.userId && user.id === dentist.userId));
  const { setShowSigninModal } = useStateContext();
  const { data: reviewsData, isLoading } = useDentistDirectoryReviews(slug);

  const reviewsList = reviewsData?.data?.reviews || [];
  const displayedReviews = onSeeAllReviews ? reviewsList.slice(0, 5) : reviewsList;
  const metrics = reviewsData?.data?.metrics || {
    communication: 0.0,
    valueForMoney: 0.0,
    followThrough: 0.0,
  };

  const averageRating = reviewsList.length > 0
    ? reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewsList.length
    : 0.0;

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.error("Please sign in to write a review.");
      setShowSigninModal(true);
      return;
    }
    if (isOwnProfile) {
      toast.error("Dentists cannot write a review on their own profile.");
      return;
    }
    setIsReviewModalOpen(true);
  };

  return (
    <section id="reviews" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-[#033355]">
          Reviews & Ratings
        </h2>
        {!isOwnProfile && (
          <Button
            onClick={handleWriteReviewClick}
            className="bg-[#0E3E65] hover:bg-[#002850] text-white font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Pen className="size-4" /> Write a Review
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin size-6 text-[#0E3E65]" />
          <span>Loading reviews...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
            {/* Left Card: Average score */}
            <div className="bg-slate-50 rounded-xl p-5 text-center flex flex-col justify-center items-center border border-slate-100">
              <span className="text-4xl lg:text-5xl font-extrabold text-[#033355]">
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
              <div className="flex justify-between items-center text-sm font-semibold text-slate-705">
                <span className="text-[#6B7280]">Communication</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0E3E65]">{metrics.communication.toFixed(1)}</span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < Math.round(metrics.communication) ? "fill-current" : "text-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold text-slate-705">
                <span className="text-[#6B7280]">Value for money</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0E3E65]">{metrics.valueForMoney.toFixed(1)}</span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < Math.round(metrics.valueForMoney) ? "fill-current" : "text-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold text-slate-705">
                <span className="text-[#6B7280]">Follow-through</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0E3E65]">{metrics.followThrough.toFixed(1)}</span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < Math.round(metrics.followThrough) ? "fill-current" : "text-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviewsList.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="mx-auto size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <MessageSquare className="size-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-[#033355]">No Written Reviews Yet</p>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Be the first to share your experience with Dr. {dentist.name}. Submit a verified review to help other patients make informed decisions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {displayedReviews.map((review: any) => (
                <div key={review.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="size-9 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-xs font-bold text-[#0E3E65] uppercase">
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
                            className={`size-3.5 ${i < Math.round(review.rating) ? "fill-current" : "text-slate-200"
                              }`}
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
          )}
          {onSeeAllReviews && reviewsList.length > 5 && (
            <div className="mt-6 flex justify-center pt-5 border-t border-slate-100">
              <Button
                type="button"
                onClick={onSeeAllReviews}
                className="w-full sm:w-auto h-11 rounded-lg border border-slate-200 bg-white text-[#0E3E65] hover:bg-slate-50 font-bold transition-colors cursor-pointer"
              >
                See All Reviews ({reviewsList.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
