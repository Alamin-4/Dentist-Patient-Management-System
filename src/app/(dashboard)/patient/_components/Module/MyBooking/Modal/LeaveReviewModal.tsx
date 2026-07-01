"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, ShieldCheck, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: {
    name: string;
    specialty: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
  };
}

export function LeaveReviewModal({
  isOpen,
  onClose,
  doctor,
}: ReviewModalProps) {
  const [ratings, setRatings] = useState({
    communication: 5,
    value: 5,
    followThrough: 5,
  });

  const categories = [
    { id: "communication", label: "Communication" },
    { id: "value", label: "Value for money" },
    { id: "followThrough", label: "Follow through" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none gap-0 rounded-3xl">
        {/* Header Section */}
        <DialogHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-2xl font-bold text-[#1A1A2E]">
            Leave review
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Doctor Info Card - Matches image_2e7035.png */}
          <div className="p-6 rounded-lg border border-[#E2E8F0] bg-white flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative size-24 rounded-full overflow-hidden border-2 border-slate-50">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="size-4 text-[#4CA30D]" />
                <span className="text-[10px] font-bold text-[#1A1A2E]">
                  VERIFIED
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-1.5">
              <h3 className="text-2xl font-bold text-[#1A1A2E]">
                {doctor.name}
              </h3>
              <p className="text-slate-500 font-medium">{doctor.specialty}</p>

              <div className="flex items-center justify-center md:justify-start gap-1 pt-1">
                <span className="text-sm font-bold text-[#0F3659] mr-1">
                  {doctor.rating}
                </span>
                <div className="flex text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 text-xs ml-1">
                  ({doctor.reviewCount} Ratings)
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1 text-slate-400">
                <MapPin className="size-4" />
                <span className="text-sm font-medium">{doctor.location}</span>
              </div>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <p className="text-lg font-semibold text-[#1A1A2E]">
                  {cat.label}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({ ...ratings, [cat.id]: star })}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <Star
                        className={`size-6 ${star <= (ratings as any)[cat.id]
                            ? "fill-[#FBBF24] text-[#FBBF24]"
                            : "text-slate-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-[#1A1A2E]">Write Review</p>
            <Textarea
              placeholder="Share your experience with this vendor..."
              className="min-h-40 rounded-lg border-slate-200 p-4 text-base resize-none focus-visible:ring-[#0F3659]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-14 rounded-lg cursor-pointer border-slate-300 font-bold text-[#1A1A2E] hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 h-14 rounded-lg cursor-pointer bg-[#0F3659] font-bold text-white hover:bg-[#0a2640]"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
