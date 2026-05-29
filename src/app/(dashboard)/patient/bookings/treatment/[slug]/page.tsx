"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Star,
  Copy,
  ShieldAlert,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  inProgressBookingsData,
  type InProgressBooking,
  type TimelineStep,
} from "../../../_components/Module/MyBooking/data";
import ClinicLocationModal from "../../../_components/Module/MyBooking/Modal/ClinicLocationModal";
import { ConfirmReleaseModal } from "../../../_components/Module/MyBooking/Modal/ApproveModal";
import { LeaveReviewModal } from "../../../_components/Module/MyBooking/Modal/LeaveReviewModal";
import { RejectPlanModal } from "../../../_components/Module/MyBooking/Modal/RejectModal";
import { NoSurpriseRejectModal } from "../../../_components/Module/MyBooking/Modal/NoSurpriseRejectModal";

export default function TreatmentDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const booking: InProgressBooking =
    inProgressBookingsData.find((b) => b.slug === slug) ??
    inProgressBookingsData[0];

  const finalPlan = booking.finalPlan;
  const isWithinLeeway = finalPlan?.isWithinLeeway ?? true;

  const [isApproved, setIsApproved] = useState(false);
  const [estimatePlanOpen, setEstimatePlanOpen] = useState(!finalPlan);
  const [finalPlanOpen, setFinalPlanOpen] = useState(true);
  const [journeyOpen, setJourneyOpen] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [noSurpriseRejectModalOpen, setNoSurpriseRejectModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.paymentCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="pb-24">
      {/* Modals */}
      <ClinicLocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        address={booking.clinicLocation.address}
        lat={booking.clinicLocation.lat}
        lng={booking.clinicLocation.lng}
      />
      <ConfirmReleaseModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        doctorName={booking.doctor.name}
        paymentCode={booking.paymentCode}
      />
      <RejectPlanModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={() => setRejectModalOpen(false)}
        totalEstimate={booking.treatmentPlan.totalEstimate}
      />
      <NoSurpriseRejectModal
        isOpen={noSurpriseRejectModalOpen}
        onClose={() => setNoSurpriseRejectModalOpen(false)}
        onConfirm={() => setNoSurpriseRejectModalOpen(false)}
      />
      <LeaveReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        doctor={{
          name: booking.doctor.name,
          specialty: booking.doctor.specialty,
          image: booking.doctor.image,
          rating: booking.doctor.rating,
          reviewCount: booking.doctor.reviewCount,
          location: `${booking.clinicLocation.city}, ${booking.clinicLocation.country}`,
        }}
      />

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-slate-500 mb-4 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ChevronLeft className="size-4" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-5">Treatment Detail</h1>

      {/* Doctor Header Card */}
      <div className="bg-white border border-[#CEE0F4] rounded-xl p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Avatar + badges */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100">
              <Image
                src={booking.doctor.image}
                alt={booking.doctor.name}
                fill
                className="object-cover"
              />
            </div>
            {booking.doctor.isVerified && (
              <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
                <ShieldCheck className="size-3.5 text-[#4CA30D]" />
                <span>VERIFIED</span>
              </div>
            )}
            <div className="border border-[#1A1A2E] rounded px-2 py-0.5 text-[11px] font-bold text-[#1A1A2E]">
              {booking.doctor.rdvScore} RDV Score
            </div>
          </div>

          {/* Doctor info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#1A1A2E]">{booking.doctor.name}</h2>
            <p className="text-sm text-[#475569] mt-0.5">{booking.doctor.specialty}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="font-semibold text-sm text-[#1A1A2E] mr-0.5">
                {booking.doctor.rating}
              </span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < booking.doctor.rating
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "fill-slate-200 text-slate-200"
                  )}
                />
              ))}
              <span className="text-slate-400 text-xs ml-0.5">
                ({booking.doctor.reviewCount} Ratings)
              </span>
            </div>
          </div>

          {/* Procedure */}
          <div className="shrink-0 space-y-1 min-w-32.5">
            <p className="text-xs text-slate-500 font-medium">Procedure</p>
            <p className="text-sm font-semibold text-[#1A1A2E]">{booking.procedure}</p>
          </div>

          {/* Appointment Dates */}
          <div className="shrink-0 space-y-1 min-w-40">
            <p className="text-xs text-slate-500 font-medium">Appointment Dates</p>
            <p className="text-sm font-semibold text-[#1A1A2E]">{booking.appointmentDate}</p>
          </div>

          {/* Budget / Status */}
          <div className="shrink-0 space-y-1 text-right">
            <p className="text-xs text-slate-500 font-medium">Estimate Budget</p>
            <p className="text-xl font-bold text-[#0E3E65]">
              ${booking.estimateBudget.toLocaleString()}
            </p>
            {isApproved ? (
              <p className="text-xs font-bold text-[#4CA30D] mt-0.5">Paid</p>
            ) : (
              <p className="text-xs font-bold text-[#CA8504] mt-0.5">In Escrow</p>
            )}
          </div>
        </div>
      </div>

      {/* 2-column main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Estimate Treatment plan (collapsible) */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setEstimatePlanOpen((v) => !v)}
              className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
            >
              <h4 className="font-bold text-[#1A1A2E]">Estimate Treatment plan</h4>
              <ChevronDown
                className={cn(
                  "size-5 text-slate-400 transition-transform",
                  estimatePlanOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {estimatePlanOpen && (
              <div className="px-5 md:px-6 pb-5">
                <PlanTable
                  breakdown={booking.treatmentPlan.breakdown}
                  totalLabel="Estimate amount"
                  total={booking.treatmentPlan.totalEstimate}
                />
                <div className="mt-4 bg-[#F0F9FF] p-4 rounded-xl border border-[#B3D8FF]">
                  <p className="text-[#0E3E65] font-bold text-sm mb-1">
                    {booking.treatmentPlan.leewayPercent}% leeway
                  </p>
                  <p className="text-[#203A55] text-xs leading-relaxed">
                    Your final price on Day 1 will be within{" "}
                    {booking.treatmentPlan.leewayPercent}%. If{" "}
                    {booking.doctor.name}&apos;s final price exceeds 15%, you can
                    Reject for a full refund. No questions asked.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Final Treatment Plan (visible when finalPlan exists) */}
          {finalPlan && (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setFinalPlanOpen((v) => !v)}
                className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-[#1A1A2E]">Final treatment Plan</h4>
                  {isWithinLeeway ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-2.5 py-0.5">
                      <ShieldCheck className="size-3" />
                      Within 15% protected range
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#BE185D] bg-[#FDF2F8] border border-[#FBCFE8] rounded-full px-2.5 py-0.5">
                      <ShieldAlert className="size-3" />
                      Exceed 15% protected range
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 text-slate-400 transition-transform shrink-0",
                    finalPlanOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {finalPlanOpen && (
                <div className="px-5 md:px-6 pb-5">
                  <PlanTable
                    breakdown={finalPlan.breakdown}
                    totalLabel="Final total"
                    total={finalPlan.finalTotal}
                    isFinal
                  />

                  {/* No Surprise Reject — only when exceeds leeway */}
                  {!isWithinLeeway && !isApproved && (
                    <button
                      onClick={() => setNoSurpriseRejectModalOpen(true)}
                      className="mt-4 w-full py-3 rounded-xl border border-[#F43F5E] text-[#F43F5E] text-sm font-semibold hover:bg-[#FFF1F2] transition-colors cursor-pointer"
                    >
                      No surprise reject
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Journey Completed (visible when approved) */}
          {isApproved && booking.journeyCompleted && (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setJourneyOpen((v) => !v)}
                className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
              >
                <h4 className="font-bold text-[#1A1A2E]">Journey Completed</h4>
                <ChevronDown
                  className={cn(
                    "size-5 text-slate-400 transition-transform",
                    journeyOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {journeyOpen && (
                <div className="px-5 md:px-6 pb-5">
                  <div className="divide-y divide-slate-50">
                    <SummaryRow
                      label="Final Amount"
                      value={`$${booking.journeyCompleted.finalAmount.toLocaleString()}`}
                    />
                    <SummaryRow
                      label="Treatment Duration"
                      value={booking.journeyCompleted.treatmentDuration}
                    />
                    <SummaryRow
                      label="Location"
                      value={booking.journeyCompleted.location}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right column ────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Treatment Timeline */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 md:p-6">
            <h4 className="font-bold text-[#1A1A2E] mb-6">Treatment Timeline</h4>
            <div className="space-y-0">
              {booking.timeline.map((step, i) => (
                <TimelineStepItem
                  key={i}
                  step={step}
                  isLast={i === booking.timeline.length - 1}
                  onViewMap={
                    step.link ? () => setLocationModalOpen(true) : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* Payment Code (visible when approved) */}
          {isApproved && (
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 md:p-6">
              <p className="text-sm font-bold text-[#1A1A2E] mb-3">Payment Code</p>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-bold tracking-widest text-[#1A1A2E]">
                  {booking.paymentCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 cursor-pointer"
                  title="Copy code"
                >
                  <Copy className="size-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {codeCopied ? "Copied!" : `Show this to Dr. Alex on for release Amount`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky footer ───────────────────────────────────────────────── */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 md:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button className="text-sm text-[#1A1A2E] underline underline-offset-2 cursor-pointer hover:text-slate-600 transition-colors">
            Dispute
          </button>

          <div className="flex items-center gap-3">
            {isApproved ? (
              <>
                <button className="border border-slate-300 text-[#1A1A2E] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  View Document
                </button>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Review Doctor
                </button>
              </>
            ) : (
              <>
                {isWithinLeeway && finalPlan && (
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="border border-slate-300 text-[#1A1A2E] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Reject Plan
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsApproved(true);
                    setApproveModalOpen(true);
                  }}
                  className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function PlanTable({
  breakdown,
  totalLabel,
  total,
  isFinal = false,
}: {
  breakdown: Array<{ label: string; price: number | string }>;
  totalLabel: string;
  total: number;
  isFinal?: boolean;
}) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <div className="flex justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Procedure breakdown
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Price
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between px-4 py-3.5 text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className="text-[#1E293B] font-medium">
              {typeof item.price === "number"
                ? `$${item.price.toLocaleString()}`
                : item.price}
            </span>
          </div>
        ))}
        <div className="flex justify-between px-4 py-4 border-t border-slate-100">
          <span
            className={cn(
              "font-bold",
              isFinal ? "text-[#0F3659]" : "text-[#0F3659]"
            )}
          >
            {totalLabel}
          </span>
          <span className="text-[#0F3659] font-bold text-lg">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-[#1A1A2E]">{value}</span>
    </div>
  );
}

function TimelineStepItem({
  step,
  isLast,
  onViewMap,
}: {
  step: TimelineStep;
  isLast: boolean;
  onViewMap?: () => void;
}) {
  return (
    <div className="flex gap-3 min-h-16">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-5 rounded-full border-2 flex items-center justify-center z-10 shrink-0",
            step.completed
              ? "bg-[#0F3659] border-[#0F3659]"
              : "bg-white border-slate-300"
          )}
        >
          {step.completed && (
            <CheckCircle2 className="size-3.5 text-white fill-[#0F3659]" />
          )}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-slate-100 mt-1" />}
      </div>

      <div className="flex-1 pb-5">
        <div className="flex items-start justify-between gap-2">
          <h5
            className={cn(
              "text-sm font-semibold leading-tight",
              step.completed ? "text-[#1A1A2E]" : "text-slate-600"
            )}
          >
            {step.title}
          </h5>
          {step.link && onViewMap && (
            <button
              onClick={onViewMap}
              className="flex items-center gap-1 text-[#0F3659] text-xs font-semibold underline shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
            >
              <MapPin className="size-3" />
              {step.link.label}
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}
