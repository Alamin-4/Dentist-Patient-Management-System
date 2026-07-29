import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTreatmentPlanById } from "@/hooks/treatment-plan/useTreatmentPlan";
import { mapPlanToBooking } from "@/app/modules/patient/MyBooking/MyBooking";
import {
  useCreateEscrowSession,
  useRespondFinalPlan,
  useSubmitReview,
} from "@/hooks/treatment-booking/useTreatmentBooking";
import { apiClient } from "@/api/client";

export function usePatientTreatmentController() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { data: treatmentPlanResponse, isLoading } = useTreatmentPlanById(slug as string);

  // Confirm escrow payment when Stripe redirects back with ?success=true&session_id=...
  useEffect(() => {
    const isSuccess = searchParams.get("success") === "true";
    const sessionId = searchParams.get("session_id");
    if (!isSuccess || !sessionId) return;

    const confirm = async () => {
      try {
        await apiClient.treatmentBookings.confirmEscrowPayment(sessionId);
        // Invalidate queries so status refreshes
        await queryClient.invalidateQueries({ queryKey: ["treatmentPlan", slug] });
        await queryClient.invalidateQueries({ queryKey: ["patientTreatmentPlans"] });
        // Clean URL without reload
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        console.error("Failed to confirm escrow payment:", err);
      }
    };

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [estimatePlanOpen, setEstimatePlanOpen] = useState(true);
  const [finalPlanOpen, setFinalPlanOpen] = useState(true);
  const [journeyOpen, setJourneyOpen] = useState(true);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [noSurpriseRejectModalOpen, setNoSurpriseRejectModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [arrivalCodeCopied, setArrivalCodeCopied] = useState(false);

  const createEscrowSessionMutation = useCreateEscrowSession();
  const respondFinalPlanMutation = useRespondFinalPlan();
  const submitReviewMutation = useSubmitReview();

  const plan = treatmentPlanResponse?.data;
  const booking = plan ? mapPlanToBooking(plan) : null;
  const finalPlan = booking?.finalPlan;
  const isWithinLeeway = finalPlan?.isWithinLeeway ?? true;
  const isApproved = booking?.isApproved;
  const isCancelled = plan?.treatmentBooking?.status === "CANCELLED";

  const travelFromDateStr = plan?.consultation?.intake?.travelFrom;
  const isArrivalToday = (() => {
    if (searchParams.get("mockArrival") === "true") return true;
    if (!travelFromDateStr) return false;
    const tFrom = new Date(travelFromDateStr);
    const day1Arrival = new Date(tFrom.getTime() + 24 * 60 * 60 * 1000);
    const today = new Date();

    const isToday = (d: Date) =>
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    return isToday(tFrom) || isToday(day1Arrival);
  })();

  const handleCopyCode = () => {
    if (booking?.paymentCode) {
      navigator.clipboard.writeText(booking.paymentCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleCopyArrivalCode = () => {
    if (booking?.arrivalCode) {
      navigator.clipboard.writeText(booking.arrivalCode);
      setArrivalCodeCopied(true);
      setTimeout(() => setArrivalCodeCopied(false), 2000);
    }
  };

  const handlePayDeposit = () => {
    if (booking?.treatmentBookingId) {
      createEscrowSessionMutation.mutate(booking.treatmentBookingId);
    }
  };

  const handleApprovePlan = () => {
    if (booking?.treatmentBookingId) {
      respondFinalPlanMutation.mutate({
        id: booking.treatmentBookingId,
        payload: { action: "APPROVE" },
      }, {
        onSuccess: () => {
          setApproveModalOpen(true);
        }
      });
    }
  };

  const handleRejectPlanConfirm = (reason: string) => {
    if (booking?.treatmentBookingId) {
      respondFinalPlanMutation.mutate({
        id: booking.treatmentBookingId,
        payload: { action: "REJECT", reason },
      });
      setRejectModalOpen(false);
    }
  };

  const handleNoSurpriseRejectConfirm = (reason: string) => {
    if (booking?.treatmentBookingId) {
      respondFinalPlanMutation.mutate({
        id: booking.treatmentBookingId,
        payload: { action: "REJECT", reason },
      });
      setNoSurpriseRejectModalOpen(false);
    }
  };

  const handleReviewSubmit = (reviewData: any) => {
    if (booking?.treatmentBookingId) {
      submitReviewMutation.mutate({
        id: booking.treatmentBookingId,
        payload: {
          ratingCommunication: reviewData.ratingCommunication,
          ratingValueForMoney: reviewData.ratingValueForMoney,
          ratingFollowThrough: reviewData.ratingFollowThrough,
          comments: reviewData.comments,
        },
      });
    }
  };

  return {
    slug,
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
    isPayingDeposit: createEscrowSessionMutation.isPending,
    isRespondingPlan: respondFinalPlanMutation.isPending,
    isSubmittingReview: submitReviewMutation.isPending,
    router,
  };
}
