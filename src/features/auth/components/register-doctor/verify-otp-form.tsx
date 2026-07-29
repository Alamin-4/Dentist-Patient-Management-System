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
import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";

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
          const errorMessage = mapApiErrorToUserMessage(
            error,
            "Invalid OTP. Please try again."
          );
          setError("otp", { type: "manual", message: errorMessage });
        },
      }
    );
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        <div className="flex flex-col items-center space-y-4 w-full">
          
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
                        className={`h-12 md:h-14 w-full max-w-17.5 rounded-lg bg-white text-xl font-semibold text-primary border transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary ${errors.otp
                          ? "border-red-400 bg-red-50/10"
                          : "border-border"
                          }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-xs text-red-500 mt-1 w-full text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          {isActive ? (
            <div className="flex items-center gap-1.5 text-sm text-sec-text">
              <Clock className="h-3.5 w-3.5" />
              <span>
                OTP expires in {" "}
                <span className="font-semibold tabular-nums">{displayTime}</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-end w-full">
              <button
              type="button"
              disabled={otpVerifyMutation.isPending}
              className={`font-medium text-sm md:text-base cursor-pointer text-primary hover:underline`}
              onClick={handleResendOtp}
            >
              {otpVerifyMutation.isPending ? "Sending....." : "Resend"}
            </button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isOtpVerifyLoading}
          className="h-10 md:h-11 w-full bg-primary text-white hover:bg-primary/95 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium cursor-pointer transition-colors shadow-lg flex items-center justify-center gap-2"
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