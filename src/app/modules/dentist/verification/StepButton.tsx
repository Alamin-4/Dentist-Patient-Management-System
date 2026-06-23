"use client";

import { Button } from "@/components/ui/button";
import { VerificationNextStepModal } from "./verification-next-step-modal";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useIsMutating } from "@tanstack/react-query";
import useVerificationProgress, { type VerificationPhaseStep } from "@/hooks/dentist/useStepProgress";

export default function StepButton() {
  const {
    verificationStep,
    verificationStepReady,
    verificationCompletedStep,
    setVerificationCompletedStep,
  } = useStateContext();
  const router = useRouter();
  const { submittedByStep } = useVerificationProgress();

  const isAlreadySubmitted = submittedByStep[verificationStep as VerificationPhaseStep];

  const activeMutationCount = useIsMutating({
    mutationKey: ["dentist", "verification"],
  });
  const isSubmitting = activeMutationCount > 0;

  const isReady = isAlreadySubmitted || verificationStepReady[verificationStep];

  const buttonLabel =
    verificationStep === 3
      ? isAlreadySubmitted
        ? "Return to Dashboard"
        : "Submit & Complete"
      : `Continue to Phase ${verificationStep + 1}`;

  const handleNextPhaseDirectly = () => {
    if (verificationStep === 1) {
      router.push("/dentist/verification?phase=operations-verify");
    } else if (verificationStep === 2) {
      router.push("/dentist/verification?phase=clinic-depth-verify");
    } else {
      router.push("/dentist");
    }
  };

  const buttonProps = isAlreadySubmitted
    ? {
        type: "button" as const,
        onClick: handleNextPhaseDirectly,
      }
    : {
        type: "submit" as const,
        form: `phase-${verificationStep}-verification-form`,
      };

  const isModalOpen =
    verificationCompletedStep !== null &&
    verificationCompletedStep === verificationStep;

  const handleContinue = () => {
    if (verificationCompletedStep === 1) {
      router.push("/dentist/verification?phase=operations-verify");
    } else if (verificationCompletedStep === 2) {
      router.push("/dentist/verification?phase=clinic-depth-verify");
    } else {
      router.push("/dentist");
    }

    setVerificationCompletedStep(null);
  };

  return (
    <>
      <div className="flex w-full justify-end px-4 sm:px-6 lg:px-8">
        <Button
          {...buttonProps}
          size="lg"
          disabled={!isReady || isSubmitting}
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

      <VerificationNextStepModal
        open={isModalOpen}
        step={verificationCompletedStep ?? verificationStep}
        onOpenChange={(open) => {
          if (!open) {
            setVerificationCompletedStep(null);
          }
        }}
        onContinue={handleContinue}
      />
    </>
  );
}
