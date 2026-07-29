"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useAuth";
import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";
import toast from "react-hot-toast";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

export default function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          onSuccess(email);
        },
        onError: (err: any) => {
          toast.error(mapApiErrorToUserMessage(err, "Failed to send OTP. Please try again."));
        },
      }
    );
  };

  return (
    <>
      <DialogHeader className="mb-8 text-left">
        <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-text">
          Forgot password?
        </DialogTitle>
        <DialogDescription className="text-[16px] leading-snug text-sec-text">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-[15px] font-semibold text-text">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
          />
        </div>

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Sending otp...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full text-center text-sm font-semibold text-[#113254] hover:underline"
      >
        Back to Sign In
      </button>
    </>
  );
}
