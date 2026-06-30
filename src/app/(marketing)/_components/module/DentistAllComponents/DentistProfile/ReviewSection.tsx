"use client";

import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";

export default function ReviewSection({
  googleRating = 5.0,
  googleReviewCount = 0,
}: {
  googleRating?: number;
  googleReviewCount?: number;
}) {
  const metrics = [
    { label: "Communication", score: "4.0", stars: 4 },
    { label: "Value for money", score: "5.0", stars: 5 },
    { label: "Follow-through", score: "5.0", stars: 5 },
  ];

  const reviews = [
    {
      name: "Adriana",
      text: "Dr. Albano is incredibly gentle and takes the time to explain everything clearly. I usually feel nervous about dental appointments, but she made me feel completely at ease. Highly recommend!",
    },
    {
      name: "Lily Adams",
      text: "From the front desk to the treatment room, the entire experience was smooth. Dr. Albano created a personalized treatment plan and answered all my questions patiently. My smile has never looked better!",
    },
    {
      name: "Albert Den",
      text: "I brought my child in for a checkup, and Dr. Albano was amazing—kind, friendly, and very patient. She truly cares about her patients and makes dental visits stress-free. We've found our family dentist!",
    },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      {/* Exact Design Heading */}
      <h2 className="text-xl lg:text-2xl font-bold text-[#033355] mb-8">
        Reviews & Ratings
      </h2>

      {/* Stats Summary Area */}
      <div className="flex flex-col gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <span className="text-2xl lg:text-3xl font-bold text-[#033355]">
            {googleRating.toFixed(1)}
          </span>
          <div className="space-y-1 mt-1.5">
            <span className="text-xs text-[#6B7280] block">
              {googleReviewCount} Rating{googleReviewCount !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-0.5 text-[#FFC107]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${
                    i < Math.round(googleRating) ? "fill-current" : "text-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between ">
              <span className="text-sm text-[#6b7280]">{m.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-[15px] font-black text-[#033355]">
                  {m.score}
                </span>
                <div className="flex gap-0.5 text-[#FFC107]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < m.stars ? "fill-current" : "text-slate-200"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Review Items */}
      <div className="divide-y divide-[#F8FAFC] border-b border-slate-200 pb-6">
        {reviews.map((r, i) => (
          <div key={i} className="py-8 first:pt-8 last:pb-0 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden relative">
                <Image
                  src={`https://i.pravatar.cc/150?u=${i}`}
                  alt={r.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#033355]">{r.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#033355]">
                    5.0
                  </span>
                  <div className="flex gap-0.5 text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#6B7280]">{r.text}</p>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 text-[#033355] text-sm font-medium mt-4">
        Show more <ChevronDown className="size-5 stroke-[3px]" />
      </button>
    </section>
  );
}
