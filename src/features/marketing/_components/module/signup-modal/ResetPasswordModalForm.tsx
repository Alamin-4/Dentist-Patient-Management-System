"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/useAuth";
import toast from "react-hot-toast";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ResetPasswordModalFormProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function ResetPasswordModalForm({ token, onSuccess, onBack }: ResetPasswordModalFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useResetPassword();

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
          toast.success("Password reset successfully!");
          onSuccess();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to reset password.");
        },
      }
    );
  };

  return (
    <>
      <DialogHeader className="mb-6 text-center">
        <DialogTitle className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
          Reset your password
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Enter a new secure password for your account.
        </DialogDescription>
      </DialogHeader>

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

      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full text-center text-sm font-semibold text-[#113254] hover:underline"
      >
        Back to Verification
      </button>
    </>
  );
}
