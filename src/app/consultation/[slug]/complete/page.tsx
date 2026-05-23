"use client";

import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  consultationFlowData,
  getConsultationFlowItemBySlug,
} from "@/app/(dashboard)/patient/_components/Module/MyBooking/data";

export default function ConsultationCompletePage() {
  const router = useRouter();
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : consultationFlowData[0].slug;
  const consultation = getConsultationFlowItemBySlug(slug);

  return (
    <div className="flex min-h-screen items-center justify-center rounded-[28px] bg-[#F8FAFB] px-4 py-10">
      <div className="max-w-2xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#113254] text-white shadow-[0_18px_40px_rgba(17,50,84,0.18)]">
          <Check className="size-10 stroke-[3px]" />
        </div>

        <h1 className="mt-10 text-[28px] font-bold text-[#1A1A2E] md:text-[34px]">
          Your consultation is complete
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#64748B]">
          {consultation.doctor.name}, will review your case and send your
          treatment plan within 24 hours. You&apos;ll be notified by email and
          WhatsApp.
        </p>

        <button
          type="button"
          onClick={() => router.push("/patient/bookings")}
          className="mt-8 rounded-xl bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95"
        >
          Go to my Bookings
        </button>
      </div>
    </div>
  );
}
