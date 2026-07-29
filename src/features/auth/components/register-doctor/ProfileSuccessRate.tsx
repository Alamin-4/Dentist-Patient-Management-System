"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

export function ProfileSuccessState() {
  const email = typeof window !== "undefined" ? localStorage.getItem("registerEmail") : null;
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
      {/* Icon Circle */}
      <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary mb-6">
        <Check className="w-8 h-8 md:w-10 md:h-10 text-white stroke-3" />
      </div>

      {/* Heading */}
      <div className="mb-3">
        <CustomSectionHeading value="Confirm your email" center_align={true} />
      </div>

      {/* Description */}
      <div className="mb-8 max-w-sm">
        <CustomDesText value={`We've sent a confirmation link to ${email || ""}.`} center_align={true} />
      </div>

      {/* Action Button */}
      <Button
        className="w-full h-10 md:h-11 bg-primary hover:bg-primary/95 cursor-pointer text-white font-medium rounded-lg transition-all focus:ring-0 focus:outline-none"
        onClick={() => router.push("/dentist/profile")}
      >
        Go To Dashboard
      </Button>
    </div>
  );
}
