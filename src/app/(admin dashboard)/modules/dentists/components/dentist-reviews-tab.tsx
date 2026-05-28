"use client";

import { Star } from "lucide-react";

type Review = {
  id: string;
  reviewer_name: string;
  reviewer_initials: string;
  reviewer_color: string;
  rating: number;
  treatment: string;
  date: string;
  text: string;
};

interface DentistReviewsTabProps {
  reviews: Review[];
  totalReviews: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </span>
  );
}

export function DentistReviewsTab({ reviews, totalReviews }: DentistReviewsTabProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3.5">
        <p className="text-sm font-semibold text-gray-500">
          Showing {reviews.length} of {totalReviews.toLocaleString()} reviews
        </p>
      </div>

      <div className="divide-y divide-gray-50">
        {reviews.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No reviews yet</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3 px-5 py-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: review.reviewer_color }}
              >
                {review.reviewer_initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-[#1A1A2E]">{review.reviewer_name}</p>
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">
                    {review.treatment} · {review.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{review.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
