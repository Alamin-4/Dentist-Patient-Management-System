"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Camera, MailCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";
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
import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";

interface CreateAccountFormProps {
  setStep: (step: "create-account" | "verify-email" | "professional-info" | "success") => void;
}

export function CreateAccountForm({ setStep }: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [needVerifyEmail, setNeedVerifyEmail] = useState<string | null>(null);

  const {
    registerDentistMutation,
    resendOtpMutation,
    isRegisterDentistLoading,
    isOtpResendLoading
  } = useAuth();

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

  // Manually register custom select fields to avoid state mapping bugs in React Hook Form
  useEffect(() => {
    register("gender");
  }, [register]);

  const handleSendVerificationOtp = () => {
    if (!needVerifyEmail) return;

    resendOtpMutation.mutate(
      { email: needVerifyEmail },
      {
        onSuccess: () => {
          localStorage.setItem("registerEmail", needVerifyEmail);
          setNeedVerifyEmail(null);
          setStep("verify-email");
        },
        onError: (error: any) => {
          const errorMessage = mapApiErrorToUserMessage(error, "Failed to send verification OTP. Try again.");
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
      },

      onError: (error: any) => {
        const apiErrors = error?.errors || error?.response?.data?.errors;
        const validFields: Array<keyof IRegisterDentist> = [
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "gender",
          "referralCode",
          "password",
          "confirmPassword",
        ];

        let hasMappedFieldError = false;
        if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
          apiErrors.forEach((fieldError: any) => {
            if (validFields.includes(fieldError.field)) {
              setError(fieldError.field as keyof IRegisterDentist, {
                type: "manual",
                message: fieldError.message,
              });
              hasMappedFieldError = true;
            }
          });
        }

        if (!hasMappedFieldError) {
          const errorRes = mapApiErrorToUserMessage(error, "Failed to create account.");
          toast.error(errorRes);
        }
      },
    });
  };

  if (needVerifyEmail) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-5 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <CustomSectionHeading value="Email Verification Required" center_align={true} />
          <CustomDesText value={`Your email ${needVerifyEmail} is registered but not yet verified.`} center_align={true} />
        </div>

        <div className="w-full space-y-3 pt-2">
          <Button
            type="button"
            onClick={handleSendVerificationOtp}
            disabled={isOtpResendLoading}
            className="h-10 md:h-11 w-full bg-primary hover:bg-primary/95 text-white font-medium focus:ring-0 focus:outline-none cursor-pointer flex items-center justify-center gap-2"
          >
            {isOtpResendLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Verification OTP...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>

          <button
            type="button"
            onClick={() => setNeedVerifyEmail(null)}
            className="flex items-center justify-center gap-1.5 w-full text-sm font-medium text-sec-text hover:text-text transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName" className="text-sm text-sec-text">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName", { onChange: () => clearErrors("firstName") })}
            placeholder="John"
            className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.firstName ? "border-red-400" : ""}`}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName" className="text-sm text-sec-text">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName", { onChange: () => clearErrors("lastName") })}
            placeholder="Doe"
            className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.lastName ? "border-red-400" : ""}`}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm text-sec-text">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { onChange: () => clearErrors("email") })}
          placeholder="example@gmail.com"
          className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.email ? "border-red-400" : ""}`}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phoneNumber" className="text-sm text-sec-text">Phone No</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber", { onChange: () => clearErrors("phoneNumber") })}
          placeholder="+1 234 *******"
          className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.phoneNumber ? "border-red-400" : ""}`}
        />
        {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2">
          <Label htmlFor="gender" className="text-sm text-sec-text">Gender</Label>
          <Select
            onValueChange={(val) => {
              setValue("gender", val as "MALE" | "FEMALE" | "OTHER", { shouldValidate: true });
              clearErrors("gender");
            }}
          >
            <SelectTrigger
              id="gender"
              className={`h-10 md:h-11! w-full border-border bg-white ${errors.gender ? "border-red-400" : ""}`}
            >
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE" className="h-10 md:h-11!">Male</SelectItem>
              <SelectItem value="FEMALE" className="h-10 md:h-11!">Female</SelectItem>
              <SelectItem value="OTHER" className="h-10 md:h-11!">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="referralCode" className="text-sm text-sec-text">Referral Code</Label>
          <Input
            id="referralCode"
            {...register("referralCode", { onChange: () => clearErrors("referralCode") })}
            placeholder="JH-12 (Optional)"
            className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.referralCode ? "border-red-400" : ""}`}
          />
          {errors.referralCode && <p className="text-xs text-red-500">{errors.referralCode.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text-sm text-sec-text">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password", { onChange: () => clearErrors("password") })}
            placeholder="••••••••"
            className={`h-10 md:h-11 pr-10 border-border bg-white focus:ring-0 focus:outline-none ${errors.password ? "border-red-400" : ""}`}
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
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword" className="text-sm text-sec-text">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", { onChange: () => clearErrors("confirmPassword") })}
            placeholder="••••••••"
            className={`h-10 md:h-11 pr-10 border-border bg-white focus:ring-0 focus:outline-none ${errors.confirmPassword ? "border-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isRegisterDentistLoading}
        className="h-10 md:h-11 bg-primary hover:bg-primary/95 text-white font-medium focus:ring-0 focus:outline-none cursor-pointer w-full"
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