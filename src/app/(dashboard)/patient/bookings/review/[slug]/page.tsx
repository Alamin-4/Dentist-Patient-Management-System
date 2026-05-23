"use client";

import Image from "next/image";
import { ChevronLeft, ShieldCheck, Award } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SignatureModal from "../../../_components/Module/MyBooking/Modal/SignatureModal";
import { RejectPlanModal } from "../../../_components/Module/MyBooking/Modal/RejectModal";
import PaymentSuccessModal from "../../../_components/Module/MyBooking/Modal/PaySuccessModal";
import { treatmentPlansData } from "../../../_components/Module/MyBooking/data";

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white rounded-2xl p-6 border border-slate-100", className)}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewPlanPage() {
  const { slug } = useParams();
  const router = useRouter();

  const plan = treatmentPlansData.find((p) => p.slug === slug) ?? treatmentPlansData[0];

  const leewayAmount = Math.round(plan.procedure.totalEstimate * 0.15);
  const maxPrice = plan.procedure.totalEstimate + leewayAmount;

  const [agreed, setAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <SignatureModal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        onConfirm={(data) => {
          setSignatureData(data);
          setAgreed(true);
        }}
      />

      <RejectPlanModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={() => {
          setRejectModalOpen(false);
          router.push("/patient/bookings");
        }}
      />

      <PaymentSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/patient/bookings");
        }}
      />

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 mb-4 hover:text-slate-600 transition-colors"
      >
        <ChevronLeft className="size-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold mb-6">
        Review Plan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          <SectionCard>
            {/* Doctor header */}
            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl mb-8">
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden bg-slate-100">
                  <Image
                    src={plan.doctor.image}
                    alt={plan.doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]">{plan.doctor.name}</h3>
                  <p className="text-sm text-[#475569]">{plan.doctor.specialty}</p>
                </div>
              </div>
              <div className="bg-[#EEF8FF] text-[#0E3E65] px-3 py-1.5 rounded-full border border-[#B3D8FF] flex items-center gap-2">
                <Award className="size-4" />
                <span className="text-xs font-semibold uppercase">No Surprise Guarantee</span>
              </div>
            </div>

            {/* Treatment breakdown */}
            <h4 className="font-semibold mb-4 text-[#1A1A2E]">Treatment plan breakdown</h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="flex justify-between bg-slate-50 px-4 py-3 border-b border-slate-100 font-bold text-sm">
                <span>Procedure breakdown</span>
                <span>Price</span>
              </div>
              <div className="divide-y divide-slate-50">
                {plan.procedure.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-4 py-4 text-sm">
                    <span className="text-[#64748B]">{item.label}</span>
                    <span className="text-[#1E293B] font-semibold">
                      {typeof item.price === "number"
                        ? `$${item.price.toLocaleString()}`
                        : item.price}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-5 bg-white border-t-2 border-slate-100">
                  <span className="text-[#1A1A2E] font-bold">Estimate amount</span>
                  <span className="text-[#1A1A2E] font-bold text-lg">
                    ${plan.procedure.totalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 15% leeway */}
            <div className="mt-6 bg-[#F0F9FF] p-5 rounded-xl border border-[#B3D8FF]">
              <p className="text-[#0E3E65] font-bold mb-1">15% leeway</p>
              <p className="text-[#203A55] text-sm leading-relaxed">
                Your final price on Day 1 will be within {leewayAmount.toLocaleString()} of $
                {plan.procedure.totalEstimate.toLocaleString()}. If {plan.doctor.name}&apos;s
                final price exceeds 15%, you can Reject for a full refund. No questions asked.
              </p>
            </div>
          </SectionCard>

          {/* Consent checkbox */}
          <div className="flex items-start gap-3 px-2 py-4">
            <input
              type="checkbox"
              id="consent"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-5 rounded border-slate-300 text-[#0F3659] focus:ring-[#0F3659] cursor-pointer"
            />
            <label htmlFor="consent" className="text-slate-500 text-sm leading-relaxed cursor-pointer">
              I have reviewed the treatment plan and understand the estimate range of $
              {plan.procedure.totalEstimate.toLocaleString()}, with the No Surprise Guarantee
              offering a full refund if the final price exceeds ${maxPrice.toLocaleString()}.
            </label>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <SectionCard>
            <h4 className="text-lg font-bold mb-6">Estimate Timeline</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full bg-[#0E3E65] shrink-0" />
                <p className="text-[#6B7280] text-sm">
                  You selected :{" "}
                  <span className="text-black font-bold">{plan.timeline.dates}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full bg-[#0E3E65] shrink-0" />
                <p className="text-[#6B7280] text-sm">
                  Treatment takes :{" "}
                  <span className="text-black font-bold">{plan.timeline.days} once you arrive</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full bg-[#0E3E65] shrink-0" />
                <p className="text-[#6B7280] text-sm">
                  Appointment Date :{" "}
                  <span className="text-black font-bold">{plan.timeline.dates}</span>
                </p>
              </div>
            </div>

            {/* Sign to confirm */}
            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h5 className="font-bold text-[#1A1A2E] mb-1">Sign to confirm plan</h5>
              <p className="text-[11px] text-slate-500 mb-4">
                Read each point carefully. You must agree to all three before your payment is processed.
              </p>

              {signatureData ? (
                <div className="relative h-32 bg-white border-2 border-[#10B981] rounded-xl overflow-hidden">
                  {signatureData.startsWith("data:image") ? (
                    <img
                      src={signatureData}
                      alt="Signature"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-3xl font-serif italic text-[#1A1A2E]">
                        {signatureData}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSignModalOpen(true)}
                    className="absolute top-2 right-2 text-[11px] font-semibold text-[#6B7280] border border-slate-200 bg-white rounded-md px-2 py-1 hover:bg-slate-50 transition-colors"
                  >
                    Resign
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSignModalOpen(true)}
                  className="w-full h-32 bg-white border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center hover:border-[#0F3659] transition-all"
                >
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-sm font-bold border-b-2 border-black pb-0.5">
                      click here to sign
                    </span>
                  </div>
                </button>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#F0F9FF] px-4 py-3 rounded-lg border border-[#B3D8FF]">
            <ShieldCheck className="size-5 text-[#0369A1]" />
            <p className="text-[#0369A1] text-xs font-medium">
              Secure payment held in escrow · Released only on day 1 of your arrival · Payment protected by Stripe
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setRejectModalOpen(true)}
              className="flex-1 md:flex-none px-8 py-3.5 rounded-xl border border-slate-300 font-bold text-[#EF4444] hover:bg-red-50 transition-all"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => setShowSuccess(true)}
              disabled={!agreed || !signatureData}
              className={cn(
                "flex-1 md:flex-none px-10 py-3.5 rounded-xl font-bold text-[15px] transition-all",
                agreed && signatureData
                  ? "bg-[#0F3659] text-white hover:bg-[#0A2640] active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              Pay ${plan.procedure.totalEstimate.toLocaleString()} securely
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
