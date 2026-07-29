"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyResetOtp, useResendOtp } from "@/hooks/auth/useAuth";

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

interface ForgotOtpFormProps {
  email: string;
  onBack: () => void;
  onSuccess: (token: string) => void;
}

export default function ForgotOtpForm({ email, onBack, onSuccess }: ForgotOtpFormProps) {
  const verifyResetOtpMutation = useVerifyResetOtp();
  const resendOtpMutation = useResendOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<OtpVerifyFormData>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OtpVerifyFormData) => {
    verifyResetOtpMutation.mutate(
      {
        email,
        otp: data.otp,
      },
      {
        onSuccess: (res: any) => {
          toast.success("Code verified successfully!", {
            style: TOAST_STYLE,
          });
          reset();
          onSuccess(res?.data?.resetToken || res?.resetToken);
        },
        onError: (error: any) => {
          const errMsg = error?.message || "Verification code is incorrect. Please try again.";
          setError("otp", {
            type: "server",
            message: errMsg,
          });
        },
      },
    );
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("Verification code sent again.", {
            style: TOAST_STYLE,
          });
        },
        onError: (error: any) => {
          toast.error(mapApiErrorToUserMessage(error, "Failed to resend verification code."), { style: TOAST_STYLE });
        },
      },
    );
  };

  return (
    <>
      <DialogHeader className="mb-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#EAF2F8] text-[#113254]">
          <MailCheck className="size-7" />
        </div>
        <DialogTitle className="text-[30px] font-semibold leading-tight text-text">
          Verify OTP Code
        </DialogTitle>
        <DialogDescription className="text-[15px] leading-relaxed text-sec-text">
          We sent a 6-digit password reset code to{" "}
          <span className="font-semibold text-text">{email}</span>.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-hidden">
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
                  if (errors.otp) {
                    clearErrors("otp");
                  }
                }}
                containerClassName="w-full justify-center"
              >
                <InputOTPGroup className="w-full justify-between gap-1">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`size-12 rounded-lg border text-lg font-semibold text-[#113254] sm:size-14 ${errors.otp ? "border-red-500" : "border-[#E5E7EB]"
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

        <button
          type="submit"
          disabled={verifyResetOtpMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {verifyResetOtpMutation.isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>

        <p className="text-center text-sm text-sec-text">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendOtpMutation.isPending}
            className="font-semibold text-[#113254] transition-colors hover:text-[#0d2844] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {resendOtpMutation.isPending ? "Sending..." : "Resend"}
          </button>
        </p>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full text-center text-sm font-semibold text-[#113254] hover:underline"
      >
        Back to Forgot Password
      </button>
    </>
  );
}
