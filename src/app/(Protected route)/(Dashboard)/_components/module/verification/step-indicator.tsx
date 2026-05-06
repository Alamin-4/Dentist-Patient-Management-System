import { User, Lock, Award, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Licence + identity", icon: User },
  { label: "Facility & Transparency", icon: Lock },
  { label: "Clinical Excellence", icon: Award },
];

export function StepIndicator({ currentStep = 0 }) {
  return (
    <div className="flex items-center justify-center gap-4 lg:gap-12">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                index <= currentStep
                  ? "border-[#163E5C] bg-[#163E5C] text-white"
                  : "border-gray-200 bg-white text-gray-400",
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] lg:text-xs font-bold uppercase tracking-tight whitespace-nowrap",
                index <= currentStep ? "text-gray-900" : "text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="h-[2px] w-8 lg:w-16 bg-gray-100 mt-[-20px]" />
          )}
        </div>
      ))}
    </div>
  );
}
