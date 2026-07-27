"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import { useCreateDirectoryCheckoutSession } from "@/hooks/dentist/useDentistDirectory";
import type {
  DentistVerificationProgress,
  VerificationProgressStep,
  VerificationPhase,
} from "./verification-progress.types";

export enum VerificationStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

const getStepByPhase = (
  steps: VerificationProgressStep[],
  phase: VerificationPhase,
) => steps.find((step) => step.phase === phase);

export function VerificationBanner() {
  const router = useRouter();
  const { data: progressData } = useDentistProgress();

  const progress = progressData?.data as
    | DentistVerificationProgress
    | undefined;

  const [selectedPlan, setSelectedPlan] = useState<string>("6_MONTH");
  const checkoutMutation = useCreateDirectoryCheckoutSession();

  if (progress?.show_membership_purchase) {
    const handleProceedToPayment = () => {
      const directoryId = progress.dentist_directory_id;
      if (!directoryId) {
        toast.error("Directory Profile ID not found. Please try again.");
        return;
      }

      checkoutMutation.mutate(
        { dentistDirectoryId: directoryId, membershipPlan: selectedPlan },
        {
          onSuccess: (res: any) => {
            const checkoutUrl = res?.data?.url;
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
            } else {
              toast.error("Failed to create checkout session. Please try again.");
            }
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Payment setup failed.");
          },
        }
      );
    };

    return (
      <div className="mx-auto max-w-xl my-auto bg-white p-6 lg:p-8 rounded-lg border border-gray-200 shadow-sm animate-scaleUp">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground">
            Documents Verified successfully!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            All your verification documents have been approved by our admin team. The final step to go live on RatedDocs is to select a membership plan below.
          </p>

          <div className="mt-8 w-full">
            <div className="space-y-4 text-left">
              <label className="text-sm font-semibold text-foreground block">
                Select Your Membership Plan
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedPlan("6_MONTH")}
                  className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    selectedPlan === "6_MONTH"
                      ? "border-[#0e3e65] bg-[#0e3e65]/5 ring-2 ring-[#0e3e65]/10"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">6 Months</span>
                  <span className="block text-2xl font-extrabold text-[#0e3e65] mt-1">$899</span>
                  <span className="block text-[10px] text-slate-400 mt-1">~$149.83/mo</span>
                </div>
                
                <div
                  onClick={() => setSelectedPlan("12_MONTH")}
                  className={`relative border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    selectedPlan === "12_MONTH"
                      ? "border-[#4CA30D] bg-[#4CA30D]/5 ring-2 ring-[#4CA30D]/10"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4CA30D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Best Value</span>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">12 Months</span>
                  <span className="block text-2xl font-extrabold text-[#0e3e65] mt-1">$1499</span>
                  <span className="block text-[10px] text-slate-400 mt-1">~$124.92/mo</span>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-3.5 text-xs text-blue-800 flex items-start gap-2.5">
                <ShieldCheck className="size-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  You will be redirected to Stripe for secure payment. Once checkout is completed successfully, your profile will instantly go live and patient bookings will be enabled.
                </span>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  disabled={checkoutMutation.isPending}
                  className="w-full h-14 rounded-lg bg-[#0E3E65] hover:bg-[#082842] text-white font-semibold shadow-sm cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
                  onClick={handleProceedToPayment}
                >
                  {checkoutMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      Redirecting to Payment...
                    </span>
                  ) : (
                    `Purchase Membership & Go Live →`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = progress?.steps || [];
  const licenseStep = getStepByPhase(steps, "LICENSE");
  const operationalStep = getStepByPhase(steps, "OPERATIONAL");
  const clinicalStep = getStepByPhase(steps, "CLINICAL");

  // Helper to resolve step status
  const getStepStatus = (
    step: VerificationProgressStep | undefined,
    fallbackStatus?: string | null,
  ) => {
    if (fallbackStatus && fallbackStatus !== "PENDING") return fallbackStatus;
    if (!step) return "PENDING";
    if (step.status) return step.status;
    return step.completed ? "APPROVED" : "PENDING";
  };

  const step1Status = getStepStatus(licenseStep, progress?.step_one_status);
  const step2Status = getStepStatus(operationalStep, progress?.step_two_status);
  const step3Status = getStepStatus(clinicalStep, progress?.step_three_status);

  const step1Done = licenseStep
    ? licenseStep.completed
    : progress?.is_step_one_completed || step1Status === VerificationStatus.APPROVED;
  const step2Done = operationalStep
    ? operationalStep.completed
    : progress?.is_step_two_completed || step2Status === VerificationStatus.APPROVED;
  const step3Done = clinicalStep
    ? clinicalStep.completed
    : progress?.is_step_three_completed || step3Status === VerificationStatus.APPROVED;

  // Calculate completion percentage
  let computedScore = 0;
  if (step1Done) computedScore += 30;
  if (step2Done) computedScore += 40;
  if (step3Done) computedScore += 30;

  const score =
    progress?.progress_percentage ?? progress?.score ?? computedScore;

  const renderStepStatus = (status: string) => {
    switch (status) {
      case VerificationStatus.APPROVED:
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />,
          label: "Verified",
          labelClass:
            "text-green-600 bg-green-50 border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0",
        };
      case VerificationStatus.SUBMITTED:
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500 animate-pulse shrink-0" />,
          label: "In Review",
          labelClass:
            "text-yellow-600 bg-yellow-50 border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0",
        };
      case VerificationStatus.REJECTED:
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />,
          label: "Rejected",
          labelClass:
            "text-red-600 bg-red-50 border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0",
        };
      default:
        return {
          icon: <Circle className="h-6 w-6 text-gray-300 shrink-0" />,
          label: "Pending",
          labelClass:
            "text-gray-500 bg-gray-50 border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-semibold border shrink-0",
        };
    }
  };

  const phases = [
    {
      title: "Phase 1 — License Verification",
      subtitle: "~5 min · RDV +30%",
      status: step1Status,
      note: progress?.step_one_note || licenseStep?.note,
      phaseParam: "license-verify",
    },
    {
      title: "Phase 2 — Operations",
      subtitle: "~20–30 min · RDV +40%",
      status: step2Status,
      note: progress?.step_two_note || operationalStep?.note,
      phaseParam: "operations-verify",
    },
    {
      title: "Phase 3 — Clinical depth",
      subtitle: "Async · RDV +30%",
      status: step3Status,
      note: progress?.step_three_note || clinicalStep?.note,
      phaseParam: "clinic-depth-verify",
    },
  ];

  // Resolve target verification step and button texts
  let targetPhaseParam = "license-verify";
  let buttonText = "Start Verification";
  let isTargetRejected = false;

  if (step1Status !== VerificationStatus.APPROVED && step1Status !== VerificationStatus.SUBMITTED) {
    targetPhaseParam = "license-verify";
    isTargetRejected = step1Status === VerificationStatus.REJECTED;
    buttonText = isTargetRejected ? "Verify Again — Phase 1" : "Start Verification";
  } else if (step2Status !== VerificationStatus.APPROVED && step2Status !== VerificationStatus.SUBMITTED) {
    targetPhaseParam = "operations-verify";
    isTargetRejected = step2Status === VerificationStatus.REJECTED;
    buttonText = isTargetRejected ? "Verify Again — Phase 2" : "Continue Phase 2";
  } else if (step3Status !== VerificationStatus.APPROVED && step3Status !== VerificationStatus.SUBMITTED) {
    targetPhaseParam = "clinic-depth-verify";
    isTargetRejected = step3Status === VerificationStatus.REJECTED;
    buttonText = isTargetRejected ? "Verify Again — Phase 3" : "Continue Phase 3";
  } else {
    if (step3Status === VerificationStatus.SUBMITTED) {
      buttonText = "In Review";
    } else {
      buttonText = "Verification Complete";
    }
  }

  const isAllApprovedOrSubmitted =
    (step1Status === VerificationStatus.APPROVED || step1Status === VerificationStatus.SUBMITTED) &&
    (step2Status === VerificationStatus.APPROVED || step2Status === VerificationStatus.SUBMITTED) &&
    (step3Status === VerificationStatus.APPROVED || step3Status === VerificationStatus.SUBMITTED);

  return (
    <div className="mx-auto max-w-xl my-auto bg-white p-6 lg:p-8 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8 h-44 w-44 sm:h-52 sm:w-52">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#0E3E65"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F2C467"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="251.3"
              strokeDashoffset={251.3 - (251.3 * score) / 100}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl font-semibold text-[#F2C467]">
                {score}%
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#F2C467]">
                RDV Score
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-foreground">
          Start your verification
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Complete your RDV verification in phases to unlock your profile.
        </p>

        <div className="mt-8 w-full">
          <div className="w-full max-w-md mx-auto space-y-6">
            {phases.map((p, i) => {
              const { icon, label, labelClass } = renderStepStatus(p.status);
              return (
                <div key={p.title} className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-8 w-8 flex-col items-center justify-center shrink-0">
                      {icon}
                      {i < phases.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 h-8 w-px bg-border" />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-foreground">
                        {p.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {p.subtitle}
                      </p>
                    </div>

                    <div hidden={label === "Pending"}>
                      <span className={labelClass}>{label}</span>
                    </div>
                  </div>
                  {p.status === VerificationStatus.REJECTED && p.note && (
                    <div className="ml-12 rounded-md bg-red-50 border border-red-100 p-3 text-left">
                      <p className="text-xs font-semibold text-red-800">Rejection Reason:</p>
                      <p className="mt-0.5 text-xs text-red-700">{p.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              disabled={isAllApprovedOrSubmitted}
              className="w-full h-14 rounded-lg bg-[#0E3E65] hover:bg-[#082842] text-white font-semibold shadow-sm cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => {
                router.push(`/dentist/verification?phase=${targetPhaseParam}`);
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
