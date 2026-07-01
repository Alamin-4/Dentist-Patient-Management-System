"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import { useIsMutating } from "@tanstack/react-query";
import type {
  DentistVerificationProgress,
  VerificationPhase,
} from "../overview/verification-progress.types";

const PHASE_BY_STEP: Record<number, VerificationPhase> = {
  1: "LICENSE",
  2: "OPERATIONAL",
  3: "CLINICAL",
};

export default function StepButton() {
  const router = useRouter();
  const { verificationStep } = useVerificationStore();
  const { data: progressData, isLoading } = useDentistProgress();

  // Check if any verification mutation is in progress
  const activeMutationCount = useIsMutating({
    mutationKey: ["dentist", "verification"],
  });
  const isSubmitting = activeMutationCount > 0;

  if (isLoading || !progressData) {
    return (
      <div className="flex w-full justify-end px-4 sm:px-6 lg:px-8">
        <Button
          size="lg"
          disabled
          className="h-12 rounded-lg px-10 font-semibold bg-[#0E3E65] text-white"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  const progress = progressData.data as DentistVerificationProgress;
  const steps = progress.steps || [];

  // Get data for the step the user is currently viewing. `steps` isn't
  // guaranteed by the API, so fall back to the flat step_x_status fields
  // (same fallback pattern used by verification-banner.tsx / verification-sidebar.tsx).
  const flatStatusByStep: Record<number, string | null | undefined> = {
    1: progress.step_one_status,
    2: progress.step_two_status,
    3: progress.step_three_status,
  };
  const matchingStep = steps.find(
    (step) => step.phase === PHASE_BY_STEP[verificationStep],
  );
  const flatStatus = flatStatusByStep[verificationStep];

  const currentStatus =
    (flatStatus && flatStatus !== "PENDING" ? flatStatus : null) ||
    matchingStep?.status ||
    (matchingStep?.completed ? "APPROVED" : "PENDING");
  const isStepSubmitted = currentStatus === "SUBMITTED" || currentStatus === "SUBMIT";
  const isStepApproved = currentStatus === "APPROVED";

  const isAlreadySubmitted = isStepSubmitted || isStepApproved;

  // Determine button label
  const getButtonLabel = () => {
    if (isAlreadySubmitted) {
      if (verificationStep === 1) return "Continue to Phase 2";
      if (verificationStep === 2) return "Continue to Phase 3";
      return "Return to Dashboard";
    }

    if (verificationStep === 3) {
      return "Submit & Complete";
    }

    return `Continue to Phase ${verificationStep + 1}`;
  };

  const buttonLabel = getButtonLabel();

  // Handle button click for non-submit types (already submitted steps)
  const handleClick = () => {
    if (verificationStep === 1) {
      router.push("/dentist/verification?phase=operations-verify");
    } else if (verificationStep === 2) {
      router.push("/dentist/verification?phase=clinic-depth-verify");
    } else {
      router.push("/dentist");
    }
  };

  // If the currently viewed step is not submitted yet, it acts as a form submit button
  const buttonProps = isAlreadySubmitted
    ? {
        type: "button" as const,
        onClick: handleClick,
      }
    : {
        type: "submit" as const,
        form: `phase-${verificationStep}-verification-form`,
      };

  return (
    <div className="flex w-full justify-end px-4 sm:px-6 lg:px-8">
      <Button
        {...buttonProps}
        size="lg"
        disabled={isSubmitting}
        className="h-12 rounded-lg px-10 font-semibold bg-[#0E3E65] text-white hover:bg-[#0E3E65]/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </div>
  );
}