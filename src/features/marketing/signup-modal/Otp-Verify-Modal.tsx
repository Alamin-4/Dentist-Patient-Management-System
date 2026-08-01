"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuth from "@/hooks/auth/useAuth";
import { useOtpCountdown } from "@/hooks/auth/useOtpCountdown";
import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";

const otpVerifySchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit verification code"),
});

type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;

const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#1A1A2E",
  color: "#fff",
};

interface OtpVerifyModalProps {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export default function OtpVerifyModal({
  email,
  open,
  onOpenChange,
  onVerified,
}: OtpVerifyModalProps) {
  const { otpVerifyMutation, resendOtpMutation } = useAuth();

  /**
   * Countdown timer — persisted in localStorage under the 'patient_signup' namespace.
   * Survives page reloads (e.g., accidental refresh during verification).
   */
  const { isActive, displayTime, startCountdown, syncWithBackend } =
    useOtpCountdown({ storageKey: "patient_signup" });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<OtpVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { otp: "" },
  });

  // Start the 2-minute countdown when the modal first opens.
  // If the modal is re-opened and a timer is already running (persisted),
  // we skip restarting it to avoid resetting the clock on every open.
  useEffect(() => {
    if (open && !isActive) {
      startCountdown(); // 120 s default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = (data: OtpVerifyFormData) => {
    otpVerifyMutation.mutate(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!", { style: TOAST_STYLE });
          reset();
          onVerified();
        },
        onError: (error: any) => {
          const errMsg = mapApiErrorToUserMessage(
            error,
            "Verification code is incorrect. Please try again."
          );
          setError("otp", { type: "server", message: errMsg });
        },
      }
    );
  };

  const handleResendOtp = () => {
    // if (resendOtpMutation.isPending || isActive || !email) return;

    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("Verification code sent again.");
          startCountdown();
          console.log("send")
          reset()
        },
        onError: (error: any) => {
          const responseData = error?.response?.data;
          const httpStatus = error?.response?.status ?? error?.status;
          console.log("error")
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
              { style: TOAST_STYLE, duration: 6000 }
            );
            return;
          }

          // ── All other errors ──
          const errMsg = mapApiErrorToUserMessage(error, "Failed to resend verification code. Please try again.");
          toast.error(errMsg, { style: TOAST_STYLE });
        },
      }
    );
    console.log("kisui nai")
  };

  // ── Button label logic ────────────────────────────────────────────────────
  const resendLabel = resendOtpMutation.isPending
    ? "Sending..."
    : isActive
      ? `Resend in ${displayTime}`
      : "Resend";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-lg border-none p-8">
        <DialogHeader className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#EAF2F8] text-[#113254]">
            <MailCheck className="size-7" />
          </div>
          <DialogTitle className="text-[30px] font-semibold leading-tight text-text">
            Verify your email
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed text-sec-text">
            We sent a 6-digit verification code to{" "}
            <span className="font-semibold text-text">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="space-y-3">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (errors.otp) clearErrors("otp");
                  }}
                  containerClassName="w-full justify-center"
                >
                  <InputOTPGroup className="w-full justify-between gap-2 border-0">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={`ph-no-capture ph-ignore-input size-12 rounded-lg border text-lg font-semibold text-[#113254] sm:size-14 ${errors.otp ? "border-red-500" : "border-[#E5E7EB]"
                          }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-center text-sm text-red-500">
                {errors.otp.message}
              </p>
            )}
          </div>

          {isActive ? (
            <div className="flex items-center justify-center gap-1.5 text-sm text-[#113254]/60">
              <Clock className="size-3.5" />
              <span>
                Code expires in{" "}
                <span className="font-semibold tabular-nums text-[#113254]">
                  {displayTime}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                type="button"
                id="otp-resend-btn"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className={`font-semibold transition-colors text-primary hover:text-primary/95 cursor-pointer 
                `}
              >
                {
                  resendOtpMutation.isPending ? "Sending...." : "Resend OTP"
                }

              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={otpVerifyMutation.isPending || !email}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {otpVerifyMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
