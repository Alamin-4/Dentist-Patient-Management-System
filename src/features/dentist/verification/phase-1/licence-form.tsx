"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import { getCountries, getCities, type CSCCountry, type CSCCity } from "@/lib/countryApi";

const formSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  authority: z
    .string()
    .min(1, "Registration authority is required")
    .refine((val) => /[a-zA-Z]/.test(val), "Registration authority must contain letters (e.g., BMDC)"),
  regNo: z.string().min(1, "Registration number is required"),
});

interface LicenceFormProps {
  onVerify: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>> | null;
  isFormLocked: boolean;
  isVerifying: boolean;
  serverErrors?: Record<string, string>;
  submissionAttempted?: boolean;
  onFormChange?: () => void;
}

export default function LicenceForm({
  onVerify,
  defaultValues,
  isFormLocked,
  isVerifying,
  serverErrors,
  submissionAttempted,
  onFormChange,
}: LicenceFormProps) {
  const [countriesList, setCountriesList] = useState<CSCCountry[]>([]);
  const [citiesList, setCitiesList] = useState<CSCCity[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      country: defaultValues?.country || "",
      city: defaultValues?.city || "",
      authority: defaultValues?.authority || "",
      regNo: defaultValues?.regNo || "",
    },
  });

  const { formState: { errors } } = form;

  const selectedCountry = form.watch("country");
  const watchAll = form.watch();

  useEffect(() => {
    if (form.formState.isDirty) {
      onFormChange?.();
    }
  }, [watchAll.country, watchAll.city, watchAll.authority, watchAll.regNo, form.formState.isDirty, onFormChange]);

  useEffect(() => {
    async function loadCountries() {
      setLoadingLocations(true);
      const list = await getCountries();
      setCountriesList(list);
      setLoadingLocations(false);
    }
    loadCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setCitiesList([]);
      return;
    }
    async function loadCities() {
      const countryObj = countriesList.find(
        (c) => c.name.toLowerCase() === selectedCountry.toLowerCase()
      );
      if (countryObj) {
        // FIX: Pass the ISO code (e.g., "US", "BD") instead of the full name
        const list = await getCities(countryObj.iso2);
        setCitiesList(list);
      } else {
        setCitiesList([]);
      }
    }
    if (countriesList.length > 0) {
      loadCities();
    }
  }, [selectedCountry, countriesList]);

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        country: defaultValues.country || "",
        city: defaultValues.city || "",
        authority: defaultValues.authority || "",
        regNo: defaultValues.regNo || "",
      });
    }
  }, [defaultValues]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      form.clearErrors();

      Object.entries(serverErrors).forEach(([field, msg]) => {
        let formField: "country" | "city" | "authority" | "regNo" | null = null;
        if (field === "country") formField = "country";
        else if (field === "city") formField = "city";
        else if (field === "registrationAuthority" || field === "authority") formField = "authority";
        else if (field === "registrationNumber" || field === "regNo") formField = "regNo";

        if (formField) {
          form.setError(formField, { type: "server", message: msg });
        }
      });
    }
  }, [serverErrors, form]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    form.reset(data);
    onVerify(data);
  };

  useEffect(() => {
    if (submissionAttempted) {
      form.handleSubmit(handleFormSubmit)();
    }
  }, [submissionAttempted]);

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">Country</Label>
          <Controller
            name="country"
            control={form.control}
            render={({ field }) => (
              <SearchableDropdown
                disabled={isFormLocked || isVerifying || loadingLocations}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  form.setValue("city", "");
                }}
                options={countriesList.map((c) => c.name)}
                placeholder={loadingLocations ? "Loading countries..." : "Select Country"}
                triggerClassName="h-14! bg-card border-border px-4 text-[14px]"
              />
            )}
          />
          {errors.country && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">City</Label>
          <Controller
            name="city"
            control={form.control}
            render={({ field }) => (
              <SearchableDropdown
                disabled={isFormLocked || isVerifying || !selectedCountry}
                value={field.value}
                onChange={field.onChange}
                options={citiesList.map((c) => c.name)}
                placeholder="Select City"
                triggerClassName="h-14! bg-card border-border px-4 text-[14px]"
              />
            )}
          />
          {errors.city && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">
            Registration Authority
          </Label>
          <Input
            disabled={isFormLocked || isVerifying}
            placeholder="Enter Registration Authority"
            {...form.register("authority")}
            className="h-14 rounded-lg border-border bg-card px-4 py-0"
          />
          {errors.authority && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errors.authority.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">
            Registration No
          </Label>
          <Input
            disabled={isFormLocked || isVerifying}
            {...form.register("regNo")}
            className="h-14 rounded-lg border-border bg-card px-4 py-0"
            placeholder="Enter Reg No"
          />
          {errors.regNo && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errors.regNo.message}
            </p>
          )}
        </div>
      </div>

      <div className="">
        <Button
          disabled={isFormLocked || isVerifying}
          type="submit"
          className="h-12 rounded-lg px-10 font-semibold flex items-center justify-center gap-2"
        >
          {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
          {isFormLocked ? "Submitted" : isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </form>
  );
}
