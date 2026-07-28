"use client";

import { cn } from "@/lib/utils";

interface AdminForgotSuccessViewProps {
  email: string;
  onBack: () => void;
}

export default function AdminForgotSuccessView({ email, onBack }: AdminForgotSuccessViewProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-text leading-tight tracking-tight mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-gray-500">
          A password recovery email has been sent to <strong className="text-text">{email}</strong>. Please check your inbox and spam folder.
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150",
          "bg-text hover:bg-[#0D2B3E]",
          "focus:outline-none focus:ring-2 focus:ring-text/30 focus:ring-offset-2",
        )}
      >
        Back to Sign In
      </button>
    </>
  );
}
