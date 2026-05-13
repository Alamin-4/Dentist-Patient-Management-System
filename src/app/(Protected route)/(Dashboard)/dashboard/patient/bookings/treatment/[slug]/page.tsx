"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronDown,
  ShieldCheck,
  Award,
  CheckCircle2,
  MapPin,
  Copy,
  Hourglass,
  Star,
  Flag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PaymentSuccessModal from "../../../_components/Module/MyBooking/Modal/PaySuccessModal";
import { treatmentPlansData } from "../../../_components/Module/MyBooking/data";
import { useStateContext } from "@/providers/StateProvider";
import { ConfirmReleaseModal } from "../../../_components/Module/MyBooking/Modal/ApproveModal";
import { LeaveReviewModal } from "../../../_components/Module/MyBooking/Modal/LeaveReviewModal";
import { RejectPlanModal } from "../../../_components/Module/MyBooking/Modal/RejectModal";

const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

export default function TreatmentDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const { activeTab } = useStateContext();
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejected, setRejected] = useState(false);

  const plan =
    treatmentPlansData.find((p) => p.slug === slug) || treatmentPlansData[0];

  return (
    <div className="">
      <PaymentSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      <ConfirmReleaseModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={() => {
          setApproveModalOpen(false);
          setApproved(true);
        }}
        doctorName={plan.doctor.name}
      />
      <RejectPlanModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={() => {
          setShowRejectModal(false);
          setRejected(true);
        }}
      />

      <LeaveReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        doctor={{
          name: plan.doctor.name,
          specialty: plan.doctor.specialty,
          image: plan.doctor.image,
          rating: plan.doctor.rating,
          reviewCount: plan.doctor.reviewCount,
          location: "Cancun, Mexico",
        }}
      />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 mb-4 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="size-4" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">
        Treatment Detail
      </h1>

      {/* Top Header Card - Based on image_396c7c.png */}
      <SectionCard className="mb-6">
        <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Left: Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-16 lg:w-20 h-16 lg:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50">
              <Image
                src={plan.doctor.image}
                alt={plan.doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
              <ShieldCheck className="size-4 text-[#4CA30D]" />
              VERIFIED
            </div>
          </div>

          {/* Middle: Doctor Info */}
          <div className="flex-1 space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A2E]">
              {plan.doctor.name}
            </h2>
            <p className="text-base font-medium text-[#475569]">
              {plan.doctor.specialty}
            </p>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-[#1A1A2E] font-semibold mr-1">
                {plan.doctor.rating}
              </span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < plan.doctor.rating
                      ? "fill-[#FBBF24] text-[#FBBF24]"
                      : "text-slate-200",
                  )}
                />
              ))}
              <span className="text-slate-400 text-xs ml-1">
                ({plan.doctor.reviewCount} Ratings)
              </span>
            </div>
          </div>

          {/* Right: Procedure Info */}
          <div className="flex-1 space-y-1">
            <p className="text-slate-500 text-sm font-medium">Procedure</p>
            <p className="text-lg font-semibold text-[#1A1A2E]">
              {plan.procedure.name}
            </p>
          </div>
          {activeTab === "treatment" && plan.estimate_status === "accepted" && (
            <div className="flex-1 space-y-1">
              <p className="text-slate-500 text-sm font-medium">Next Step</p>
              <p className="text-lg font-semibold text-[#CA8504]">
                Pending Travel
              </p>
            </div>
          )}

          {/* Action Area: Logic Swaps Here */}
          <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
            {plan.estimate_status === "accepted" ? (
              <div className="text-right">
                <p className="text-[#6B7280] text-sm font-medium mb-1">
                  Estimate Budget
                </p>
                <p className="lg:text-xl font-bold text-[#0E3E65]">
                  ${plan.procedure.totalEstimate.toLocaleString()}
                </p>
                <p className="text-[#4CA30D] text-sm font-bold pt-2">
                  In Escrow
                </p>
              </div>
            ) : (
              <>
                <button className="w-full md:w-auto bg-[#F79009] hover:bg-[#EA580C] text-white px-4 py-2.5 rounded-lg text-sm transition-all">
                  Estimate Pending
                </button>
                <div className="text-right">
                  <p className="font-bold text-[#1A1A2E] text-lg tabular-nums">
                    {plan.timeline.remainingTime}
                  </p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Time remaining
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Estimate Treatment Plan Breakdown */}
          <SectionCard className="p-0 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <h4 className="font-bold text-[#1A1A2E]">
                Estimate Treatment plan
              </h4>
              <ChevronDown className="size-5 text-slate-400" />
            </div>

            <div className="p-6">
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="flex justify-between bg-slate-50/50 px-4 py-3 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase">
                  <span>Procedure breakdown</span>
                  <span>Price</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {plan.procedure.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between px-4 py-4 text-sm"
                    >
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-[#1E293B] font-medium">
                        {item.price === 0
                          ? "Included"
                          : `$${item.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-4 bg-white border-t border-slate-100">
                    <span className="text-[#0F3659] font-bold">
                      Estimate amount
                    </span>
                    <span className="text-[#0F3659] font-bold text-lg">
                      ${plan.procedure.totalEstimate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#F0F9FF] p-5 rounded-xl border border-[#B3D8FF]">
                <p className="text-[#0E3E65] font-bold mb-2 text-sm">
                  15% leeway
                </p>
                <p className="text-[#203A55] text-xs leading-relaxed">
                  Your final price on Day 1 will be within $161 of $
                  {plan.procedure.totalEstimate.toLocaleString()}. If Dr.
                  Mick&apos;s final price exceeds $1,236, you can cancel for a
                  full refund. No questions asked.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Final Treatment Plan (Empty State) */}
          <SectionCard className="p-0 overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <h4 className="font-bold text-[#1A1A2E]">Final Treatment plan</h4>
              <ChevronDown className="size-5 text-slate-400" />
            </div>
            <div className="px-6 pb-10 text-center flex flex-col items-center">
              <Hourglass className="size-10 text-slate-300 mb-4 animate-pulse" />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Final treatment plan will show here. Dr. Mick&apos;s final price
                exceeds $1,236, you can cancel for a full refund. No questions
                asked.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pending Steps - Vertical Tracker */}
          <SectionCard>
            <h4 className="font-bold text-[#1A1A2E] mb-8">Pending Steps</h4>
            <div className="space-y-0">
              <StepItem
                title="Payment Confirmed"
                desc="$1075 held in escrow • April 30, 2026"
                status="completed"
                isFirst
              />
              <StepItem
                title="Travel destination"
                desc="Cancun, Mexico • May 02, 2026"
                status="pending"
                rightElement={
                  <button className="flex items-center gap-1 text-[#0F3659] text-[10px] font-bold underline">
                    <MapPin className="size-3" /> View map location
                  </button>
                }
              />
              <StepItem
                title="Day 1 arrival, CBCT examination"
                desc="Show arrival code at clinic • May 03, 2026"
                status="pending"
              />
              <StepItem
                title="Final Treatment Plan Confirm"
                desc="Dr Alex submit final price you confirm via sms • May 02, 2026"
                status="pending"
              />
              <StepItem
                title="Treatment Done"
                desc="Review to the doctor"
                status="pending"
                isLast
              />
            </div>
          </SectionCard>

          {/* Arrival Code Card */}
          <SectionCard className="bg-[#FAFAFA]">
            <p className="text-sm font-bold text-[#1A1A2E] mb-4">
              Arrival Code
            </p>
            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold tracking-widest text-[#1A1A2E]">
                5263
              </span>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                <Copy className="size-5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-4">
              Show this to Dr. Alex on day 1 at clinic
            </p>
          </SectionCard>
        </div>
      </div>

      {approved ? (
        <div className="border-t pt-6 mt-6 flex items-center justify-end gap-4">
          <button className="flex cursor-pointer items-center gap-2 underline py-2 px-4">
            Upload After Photo
          </button>
          <button className="flex cursor-pointer items-center gap-2 border border-[#6B7280] text-[#1A1A2E] py-2 px-4 rounded-lg">
            View Document
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex cursor-pointer items-center gap-2 text-white bg-[#0E3E65] py-2 px-4 rounded-lg"
          >
            Review Doctor
          </button>
        </div>
      ) : (
        <div className="border-t pt-6 mt-6 flex items-center justify-end gap-4">
          <button className="flex cursor-pointer items-center gap-2 border border-red-400 text-red-400 py-2 px-4 rounded-lg">
            <Flag />
            Report
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="flex cursor-pointer items-center gap-2 border border-[#6B7280] text-[#1A1A2E] py-2 px-4 rounded-lg"
          >
            Reject Plan
          </button>
          <button
            onClick={() => setApproveModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 text-white bg-[#0E3E65] py-2 px-4 rounded-lg"
          >
            Approve & release
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components for the Tracker
const StepItem = ({ title, desc, status, isLast, rightElement }: any) => (
  <div className="flex gap-4 min-h-20">
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "size-5 rounded-full border-2 flex items-center justify-center z-10 bg-white",
          status === "completed"
            ? "bg-[#0F3659] border-[#0F3659]"
            : "border-slate-300",
        )}
      >
        {status === "completed" && (
          <CheckCircle2 className="size-3 text-white fill-[#0F3659]" />
        )}
      </div>
      {!isLast && <div className="w-0.5 h-full bg-slate-100 -my-1" />}
    </div>
    <div className="flex-1 pb-6">
      <div className="flex justify-between items-start">
        <h5
          className={cn(
            "text-sm font-bold",
            status === "completed" ? "text-[#1A1A2E]" : "text-slate-600",
          )}
        >
          {title}
        </h5>
        {rightElement}
      </div>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
    </div>
  </div>
);

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
