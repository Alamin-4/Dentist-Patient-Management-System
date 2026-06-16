"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/authentication/useAuth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Define the validation schema
const formSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.string().min(1, "Gender is required"),
    referral_code: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
    role: z.literal("DENTIST"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof formSchema>;

export function CreateAccountForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      referral_code: "",
      password: "",
      confirm_password: "",
      role: "DENTIST",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    localStorage.setItem("registerEmail", data.email);

    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          "Account created successfully! Please verify your email.",
        );
        localStorage.setItem("registerEmail", data.email);
        setStep(2);
      },
      onError: (error: any) => {

        const errorRes = error?.detail?.message

        toast.error(`${errorRes}`)

      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              {...register("first_name")}
              placeholder="John"
              className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.first_name ? "border-red-500" : ""}`}
            />
            {errors.first_name && (
              <p className="text-xs text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="last_name"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </Label>
            <Input
              id="last_name"
              {...register("last_name")}
              placeholder="Doe"
              className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.last_name ? "border-red-500" : ""}`}
            />
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@gmail.com"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone No
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 234 *******"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700"
            >
              Gender
            </Label>
            <Select onValueChange={(val) => setValue("gender", val)}>
              <SelectTrigger
                className={`h-11! w-full border-gray-300 bg-white ${errors.gender ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="h-11!" value="MALE">
                  Male
                </SelectItem>
                <SelectItem className="h-11!" value="FEMALE">
                  Female
                </SelectItem>
                <SelectItem className="h-11!" value="OTHER">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="referral_code"
              className="text-sm font-medium text-gray-700"
            >
              Referral Code
            </Label>
            <Input
              id="referral_code"
              {...register("referral_code")}
              placeholder="JH-12"
              className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.referral_code ? "border-red-500" : ""}`}
            />
            {errors.referral_code && (
              <p className="text-xs text-red-500">
                {errors.referral_code.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.password ? "border-red-500" : ""}`}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="confirm_password"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showPassword ? "text" : "password"}
              {...register("confirm_password")}
              placeholder="••••••••"
              className={`h-11 pr-10 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.confirm_password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-red-500">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 bg-[#163E5C] hover:bg-[#0E3E65] focus:ring-0 focus:ring-offset-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <div className="text-center text-sm">
          Already have an account? <Link href="/doctor-login" className="text-[#0E3E65] font-medium! hover:underline cursor-pointer">Sign In</Link>

        </div>
      </form>

    </>
  );
}
