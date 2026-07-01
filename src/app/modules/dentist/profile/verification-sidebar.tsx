"use client";

import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import type {
  DentistVerificationProgress,
  VerificationProgressStep,
} from "../overview/verification-progress.types";

const getStepByPhase = (
  steps: VerificationProgressStep[],
  phase: "LICENSE" | "OPERATIONAL" | "CLINICAL",
) => steps.find((step) => step.phase === phase);

export function VerificationSidebar() {
  const router = useRouter();
  const { data: progressData } = useDentistProgress();
  const { nextIncompleteStep } = useVerificationProgress();

  const progress = progressData?.data as
    | DentistVerificationProgress
    | undefined;
  const stepsData = progress?.steps || [];

  const licenseStep = getStepByPhase(stepsData, "LICENSE");
  const operationalStep = getStepByPhase(stepsData, "OPERATIONAL");
  const clinicalStep = getStepByPhase(stepsData, "CLINICAL");

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
    : progress?.is_step_one_completed || step1Status === "APPROVED";
  const step2Done = operationalStep
    ? operationalStep.completed
    : progress?.is_step_two_completed || step2Status === "APPROVED";
  const step3Done = clinicalStep
    ? clinicalStep.completed
    : progress?.is_step_three_completed || step3Status === "APPROVED";

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

  const renderIcon = (status: string, done: boolean, isCurrent: boolean) => {
    if (status === "APPROVED" || status === "SUBMITTED") {
      return (
        <CheckCircle2 className="h-5 w-5 bg-green-500 text-white border-2 border-green-500 rounded-full" />
      );
    }
    if (status === "REJECTED") {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }

    return <div className="h-5 w-5 border-4 border-primary rounded-full" />;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-100 bg-white p-6">
        <h3 className="mb-6 font-bold text-gray-900">Verification Progress</h3>
        <div className="space-y-8 relative">
          <div className="absolute left-[9px] top-2.5 bottom-2 w-0.5 bg-gray-100" />
          {steps.map((step, i) => {
            const isCurrent = i + 1 === nextIncompleteStep;
            return (
              <div key={i} className="relative flex gap-4 pl-8">
                <div className="absolute left-0 top-1 z-10 flex items-center justify-center rounded-full bg-white">
                  {renderIcon(step.status, step.done || false, isCurrent)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400  flex items-center gap-2">
                    {step.sub}
                    {(step.status === "SUBMITTED") && (
                      <span className="text-xs text-yellow-400">Review</span>
                    )}
                    {(step.status === "REJECTED") && (
                      <span className="text-xs text-red-400">Rejected</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          onClick={handleStart}
          disabled={nextIncompleteStep === 3}
          className="mt-8 h-12 w-full bg-[#163E5C] hover:bg-[#113149]"
        >
          {allDone ? "APPROVED" : `Start Phase ${nextIncompleteStep}`}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-6">
        <h3 className="mb-4 font-bold text-gray-900">Profile completeness</h3>
        <div className="space-y-4">
          {[
            { label: "Basic Info", completed: true },
            {
              label: "License Verification",
              completed: step1Done,
              phase: "Phase 1",
            },
            { label: "Headshot", completed: step1Done, phase: "Phase 1" },
            { label: "Pricing Set", completed: step2Done, phase: "Phase 2" },
            { label: "Credentials", completed: step3Done, phase: "Phase 3" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <span className="text-gray-400">{item.phase}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
