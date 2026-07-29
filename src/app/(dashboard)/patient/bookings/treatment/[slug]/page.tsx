"use client";

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
import { cn } from "@/lib/utils";
import ClinicLocationModal from "@/app/modules/patient/MyBooking/Modal/ClinicLocationModal";
import { ConfirmReleaseModal } from "@/app/modules/patient/MyBooking/Modal/ApproveModal";
import { LeaveReviewModal } from "@/app/modules/patient/MyBooking/Modal/LeaveReviewModal";
import { RejectPlanModal } from "@/app/modules/patient/MyBooking/Modal/RejectModal";
import { NoSurpriseRejectModal } from "@/app/modules/patient/MyBooking/Modal/NoSurpriseRejectModal";
import { usePatientTreatmentController } from "@/core/hooks/patient/usePatientTreatmentController";

export default function TreatmentDetailsPage() {
  const {
    plan,
    booking,
    finalPlan,
    isWithinLeeway,
    isApproved,
    isCancelled,
    isArrivalToday,
    isLoading,
    estimatePlanOpen,
    setEstimatePlanOpen,
    finalPlanOpen,
    setFinalPlanOpen,
    journeyOpen,
    setJourneyOpen,
    locationModalOpen,
    setLocationModalOpen,
    approveModalOpen,
    setApproveModalOpen,
    rejectModalOpen,
    setRejectModalOpen,
    noSurpriseRejectModalOpen,
    setNoSurpriseRejectModalOpen,
    reviewModalOpen,
    setReviewModalOpen,
    codeCopied,
    arrivalCodeCopied,
    handleCopyCode,
    handleCopyArrivalCode,
    handlePayDeposit,
    handleApprovePlan,
    handleRejectPlanConfirm,
    handleNoSurpriseRejectConfirm,
    handleReviewSubmit,
    isPayingDeposit,
    isRespondingPlan,
    isSubmittingReview,
    router,
  } = usePatientTreatmentController();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F3659]"></div>
      </div>
    );
  }

  if (!plan || !booking) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-lg shadow-sm">
        <p className="text-red-500 font-medium">Treatment booking not found.</p>
        <button
          onClick={() => router.push("/patient")}
          className="mt-4 px-6 py-2 bg-[#0F3659] text-white rounded-lg text-sm cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
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
        onConfirm={handleRejectPlanConfirm}
        totalEstimate={booking.treatmentPlan.totalEstimate}
        isLoading={isRespondingPlan}
      />
      <NoSurpriseRejectModal
        isOpen={noSurpriseRejectModalOpen}
        onClose={() => setNoSurpriseRejectModalOpen(false)}
        onConfirm={handleNoSurpriseRejectConfirm}
        isLoading={isRespondingPlan}
      />
      <LeaveReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        doctor={{
          name: booking.doctor.name,
          specialty: booking.doctor.specialty,
          image: booking.doctor.image,
          rating: booking.doctor.rating,
          reviewCount: booking.doctor.reviewCount,
          location: `${booking.clinicLocation.city}, ${booking.clinicLocation.country}`,
        }}
      />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-slate-500 mb-4 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ChevronLeft className="size-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <h1 className="text-2xl font-bold text-text">Treatment Detail</h1>
        {isCancelled && (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Rejected
          </span>
        )}
      </div>

      <div className="bg-white border border-border rounded-lg p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
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
              <div className="flex items-center gap-1 text-xs font-medium text-text">
                <ShieldCheck className="size-3.5 text-badge" />
                <span>VERIFIED</span>
              </div>
            )}
            <div className="border border-slate-200 rounded px-2 py-0.5 text-[11px] text-text">
              {booking.doctor.rdvScore} RDV Score
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-text">{booking.doctor.name}</h2>
            <p className="text-sm text-[#475569] mt-0.5">{booking.doctor.specialty}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="font-semibold text-sm text-text mr-0.5">
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
            <p className="text-sm font-semibold text-text">{booking.procedure}</p>
          </div>

          {/* Appointment Dates */}
          <div className="shrink-0 space-y-1 min-w-40">
            <p className="text-xs text-slate-500 font-medium">Appointment Dates</p>
            <p className="text-sm font-semibold text-text">{booking.appointmentDate}</p>
          </div>

          {/* Budget / Status */}
          <div className="shrink-0 space-y-1 text-right">
            <p className="text-xs text-slate-500 font-medium">Estimate Budget</p>
            <p className="text-xl font-bold text-primary">
              ${booking.estimateBudget.toLocaleString()}
            </p>
            {booking.paymentStatus === "refunded" || isCancelled ? (
              <>
                <p className="text-xs font-bold text-sky-600 mt-0.5">Refunded</p>
                {booking.refundAmount && (
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Refund: ${Number(booking.refundAmount).toLocaleString()}
                  </p>
                )}
                {booking.cancellationFeeAmount && Number(booking.cancellationFeeAmount) > 0 && (
                  <p className="text-[10px] text-rose-600 font-medium mt-0.5">
                    Cancellation Fee: ${Number(booking.cancellationFeeAmount).toLocaleString()}
                  </p>
                )}
              </>
            ) : booking.paymentStatus === "paid" ? (
              <>
                <p className="text-xs font-bold text-badge mt-0.5">Paid</p>
                {booking.finalPlan?.finalTotal && (
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Final Price: ${Number(booking.finalPlan.finalTotal).toLocaleString()}
                  </p>
                )}
              </>
            ) : booking.paymentStatus === "pending" ? (
              <p className="text-xs font-bold text-red-500 mt-0.5">Payment Required</p>
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

          {/* Cancelled Banner */}
          {isCancelled && (
            <div className="bg-[#FFF1F2] border border-[#FCA5A5] rounded-xl px-5 py-4 text-[#B91C1C] text-sm font-semibold shadow-sm leading-relaxed">
              {plan.treatmentBooking?.metadata?.rejection?.reason || "I'm not ready to proceed with treatment at this time"}
            </div>
          )}

          {/* Estimate Treatment plan (collapsible) */}
          <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setEstimatePlanOpen((v) => !v)}
              className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
            >
              <h4 className="font-bold text-text">Estimate Treatment plan</h4>
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
                <div className="mt-4 bg-[#F0F9FF] p-4 rounded-lg border border-[#B3D8FF]">
                  <p className="text-primary font-bold text-sm mb-1">
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
            <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setFinalPlanOpen((v) => !v)}
                className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-text">Final treatment Plan</h4>
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

                  {/* No Surprise Reject — only when exceeds leeway and booking is in progress */}
                  {!isWithinLeeway && !isApproved && plan.treatmentBooking?.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => setNoSurpriseRejectModalOpen(true)}
                      className="mt-4 w-full py-3 rounded-lg border border-[#F43F5E] text-[#F43F5E] text-sm font-semibold hover:bg-[#FFF1F2] transition-colors cursor-pointer"
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
            <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setJourneyOpen((v) => !v)}
                className="w-full flex justify-between items-center px-5 md:px-6 py-4 cursor-pointer"
              >
                <h4 className="font-bold text-text">Journey Completed</h4>
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
          <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-5 md:p-6">
            <h4 className="font-bold text-text mb-6">Treatment Timeline</h4>
            <div className="space-y-0">
              {booking.timeline.map((step: any, i: number) => (
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

          {/* Arrival Code (visible when arrival date is today, booking is CONFIRMED, and arrival code exists) */}
          {plan.treatmentBooking?.status === "CONFIRMED" && isArrivalToday && booking.arrivalCode && (
            <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-5 md:p-6">
              <p className="text-sm font-bold text-text mb-3">Arrival Code</p>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-bold tracking-widest text-text">
                  {booking.arrivalCode}
                </span>
                <button
                  onClick={handleCopyArrivalCode}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 cursor-pointer"
                  title="Copy code"
                >
                  <Copy className="size-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {arrivalCodeCopied ? "Copied!" : `Show this to ${booking.doctor.name} on day 1 at clinic`}
              </p>
            </div>
          )}

          {/* Payment Code (visible when approved but not yet fully completed/paid) */}
          {isApproved && booking.paymentCode && plan.treatmentBooking?.status !== "COMPLETED" && (
            <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-5 md:p-6">
              <p className="text-sm font-bold text-text mb-3">Payment Code</p>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-bold tracking-widest text-text">
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
                {codeCopied ? "Copied!" : `Show this to ${booking.doctor.name} to complete payment`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed footer ───────────────────────────────────────────────── */}
      {!isCancelled && (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 bg-white border-t border-slate-200 px-6 md:px-10 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {plan.treatmentBooking?.status === "IN_PROGRESS" && (
              <button className="text-sm text-text underline underline-offset-2 cursor-pointer hover:text-slate-600 transition-colors">
                Dispute
              </button>
            )}

            <div className="flex items-center gap-3">
              {booking.paymentStatus === "pending" ? (
                <button
                  onClick={handlePayDeposit}
                  disabled={isPayingDeposit}
                  className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPayingDeposit ? "Loading Stripe..." : "Pay Escrow Deposit"}
                </button>
              ) : isApproved ? (
                <>
                  <button
                    onClick={() => router.push("/patient/documents")}
                    className="border border-slate-300 text-text px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    View Document
                  </button>
                  {plan.treatmentBooking?.status === "COMPLETED" && !plan.treatmentBooking?.metadata?.review && (
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      disabled={isSubmittingReview}
                      className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                    >
                      Review Doctor
                    </button>
                  )}
                </>
              ) : (
                <>
                  {finalPlan && plan.treatmentBooking?.status === "IN_PROGRESS" && (
                    <>
                      {isWithinLeeway && (
                        <button
                          onClick={() => setRejectModalOpen(true)}
                          disabled={isRespondingPlan}
                          className="border border-slate-300 text-text px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Reject Plan
                        </button>
                      )}
                      <button
                        onClick={handleApprovePlan}
                        disabled={isRespondingPlan}
                        className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isRespondingPlan ? "Approving..." : "Approve"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <div className="flex justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Procedure breakdown
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Price
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {breakdown.map((row, i) => (
          <div key={i} className="flex justify-between px-4 py-3 text-sm text-[#334155] bg-white">
            <span className="font-normal text-xs">{row.label}</span>
            <span className="font-semibold text-xs">
              {typeof row.price === "number" ? `$${row.price.toLocaleString()}` : row.price}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between bg-slate-50 px-4 py-3.5 border-t border-slate-100">
        <span className="font-bold text-primary text-sm">{totalLabel}</span>
        <span className="font-bold text-primary text-sm">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-text">{value}</span>
    </div>
  );
}

function TimelineStepItem({
  step,
  isLast,
  onViewMap,
}: {
  step: any;
  isLast: boolean;
  onViewMap?: () => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-5.5 rounded-full flex items-center justify-center shrink-0 border",
            step.completed
              ? "bg-primary border-primary text-white"
              : "bg-white border-slate-200 text-slate-300"
          )}
        >
          {step.completed && <CheckCircle2 className="size-3.5 fill-current text-white bg-primary rounded-full" />}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-8 my-1",
              step.completed ? "bg-primary" : "bg-slate-100"
            )}
          />
        )}
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <h5
          className={cn(
            "text-sm font-bold leading-tight",
            step.completed ? "text-text" : "text-slate-400"
          )}
        >
          {step.title}
        </h5>
        <p className="text-xs text-slate-400 mt-1">{step.description}</p>
        {step.link && onViewMap && (
          <button
            onClick={onViewMap}
            className="flex items-center gap-1 text-primary text-xs font-bold mt-2 hover:underline cursor-pointer"
          >
            <MapPin className="size-3" />
            <span>{step.link.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}
