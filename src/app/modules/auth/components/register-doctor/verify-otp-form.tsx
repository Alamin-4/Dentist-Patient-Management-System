"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/auth/useAuth";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a valid 6-digit code"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface VerifyOtpFormProps {
  setStep: (step: "professional-info" | "success") => void;
}

export function VerifyOtpForm({ setStep }: VerifyOtpFormProps) {
  const [resendCountdown, setResendCountdown] = useState(60);

  const router = useRouter();
  const pathName = usePathname()


  const { otpVerifyMutation, resendOtpMutation, isOtpVerifyLoading } = useAuth();
  const isResending = resendOtpMutation.isPending;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (resendCountdown > 0) {
      timerRef.current = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

  }, [resendCountdown]);

  const handleResendOtp = () => {
    if (typeof window === "undefined" || resendCountdown > 0 || isResending)
      return;

    const registerEmail = localStorage.getItem("registerEmail");
    if (!registerEmail) {
      toast.error("Session expired. Please restart the sign-up process.");
      return;
    }

    resendOtpMutation.mutate(
      { email: registerEmail },
      {
        onSuccess: () => {
          setResendCountdown(60);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to resend OTP. Try again.";
          toast.error(errorMessage);
        },
      },
    );
  }


  const onSubmit = async (data: OtpFormData) => {
    if (typeof window === "undefined") return;

    const registerEmail = localStorage.getItem("registerEmail");

    if (!registerEmail) {
      toast.error("Session expired. Please restart the sign-up process.");
      return;
    }

    const payload = {
      email: registerEmail,
      otp: data.otp,
    };

    otpVerifyMutation.mutate(payload, {
      onSuccess: () => {
        setStep("professional-info");
        router.push(`${pathName}?dentist=professional-info`);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
      },

    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col items-center space-y-6 md:space-y-8 lg:space-y-12">
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
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

          <div className="text-center text-sm lg:text-base text-gray-600">
            Didn’t receive OTP?{" "}
            <button
              type="button"
              disabled={isResending}
              className="font-bold text-[#163E5C] cursor-pointer hover:underline transition-all focus:outline-none disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
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
