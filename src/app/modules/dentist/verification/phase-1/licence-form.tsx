"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { locationData } from "@/lib/location-data";

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
  const selectedCity = form.watch("city");

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

  const isCountryKey = (key: string): key is keyof typeof locationData => {
    return key in locationData;
  };

  const countries = Object.keys(locationData) as Array<keyof typeof locationData>;
  const cities = selectedCountry && isCountryKey(selectedCountry)
    ? Object.keys(locationData[selectedCountry].cities)
    : [];
  const authorities = (selectedCountry && isCountryKey(selectedCountry) && selectedCity)
    ? (locationData[selectedCountry].cities as Record<string, readonly string[]>)[selectedCity] || []
    : [];

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
              <Select
                disabled={isFormLocked || isVerifying}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("city", "");
                  form.setValue("authority", "");
                }}
                value={field.value}
              >
                <SelectTrigger className="h-14! w-full rounded-lg border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  {countries.map((code) => (
                    <SelectItem key={code} value={code}>
                      {locationData[code].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                disabled={isFormLocked || isVerifying || !selectedCountry}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("authority", "");
                }}
                value={field.value}
              >
                <SelectTrigger className="h-14! w-full rounded-lg border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  {cities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Registration Authority Select */}
        <div className="space-y-2">
          <Label className="font-semibold text-muted-foreground">
            Registration Authority
          </Label>
          <Controller
            name="authority"
            control={form.control}
            render={({ field }) => (
              <Select
                disabled={isFormLocked || isVerifying || !selectedCity}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="h-14! w-full rounded-lg border-border bg-card px-4 py-0">
                  <SelectValue placeholder="Select Authority" />
                </SelectTrigger>
                <SelectContent className="px-2 *:py-2">
                  {authorities.map((authName) => (
                    <SelectItem key={authName} value={authName}>
                      {authName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
