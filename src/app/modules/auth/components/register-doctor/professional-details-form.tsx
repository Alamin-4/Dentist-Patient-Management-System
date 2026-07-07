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
import { useSpecialties } from "@/hooks/dentist/useSpecialty";
import { ProfessionalDetailsI } from "@/hooks/dentist/dentist.interface";
import { locationData } from "@/lib/location-data";

const profSchema = z.object({
  full_name: z.string().min(2, "Full legal name is required"),
  specialty: z.string().min(1, "Please select a specialty"),
  experience_years: z.coerce.number().min(1, "Years of experience is required"),
  city: z.string().min(1, "Please select a city"),
  country: z.string().min(1, "Please select a country"),
});

type ProfFormData = z.infer<typeof profSchema>;

const backendToFrontendFieldMap: Record<string, keyof ProfFormData> = {
  legalName: "full_name",
  primarySpecialty: "specialty",
  yearsOfExperience: "experience_years",
  country: "country",
  city: "city",
};

export function ProfessionalDetailsForm({
  setStep,
}: {
  setStep: (step: "success") => void;
}) {
  const { professionalDetailsMutation, isProfessionalDetailsLoading } =
    useDentist();
  const { data: specialties, isLoading: isSpecialtiesLoading } = useSpecialties();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ProfFormData>({
    resolver: zodResolver(profSchema) as any,
    defaultValues: {
      full_name: "",
      specialty: "",
      experience_years: undefined,
      city: "",
      country: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  const isCountryKey = (key: string): key is keyof typeof locationData => {
    return key in locationData;
  };

  const countries = Object.keys(locationData) as Array<keyof typeof locationData>;
  const cities = selectedCountry && isCountryKey(selectedCountry)
    ? Object.keys(locationData[selectedCountry].cities)
    : [];

  const onSubmit = async (data: ProfFormData) => {
    clearErrors();
    const payload: ProfessionalDetailsI = {
      primarySpecialty: data.specialty,
      yearsOfExperience: data.experience_years.toString(),
      legalName: data.full_name,
      country: data.country,
      city: data.city
    }
    professionalDetailsMutation.mutate(payload, {
      onSuccess: () => {
        setStep("success");
      },
      onError: (error: any) => {
        const apiErrors = error?.errors || error?.response?.data?.errors;

        if (apiErrors && Array.isArray(apiErrors)) {
          apiErrors.forEach((fieldError: any) => {
            const mappedField = backendToFrontendFieldMap[fieldError.field] || fieldError.field;
            setError(mappedField as keyof ProfFormData, {
              type: "manual",
              message: fieldError.message,
            });
          });
          return;
        }

        const errorMessage =
          error?.response?.data?.message || error?.message || "Failed to save details.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="grid gap-2 text-left">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Full Legal Name
          </Label>
          <Input
            id="full_name"
            {...register("full_name", { onChange: () => clearErrors("full_name") })}
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
          <Select onValueChange={(val) => {
            setValue("specialty", val, { shouldValidate: true });
            clearErrors("specialty");
          }}>
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.specialty ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder={isSpecialtiesLoading ? "Loading..." : "Select a specialty"} />
            </SelectTrigger>
            <SelectContent>
              {isSpecialtiesLoading ? (
                <SelectItem className="h-11!" value="__loading" disabled>
                  Loading specialties...
                </SelectItem>
              ) : specialties && specialties.length > 0 ? (
                specialties.map((s) => (
                  <SelectItem className="h-11!" key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="h-11!" value="__empty" disabled>
                  No specialties available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.specialty && (
            <p className="text-xs text-red-500">{errors.specialty.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2 text-left items-start">
        <Label
          htmlFor="experience"
          className="text-sm font-medium text-gray-700"
        >
          Years of Experience
        </Label>
        <Input
          id="experience_years"
          type="number"
          {...register("experience_years", { onChange: () => clearErrors("experience_years") })}
          placeholder="8"
          className={`h-11 border-gray-300 bg-white focus:ring-0 focus:border-[#163E5C] ${errors.experience_years ? "border-red-500" : ""}`}
        />
        {errors.experience_years && (
          <p className="text-xs text-red-500">
            {errors.experience_years.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="grid gap-2 text-left items-start">
          <Label className="text-sm font-medium text-gray-700">Country</Label>
          <Select
            onValueChange={(val) => {
              setValue("country", val, { shouldValidate: true });
              setValue("city", "", { shouldValidate: true });
              clearErrors("country");
              clearErrors("city");
            }}
            value={selectedCountry}
          >
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.country ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((code) => (
                <SelectItem className="h-11!" key={code} value={code}>
                  {locationData[code].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>

        <div className="grid gap-2 text-left items-start">
          <Label className="text-sm font-medium text-gray-700">City</Label>
          <Select
            disabled={!selectedCountry}
            onValueChange={(val) => {
              setValue("city", val, { shouldValidate: true });
              clearErrors("city");
            }}
            value={selectedCity}
          >
            <SelectTrigger
              className={`h-11! w-full border-gray-300 bg-white ${errors.city ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder={selectedCountry ? "Select City" : "Select Country First"} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((cityName) => (
                <SelectItem className="h-11!" key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
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
        className="mt-4  h-14 w-full bg-[#163E5C] text-white hover:bg-[#113149] rounded-lg text-lg font-semibold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProfessionalDetailsLoading && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        {isProfessionalDetailsLoading ? "Saving..." : "Create Account"}
      </Button>
    </form>
  );
}
