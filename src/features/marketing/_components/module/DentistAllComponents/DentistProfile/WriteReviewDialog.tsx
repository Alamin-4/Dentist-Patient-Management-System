"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useCreateDentistDirectoryReview } from "@/hooks/dentist/useDentistDirectory";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#1A1A2E",
  color: "#fff",
};

function StarRatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0">
      <span className="text-sm font-semibold text-[#1A1A2E]">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverVal(star)}
            onMouseLeave={() => setHoverVal(null)}
          >
            <Star
              className={`size-6 ${
                star <= (hoverVal ?? value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface WriteReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  dentistName: string;
}

export default function WriteReviewDialog({
  isOpen,
  onOpenChange,
  slug,
  dentistName,
}: WriteReviewDialogProps) {
  const createReviewMutation = useCreateDentistDirectoryReview();

  const [overallRating, setOverallRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [followRating, setFollowRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = () => {
    if (!reviewText || reviewText.trim().length < 10) {
      toast.error("Please enter a review comment of at least 10 characters.", { style: TOAST_STYLE });
      return;
    }

    const toastId = toast.loading("Submitting your review...", { style: TOAST_STYLE });
    createReviewMutation.mutate(
      {
        slug,
        payload: {
          rating: overallRating,
          communication: commRating,
          valueForMoney: valueRating,
          followThrough: followRating,
          text: reviewText,
        },
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully!", { id: toastId, style: TOAST_STYLE });
          onOpenChange(false);
          // Reset form
          setOverallRating(5);
          setCommRating(5);
          setValueRating(5);
          setFollowRating(5);
          setReviewText("");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || "Failed to submit review.";
          toast.error(msg, { id: toastId, style: TOAST_STYLE });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[95vh] overflow-y-auto rounded-lg border-none p-8 gap-0 bg-white">
        <DialogHeader className="mb-6 text-left">
          <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
            Write a Review
          </DialogTitle>
          <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
            Share your verified treatment experience with Dr. {dentistName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <StarRatingInput
            label="Overall Rating"
            value={overallRating}
            onChange={setOverallRating}
          />
          <StarRatingInput
            label="Communication"
            value={commRating}
            onChange={setCommRating}
          />
          <StarRatingInput
            label="Value for Money"
            value={valueRating}
            onChange={setValueRating}
          />
          <StarRatingInput
            label="Guarantee & Follow-through"
            value={followRating}
            onChange={setFollowRating}
          />

          <div className="space-y-2 pt-4">
            <label className="text-[15px] font-semibold text-[#1A1A2E] block">
              Review Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Tell other patients about your consultation, cleanings, procedures, or treatment plan details..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-[120px] rounded-lg border border-[#E5E7EB] px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
            <p className="text-[11px] text-[#9EA9AA]">
              Minimum 10 characters. Your review will be published instantly.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={createReviewMutation.isPending}
            className="flex-1 sm:flex-initial rounded-lg border border-[#E5E7EB] px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={createReviewMutation.isPending}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {createReviewMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
