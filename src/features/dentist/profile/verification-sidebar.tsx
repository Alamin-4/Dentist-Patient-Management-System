"use client";

import {
  Check,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import { FaCircleCheck } from "react-icons/fa6";

export function VerificationSidebar() {
  const router = useRouter();
  const { data: progressData } = useDentistProgress();
  const { nextIncompleteStep } = useVerificationProgress();

  const progress = progressData?.data as any;

  const step1Status = progress?.step_one_status || "PENDING";
  const step2Status = progress?.step_two_status || "PENDING";
  const step3Status = progress?.step_three_status || "PENDING";

  const step1Done = progress?.is_step_one_completed || false;
  const step2Done = progress?.is_step_two_completed || false;
  const step3Done = progress?.is_step_three_completed || false;

  const steps = [
    {
      title: "Phase 1 — Licence verify",
      sub: "~5 min · RDV +30%",
      status: step1Status,
      done: step1Done,
    },
    {
      title: "Phase 2 — Operations",
      sub: "~20-30 min · RDV +40%",
      status: step2Status,
      done: step2Done,
    },
    {
      title: "Phase 3 — Clinical depth",
      sub: "Async · RDV +30%",
      status: step3Status,
      done: step3Done,
    },
  ];

  const handleStart = () => {
    const phaseNames = {
      1: "license-verify",
      2: "operations-verify",
      3: "clinic-depth-verify",
    };
    const phase = phaseNames[nextIncompleteStep] || "license-verify";
    router.push(`/dentist/verification?phase=${phase}`);
  };

  const allDone = step1Done && step2Done && step3Done;

  const renderIcon = (status: string, done: boolean) => {
    if (status === "APPROVED" || done) {
      return (
        <div className="flex p-1 items-center justify-center rounded-full bg-green-500 text-white">
          <Check className="h-3 w-3 stroke-3" />
        </div>
      );
    }
    if (status === "SUBMITTED") {
      return (
        <div className="flex p-1 items-center justify-center rounded-full bg-yellow-500 text-white animate-pulse">
          <Clock className="h-3 w-3 stroke-3" />
        </div>
      );
    }
    if (status === "REJECTED") {
      return (
        <div className="flex p-1 items-center justify-center rounded-full bg-red-500 text-white">
          <AlertCircle className="h-3.5 w-3.5" />
        </div>
      );
    }

    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
        <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-bold text-gray-900 text-sm tracking-wide">Verification Prgress</h3>

      <div className="space-y-8 relative">
        {/* Connecting timeline line */}
        <div className="absolute left-2.25 top-2.5 bottom-2.5 w-0.5 bg-gray-100" />

        {steps.map((step, i) => {
          return (
            <div key={i} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 top-0.5 z-10 flex items-center justify-center rounded-full bg-white">
                {renderIcon(step.status, step.done || false)}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-gray-800">
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show action button only when verification is incomplete */}
      {!allDone && (
        <Button
          onClick={handleStart}
          className="mt-8 h-11 w-full bg-[#163E5C] hover:bg-[#113149] text-white font-semibold rounded-lg text-sm transition-colors"
        >
          Start Phase {nextIncompleteStep}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
