"use client"

import { useState } from "react";
import ToggleButton from "./ToggleButton/ToggleButton";
import InProgressBookingCard from "./InProgressBookingCard";
import InProgressBookingCardSkeleton from "./InProgressBookingCardSkeleton";
import { CalendarOff } from "lucide-react";
import { usePatientTreatmentPlans } from "@/hooks/treatment-plan/useTreatmentPlan";
import { TreatmentPlanItem } from "@/types";

// ─── Mapper Helper ────────────────────────────────────────────────────────────

export function mapPlanToBooking(plan: TreatmentPlanItem): any {
  const dentistUser = plan.dentist?.user;
  const doctorName = dentistUser ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim() : "Dentist";
  const specialty = plan.dentist?.specialty?.name || "Dentist";
  const avatarSrc = dentistUser?.image || "/images/dentist.png";

  const dentistDirectory = plan.dentist?.dentistDirectory;
  const rating = dentistDirectory?.googleRating ?? dentistDirectory?.doctoraliaRating ?? 0;
  const reviewCount = dentistDirectory?.googleReviewCount ?? dentistDirectory?.doctoraliaReviewCount ?? 0;

  const totalEstimate = plan.lineItems
    ? plan.lineItems.reduce((acc: number, item: any) => acc + Number(item.unitPrice) * (item.quantity || 1), 0)
    : 0;

  const procedureName = plan.lineItems?.[0]?.globalProcedure?.name || "Dental Treatment";

  // Format scheduledDate
  const scheduledDate = plan.consultation?.scheduledDate
    ? new Date(plan.consultation.scheduledDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " · " + (plan.consultation.scheduledTime || "")
    : "Not Scheduled";

  const bookingStatusMap: Record<string, string> = {
    ACTIVE: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "rejected",
  };

  const bookingStatus = bookingStatusMap[plan.status] || "in_progress";

  const paymentStatusMap: Record<string, string> = {
    PENDING: "pending",
    IN_ESCROW: "in_escrow",
    PAID: "paid",
    REFUNDED: "refunded",
  };

  const paymentStatus = paymentStatusMap[plan.treatmentBooking?.paymentStatus || ""] || "in_escrow";

  // Build progress steps based on treatmentBooking status
  // PENDING_PAYMENT, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
  const tbStatus = plan.treatmentBooking?.status || "PENDING_PAYMENT";
  const finalPlanObj = plan.treatmentBooking?.metadata?.finalPlan;

  const finalPlan = finalPlanObj
    ? {
      breakdown: finalPlanObj.procedures.map((p: any) => ({
        label: p.name,
        price: Number(p.price),
      })),
      finalTotal: Number(finalPlanObj.finalTotal),
      isWithinLeeway: Number(finalPlanObj.finalTotal) <= totalEstimate * 1.15,
    }
    : null;

  const isApproved = !!plan.treatmentBooking?.metadata?.finalPlanApproved || tbStatus === "COMPLETED";

  const progressSteps = [
    { label: "Payment Confirmed", completed: tbStatus !== "PENDING_PAYMENT" && tbStatus !== "CANCELLED" },
    { label: "Travel destination", completed: tbStatus !== "PENDING_PAYMENT" && tbStatus !== "CANCELLED" },
    { label: "Day 1 arrival, CBCT examination", completed: tbStatus === "IN_PROGRESS" || tbStatus === "COMPLETED" },
    { label: "Final Treatment Plan Confirm", completed: isApproved },
    { label: "Treatment Done", completed: tbStatus === "COMPLETED" },
  ];

  const breakdown = plan.lineItems?.map((item: any) => ({
    label: item.globalProcedure?.name || "Procedure",
    price: Number(item.unitPrice),
  })) || [];

  const paymentConfirmedDate = plan.treatmentBooking && tbStatus !== "PENDING_PAYMENT"
    ? new Date(plan.treatmentBooking.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const travelFromDate = plan.consultation?.intake?.travelFrom
    ? new Date(plan.consultation.intake.travelFrom).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const day1Date = plan.consultation?.intake?.travelFrom
    ? new Date(new Date(plan.consultation.intake.travelFrom).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const finalPlanApprovedDate = plan.treatmentBooking?.metadata?.finalPlanApprovedAt
    ? new Date(plan.treatmentBooking.metadata.finalPlanApprovedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : (isApproved && plan.treatmentBooking?.updatedAt
      ? new Date(plan.treatmentBooking.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : null);

  const finalPlanRejectionDate = tbStatus === "CANCELLED" && plan.treatmentBooking?.updatedAt
    ? new Date(plan.treatmentBooking.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const timeline = [
    {
      title: "Payment Confirmed",
      description: `$${totalEstimate.toLocaleString()} held in escrow${paymentConfirmedDate ? ` • ${paymentConfirmedDate}` : ""}`,
      completed: tbStatus !== "PENDING_PAYMENT",
    },
    {
      title: "Patient in Travel",
      description: travelFromDate || "Pending travel details",
      completed: tbStatus !== "PENDING_PAYMENT" && tbStatus !== "CONFIRMED",
      link: { label: "View map location" },
    },
    {
      title: "Day 1 arrival, CBCT examination",
      description:
        tbStatus === "IN_PROGRESS" || tbStatus === "COMPLETED" || tbStatus === "CANCELLED"
          ? day1Date || "Arrived"
          : "Show arrival code at clinic",
      completed: tbStatus === "IN_PROGRESS" || tbStatus === "COMPLETED" || tbStatus === "CANCELLED",
    },
    {
      title: "Final Treatment Plan Confirm",
      description: isApproved
        ? `Confirmed${finalPlanApprovedDate ? ` • ${finalPlanApprovedDate}` : ""}`
        : tbStatus === "CANCELLED"
          ? `Rejected${finalPlanRejectionDate ? ` • ${finalPlanRejectionDate}` : ""}`
          : finalPlan
            ? "Review final plan"
            : `Dr. ${dentistUser?.lastName || 'Dentist'} submit final price you confirm via sms`,
      completed: isApproved,
    },
    {
      title: "Treatment Done",
      description: tbStatus === "COMPLETED" ? "Review submitted" : tbStatus === "CANCELLED" ? "Cancelled" : "Waiting for review",
      completed: tbStatus === "COMPLETED",
    },
  ];

  return {
    id: plan.id,
    slug: plan.id,
    treatmentBookingId: plan.treatmentBooking?.id,
    bookingStatus,
    isApproved,
    doctor: {
      name: doctorName,
      specialty,
      image: avatarSrc,
      rating,
      reviewCount,
      rdvScore: plan.dentist?.dentistVerificationProgress?.rvdScore ?? 0,
      isVerified: plan.dentist?.dentistVerificationProgress?.isLicenseVerified ?? false,
    },
    procedure: procedureName,
    appointmentDate: scheduledDate,
    estimateBudget: totalEstimate,
    paymentStatus,
    progressSteps,
    infoMessage: "Review your treatment details, including arrival date and any updates, to confirm next steps.",
    treatmentPlan: {
      breakdown,
      totalEstimate,
      leewayPercent: 15,
    },
    timeline,
    clinicLocation: {
      address: dentistDirectory?.fullAddress || "123 Smile Avenue, Suite 202, Mexico City, Mexico 01010",
      city: dentistDirectory?.city || "Mexico City",
      country: dentistDirectory?.country || "Mexico",
      lat: Number(dentistDirectory?.latitude) || 19.4326,
      lng: Number(dentistDirectory?.longitude) || -99.1332,
    },
    arrivalCode: plan.treatmentBooking?.arrivalCode || "",
    paymentCode: plan.treatmentBooking?.paymentCode || "",
    finalPlan,
    journeyCompleted: tbStatus === "COMPLETED" ? {
      finalAmount: finalPlan ? finalPlan.finalTotal : totalEstimate,
      treatmentDuration: "Completed",
      location: `${dentistDirectory?.city || "Mexico City"}, ${dentistDirectory?.country || "Mexico"}`,
    } : null,
    dentistPayoutAmount: plan.treatmentBooking?.dentistPayoutAmount || null,
    platformFeeAmount: plan.treatmentBooking?.platformFeeAmount || null,
    refundAmount: plan.treatmentBooking?.refundAmount || null,
    cancellationFeeAmount: plan.treatmentBooking?.cancellationFeeAmount || null,
  };
}

const TABS = [
  { key: "in-progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

export default function MyBooking() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { data: treatmentPlansResponse, isLoading } = usePatientTreatmentPlans();

  const treatmentPlans = treatmentPlansResponse?.data || [];

  // Filter: only show plans that are bookings (status: ACTIVE, COMPLETED, CANCELLED)
  const bookings = treatmentPlans
    .filter((plan: TreatmentPlanItem) => plan.status === "ACTIVE" || plan.status === "COMPLETED" || plan.status === "CANCELLED")
    .map(mapPlanToBooking);

  const byStatus = (status: "in_progress" | "completed" | "rejected") =>
    bookings.filter((b: any) => b.bookingStatus === status);

  const inProgress = byStatus("in_progress");
  const completed = byStatus("completed");
  const rejected = byStatus("rejected");

  const currentList =
    activeTab === "in-progress"
      ? inProgress
      : activeTab === "completed"
        ? completed
        : rejected;

  const emptyMessages: Record<string, { title: string; description: string }> = {
    "in-progress": {
      title: "No Treatment Bookings Yet",
      description:
        "You haven't booked any treatments yet. Once you schedule a consultation, your treatment details will appear here.",
    },
    completed: {
      title: "No Completed Bookings",
      description:
        "Your completed treatment bookings will appear here once a treatment has been finished.",
    },
    rejected: {
      title: "No Rejected Bookings",
      description:
        "Any treatment bookings that were rejected or cancelled will appear here.",
    },
  };

  return (
    <div>
      <p className="text-2xl lg:text-3xl text-text font-bold">My Bookings</p>

      <div className="mt-4">
        <ToggleButton value={activeTab} onChange={setActiveTab} tabs={TABS} />
      </div>

      <div className="py-5 space-y-4">
        {isLoading ? (
          <InProgressBookingCardSkeleton />
        ) : currentList.length === 0 ? (
          <EmptyState {...emptyMessages[activeTab]} />
        ) : (
          currentList.map((booking: any) => (
            <InProgressBookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <CalendarOff className="size-12 text-[#0F3659] opacity-60" />
      <h3 className="text-lg font-bold text-text">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
