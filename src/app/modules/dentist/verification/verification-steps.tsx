"use client";

import {
  User,
  Lock,
  Award,
  Building,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useRouter } from "next/navigation";

export function VerificationSteps() {
  const { verificationStep } = useVerificationStore();
  const { submittedByStep, canAccessStep } = useVerificationProgress();
  const router = useRouter();

  const steps = [
    {
      step: 1,
      label: "Licence + identity",
      icon: User,
      unlocked: true,
      submitted: submittedByStep[1],
    },
    {
      step: 2,
      label: "Facility & Transparency",
      icon: Building,
      unlocked: canAccessStep(2),
      submitted: submittedByStep[2],
    },
    {
      step: 3,
      label: "Clinical Excellence",
      icon: Award,
      unlocked: canAccessStep(3),
      submitted: submittedByStep[3],
    },
  ];

  const handleStepClick = (stepNum: number, unlocked: boolean) => {
    if (!unlocked) return;
    const phaseParam =
      stepNum === 1
        ? "license-verify"
        : stepNum === 2
          ? "operations-verify"
          : "clinic-depth-verify";
    router.push(`/dentist/verification?phase=${phaseParam}`);
  };

  return (
    <div className="flex items-center gap-2 md:gap-8">
      {steps.map((step, index) => {
        const IconComponent = !step.unlocked
          ? Lock
          : step.submitted
            ? CircleCheck
            : step.icon;

        const isActive = step.step === verificationStep;

        return (
          <button
            key={index}
            type="button"
            disabled={!step.unlocked}
            onClick={() => handleStepClick(step.step, step.unlocked)}
            className={cn(
              "flex flex-col items-center gap-2 outline-none text-left cursor-pointer disabled:cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                isActive
                  ? "border-primary text-primary font-semibold"
                  : step.unlocked
                    ? step.submitted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/40 text-primary"
                    : "border-border bg-gray-50 text-muted-foreground",
              )}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <span
              className={cn(
                "hidden md:block text-sm text-center",
                isActive
                  ? "font-medium text-foreground"
                  : step.unlocked
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50",
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
