"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
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
import { useProfessionalDetailsMutation } from "@/hooks/dentist/useDentist";
import { useSpecialties } from "@/hooks/dentist/useSpecialty";
import { ProfessionalDetailsI } from "@/hooks/dentist/dentist.interface";
import { locationData } from "@/lib/location-data";
import { mapApiErrorToUserMessage } from "@/core/lib/getErrorMessage";

import { LanguageMultiSelect } from "@/components/ui/language-multi-select";

const profSchema = z.object({
  full_name: z.string().min(2, "Full legal name is required"),
  specialty: z.string().min(1, "Please select a specialty"),
  experience_years: z.coerce.number().min(0, "Years of experience must be at least 0"),
  city: z.string().min(1, "Please select a city"),
  country: z.string().min(1, "Please select a country"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  bio: z.string().optional(),
});

type ProfFormData = z.infer<typeof profSchema>;

const backendToFrontendFieldMap: Record<string, keyof ProfFormData> = {
  legalName: "full_name",
  primarySpecialty: "specialty",
  yearsOfExperience: "experience_years",
  country: "country",
  city: "city",
  languages: "languages",
};

export function ProfessionalDetailsForm({
  setStep,
}: {
  setStep: (step: "success") => void;
}) {
  const professionalDetailsMutation = useProfessionalDetailsMutation();
  const isProfessionalDetailsLoading = professionalDetailsMutation.isPending;
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
      languages: [],
      bio: "",
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

  const selectedLanguages = watch("languages") || [];

  const onSubmit = async (data: ProfFormData) => {
    clearErrors();
    const payload: ProfessionalDetailsI = {
      primarySpecialty: data.specialty,
      yearsOfExperience: data.experience_years.toString(),
      legalName: data.full_name,
      country: data.country,
      city: data.city,
      languages: data.languages,
      bio: data.bio || "",
    };
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

        const errorMessage = mapApiErrorToUserMessage(error, "Failed to save details.");
        toast.error(errorMessage);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2 text-left">
          <Label
            htmlFor="full_name"
            className="text-sm text-sec-text"
          >
            Full Legal Name
          </Label>
          <Input
            id="full_name"
            {...register("full_name", { onChange: () => clearErrors("full_name") })}
            placeholder="John Smith"
            className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.full_name ? "border-red-400" : ""}`}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div className="grid gap-2 text-left">
          <Label className="text-sm text-sec-text">
            Primary Speciality
          </Label>
          <Select onValueChange={(val) => {
            setValue("specialty", val, { shouldValidate: true });
            clearErrors("specialty");
          }}>
            <SelectTrigger
              className={`h-10 md:h-11! w-full border-border bg-white ${errors.specialty ? "border-red-400" : ""}`}
            >
              <SelectValue placeholder={isSpecialtiesLoading ? "Loading..." : "Select a specialty"} />
            </SelectTrigger>
            <SelectContent>
              {isSpecialtiesLoading ? (
                <SelectItem className="h-10 md:h-11!" value="__loading" disabled>
                  Loading specialties...
                </SelectItem>
              ) : specialties && specialties.length > 0 ? (
                specialties.map((s) => (
                  <SelectItem className="h-10 md:h-11!" key={s.id} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="h-10 md:h-11!" value="__empty" disabled>
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
          htmlFor="experience_years"
          className="text-sm text-sec-text"
        >
          Years of Experience
        </Label>
        <Input
          id="experience_years"
          type="number"
          min={0}
          onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
          {...register("experience_years", { onChange: () => clearErrors("experience_years") })}
          placeholder="8"
          className={`h-10 md:h-11 border-border bg-white focus:ring-0 focus:outline-none ${errors.experience_years ? "border-red-400" : ""}`}
        />
        {errors.experience_years && (
          <p className="text-xs text-red-500">
            {errors.experience_years.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4">
        <div className="grid gap-2 text-left items-start">
          <Label className="text-sm text-sec-text">Country</Label>
          <Select
            onValueChange={(val) => {
              setValue("country", val, { shouldValidate: true });
              setValue("city", "", { shouldValidate: false });
              clearErrors("country");
              clearErrors("city");
            }}
            value={selectedCountry}
          >
            <SelectTrigger
              className={`h-10 md:h-11! w-full border-border bg-white ${errors.country ? "border-red-400" : ""}`}
            >
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((code) => (
                <SelectItem className="h-10 md:h-11!" key={code} value={code}>
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
          <Label className="text-sm text-sec-text">City</Label>
          <Select
            disabled={!selectedCountry}
            onValueChange={(val) => {
              setValue("city", val, { shouldValidate: true });
              clearErrors("city");
            }}
            value={selectedCity}
          >
            <SelectTrigger
              className={`h-10 md:h-11! w-full border-border bg-white ${errors.city ? "border-red-400" : ""}`}
            >
              <SelectValue placeholder={selectedCountry ? "Select City" : "Select Country First"} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((cityName) => (
                <SelectItem className="h-10 md:h-11!" key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <LanguageMultiSelect
        selectedLanguages={selectedLanguages}
        onChange={(langs: string[]) => {
          setValue("languages", langs, { shouldValidate: true });
          if (langs.length > 0) clearErrors("languages");
        }}
        error={errors.languages?.message}
        label="Spoken Languages"
        required={true}
        disabled={isProfessionalDetailsLoading}
      />

      <div className="grid gap-2 text-left items-start">
        <Label className="text-sm text-sec-text">Professional Bio / About Us (Optional)</Label>
        <textarea
          {...register("bio")}
          rows={3}
          placeholder="Briefly describe your clinical practice, philosophy, and experience..."
          className="w-full rounded-md border border-border bg-white p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400"
          disabled={isProfessionalDetailsLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={isProfessionalDetailsLoading}
        className="h-10 md:h-11 bg-primary hover:bg-primary/95 text-white font-medium focus:ring-0 focus:outline-none cursor-pointer w-full mt-2 flex items-center justify-center gap-2"
      >
        {isProfessionalDetailsLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {isProfessionalDetailsLoading ? "Saving..." : "Create Account"}
      </Button>
    </form>
  );
}
