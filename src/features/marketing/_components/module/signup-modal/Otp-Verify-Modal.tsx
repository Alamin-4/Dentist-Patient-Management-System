"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
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
    otpVerifyMutation.mutate(
      {
        email,
        otp: data.otp,
      },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!", {
            style: TOAST_STYLE,
          });
          reset();
          onVerified();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message || "Verification code is incorrect. Please try again.";
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
          const errMsg = error?.response?.data?.message || "Failed to resend verification code. Please try again.";
          toast.error(errMsg, { style: TOAST_STYLE });
        },
      },
    );
  };

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
            <span className="font-semibold text-text">{email}</span>.
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
                    if (errors.otp) {
                      clearErrors("otp");
                    }
                  }}
                  containerClassName="w-full justify-center"
                >
                  <InputOTPGroup className="w-full justify-between gap-2 border-0">
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

          <p className="text-center text-sm text-sec-text">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending || !email}
              className="font-semibold text-[#113254] transition-colors hover:text-[#0d2844] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
