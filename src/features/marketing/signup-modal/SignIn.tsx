"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import z from "zod";

import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { useGoogleLogin, useLogin, useMe, useResendOtp } from "@/hooks/auth/useAuth";
import { LoginFormData, loginSchema } from "@/hooks/dentist/dentist.interface";
import OtpVerifyModal from "./Otp-Verify-Modal";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotOtpForm from "./ForgotOtpForm";
import ResetPasswordModalForm from "./ResetPasswordModalForm";

export default function SigninModal() {
  const {
    showSigninModal,
    setShowSigninModal,
    setShowSignupModal,
    setShowPersonalizeModal,
    setShowCompareModal,
    dentistsToCompare,
  } = useStateContext();

  const { user } = useMe();
  const [authView, setAuthView] = useState<"signin" | "forgot" | "forgot_otp" | "forgot_reset" | "forgot_success">("signin");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (user && showSigninModal) {
      setShowSigninModal(false);
    }
  }, [user, showSigninModal, setShowSigninModal]);

  useEffect(() => {
    if (!showSigninModal) {
      setAuthView("signin");
      setForgotEmail("");
      setResetToken("");
    }
  }, [showSigninModal]);

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [isEmailUnverified, setIsEmailUnverified] = useState(false);

  const { mutate: login, isPending } = useLogin();
  const { mutate: googleLogin, isPending: isGooglePending } = useGoogleLogin();
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
          toast.error(mapApiErrorToUserMessage(err, "Failed to send verification code."));
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
      const params = new URLSearchParams(window.location.search);
      params.delete("modal");
      const search = params.toString();
      const returnTo = window.location.pathname + (search ? `?${search}` : "");
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
        <DialogContent className="sm:max-w-150 max-h-[90vh] flex flex-col rounded-lg border-none p-0 gap-0">
          <div className="overflow-y-auto p-8 flex-1">
            {authView === "signin" ? (
              <>
                <DialogHeader className="mb-8 text-left">
                  <DialogTitle className="mb-3 text-4xl font-bold leading-tight text-text">
                    Sign in
                  </DialogTitle>
                  <DialogDescription className="text-base leading-snug text-[#6B7280]">
                    Welcome back! Sign in to manage your appointments and consultations.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap *:flex-1 gap-4 items-start justify-between">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}

                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-border lg:py-3.5"
                  >
                    <FcGoogle className="text-2xl" />
                    <span className="text-text font-medium hidden md:block">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Apple")}
                    disabled
                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200  lg:py-3.5"
                  >
                    <FaApple className="text-2xl text-text" />
                    <span className="text-text font-medium hidden md:block">Apple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled
                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200  lg:py-3.5"
                  >
                    <FaFacebook className="text-2xl text-[#1877F2]" />
                    <span className="text-text font-medium hidden md:block">Facebook</span>
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
                    <label className="mb-2 block text-sm font-semibold text-text">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      {...register("email")}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.email && (
                      <div className="mt-1.5 flex flex-col items-start gap-1">
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                        {errors.email.message?.toLowerCase().includes("verify") && (
                          <button
                            type="button"
                            disabled={resendOtpMutation.isPending}
                            onClick={handleStartVerification}
                            className="text-xs font-semibold text-brand-deep-navy hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {resendOtpMutation.isPending ? "Sending OTP..." : "Verify your email now →"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-text">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm font-medium text-brand-deep-navy hover:underline"
                        onClick={() => setAuthView("forgot")}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...register("password")}
                        className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {errors.root?.server?.message && !isEmailUnverified && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {errors.root.server.message}
                    </div>
                  )}

                  {isEmailUnverified && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-accent/95 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span>Your email is not verified yet.</span>
                      <button
                        type="button"
                        disabled={resendOtpMutation.isPending}
                        onClick={handleStartVerification}
                        className="shrink-0 rounded-lg bg-brand-deep-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-deep-navy-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendOtpMutation.isPending ? "Sending..." : "Verify Now"}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-deep-navy py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand-deep-navy-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
                    className="font-semibold text-brand-deep-navy hover:underline"
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
                    className="font-semibold text-brand-deep-navy hover:underline"
                  >
                    Join as a dentist
                  </button>
                </p>
              </>
            ) : authView === "forgot" ? (
              <ForgotPasswordForm
                onBack={() => setAuthView("signin")}
                onSuccess={(email) => {
                  setForgotEmail(email);
                  setAuthView("forgot_otp");
                }}
              />
            ) : authView === "forgot_otp" ? (
              <ForgotOtpForm
                email={forgotEmail}
                onBack={() => setAuthView("forgot")}
                onSuccess={(token) => {
                  setResetToken(token);
                  setAuthView("forgot_reset");
                }}
              />
            ) : authView === "forgot_reset" ? (
              <ResetPasswordModalForm
                token={resetToken}
                onBack={() => setAuthView("forgot_otp")}
                onSuccess={() => {
                  setForgotEmail("");
                  setResetToken("");
                  setAuthView("signin");
                }}
              />
            ) : null}
          </div>
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