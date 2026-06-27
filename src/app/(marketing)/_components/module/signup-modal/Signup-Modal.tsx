"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import OtpVerifyModal from "./Otp-Verify-Modal";

import { IRegisterPatient, registerPatientSchema } from "@/hooks/auth/auth.validation";
import useAuth, { useMe } from "@/hooks/auth/useAuth";

export const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#1A1A2E",
  color: "#fff",
};

export default function SignupModal() {
  const {
    showSignupModal,
    setShowSignupModal,
    setShowPersonalizeModal,
    setShowSigninModal,
    setShowCompareModal,
    dentistsToCompare,
  } = useStateContext();

  const switchToSignin = () => {
    setShowSignupModal(false);
    setTimeout(() => {
      setShowSigninModal(true);
    }, 200);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showconfirm_password, setShowconfirm_password] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [needVerifyEmail, setNeedVerifyEmail] = useState<string | null>(null);

  // session user 
  const { user } = useMe()

  const { registerPatientMutation, isRegisterPatientLoading, resendOtpMutation, isOtpResendLoading } = useAuth();

  const handleSendVerificationOtp = async () => {
    if (!needVerifyEmail) return;
    try {
      await resendOtpMutation.mutateAsync({ email: needVerifyEmail });
      toast.success("Verification OTP sent successfully!", { style: TOAST_STYLE });
      setPendingEmail(needVerifyEmail);
      setNeedVerifyEmail(null);
      setShowSignupModal(false);
      setShowOtpModal(true);
    } catch (error: unknown) {

    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRegisterPatient>({
    resolver: zodResolver(registerPatientSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: IRegisterPatient) => {

    try {
      const res = await registerPatientMutation.mutateAsync(data)
      if (res) {
        if (res?.data?.needEmailVerify) {
          toast.success("Email is already registered but not verified. Please verify your email.", {
            style: TOAST_STYLE,
          });
          setNeedVerifyEmail(data.email);
          return;
        }
        toast.success("Account created successfully. Please verify your email.", {
          style: TOAST_STYLE,
        });
        setPendingEmail(data.email);
        reset();
        setShowSignupModal(false);
        setShowOtpModal(true);
      }
    } catch (error: unknown) {
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.success(`Signed up with ${provider}!`, { style: TOAST_STYLE });
    setShowSignupModal(false);

    if (dentistsToCompare && dentistsToCompare.length > 0) {
      const hasProfileDetails = !!(user?.firstName || user?.name);
      if (hasProfileDetails) {
        setShowCompareModal(true);
      } else {
        setShowPersonalizeModal(true);
      }
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setPendingEmail("");

    if (dentistsToCompare && dentistsToCompare.length > 0) {
      const hasProfileDetails = !!(user?.firstName || user?.name);
      if (hasProfileDetails) {
        setShowCompareModal(true);
      } else {
        setShowPersonalizeModal(true);
      }
    }
  };

  return (
    <>
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-150 max-h-[95vh] overflow-y-auto rounded-xl border-none p-8 gap-0">
          <DialogHeader className="mb-8 text-left">
            <DialogTitle className="mb-2 text-[32px] font-semibold leading-tight text-[#1A1A2E]">
              Sign up
            </DialogTitle>
            <DialogDescription className="text-[16px] leading-snug text-[#6B7280]">
              Sign up to compare dentists and continue your consultation
              journey.
            </DialogDescription>
          </DialogHeader>

          {needVerifyEmail ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
              <div className="text-[#1A1A2E] font-semibold text-lg">
                Your email ({needVerifyEmail}) is registered but not verified.
              </div>
              <p className="text-sm text-[#6B7280]">
                Click the button below to receive a verification OTP on your email.
              </p>
              <button
                type="button"
                onClick={handleSendVerificationOtp}
                disabled={isOtpResendLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isOtpResendLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
              <button
                type="button"
                onClick={() => setNeedVerifyEmail(null)}
                className="text-sm font-semibold text-[#113254] hover:underline"
              >
                Go back to Sign up
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 space-y-3">
                <button
                  onClick={() => handleSocialSignup("Google")}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="text-[#6B7280]">Continue with Google</span>
                </button>

                <button
                  onClick={() => handleSocialSignup("Apple")}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
                >
                  <FaApple className="text-2xl text-black" />
                  <span className="text-[#6B7280]">Continue with Apple</span>
                </button>

                <button
                  onClick={() => handleSocialSignup("Facebook")}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#F3F4F6] px-4 py-2.5 transition-colors duration-200 hover:bg-[#E5E7EB] lg:py-3.5"
                >
                  <FaFacebook className="text-2xl text-[#1877F2]" />
                  <span className="text-[#6B7280]">Continue with Facebook</span>
                </button>
              </div>

              <div className="relative my-6 flex items-center justify-center lg:my-8">
                <div className="grow border-t border-[#E5E7EB]"></div>
                <span className="mx-4 bg-white px-2 text-sm text-[#9EA9AA]">
                  or
                </span>
                <div className="grow border-t border-[#E5E7EB]"></div>
              </div>

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
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
                    Password <span className="text-red-500">*</span>
                  </label>
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

                <div>
                  <label className="mb-2 block text-[15px] font-semibold text-[#1A1A2E]">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showconfirm_password ? "text" : "password"}
                      placeholder="Enter Password"
                      {...register("confirmPassword")}
                      className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:py-4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowconfirm_password((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
                    >
                      {showconfirm_password ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isRegisterPatientLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#113254] py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRegisterPatientLoading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {/* Footer Toggle Link */}
              <p className="mt-6 text-center text-sm text-[#6B7280]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchToSignin}
                  className="font-semibold text-[#113254] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <OtpVerifyModal
        email={pendingEmail}
        open={showOtpModal}
        onOpenChange={setShowOtpModal}
        onVerified={handleOtpVerified}
      />
    </>
  );
}
