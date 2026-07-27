"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VerificationSteps } from "@/app/modules/dentist/verification/verification-steps";
import StepButton from "@/app/modules/dentist/verification/StepButton";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import type { VerificationPhaseStep } from "@/hooks/dentist/useStepProgress";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { verificationStep, setVerificationStep } = useVerificationStore();
  const {
    submittedByStep,
    nextIncompleteStep,
    canAccessStep,
    isProgressLoading,
    rdvScore,
  } = useVerificationProgress();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phaseParam = searchParams.get("phase");

  const resolvedStep = useMemo<VerificationPhaseStep>(() => {
    if (!phaseParam) {
      return nextIncompleteStep;
    }

    let requestedStep: VerificationPhaseStep = 1;
    if (phaseParam === "operations-verify") {
      requestedStep = 2;
    } else if (phaseParam === "clinic-depth-verify") {
      requestedStep = 3;
    }

    if (!canAccessStep(requestedStep)) {
      if (!submittedByStep[1]) return 1;
      if (!submittedByStep[2]) return 2;
      return 3;
    }

    return requestedStep;
  }, [phaseParam, nextIncompleteStep, canAccessStep, submittedByStep]);

  useEffect(() => {
    if (isProgressLoading) return;

    const expectedParam =
      resolvedStep === 1
        ? "license-verify"
        : resolvedStep === 2
          ? "operations-verify"
          : "clinic-depth-verify";

    if (phaseParam !== expectedParam) {
      router.replace(`/dentist/verification?phase=${expectedParam}`);
    }

    if (verificationStep !== resolvedStep) {
      setVerificationStep(resolvedStep);
    }
  }, [
    isProgressLoading,
    resolvedStep,
    phaseParam,
    verificationStep,
    setVerificationStep,
    router,
  ]);

  const handleBack = () => {
    if (verificationStep === 1) {
      router.push("/dentist");
    } else if (verificationStep === 2) {
      router.push("/dentist/verification?phase=license-verify");
    } else if (verificationStep === 3) {
      router.push("/dentist/verification?phase=operations-verify");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <header className=" border-b pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-xl font-bold text-[#0A2533]">
              Verification Progress
            </h1>
          </div>

          {/* Stepper Component */}
          <VerificationSteps />
        </div>
      </header>

      <main className="flex-1 py-10">
        <div >
          <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-6">
            {isProgressLoading ? (
              <div className="flex min-h-80 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#0E3E65]" />
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-white py-4 z-40 -mx-6 -mb-6 px-6 mt-12">
        <StepButton />
      </footer>
    </div>
  );
}