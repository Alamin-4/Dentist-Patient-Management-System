"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useCreateDentistDirectoryReview } from "@/hooks/dentist/useDentistDirectory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const reviewSchema = z.object({
  rating: z.number().min(1, "Overall rating is required. Please select at least 1 star."),
  communication: z.number().min(1, "Communication rating is required. Please select at least 1 star."),
  valueForMoney: z.number().min(1, "Value for money rating is required. Please select at least 1 star."),
  followThrough: z.number().min(1, "Follow-through rating is required. Please select at least 1 star."),
  text: z.string().min(10, "Please enter a review comment of at least 10 characters."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function StarRatingInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  error?: string;
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  return (
    <div className="flex flex-col py-3 border-b border-slate-100 last:border-b-0 gap-1">
      <div className="flex items-center justify-between gap-4">
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
                className={`size-6 ${star <= (hoverVal ?? value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-right text-xs font-semibold text-destructive mt-0.5 animate-in fade-in slide-in-from-right-1">
          {error}
        </p>
      )}
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      communication: 0,
      valueForMoney: 0,
      followThrough: 0,
      text: "",
    },
  });

  const overallRating = watch("rating");
  const commRating = watch("communication");
  const valueRating = watch("valueForMoney");
  const followRating = watch("followThrough");

  const onSubmit = (data: ReviewFormValues) => {
    const toastId = toast.loading("Submitting your review...", { style: TOAST_STYLE });
    createReviewMutation.mutate(
      {
        slug,
        payload: {
          rating: data.rating,
          communication: data.communication,
          valueForMoney: data.valueForMoney,
          followThrough: data.followThrough,
          text: data.text,
        },
      },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully!", { id: toastId, style: TOAST_STYLE });
          onOpenChange(false);
          reset({
            rating: 0,
            communication: 0,
            valueForMoney: 0,
            followThrough: 0,
            text: "",
          });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <StarRatingInput
              label="Overall Rating"
              value={overallRating}
              onChange={(val) => setValue("rating", val, { shouldValidate: true })}
              error={errors.rating?.message}
            />
            <StarRatingInput
              label="Communication"
              value={commRating}
              onChange={(val) => setValue("communication", val, { shouldValidate: true })}
              error={errors.communication?.message}
            />
            <StarRatingInput
              label="Value for Money"
              value={valueRating}
              onChange={(val) => setValue("valueForMoney", val, { shouldValidate: true })}
              error={errors.valueForMoney?.message}
            />
            <StarRatingInput
              label="Guarantee & Follow-through"
              value={followRating}
              onChange={(val) => setValue("followThrough", val, { shouldValidate: true })}
              error={errors.followThrough?.message}
            />

            <div className="space-y-2 pt-4">
              <label className="text-[15px] font-semibold text-[#1A1A2E] block">
                Review Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Tell other patients about your consultation, cleanings, procedures, or treatment plan details..."
                {...register("text")}
                className={`w-full min-h-30 rounded-lg border px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm ${errors.text ? "border-red-500 bg-red-50/10" : "border-[#E5E7EB] focus:border-[#0E3E65]"
                  }`}
              />
              {errors.text ? (
                <p className="text-xs font-semibold text-destructive mt-1 animate-in fade-in slide-in-from-left-1">
                  {errors.text.message}
                </p>
              ) : (
                <p className="text-[11px] text-[#9EA9AA]">
                  Minimum 10 characters. Your review will be published instantly.
                </p>
              )}
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
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
