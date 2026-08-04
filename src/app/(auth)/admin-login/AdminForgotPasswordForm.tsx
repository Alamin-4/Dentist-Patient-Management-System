"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useAuth";
import { cn } from "@/lib/utils";

interface AdminForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

export default function AdminForgotPasswordForm({ onBack, onSuccess }: AdminForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email) return;

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          onSuccess(email);
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || err?.message || "Failed to send reset link");
        },
      }
    );
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-text leading-tight tracking-tight mb-2">
          Forgot password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your work email address and we&apos;ll send you a recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-1.5 block text-[13px] font-medium text-text"
          >
            Work email
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="admin@rateddocs.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-text placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#163E5C]/20 focus:border-[#163E5C] hover:border-gray-300"
          />
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150",
            "bg-text hover:bg-[#0D2B3E]",
            "focus:outline-none focus:ring-2 focus:ring-text/30 focus:ring-offset-2",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Link...
            </>
          ) : (
            "Send Recovery Link"
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 block w-full text-center text-sm font-semibold text-text hover:underline"
      >
        Back to Sign In
      </button>
    </>
  );
}
