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

  const progress = progressData?.data as any; // Temporary any, we'll map directly from the response
  
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
