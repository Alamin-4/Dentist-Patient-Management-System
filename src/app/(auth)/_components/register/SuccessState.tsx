"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessState({ setStep }: { setStep: (step: number) => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-10 w-full max-w-120 mx-auto">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#163E5C]">
        <Check className="w-10 h-10 text-white stroke-3" />
      </div>

      <h2 className="text-[32px] font-bold text-[#0A2533] leading-tight tracking-tight">
        Let&apos;s set up your Doctor Profile
      </h2>

      <Button
        className="w-full h-14 bg-[#163E5C] hover:bg-[#113149] text-white text-lg font-semibold rounded-xl transition-all shadow-sm"
        onClick={() => setStep(4)}
      >
        Continue
      </Button>
    </div>
  );
}
