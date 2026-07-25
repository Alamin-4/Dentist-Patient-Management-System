"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  KeyRound,
  ShieldCheck,
  Target,
  Check,
  Info,
} from "lucide-react";
import CreateFinalTreatmentPlanModal from "@/app/modules/dentist/booking-manage/create-final-treatment-plan-modal";
import {
  useTreatmentBookingById,
  useVerifyArrivalCode,
  useSubmitFinalPlan,
  useVerifyPaymentCode,
} from "@/hooks/treatment-booking/useTreatmentBooking";
import { toast } from "react-hot-toast";
import { apiClient } from "@/api/client";
import { normalizeApiError } from "@/api/error-handler";

// ─── Sub-components ────────────────────────────────────────────────────────────

function TimelineIcon({ status }: { status: "completed" | "current" | "pending" }) {
  if (status === "completed") {
    return (
      <div className="shrink-0 w-6 h-6 rounded-full bg-[#0A2540] flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === "current") {
    return (
      <div className="shrink-0 w-6 h-6 rounded-full border-2 border-[#0A2540] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#0A2540]" />
      </div>
    );
  }
  return (
    <div className="shrink-0 w-6 h-6 rounded-full border-2 border-slate-200" />
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BookingDetailPage() {
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

  // Determine booking step based on live booking status
  let step: "day1_arrival" | "final_plan" | "payment_release" | "completed" | "cancelled" = "day1_arrival";

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

  // Build display data
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

  // Timeline status per step
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

  // Arrival verification handler
  const handleVerify = async () => {
    if (arrivalCode.length !== 4) {
      setCodeError(true);
      return;
    }
    setCodeError(false);
    verifyArrivalMutation.mutate(
      { id: id!, arrivalCode },
      {
        onError: () => {
          setCodeError(true);
        },
      }
    );
  };

  // Payment release verification handler
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

          if (errorMsg.includes("Stripe Connect") || errorMsg.includes("receive payouts")) {
            const toastId = toast.loading("Stripe Connect required to receive payouts. Initializing onboarding...");
            try {
              const response = await apiClient.stripe.connectOnboard();
              if (response?.data?.url) {
                toast.success("Redirecting to Stripe onboarding...", { id: toastId });
                window.location.href = response.data.url;
              } else {
                toast.error("Failed to start Stripe onboarding. Redirecting to Settings...", { id: toastId });
                setTimeout(() => {
                  router.push("/dentist/settings");
                }, 2000);
              }
            } catch (stripeErr: any) {
              console.error("Stripe Connect onboarding error:", stripeErr);
              toast.error("Redirecting to Settings...", { id: toastId });
              setTimeout(() => {
                router.push("/dentist/settings");
              }, 2000);
            }
          } else {
            setPaymentErrorMessage(errorMsg);
            setPaymentCodeError(true);
          }
        },
      }
    );
  };

  // Final plan modal submit
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

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-8 w-52 bg-slate-200 rounded" />
        <div className="bg-white rounded-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-36 bg-slate-200 rounded" />
                <div className="h-3 w-28 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-10 w-28 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white rounded-lg border border-slate-100" />
          <div className="h-72 bg-white rounded-lg border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* ── Back + Title ── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <button
              onClick={() => router.push("/dentist/bookings")}
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold">
              Treatment Detail
            </h1>
          </div>
          {booking?.status === "CANCELLED" && (
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Rejected
            </span>
          )}
        </div>

        {/* ── Patient Info Card ── */}
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Avatar + Name + Status */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8EEF2] flex items-center justify-center text-[#163E5C] font-bold text-base shrink-0">
                {display.initials}
              </div>
              <div>
                <div className="font-bold text-lg text-[#0F172A]">{display.name}</div>
                <div className="text-sm text-slate-500 mb-2">{display.email}</div>
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${booking?.status === "COMPLETED"
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : booking?.status === "CANCELLED"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                  {booking?.status === "CANCELLED" ? "Rejected" : booking?.status}
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-14 w-px bg-slate-100" />

            {/* Procedure */}
            <div className="sm:text-center">
              <div className="text-xs text-slate-500 mb-1">Procedure</div>
              <div className="font-semibold text-[#0F172A]">{display.procedure}</div>
            </div>

            <div className="hidden sm:block h-14 w-px bg-slate-100" />

            {/* Budget */}
            <div className="sm:text-right">
              <div className="text-xs text-slate-500 mb-1">Estimate Budget</div>
              <div className="text-2xl font-bold text-[#0A2540]">{display.budget}</div>
              <div className={`text-sm font-semibold ${booking?.paymentStatus === "REFUNDED"
                  ? "text-[#0284C7]"
                  : booking?.paymentStatus === "PAID"
                    ? "text-green-700"
                    : "text-[#D97706]"
                }`}>
                {booking?.paymentStatus === "IN_ESCROW"
                  ? "In Escrow"
                  : booking?.paymentStatus === "PAID"
                    ? "Paid"
                    : booking?.paymentStatus === "REFUNDED"
                      ? "Refund"
                      : booking?.paymentStatus}
              </div>
              {booking?.paymentStatus === "PAID" && booking.dentistPayoutAmount && (
                <div className="mt-1.5 text-xs text-emerald-600 font-semibold">
                  Payout: ${Number(booking.dentistPayoutAmount).toLocaleString()}
                  {booking.platformFeeAmount && (
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Platform Fee: ${Number(booking.platformFeeAmount).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
              {booking?.paymentStatus === "REFUNDED" && booking.refundAmount && (
                <div className="mt-1.5 text-xs text-slate-500 font-semibold">
                  Patient Refund: ${Number(booking.refundAmount).toLocaleString()}
                  {booking.cancellationFeeAmount && Number(booking.cancellationFeeAmount) > 0 && (
                    <span className="block text-[10px] text-emerald-600 font-semibold">
                      Your Fee (15%): ${Number(booking.cancellationFeeAmount).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Rejection / Cancelled Banner */}
            {booking?.status === "CANCELLED" && (
              <div className="bg-[#FFF1F2] border border-[#FCA5A5] rounded-lg px-5 py-4 text-[#B91C1C] text-sm font-semibold shadow-sm leading-relaxed">
                {booking.metadata?.rejection?.reason || "I'm not ready to proceed with treatment at this time"}
              </div>
            )}

            {/* Estimate Treatment Plan */}
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setTreatmentPlanOpen((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-[#0F172A]">Estimate Treatment plan</span>
                {treatmentPlanOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {treatmentPlanOpen && (
                <div className="px-6 pb-6">
                  <div className="rounded-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs">
                            Procedure breakdown
                          </th>
                          <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking?.treatmentPlan?.lineItems?.map((item: any, i: number) => (
                          <tr key={i} className="border-t border-slate-100">
                            <td className="px-4 py-3 text-slate-500 text-xs">
                              {item.globalProcedure?.name || "Procedure"}
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-slate-600">
                              ${Number(item.unitPrice).toLocaleString()}
                            </td>
                          </tr>
                        )) || (
                            <tr className="border-t border-slate-100">
                              <td className="px-4 py-3 text-slate-500 text-xs" colSpan={2}>
                                No procedure breakdown available.
                              </td>
                            </tr>
                          )}
                        <tr className="border-t border-slate-100 bg-slate-50">
                          <td className="px-4 py-3 font-bold text-[#163E5C] text-sm">
                            Estimate amount
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#163E5C] text-sm">
                            {display.budget}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Proposed Final Treatment Plan (if submitted) */}
            {booking?.metadata?.finalPlan && (
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFinalPlanOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-[#0F172A]">Final treatment Plan</span>
                    {(() => {
                      const estimateTotal = Number(booking.escrowAmount || 0);
                      const finalTotal = Number(booking.metadata.finalPlan.finalTotal || 0);
                      const isWithinLeeway = finalTotal <= estimateTotal * 1.15;
                      return isWithinLeeway ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-full px-2.5 py-0.5">
                          Within 15% protected range
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BE185D] bg-[#FDF2F8] border border-[#FBCFE8] rounded-full px-2.5 py-0.5">
                          Exceed 15% protected range
                        </span>
                      );
                    })()}
                  </div>
                  {finalPlanOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {finalPlanOpen && (
                  <div className="px-6 pb-6">
                    <div className="rounded-lg border border-slate-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs">Procedure</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking.metadata.finalPlan.procedures.map((row: any, i: number) => (
                            <tr key={i} className="border-t border-slate-100">
                              <td className="px-4 py-3 text-slate-500 text-xs">{row.name}</td>
                              <td className="px-4 py-3 text-right text-xs text-slate-600">${Number(row.price).toLocaleString()}</td>
                            </tr>
                          ))}
                          <tr className="border-t border-slate-100 bg-slate-50">
                            <td className="px-4 py-3 font-bold text-[#163E5C] text-sm">Final Total</td>
                            <td className="px-4 py-3 text-right font-bold text-[#163E5C] text-sm">${Number(booking.metadata.finalPlan.finalTotal).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step-based Section ── */}

            {/* Step: Day 1 Arrival Verification */}
            {step === "day1_arrival" && (
              <div className="space-y-4">
                {/* Dark verification banner */}
                <div className="bg-[#0A2540] rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        Patient Arrival Verification
                      </div>
                      <div className="text-slate-300 text-xs mt-0.5">
                        Ask the patient for their 4-digit arrival code
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full">
                    ACTION REQUIRED
                  </span>
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3.5 flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-700 leading-relaxed">
                    The patient received a unique arrival code when they booked. Ask
                    them to share it so you can verify their identity and confirm Day 1
                    arrival.
                  </p>
                </div>

                {/* Code input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Enter Arrival Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={arrivalCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setArrivalCode(val);
                        setCodeError(false);
                      }}
                      placeholder="e.g. 7429"
                      className={`flex-1 h-12 rounded-lg border px-4 text-base tracking-widest text-center font-mono bg-white focus:outline-none focus:ring-2 transition-all ${codeError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:ring-[#163E5C]/20 focus:border-[#163E5C]"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={arrivalCode.length !== 4 || verifyArrivalMutation.isPending}
                      className="h-12 px-6 rounded-lg bg-[#0A2540] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-[#0d2f50] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {verifyArrivalMutation.isPending ? "Verifying…" : "Verify"}
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-xs text-red-500 mt-1.5">
                      Please enter a valid 4-digit arrival code.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Final Treatment Plan */}
            {step === "final_plan" && (
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-[#0F172A] text-base mb-5">
                  Final Treatment plan
                </h3>

                {planSubmitted ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-green-500" />
                    </div>
                    <p className="font-semibold text-slate-700">
                      Final Treatment Plan Submitted
                    </p>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Waiting for the patient to confirm the plan before treatment can
                      begin.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Target className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                      Ensure your final treatment plan stays within 15% of the estimate
                      to uphold the No Surprise Guarantee. If it exceeds, the patient is
                      eligible for a full refund.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowFinalModal(true)}
                      className="w-full max-w-sm h-12 bg-[#0A2540] hover:bg-[#0d2f50] text-white font-semibold rounded-lg text-sm transition-colors"
                    >
                      Create Final Plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step: Payment Release Code Verification */}
            {step === "payment_release" && (
              <div className="space-y-4">
                {/* Dark payment release banner */}
                <div className="bg-[#10B981] rounded-lg px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        Release Escrow Payment
                      </div>
                      <div className="text-emerald-100 text-xs mt-0.5">
                        Ask the patient for their 4-digit payment release code
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    ACTION REQUIRED
                  </span>
                </div>

                {/* Code input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Enter Payment Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={paymentCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setPaymentCode(val);
                        setPaymentCodeError(false);
                      }}
                      placeholder="e.g. 9812"
                      className={`flex-1 h-12 rounded-lg border px-4 text-base tracking-widest text-center font-mono bg-white focus:outline-none focus:ring-2 transition-all ${paymentCodeError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPayment}
                      disabled={paymentCode.length !== 4 || verifyPaymentMutation.isPending}
                      className="h-12 px-6 rounded-lg bg-[#10B981] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-[#059669] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {verifyPaymentMutation.isPending ? "Verifying…" : "Release Funds"}
                    </button>
                  </div>
                  {paymentCodeError && (
                    <p className="text-xs text-red-500 mt-1.5">
                      {paymentErrorMessage || "Please enter a valid 4-digit payment code."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step: Completed Details */}
            {step === "completed" && (
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Treatment Completed</h3>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">
                    The escrow deposit has been released to your account successfully. Thank you for your service!
                  </p>
                </div>
                {booking?.metadata?.review && (
                  <div className="w-full bg-slate-50 rounded-lg p-4 text-left border border-slate-100 mt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Review</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const score = (Number(booking.metadata.review.ratingCommunication) + Number(booking.metadata.review.ratingValueForMoney) + Number(booking.metadata.review.ratingFollowThrough)) / 3;
                        return (
                          <span key={idx} className={idx < Math.round(score) ? "text-[#D97706] text-lg" : "text-slate-300 text-lg"}>★</span>
                        );
                      })}
                    </div>
                    <p className="text-slate-600 text-sm mt-2 font-normal italic">
                      "{booking.metadata.review.comments}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cancelled step content is handled via the top-level banner */}
          </div>

          {/* ── Right Column: Patient Timeline ── */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 h-fit">
            <h4 className="font-bold text-[#0F172A] mb-6">Patient Timeline</h4>
            <ol className="space-y-0">
              {timelineItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {/* Icon + vertical connector */}
                  <div className="flex flex-col items-center">
                    <TimelineIcon status={item.status} />
                    {i < timelineItems.length - 1 && (
                      <div
                        className={`w-px flex-1 min-h-7 my-1 ${item.status === "completed" ? "bg-[#0A2540]" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <div
                      className={`font-semibold text-sm leading-tight ${item.status === "pending" ? "text-slate-500" : "text-[#0F172A]"
                        }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ── Create Final Treatment Plan Modal ── */}
      {booking && (
        <CreateFinalTreatmentPlanModal
          isOpen={showFinalModal}
          onClose={() => setShowFinalModal(false)}
          onSubmit={handleFinalPlanSubmit}
          estimateTotal={display.budget}
          patient={{
            name: display.name,
            email: display.email,
            initials: display.initials,
            procedure: display.procedure,
            budget: display.budget,
            travelDates: display.travelFrom,
            lastVisited: display.lastVisited,
            conditions: display.conditions,
          }}
        />
      )}
    </>
  );
}
