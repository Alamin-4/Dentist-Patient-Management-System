export interface PatientInfo {
  id: string;
  name: string;
  patient_ref: string;
  initials: string;
  avatar_color: string;
  email: string;
  phone: string;
  location: string;
}

export interface DentistInfo {
  name: string;
  initials: string;
  avatar_color: string;
  specialty: string;
  rating: number;
  review_count: number;
  verified: boolean;
  rdv_score: number;
  location: string;
}

export interface JourneyStep {
  step: string;
  date: string | null;
  completed: boolean;
  current?: boolean;
  cancelled?: boolean;
}

export interface PlatformFee {
  gross_amount: number;
  fee_pct: number;
  fee_amount: number | null;
  net_to_dentist: number | null;
}

export interface PaymentInfo {
  escrow_message: string;
  escrow_detail: string;
  estimate_amount: number;
  final_amount: number | null;
  escrow_status: string;
  escrow_type: "in_escrow" | "released" | "refunded" | "none";
}

export interface PlanItem {
  name: string;
  price: number | null;
  included?: boolean;
}

export interface TreatmentPlan {
  label: string;
  items: PlanItem[];
  estimate_total: number;
  guarantee_pct: number;
  max_charge: number;
  signed_by: string;
  signed_date: string;
  final_plan: {
    label: string;
    items: PlanItem[];
    final_total: number;
  } | null;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface ReviewInfo {
  status: string;
  reviewer_name: string;
  reviewer_initials: string;
  reviewer_avatar_color: string;
  review_date: string;
  overall_rating: number;
  categories: ReviewCategory[];
  written_review: string;
  procedure: string;
  dentist: string;
  before_after: {
    caption: string;
    has_images: boolean;
  };
}

export interface CancellationInfo {
  cancelled_on: string;
  cancelled_by: string;
  stage_at_cancel: string;
  refund_status: string;
  reason: string;
  initiated_by: string;
}

export interface UiBooking {
  id: string;
  booking_id: string;
  patient: PatientInfo;
  dentist: DentistInfo;
  procedure: string;
  status: string;
  escrow_status: string;
  amount: number;
  date: string;
  date_iso: string;
  created_date: string;
  created_date_iso: string;
  appointment_type: string;
  treatment_duration: string;
  scheduled_dates: string;
  scheduled_start: string;
  scheduled_end: string;
  booking_stage: string;
  journey: JourneyStep[];
  platform_fee: PlatformFee;
  payment: PaymentInfo;
  treatment_plan: TreatmentPlan;
  review: ReviewInfo | null;
  cancellation: CancellationInfo | null;
}

export interface DbBooking {
  id: string;
  patientId: string;
  dentistId: string;
  status: string;
  paymentStatus: string;
  escrowAmount: string | number;
  createdAt: string | Date;
  updatedAt: string | Date;
  scheduledDate?: string | Date | null;
  durationDays?: number | null;
  patient?: {
    country?: string | null;
    phoneNumber?: string | null;
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } | null;
  } | null;
  dentist?: {
    country?: string | null;
    user?: {
      firstName?: string;
      lastName?: string;
    } | null;
    specialty?: {
      name?: string;
    } | null;
    dentistDirectory?: {
      specialty?: string;
      googleRating?: number;
      googleReviewCount?: number;
      status?: string;
      city?: string;
    } | null;
    dentistVerificationProgress?: {
      rvdScore?: number;
    } | null;
  } | null;
  treatmentPlan?: {
    lineItems?: Array<{
      globalProcedure?: {
        name?: string;
      } | null;
      unitPrice?: string | number;
      quantity: number;
      notes?: string | null;
    }> | null;
  } | null;
  metadata?: Record<string, unknown> | null;
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] || "";
  const l = lastName?.[0] || "";
  return `${f}${l}`.toUpperCase() || "U";
}

function getAvatarColor(name?: string): string {
  const colors = [
    "#7C3AED",
    "#1E3A5F",
    "#2563EB",
    "#0891B2",
    "#0D9488",
    "#D97706",
    "#9333EA",
    "#DC2626",
    "#059669",
    "#7C3AED",
  ];
  const charCodeSum = (name || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
}

function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateISO(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  return new Date(dateInput).toISOString().split("T")[0];
}

function formatScheduledDates(startDate?: string | Date | null, durationDays?: number | null): string {
  if (!startDate) return "Pending Schedule";
  const start = new Date(startDate);
  if (!durationDays || durationDays <= 1) {
    return start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const end = new Date(start.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
}

export function mapDbBookingToUiBooking(dbBooking: DbBooking | null | undefined): UiBooking | null {
  if (!dbBooking) return null;

  const isPendingPayment = dbBooking.status === "PENDING_PAYMENT";
  const isConfirmed = dbBooking.status === "CONFIRMED";
  const isInProgress = dbBooking.status === "IN_PROGRESS";
  const isCompleted = dbBooking.status === "COMPLETED";
  const isCancelled = dbBooking.status === "CANCELLED";

  const metadata = dbBooking.metadata || {};

  // Safe extraction from metadata record
  const finalPlan = metadata.finalPlan as Record<string, unknown> | undefined;
  const finalPlanSubmitted = !!finalPlan;
  const finalPlanApproved = !!metadata.finalPlanApproved;
  const reviewData = metadata.review as Record<string, unknown> | undefined;
  const rejectionData = metadata.rejection as Record<string, unknown> | undefined;

  // 1. Patient Mapping
  const patientFirstName = dbBooking.patient?.user?.firstName || "";
  const patientLastName = dbBooking.patient?.user?.lastName || "";
  const patientName = `${patientFirstName} ${patientLastName}`.trim() || "Unknown Patient";
  const patientInitials = getInitials(patientFirstName, patientLastName);
  const patientAvatarColor = getAvatarColor(patientName);

  const patient: PatientInfo = {
    id: dbBooking.patientId,
    name: patientName,
    patient_ref: `PAT-${dbBooking.patientId.substring(0, 4).toUpperCase()}`,
    initials: patientInitials,
    avatar_color: patientAvatarColor,
    email: dbBooking.patient?.user?.email || "N/A",
    phone: dbBooking.patient?.phoneNumber || "N/A",
    location: dbBooking.patient?.country || "N/A",
  };

  // 2. Dentist Mapping
  const dentistFirstName = dbBooking.dentist?.user?.firstName || "";
  const dentistLastName = dbBooking.dentist?.user?.lastName || "";
  const dentistName = `Dr. ${dentistFirstName} ${dentistLastName}`.trim();
  const dentistInitials = getInitials(dentistFirstName, dentistLastName);
  const dentistAvatarColor = getAvatarColor(dentistName);
  const specialtyName =
    dbBooking.dentist?.specialty?.name ||
    dbBooking.dentist?.dentistDirectory?.specialty ||
    "General Dentist";

  const dentist: DentistInfo = {
    name: dentistName,
    initials: dentistInitials,
    avatar_color: dentistAvatarColor,
    specialty: specialtyName,
    rating: dbBooking.dentist?.dentistDirectory?.googleRating || 5.0,
    review_count: dbBooking.dentist?.dentistDirectory?.googleReviewCount || 0,
    verified: dbBooking.dentist?.dentistDirectory?.status === "VERIFIED",
    rdv_score: dbBooking.dentist?.dentistVerificationProgress?.rvdScore || 0,
    location: dbBooking.dentist?.dentistDirectory?.city || dbBooking.dentist?.country || "N/A",
  };

  // 3. Procedure & Escrow Amount
  const lineItems = dbBooking.treatmentPlan?.lineItems || [];
  const procedure = lineItems[0]?.globalProcedure?.name || "Dental Treatment";
  const amount = Number(dbBooking.escrowAmount) || 0;

  // 4. Status mappings
  let status = "In Progress";
  if (isCompleted) status = "Completed";
  else if (isCancelled) status = "Cancelled";

  let escrowStatus = "Pending";
  if (dbBooking.paymentStatus === "IN_ESCROW") escrowStatus = "In Escrow";
  else if (dbBooking.paymentStatus === "PAID") escrowStatus = "Released";
  else if (dbBooking.paymentStatus === "REFUNDED") escrowStatus = "Refunded";

  // 5. Booking Journey dynamic steps
  const journey: JourneyStep[] = [
    {
      step: "Consultation",
      date: formatDate(dbBooking.createdAt),
      completed: true,
    },
    {
      step: "Estimate Sent",
      date: formatDate(dbBooking.createdAt),
      completed: true,
    },
    {
      step: "Plan Accepted",
      date: !isPendingPayment ? formatDate(dbBooking.createdAt) : null,
      completed: !isPendingPayment,
    },
    {
      step: "Payment Confirmed",
      date: !isPendingPayment ? formatDate(dbBooking.createdAt) : null,
      completed: !isPendingPayment,
      current: isPendingPayment ? true : undefined,
    },
    {
      step: "Patient in Travel",
      date: dbBooking.scheduledDate ? formatDate(dbBooking.scheduledDate) : null,
      completed: isConfirmed || isInProgress || isCompleted,
      current: isConfirmed ? true : undefined,
    },
    {
      step: "Day 1 Treatment",
      date: isInProgress || isCompleted ? formatDate(dbBooking.scheduledDate) : null,
      completed: isInProgress || isCompleted,
      current: isInProgress && !finalPlanSubmitted ? true : undefined,
    },
    {
      step: "Final Plan Confirmed",
      date: finalPlanApproved && finalPlan ? formatDate(finalPlan.submittedAt as string) : null,
      completed: finalPlanApproved || isCompleted,
      current: isInProgress && finalPlanSubmitted && !finalPlanApproved ? true : undefined,
    },
    {
      step: "Treatment Complete",
      date: isCompleted ? formatDate(dbBooking.updatedAt) : null,
      completed: isCompleted,
      current: isInProgress && finalPlanApproved ? true : undefined,
    },
    {
      step: "Payment Released",
      date: isCompleted && dbBooking.paymentStatus === "PAID" ? formatDate(dbBooking.updatedAt) : null,
      completed: isCompleted && dbBooking.paymentStatus === "PAID",
      current: isCompleted && dbBooking.paymentStatus !== "PAID" ? true : undefined,
    },
  ];

  if (isCancelled) {
    journey.push({
      step: "Cancelled",
      date: formatDate(dbBooking.updatedAt),
      completed: true,
      cancelled: true,
    });
  }

  const feePct = 10;
  const feeAmount = dbBooking.paymentStatus === "REFUNDED" ? null : amount * (feePct / 100);
  const netToDentist = dbBooking.paymentStatus === "REFUNDED" ? null : amount - (feeAmount || 0);

  const platform_fee: PlatformFee = {
    gross_amount: amount,
    fee_pct: feePct,
    fee_amount: feeAmount,
    net_to_dentist: netToDentist,
  };

  // 7. Payment info
  const escrowType: "in_escrow" | "released" | "refunded" | "none" =
    dbBooking.paymentStatus === "IN_ESCROW"
      ? "in_escrow"
      : dbBooking.paymentStatus === "PAID"
        ? "released"
        : dbBooking.paymentStatus === "REFUNDED"
          ? "refunded"
          : "none";

  const escrowMessage =
    escrowType === "in_escrow"
      ? `$${amount.toLocaleString()} held in Escrow`
      : escrowType === "released"
        ? `Payment released · $${amount.toLocaleString()}`
        : escrowType === "refunded"
          ? `Refund Issued · $${amount.toLocaleString()}`
          : "Pending Escrow Payment";

  const escrowDetail =
    escrowType === "in_escrow"
      ? "Protected by the No Surprise Guarantee. Funds release automatically after treatment is confirmed complete."
      : escrowType === "released"
        ? `Net to dentist: $${netToDentist?.toLocaleString()} · Platform fee: $${feeAmount?.toLocaleString()} (${feePct}%)`
        : escrowType === "refunded"
          ? "Refunded to patient"
          : "Waiting for payment verification";

  const payment: PaymentInfo = {
    escrow_message: escrowMessage,
    escrow_detail: escrowDetail,
    estimate_amount: amount,
    final_amount: finalPlan ? Number(finalPlan.finalTotal) || null : null,
    escrow_status: escrowStatus,
    escrow_type: escrowType,
  };

  // 8. Treatment Plan
  const planItems: PlanItem[] = lineItems.map((item) => ({
    name: item.globalProcedure?.name || "Dental Procedure",
    price: Number(item.unitPrice) * item.quantity,
    included: false,
  }));

  if (planItems.length === 0) {
    planItems.push({
      name: "Initial consultation & estimate",
      price: amount,
      included: false,
    });
  }

  const finalPlanProcedures = finalPlan?.procedures as Array<Record<string, unknown>> | undefined;

  const treatment_plan: TreatmentPlan = {
    label: "Estimate",
    items: planItems,
    estimate_total: amount,
    guarantee_pct: 15,
    max_charge: Math.round(amount * 1.15),
    signed_by: patientName,
    signed_date: formatDate(dbBooking.createdAt),
    final_plan: finalPlan
      ? {
        label: "Final treatment plan",
        items: finalPlanProcedures
          ? finalPlanProcedures.map((p) => ({
            name: String(p.name || "Dental Procedure"),
            price: Number(p.price) || null,
          }))
          : [],
        final_total: Number(finalPlan.finalTotal) || 0,
      }
      : null,
  };

  // 9. Review
  const reviewCategories = reviewData?.categories as Array<Record<string, unknown>> | undefined;
  const review: ReviewInfo | null = reviewData
    ? {
      status: "Live",
      reviewer_name: patientName,
      reviewer_initials: patientInitials,
      reviewer_avatar_color: patientAvatarColor,
      review_date: formatDate((reviewData.submittedAt as string) || dbBooking.updatedAt),
      overall_rating:
        (Number(reviewData.ratingCommunication || 5) +
          Number(reviewData.ratingValueForMoney || 5) +
          Number(reviewData.ratingFollowThrough || 5)) /
        3,
      categories: reviewCategories
        ? reviewCategories.map((c) => ({
          name: String(c.name || ""),
          rating: Number(c.rating || 5),
        }))
        : [
          { name: "Communication", rating: Number(reviewData.ratingCommunication || 5) },
          { name: "Value for money", rating: Number(reviewData.ratingValueForMoney || 5) },
          { name: "Follow through", rating: Number(reviewData.ratingFollowThrough || 5) },
        ],
      written_review: String(reviewData.comments || ""),
      procedure: procedure,
      dentist: dentistName,
      before_after: {
        caption: "Treatment results",
        has_images: !!reviewData.afterPhotoUrl,
      },
    }
    : null;

  // 10. Cancellation
  const cancellation: CancellationInfo | null = isCancelled
    ? {
      cancelled_on: formatDate(dbBooking.updatedAt),
      cancelled_by: String(rejectionData?.rejectedBy || "Patient"),
      stage_at_cancel: "Plan Accepted",
      refund_status: dbBooking.paymentStatus === "REFUNDED" ? "Issued" : "Pending",
      reason: String(rejectionData?.reason || "Cancelled by user request."),
      initiated_by: "Patient Initiated",
    }
    : null;

  return {
    id: dbBooking.id,
    booking_id: `B-${dbBooking.id.substring(0, 8).toUpperCase()}`,
    patient,
    dentist,
    procedure,
    status,
    escrow_status: escrowStatus,
    amount,
    date: formatDate(dbBooking.scheduledDate || dbBooking.createdAt),
    date_iso: formatDateISO(dbBooking.scheduledDate || dbBooking.createdAt),
    created_date: formatDate(dbBooking.createdAt),
    created_date_iso: formatDateISO(dbBooking.createdAt),
    appointment_type: (metadata.appointmentType as string) || "In-person · Single day",
    treatment_duration: dbBooking.durationDays ? `${dbBooking.durationDays} days` : "1 day",
    scheduled_dates: formatScheduledDates(dbBooking.scheduledDate, dbBooking.durationDays),
    scheduled_start: formatDateISO(dbBooking.scheduledDate),
    scheduled_end: dbBooking.scheduledDate
      ? formatDateISO(new Date(new Date(dbBooking.scheduledDate).getTime() + (dbBooking.durationDays || 1) * 24 * 60 * 60 * 1000))
      : "",
    booking_stage:
      isCompleted
        ? "Payment Released"
        : isCancelled
          ? "Cancelled"
          : isConfirmed
            ? "Payment Confirmed"
            : isInProgress
              ? finalPlanApproved
                ? "Final Plan Confirmed"
                : finalPlanSubmitted
                  ? "Final Plan Proposed"
                  : "Day 1 Arrival"
              : "Awaiting Payment",
    journey,
    platform_fee,
    payment,
    treatment_plan,
    review,
    cancellation,
  };
}
