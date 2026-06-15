"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
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
import useDentist from "@/hooks/dentist/useDentist";
import { ProfessionalDetailsI } from "@/hooks/dentist/dentist.interface";

const profSchema = z.object({
  full_name: z.string().min(2, "Full legal name is required"),
  specialty: z.string().min(1, "Please select a speciality"),
  experience_years: z.coerce.number().min(1, "Years of experience is required"),
  city: z.string().min(1, "Please select a city").optional(),
  country: z.string().min(1, "Please select a country").optional(),
});

type ProfFormData = z.infer<typeof profSchema>;

export function ProfessionalDetailsForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const { professionalDetailsMutation, isProfessionalDetailsLoading } =
    useDentist();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfFormData>({
    resolver: zodResolver(profSchema) as any,
  });

  const onSubmit = async (data: ProfFormData) => {
    professionalDetailsMutation.mutate(data as ProfessionalDetailsI, {
      onSuccess: () => {
        setStep(4);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to save details.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2 text-left">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Full Legal Name
          </Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="John Smith"
            className={`h-11 w-full border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.full_name ? "border-red-500" : ""}`}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">
            Primary Speciality
          </Label>
          <Select onValueChange={(val) => setValue("specialty", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.specialty ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="PERIODONTIST" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="PERIODONTIST">
                PERIODONTIST
              </SelectItem>
              <SelectItem className="h-11!" value="DENTIST">
                DENTIST
              </SelectItem>
              <SelectItem className="h-11!" value="SURGEON">
                SURGEON
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.specialty && (
            <p className="text-xs text-red-500">{errors.specialty.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2 text-left">
        <Label
          htmlFor="experience"
          className="text-sm font-medium text-gray-700"
        >
          Years of Experience
        </Label>
        <Input
          id="experience_years"
          type="number"
          {...register("experience_years")}
          placeholder="8"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.experience_years ? "border-red-500" : ""}`}
        />
        {errors.experience_years && (
          <p className="text-xs text-red-500">
            {errors.experience_years.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">Country</Label>
          <Select onValueChange={(val) => setValue("country", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.country ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="USA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="usa">
                USA
              </SelectItem>
              <SelectItem className="h-11!" value="uk">
                UK
              </SelectItem>
              <SelectItem className="h-11!" value="canada">
                Canada
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>

        <div className="grid gap-2 text-left">
          <Label className="text-sm font-medium text-gray-700">City</Label>
          <Select onValueChange={(val) => setValue("city", val)}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.city ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="California" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="h-11!" value="california">
                California
              </SelectItem>
              <SelectItem className="h-11!" value="new-york">
                New York
              </SelectItem>
              <SelectItem className="h-11!" value="texas">
                Texas
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProfessionalDetailsLoading}
        className="mt-4  h-14 w-full bg-[#163E5C] text-white hover:bg-[#113149] rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        {isProfessionalDetailsLoading && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        {isProfessionalDetailsLoading ? "Saving..." : "Create Account"}
      </Button>
    </form>
  );
}
