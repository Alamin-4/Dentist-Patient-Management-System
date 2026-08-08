import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useTreatmentBookingById,
  useVerifyArrivalCode,
  useSubmitFinalPlan,
  useVerifyPaymentCode,
} from "@/hooks/treatment-booking/useTreatmentBooking";
import { toast } from "react-hot-toast";
import { apiClient } from "@/api/client";
import { normalizeApiError } from "@/api/error-handler";

export type BookingStep = "day1_arrival" | "final_plan" | "payment_release" | "completed" | "cancelled";

export function useDentistBookingController() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const { data: response, isLoading } = useTreatmentBookingById(id || "");
  const booking = response?.data;

  const [arrivalCode, setArrivalCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const [paymentCode, setPaymentCode] = useState("");
  const [paymentCodeError, setPaymentCodeError] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

  const [showFinalModal, setShowFinalModal] = useState(false);
  const [treatmentPlanOpen, setTreatmentPlanOpen] = useState(true);
  const [finalPlanOpen, setFinalPlanOpen] = useState(true);

  const verifyArrivalMutation = useVerifyArrivalCode();
  const submitFinalPlanMutation = useSubmitFinalPlan();
  const verifyPaymentMutation = useVerifyPaymentCode();

  let step: BookingStep = "day1_arrival";

  if (booking) {
    if (booking.status === "CONFIRMED") {
      step = "day1_arrival";
    } else if (booking.status === "IN_PROGRESS") {
      const metadata = booking.metadata || {};
      if (metadata.finalPlanApproved) {
        step = "payment_release";
      } else {
        step = "final_plan";
      }
    } else if (booking.status === "COMPLETED") {
      step = "completed";
    } else if (booking.status === "CANCELLED") {
      step = "cancelled";
    }
  }

  const display = booking
    ? {
      name: `${booking.patient?.user?.firstName || ""} ${booking.patient?.user?.lastName || ""}`,
      email: booking.patient?.user?.email || "",
      initials: `${booking.patient?.user?.firstName?.[0] || ""}${booking.patient?.user?.lastName?.[0] || ""}`.toUpperCase(),
      procedure: booking.treatmentPlan?.lineItems?.[0]?.globalProcedure?.name || "Dental Treatment",
      budget: `$${Number(booking.escrowAmount).toLocaleString()}`,
      travelFrom: booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : "Pending scheduling",
      lastVisited: "N/A",
      conditions: "N/A",
    }
    : {
      name: "",
      email: "",
      initials: "",
      procedure: "",
      budget: "$0",
      travelFrom: "",
      lastVisited: "N/A",
      conditions: "N/A",
    };

  const formatDate = (dateInput: any) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const travelDate = booking?.scheduledDate ? new Date(booking.scheduledDate) : null;
  const arrivalDate = travelDate ? new Date(travelDate.getTime() + 24 * 60 * 60 * 1000) : null;

  const timelineItems = [
    {
      label: "Payment Confirmed",
      detail: booking ? `$${Number(booking.escrowAmount).toLocaleString()} held in escrow • ${formatDate(booking.createdAt)}` : "Held in escrow",
      status: "completed" as const,
    },
    {
      label: "Patient in Travel",
      detail: booking?.scheduledDate ? formatDate(booking.scheduledDate) : "Scheduled date",
      status: booking && booking.status !== "PENDING_PAYMENT" ? ("completed" as const) : ("pending" as const),
    },
    {
      label: "Day 1 arrival, CBCT examination",
      detail:
        booking && booking.status !== "CONFIRMED" && booking.status !== "PENDING_PAYMENT"
          ? arrivalDate
            ? formatDate(arrivalDate)
            : "Checked-in"
          : "Waiting for check-in",
      status:
        booking && booking.status !== "CONFIRMED" && booking.status !== "PENDING_PAYMENT"
          ? ("completed" as const)
          : booking?.status === "CONFIRMED"
            ? ("current" as const)
            : ("pending" as const),
    },
    {
      label: "Final Treatment Plan Confirmed",
      detail: booking?.metadata?.finalPlanApproved
        ? "Approved by patient"
        : booking?.status === "CANCELLED"
          ? "Rejected by patient"
          : booking?.metadata?.finalPlan
            ? "Awaiting patient approval"
            : "Review final plan",
      status: booking?.metadata?.finalPlanApproved
        ? ("completed" as const)
        : booking?.status === "CANCELLED"
          ? ("pending" as const)
          : booking?.metadata?.finalPlan
            ? ("current" as const)
            : ("pending" as const),
    },
    {
      label: "Treatment Done",
      detail:
        booking?.status === "COMPLETED"
          ? "Paid to your account"
          : booking?.status === "CANCELLED"
            ? "Cancelled"
            : "Waiting for review",
      status: booking?.status === "COMPLETED" ? ("completed" as const) : ("pending" as const),
    },
  ];

  const handleVerify = async () => {
    if (arrivalCode.length !== 4) {
      setCodeError(true);
      return;
    }
    setCodeError(false);
    verifyArrivalMutation.mutate(
      { id: id!, arrivalCode },
      {
        onError: (err: unknown) => {
          setCodeError(true);
          const apiErr = normalizeApiError(err);
          toast.error(apiErr.message || "Invalid arrival code. Please check with the patient.");
        },
      }
    );
  };

  const handleVerifyPayment = async () => {
    if (paymentCode.length !== 4) {
      setPaymentCodeError(true);
      setPaymentErrorMessage("Please enter a valid 4-digit payment code.");
      return;
    }
    setPaymentCodeError(false);
    setPaymentErrorMessage("");
    verifyPaymentMutation.mutate(
      { id: id!, paymentCode },
      {
        onError: async (err: any) => {
          const apiErr = normalizeApiError(err);
          const errorMsg = apiErr.message || "An error occurred during payment verification.";
          const errorCode = err?.errorCode || err?.response?.data?.errorCode;

          const isConnectRequired =
            errorCode === "STRIPE_CONNECT_REQUIRED" ||
            (errorMsg.includes("You must connect your Stripe Connect account") && !errorMsg.includes("failed"));

          if (isConnectRequired) {
            toast.error("Stripe Connect setup required to receive payouts.");
            try {
              const response = await apiClient.stripe.connectOnboard();
              if (response?.data?.url) {
                window.location.href = response.data.url;
              } else {
                router.push("/dentist/settings");
              }
            } catch (stripeErr: any) {
              console.error("Stripe Connect onboarding error:", stripeErr);
              router.push("/dentist/settings");
            }
          } else {
            setPaymentErrorMessage(errorMsg);
            setPaymentCodeError(true);
          }
        },
      }
    );
  };

  const handleFinalPlanSubmit = (data: any) => {
    submitFinalPlanMutation.mutate({
      id: id!,
      payload: {
        procedures: data.procedures,
        notes: "Submitted via Create Final Treatment Plan Modal",
      },
    });
  };

  const planSubmitted = !!booking?.metadata?.finalPlan;

  return {
    id,
    booking,
    isLoading,
    arrivalCode,
    setArrivalCode,
    codeError,
    setCodeError,
    paymentCode,
    setPaymentCode,
    paymentCodeError,
    setPaymentCodeError,
    paymentErrorMessage,
    showFinalModal,
    setShowFinalModal,
    treatmentPlanOpen,
    setTreatmentPlanOpen,
    finalPlanOpen,
    setFinalPlanOpen,
    step,
    display,
    timelineItems,
    planSubmitted,
    handleVerify,
    handleVerifyPayment,
    handleFinalPlanSubmit,
    isVerifyingArrival: verifyArrivalMutation.isPending,
    isReleasingFunds: verifyPaymentMutation.isPending,
    router,
  };
}
