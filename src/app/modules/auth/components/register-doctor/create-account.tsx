"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useAuth, { useMe } from "@/hooks/auth/useAuth";
import { IRegisterDentist, registerDentistSchema } from "@/hooks/auth/auth.validation";

interface CreateAccountFormProps {
  setStep: (step: "verify-email" | "professional-info" | "success") => void;
}

export function CreateAccountForm({ setStep }: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [needVerifyEmail, setNeedVerifyEmail] = useState<string | null>(null);
  const { user } = useMe()

  const router = useRouter();
  const pathName = usePathname();

  const {
    registerDentistMutation,
    resendOtpMutation,
    isRegisterDentistLoading,
    isOtpResendLoading
  } = useAuth();

  useEffect(() => {
    if (user && user?.emailVerified && setStep) {
      setStep("professional-info")
      router.push(`${pathName}?dentist=professional-info`);
    }
  }, [user])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,      // <--- Added: To set manual errors from API
    clearErrors,   // <--- Added: To clear previous errors
  } = useForm<IRegisterDentist>({
    resolver: zodResolver(registerDentistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      referralCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSendVerificationOtp = () => {
    if (!needVerifyEmail) return;

    resendOtpMutation.mutate(
      { email: needVerifyEmail },
      {
        onSuccess: () => {
          localStorage.setItem("registerEmail", needVerifyEmail);
          setNeedVerifyEmail(null);
          setStep("verify-email");
          router.push(`${pathName}?dentist=verify-email`);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to send verification OTP. Try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const onSubmit = (data: IRegisterDentist) => {
    clearErrors(); // <--- Clear any previous manual errors before new submission
    localStorage.setItem("registerEmail", data.email);

    registerDentistMutation.mutate(data, {
      onSuccess: (res: any) => {
        if (res?.data?.needEmailVerify) {
          setNeedVerifyEmail(data.email);
          return;
        }
        setStep("verify-email");
        router.push(`${pathName}?dentist=verify-email`);
      },

      onError: (error: any) => {
        const apiErrors = error?.errors || error?.response?.data?.errors;

        // Check if backend sent field-specific errors
        if (apiErrors && Array.isArray(apiErrors)) {
          apiErrors.forEach((fieldError: any) => {
            // Set error on the specific field
            setError(fieldError.field as keyof IRegisterDentist, {
              type: "manual",
              message: fieldError.message,
            });
          });
          return; // Prevent toast from showing
        }

        // Fallback to toast for general errors
        const errorRes = error?.message || error?.response?.data?.message || "Failed to create account.";
        toast.error(errorRes);
      },
    });
  };

  // Early return for the "Verify Email" state
  if (needVerifyEmail) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
        <div className="text-[#1A1A1A] font-semibold text-lg">
          Your email ({needVerifyEmail}) is registered but not verified.
        </div>
        <p className="text-sm text-gray-500">
          Click the button below to receive a verification OTP on your email.
        </p>
        <Button
          type="button"
          onClick={handleSendVerificationOtp}
          disabled={isOtpResendLoading}
          className="h-11 w-full bg-[#163E5C] hover:bg-[#0E3E65] focus:ring-0 focus:ring-offset-0 cursor-pointer"
        >
          {isOtpResendLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
        <button
          type="button"
          onClick={() => setNeedVerifyEmail(null)}
          className="text-sm font-semibold text-[#163E5C] hover:underline cursor-pointer"
        >
          Go back to Sign up
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName", { onChange: () => clearErrors("firstName") })}
            placeholder="John"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.firstName ? "border-red-500" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName", { onChange: () => clearErrors("lastName") })}
            placeholder="Doe"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.lastName ? "border-red-500" : ""}`}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { onChange: () => clearErrors("email") })}
          placeholder="example@gmail.com"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone No</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber", { onChange: () => clearErrors("phoneNumber") })}
          placeholder="+1 234 *******"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.phoneNumber ? "border-red-500" : ""}`}
        />
        {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
          <Select
            onValueChange={(val) => {
              setValue("gender", val as "MALE" | "FEMALE" | "OTHER");
              clearErrors("gender");
            }}
          >
            <SelectTrigger
              id="gender"
              className={`h-11! w-full border-gray-300 bg-white ${errors.gender ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE" className="h-11!">Male</SelectItem>
              <SelectItem value="FEMALE" className="h-11!">Female</SelectItem>
              <SelectItem value="OTHER" className="h-11!">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">Referral Code</Label>
          <Input
            id="referralCode"
            {...register("referralCode", { onChange: () => clearErrors("referralCode") })}
            placeholder="JH-12 (Optional)"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.referralCode ? "border-red-500" : ""}`}
          />
          {errors.referralCode && <p className="text-xs text-red-500">{errors.referralCode.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password", { onChange: () => clearErrors("password") })}
          placeholder="••••••••"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword", { onChange: () => clearErrors("confirmPassword") })}
            placeholder="••••••••"
            className={`h-11 pr-10 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isRegisterDentistLoading}
        className="h-11 bg-[#163E5C] hover:bg-[#0E3E65] focus:ring-0 focus:ring-offset-0 cursor-pointer w-full"
      >
        {isRegisterDentistLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}