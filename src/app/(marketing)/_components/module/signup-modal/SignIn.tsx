"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { useGoogleLogin, useLogin, useMe, useResendOtp } from "@/hooks/auth/useAuth";
import z from "zod";
import { LoginFormData, loginSchema } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import OtpVerifyModal from "./Otp-Verify-Modal";

export default function SigninModal() {
  const {
    showSigninModal,
    setShowSigninModal,
    setShowSignupModal,
    setShowPersonalizeModal,
    setShowCompareModal,
    dentistsToCompare,
  } = useStateContext();

  const { user } = useMe()

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);

  const { mutate: login, isPending, isError, error, } = useLogin()
  const { mutate: googleLogin, isPending: isGooglePending, isError: isGoogleError, error: googleError } = useGoogleLogin()
  const resendOtpMutation = useResendOtp();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "PATIENT",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    clearErrors();

    login(data, {
      onSuccess: () => {
        reset();
        setShowSigninModal(false);

        if (dentistsToCompare && dentistsToCompare.length > 0) {

          const hasProfileDetails = !!(user?.first_name || user?.name || user?.firstName);
          if (hasProfileDetails) {
            setShowCompareModal(true);
          } else {
            setShowPersonalizeModal(true);
          }
        }
      },
      onError: (error: any) => {
        const apiErrors = error?.errors;
        const errorMessage = error?.message || "Invalid email or password";

        const isUnverifiedError =
          errorMessage.toLowerCase().includes("verify") ||
          apiErrors?.some((err: any) => err.message?.toLowerCase().includes("verify"));

        if (isUnverifiedError) {
          setIsEmailUnverified(true);
        } else {
          setIsEmailUnverified(false);
        }

        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          apiErrors.forEach((err: any) => {
            if (err.field) {
              setError(err.field as any, {
                type: "server",
                message: err.message,
              });
            }
          });
        } else {
          setError("root.server", {
            type: "server",
            message: errorMessage,
          });
        }
      },
    });
  };

  const handleStartVerification = () => {
    const email = getValues("email");
    if (!email) return;
    setEmailToVerify(email);
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("Verification OTP sent to your email.");
          setShowOtpModal(true);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to send verification code.");
        },
      }
    );
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    clearErrors();
    setIsEmailUnverified(false);
    toast.success("Email verified successfully! Logging you in...");
    handleSubmit(onSubmit)();
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      const returnTo = window.location.pathname + window.location.search;
      const hasCompare = !!(dentistsToCompare && dentistsToCompare.length > 0);
      googleLogin({ returnTo, hasCompare });
      return;
    }
    setShowSigninModal(false);

    if (dentistsToCompare && dentistsToCompare.length > 0) {

      const hasProfileDetails = !!(user?.first_name || user?.name || user?.firstName);
      if (hasProfileDetails) {
        setShowCompareModal(true);
      } else {
        setShowPersonalizeModal(true);
      }
    }
  };

  const switchToSignup = () => {
    setShowSigninModal(false);
    setTimeout(() => {
      setShowSignupModal(true);
    }, 200);
  };

  return (
    <>
      <Dialog open={showSigninModal} onOpenChange={setShowSigninModal}>
      <DialogContent className="sm:max-w-150 max-h-[95vh] overflow-y-auto rounded-xl border-none p-8 gap-0">
        <DialogHeader className="mb-8 text-left">
          <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
            Sign in
          </DialogTitle>
          <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
            Welcome back! Sign in to manage your appointments and consultations.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-[#6B7280]">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("Apple")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FaApple className="text-2xl text-black" />
            <span className="text-[#6B7280]">Continue with Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
          >
            <FaFacebook className="text-2xl text-[#1877F2]" />
            <span className="text-[#6B7280]">Continue with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center lg:my-8">
          <div className="grow border-t border-[#E5E7EB]"></div>
          <span className="mx-4 bg-white px-2 text-sm text-[#9EA9AA]">or</span>
          <div className="grow border-t border-[#E5E7EB]"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email")}
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
            />
            {errors.email && (
              <div className="mt-1.5 flex flex-col items-start gap-1">
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
                {errors.email.message?.toLowerCase().includes("verify") && (
                  <button
                    type="button"
                    disabled={resendOtpMutation.isPending}
                    onClick={handleStartVerification}
                    className="text-xs font-semibold text-[#113254] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendOtpMutation.isPending ? "Sending OTP..." : "Verify your email now →"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[15px] font-semibold text-[#1A1A2E]">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-[#113254] hover:underline"
                onClick={() => {
                  /* Implement forgot password handler if needed */
                }}
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password")}
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root?.server?.message && !isEmailUnverified && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errors.root.server.message}
            </div>
          )}

          {isEmailUnverified && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Your email is not verified yet.</span>
              <button
                type="button"
                disabled={resendOtpMutation.isPending}
                onClick={handleStartVerification}
                className="shrink-0 rounded-lg bg-[#113254] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d2844] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendOtpMutation.isPending ? "Sending..." : "Verify Now"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={switchToSignup}
            className="font-semibold text-[#113254] hover:underline"
          >
            Sign up
          </button>
        </p>

        <p className="mt-2 text-center text-sm text-[#6B7280]">
          Are you a dentist?{" "}
          <button
            type="button"
            onClick={() => {
              setShowSigninModal(false);
              router.push("/register-doctor");
            }}
            className="font-semibold text-[#113254] hover:underline"
          >
            Join as a dentist
          </button>
        </p>
      </DialogContent>
    </Dialog>

    <OtpVerifyModal
      email={emailToVerify}
      open={showOtpModal}
      onOpenChange={setShowOtpModal}
      onVerified={handleOtpVerified}
    />
  </>
  );
}
