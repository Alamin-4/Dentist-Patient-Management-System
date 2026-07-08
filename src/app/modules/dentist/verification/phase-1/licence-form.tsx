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
  authority: z.string().min(1, "Registration authority is required"),
  regNo: z.string().min(1, "Registration number is required"),
});

interface LicenceFormProps {
  onVerify: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<z.infer<typeof formSchema>> | null;
  isFormLocked: boolean;
  isVerifying: boolean;
}

export default function LicenceForm({
  onVerify,
  defaultValues,
  isFormLocked,
  isVerifying,
}: LicenceFormProps) {
  const [countriesList, setCountriesList] = useState<CSCCountry[]>([]);
  const [citiesList, setCitiesList] = useState<CSCCity[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: defaultValues?.country || "",
      city: defaultValues?.city || "",
      authority: defaultValues?.authority || "",
      regNo: defaultValues?.regNo || "",
    },
  });

  const selectedCountry = form.watch("country");

  // Load countries on mount
  useEffect(() => {
    async function loadCountries() {
      setLoadingLocations(true);
      const list = await getCountries();
      setCountriesList(list);
      setLoadingLocations(false);
    }
    loadCountries();
  }, []);

  // Fetch cities when selected country changes
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

  // Handle defaults resetting
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        country: defaultValues.country || "",
        city: defaultValues.city || "",
        authority: defaultValues.authority || "",
        regNo: defaultValues.regNo || "",
      });
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Country Select */}
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
        </div>

        {/* City Select */}
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
        </div>

        {/* Registration Authority (Manual Input) */}
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
        </div>

        {/* Registration Number */}
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
