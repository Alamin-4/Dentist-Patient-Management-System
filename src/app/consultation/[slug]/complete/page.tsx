"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";

export default function ConsultationCompletePage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("Your dentist");

  useEffect(() => {
    if (!slug) return;
    async function loadDetails() {
      try {
        const detailsRes = await api.get(endpoints.consultations.byId(slug));
        const data = detailsRes.data?.data;
        if (data?.dentist?.user?.name) {
          setDoctorName(`Dr. ${data.dentist.user.name}`);
        }
      } catch (err) {
        console.error("Failed to fetch doctor name", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [slug]);

  return (
    <div className="flex min-h-dvh items-center justify-center rounded-[28px] bg-[#F8FAFB] px-4 py-10">
      <div className="max-w-2xl text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#113254] text-white shadow-[0_18px_40px_rgba(17,50,84,0.18)]">
          <Check className="size-10 stroke-[3px]" />
        </div>

        <h1 className="mt-10 text-[28px] font-bold text-text md:text-[34px]">
          Your consultation is complete
        </h1>

        {loading ? (
          <div className="flex items-center justify-center mt-6 text-[#64748B]">
            <Loader2 className="size-5 animate-spin mr-2" />
            <span>Loading summary...</span>
          </div>
        ) : (
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#64748B]">
            {doctorName} will review your case and send your
            treatment plan within 24 hours. You&apos;ll be notified by email and
            WhatsApp.
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/patient/bookings")}
          className="mt-8 rounded-lg bg-[#113254] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#0d2844] active:scale-95 cursor-pointer"
        >
          Go to my Bookings
        </button>
      </div>
    </div>
  );
}
