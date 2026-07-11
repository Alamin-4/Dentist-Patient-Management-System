"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/auth/useAuth";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPassword();

  if (!token) {
    return (
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Invalid Reset Link</h2>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          The password reset token is missing. Please request a new link from the sign-in modal.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-[#113254] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d2844] transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    resetPasswordMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successfully!");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to reset password.");
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Password Reset Complete</h2>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Your password has been successfully updated. You can now close this page and sign in with your new credentials.
        </p>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="rounded-lg bg-[#113254] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d2844] transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
          Reset your password
        </h1>
        <p className="text-sm text-gray-500">
          Enter a new secure password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#1A1A2E]">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-[#113254] hover:border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#1A1A2E]">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-[#113254] hover:border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#113254] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d2844] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9963F]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#113254]" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
