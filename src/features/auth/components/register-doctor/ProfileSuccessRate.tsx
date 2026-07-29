"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
      <h2 className="text-xl md:text-2xl font-semibold text-text leading-tight mb-3">
        Confirm your email
      </h2>

      {/* Description */}
      <p className="text-sec-text text-xs md:text-sm leading-relaxed mb-8 max-w-sm">
        We've sent a confirmation link to{" "}
        <span className="font-medium text-text">
          {email}
        </span>
        .
      </p>

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
