"use client";

import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ForgotSuccessViewProps {
  email: string;
  onBack: () => void;
}

export default function ForgotSuccessView({ email, onBack }: ForgotSuccessViewProps) {
  return (
    <>
      <DialogHeader className="mb-8 text-left">
        <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
          Check your email
        </DialogTitle>
        <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
          We&apos;ve sent a password reset link to <strong className="text-[#1A1A2E]">{email}</strong>. Please check your inbox and spam folder.
        </DialogDescription>
      </DialogHeader>

      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98]"
      >
        Back to Sign In
      </button>
    </>
  );
}
