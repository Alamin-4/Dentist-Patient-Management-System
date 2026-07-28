"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuth from "@/hooks/auth/useAuth";
import { useOtpCountdown } from "@/hooks/auth/useOtpCountdown";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a valid 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface VerifyOtpFormProps {
  setStep: (step: "professional-info" | "success") => void;
}

export function VerifyOtpForm({ setStep }: VerifyOtpFormProps) {
  const { otpVerifyMutation, resendOtpMutation, isOtpVerifyLoading } = useAuth();
  const isResending = resendOtpMutation.isPending;

  /**
   * Countdown timer hook — persists across page reloads via localStorage.
   * The key 'register_doctor' namespaces this instance away from other OTP flows.
   */
  const { isActive, displayTime, startCountdown, syncWithBackend } =
    useOtpCountdown({ storageKey: "register_doctor" });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!isActive) {
      startCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const handleResendOtp = () => {

    const registerEmail = localStorage.getItem("registerEmail");
    if (!registerEmail) {
      toast.error("Session expired. Please restart the sign-up process.");
      return;
    }

    resendOtpMutation.mutate(
      { email: registerEmail },
      {
        onSuccess: () => {
          startCountdown();
        },
        onError: (error: any) => {
          const responseData = error?.response?.data;
          const httpStatus = error?.response?.status ?? error?.status;

          if (httpStatus === 429) {
            const retryAfterSeconds: number | undefined =
              responseData?.data?.retryAfter;
            const retryAfterMinutes: number | undefined =
              responseData?.data?.retryAfterMinutes;

            if (retryAfterSeconds && retryAfterSeconds > 0) {
              syncWithBackend(retryAfterSeconds);
            }

            const displayMinutes =
              retryAfterMinutes ??
              (retryAfterSeconds ? Math.ceil(retryAfterSeconds / 60) : 60);

            toast.error(
              `Too many attempts. Please try again in ${displayMinutes} minute${displayMinutes === 1 ? "" : "s"}.`,
              { duration: 6000 }
            );

            return;
          }

          const errorMessage =
            responseData?.message || "Failed to resend OTP. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const onSubmit = async (data: OtpFormData) => {
    if (typeof window === "undefined") return;

    clearErrors("otp");
    const registerEmail = localStorage.getItem("registerEmail");

    if (!registerEmail) {
      toast.error("Session expired. Please restart the sign-up process.");
      return;
    }

    otpVerifyMutation.mutate(
      { email: registerEmail, otp: data.otp },
      {
        onSuccess: () => {
          setStep("professional-info");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "Invalid OTP. Please try again.";
          setError("otp", { type: "manual", message: errorMessage });
        },
      }
    );
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* ── OTP Input ── */}
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    clearErrors("otp");
                  }}
                  containerClassName="group flex items-center justify-between w-full gap-2 lg:gap-4"
                >
                  <InputOTPGroup className="flex w-full justify-between gap-2 lg:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={`h-14 lg:h-16 w-full max-w-17.5 rounded-lg bg-white text-xl font-semibold text-[#163E5C] border transition-all focus-within:ring-2 focus-within:ring-[#163E5C] focus-within:border-[#163E5C] ${errors.otp
                          ? "border-red-500 bg-red-50/10"
                          : "border-gray-300"
                          }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-sm font-medium text-red-500 mt-2 w-full text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          {isActive ? (
            <div className="flex items-center gap-1.5 text-sm text-[#163E5C]/70">
              <Clock className="h-3.5 w-3.5" />
              <span>
                OTP expires in {" "}
                <span className="font-semibold tabular-nums">{displayTime}</span>
              </span>
            </div>
          ) : (
            <button
              type="button"
              disabled={otpVerifyMutation.isPending}
              className={`font-semibold transition-all px-2 py-1 text-primary border-primary/95 cursor-pointer hover:underline"
                `}
              onClick={handleResendOtp}
            >
              {otpVerifyMutation.isPending ? "Sending....." : "Resend OTP"}
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isOtpVerifyLoading}
          className="h-14 w-full bg-[#163E5C] text-white hover:bg-[#113149] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          {isOtpVerifyLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Create Account"
          )}
        </Button>
      </div>
    </form>
  );
}