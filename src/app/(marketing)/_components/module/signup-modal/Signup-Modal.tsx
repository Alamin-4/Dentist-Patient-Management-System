"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const signupSchema = z
  .object({
    email: z.email({ error: "Please enter a valid email address" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#1A1A2E",
  color: "#fff",
};

export default function SignupModal() {
  const router = useRouter();
  const { showSignupModal, setShowSignupModal } = useStateContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const redirectToDashboard = () => {
    setShowSignupModal(false);
    reset();
    router.push("/patient/settings");
  };

  const onSubmit = async (_data: SignupFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast.success("Account created successfully!", { style: TOAST_STYLE });
    redirectToDashboard();
  };

  const handleSocialSignup = (provider: string) => {
    toast.success(`Signed up with ${provider}!`, { style: TOAST_STYLE });
    redirectToDashboard();
  };

  return (
    <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
      <DialogContent className="sm:max-w-150 p-8 rounded-xl border-none gap-0 overflow-y-auto max-h-[95vh]">
        <DialogHeader className="text-left mb-8">
          <DialogTitle className="text-[32px] font-semibold text-[#1A1A2E] leading-tight mb-2">
            Sign up
          </DialogTitle>
          <DialogDescription className="text-[#6B7280] text-[16px] leading-snug">
            Sign up to compare dentists and continue your consultation journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => handleSocialSignup("Google")}
            className="w-full flex cursor-pointer items-center justify-center gap-3 py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-[#6B7280]">Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialSignup("Apple")}
            className="w-full flex cursor-pointer items-center justify-center gap-3 py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200"
          >
            <FaApple className="text-2xl text-black" />
            <span className="text-[#6B7280]">Continue with Apple</span>
          </button>

          <button
            onClick={() => handleSocialSignup("Facebook")}
            className="w-full flex cursor-pointer items-center justify-center gap-3 py-2.5 lg:py-3.5 px-4 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-xl transition-colors duration-200"
          >
            <FaFacebook className="text-2xl text-[#1877F2]" />
            <span className="text-[#6B7280]">Continue with Facebook</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6 lg:my-8">
          <div className="grow border-t border-[#E5E7EB]"></div>
          <span className="mx-4 text-[#9EA9AA] text-sm bg-white px-2">or</span>
          <div className="grow border-t border-[#E5E7EB]"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              {...register("email")}
              className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("password")}
                className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
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
            <label className="block text-[#1A1A2E] font-semibold text-[15px] mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter Password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2.5 lg:py-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0E3E65] placeholder-[#9EA9AA] font-normal transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA]"
              >
                {showConfirmPassword ? (
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
            disabled={isLoading}
            className="w-full py-4 bg-[#113254] hover:bg-[#0d2844] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl transition-all duration-200 mt-2 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}