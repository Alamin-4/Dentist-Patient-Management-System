"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function VerificationBanner() {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#163E5C] p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="z-10 flex flex-col space-y-4 max-w-2xl">
        <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
          Verification Progress
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">
          Start your verification
        </h2>
        <p className="text-blue-100 text-lg leading-relaxed">
          Complete your RDV verification in phases to unlock your profile,
          search visibility, and booking access.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => router.push("/dashboard/dentist/verification")}
            className="h-12 px-8 bg-white text-[#163E5C] hover:bg-gray-100 font-bold rounded-lg cursor-pointer transition-all"
          >
            Start Verification
          </Button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="h-40 w-40 md:h-48 md:w-48 rounded-full border-12 border-white/10 flex items-center justify-center bg-white/5">
          <div className="absolute inset-0 rounded-full border-12 border-[#163E5C] border-t-transparent -rotate-45 opacity-20" />
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold">0%</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-tighter opacity-70">
              RDV Score
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
