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

export const locationData = {
  US: {
    name: "United States",
    cities: {
      "New York": ["New York State Dental Board", "NYC Dept. of Health - Dental Division", "New York Dental Council", "Manhattan Dental Registration", "Brooklyn Dental Board", "Queens Dental Authority", "Bronx Dental Council", "Staten Island Dental Office", "NY Regional Dental Commission", "NY Dental Association"],
      "Los Angeles": ["California Dental Board - LA", "LA County Dental Council", "Los Angeles Dental Licensing", "LA Regional Dental Office", "LA Dental Examining Board", "LA Public Health Dental", "Los Angeles Dental Jurisdiction", "LA Central Dental Authority", "LA Dental Association", "CA State Dental - LA Branch"],
      "Chicago": ["Illinois Dental Board - Chicago", "Chicago Dental Council", "Chicago Dental Licensing Authority", "Chicago Regional Dental Office", "Chicago Dental Examining Board", "Chicago Public Health Dental", "Chicago Dental Jurisdiction Board", "Chicago Central Dental Authority", "Chicago Dental Association", "IL State Dental - Chicago Branch"],
      "Houston": ["Texas Dental Board - Houston", "Houston Dental Council", "Houston Dental Licensing Authority", "Houston Regional Dental Office", "Houston Dental Examining Board", "Houston Public Health Dental", "Houston Dental Jurisdiction Board", "Houston Central Dental Authority", "Houston Dental Association", "TX State Dental - Houston Branch"],
      "Phoenix": ["Arizona Dental Board - Phoenix", "Phoenix Dental Council", "Phoenix Dental Licensing Authority", "Phoenix Regional Dental Office", "Phoenix Dental Examining Board", "Phoenix Public Health Dental", "Phoenix Dental Jurisdiction Board", "Phoenix Central Dental Authority", "Phoenix Dental Association", "AZ State Dental - Phoenix Branch"]
    }
  },
  FR: {
    name: "France",
    cities: {
      "Paris": ["Paris Dental Council", "Île-de-France Dental Board", "Paris Dental Licensing Authority", "Paris Regional Dental Office", "Paris Dental Examining Commission", "Paris Public Health Dental", "Paris Dental Jurisdiction Board", "Paris Central Dental Authority", "Paris Dental Association", "French National Dental - Paris"],
      "Marseille": ["Marseille Dental Council", "Provence Dental Board", "Marseille Dental Licensing Authority", "Marseille Regional Dental Office", "Marseille Dental Examining Commission", "Marseille Public Health Dental", "Marseille Dental Jurisdiction Board", "Marseille Central Dental Authority", "Marseille Dental Association", "French National Dental - Marseille"],
      "Lyon": ["Lyon Dental Council", "Auvergne-Rhône-Alpes Dental Board", "Lyon Dental Licensing Authority", "Lyon Regional Dental Office", "Lyon Dental Examining Commission", "Lyon Public Health Dental", "Lyon Dental Jurisdiction Board", "Lyon Central Dental Authority", "Lyon Dental Association", "French National Dental - Lyon"],
      "Toulouse": ["Toulouse Dental Council", "Occitanie Dental Board", "Toulouse Dental Licensing Authority", "Toulouse Regional Dental Office", "Toulouse Dental Examining Commission", "Toulouse Public Health Dental", "Toulouse Dental Jurisdiction Board", "Toulouse Central Dental Authority", "Toulouse Dental Association", "French National Dental - Toulouse"],
      "Nice": ["Nice Dental Council", "Alpes-Maritimes Dental Board", "Nice Dental Licensing Authority", "Nice Regional Dental Office", "Nice Dental Examining Commission", "Nice Public Health Dental", "Nice Dental Jurisdiction Board", "Nice Central Dental Authority", "Nice Dental Association", "French National Dental - Nice"]
    }
  },
  DE: {
    name: "Germany",
    cities: {
      "Berlin": ["Berlin Dental Council", "Brandenburg Dental Board", "Berlin Dental Licensing Authority", "Berlin Regional Dental Office", "Berlin Dental Examining Commission", "Berlin Public Health Dental", "Berlin Dental Jurisdiction Board", "Berlin Central Dental Authority", "Berlin Dental Association", "German National Dental - Berlin"],
      "Hamburg": ["Hamburg Dental Council", "Schleswig-Holstein Dental Board", "Hamburg Dental Licensing Authority", "Hamburg Regional Dental Office", "Hamburg Dental Examining Commission", "Hamburg Public Health Dental", "Hamburg Dental Jurisdiction Board", "Hamburg Central Dental Authority", "Hamburg Dental Association", "German National Dental - Hamburg"],
      "Munich": ["Munich Dental Council", "Bavaria Dental Board", "Munich Dental Licensing Authority", "Munich Regional Dental Office", "Munich Dental Examining Commission", "Munich Public Health Dental", "Munich Dental Jurisdiction Board", "Munich Central Dental Authority", "Munich Dental Association", "German National Dental - Munich"],
      "Cologne": ["Cologne Dental Council", "North Rhine-Westphalia Dental Board", "Cologne Dental Licensing Authority", "Cologne Regional Dental Office", "Cologne Dental Examining Commission", "Cologne Public Health Dental", "Cologne Dental Jurisdiction Board", "Cologne Central Dental Authority", "Cologne Dental Association", "German National Dental - Cologne"],
      "Frankfurt": ["Frankfurt Dental Council", "Hesse Dental Board", "Frankfurt Dental Licensing Authority", "Frankfurt Regional Dental Office", "Frankfurt Dental Examining Commission", "Frankfurt Public Health Dental", "Frankfurt Dental Jurisdiction Board", "Frankfurt Central Dental Authority", "Frankfurt Dental Association", "German National Dental - Frankfurt"]
    }
  },
  SA: {
    name: "Saudi Arabia",
    cities: {
      "Riyadh": ["Riyadh Dental Council", "Saudi Central Dental Board", "Riyadh Dental Licensing Authority", "Riyadh Regional Dental Office", "Riyadh Dental Examining Commission", "Riyadh Public Health Dental", "Riyadh Dental Jurisdiction Board", "Riyadh Central Dental Authority", "Riyadh Dental Association", "Saudi Commission for Health - Riyadh"],
      "Jeddah": ["Jeddah Dental Council", "Makkah Region Dental Board", "Jeddah Dental Licensing Authority", "Jeddah Regional Dental Office", "Jeddah Dental Examining Commission", "Jeddah Public Health Dental", "Jeddah Dental Jurisdiction Board", "Jeddah Central Dental Authority", "Jeddah Dental Association", "Saudi Commission for Health - Jeddah"],
      "Mecca": ["Mecca Dental Council", "Makkah Dental Board", "Mecca Dental Licensing Authority", "Mecca Regional Dental Office", "Mecca Dental Examining Commission", "Mecca Public Health Dental", "Mecca Dental Jurisdiction Board", "Mecca Central Dental Authority", "Mecca Dental Association", "Saudi Commission for Health - Mecca"],
      "Medina": ["Medina Dental Council", "Madinah Dental Board", "Medina Dental Licensing Authority", "Medina Regional Dental Office", "Medina Dental Examining Commission", "Medina Public Health Dental", "Medina Dental Jurisdiction Board", "Medina Central Dental Authority", "Medina Dental Association", "Saudi Commission for Health - Medina"],
      "Dammam": ["Dammam Dental Council", "Eastern Province Dental Board", "Dammam Dental Licensing Authority", "Dammam Regional Dental Office", "Dammam Dental Examining Commission", "Dammam Public Health Dental", "Dammam Dental Jurisdiction Board", "Dammam Central Dental Authority", "Dammam Dental Association", "Saudi Commission for Health - Dammam"]
    }
  },
  ES: {
    name: "Spain",
    cities: {
      "Madrid": ["Madrid Dental Council", "Community of Madrid Dental Board", "Madrid Dental Licensing Authority", "Madrid Regional Dental Office", "Madrid Dental Examining Commission", "Madrid Public Health Dental", "Madrid Dental Jurisdiction Board", "Madrid Central Dental Authority", "Madrid Dental Association", "Spanish General Dental - Madrid"],
      "Barcelona": ["Barcelona Dental Council", "Catalonia Dental Board", "Barcelona Dental Licensing Authority", "Barcelona Regional Dental Office", "Barcelona Dental Examining Commission", "Barcelona Public Health Dental", "Barcelona Dental Jurisdiction Board", "Barcelona Central Dental Authority", "Barcelona Dental Association", "Spanish General Dental - Barcelona"],
      "Valencia": ["Valencia Dental Council", "Valencian Community Dental Board", "Valencia Dental Licensing Authority", "Valencia Regional Dental Office", "Valencia Dental Examining Commission", "Valencia Public Health Dental", "Valencia Dental Jurisdiction Board", "Valencia Central Dental Authority", "Valencia Dental Association", "Spanish General Dental - Valencia"],
      "Seville": ["Seville Dental Council", "Andalusia Dental Board", "Seville Dental Licensing Authority", "Seville Regional Dental Office", "Seville Dental Examining Commission", "Seville Public Health Dental", "Seville Dental Jurisdiction Board", "Seville Central Dental Authority", "Seville Dental Association", "Spanish General Dental - Seville"],
      "Zaragoza": ["Zaragoza Dental Council", "Aragon Dental Board", "Zaragoza Dental Licensing Authority", "Zaragoza Regional Dental Office", "Zaragoza Dental Examining Commission", "Zaragoza Public Health Dental", "Zaragoza Dental Jurisdiction Board", "Zaragoza Central Dental Authority", "Zaragoza Dental Association", "Spanish General Dental - Zaragoza"]
    }
  },
  TR: {
    name: "Turkey",
    cities: {
      "Istanbul": ["Istanbul Dental Council", "Marmara Dental Board", "Istanbul Dental Licensing Authority", "Istanbul Regional Dental Office", "Istanbul Dental Examining Commission", "Istanbul Public Health Dental", "Istanbul Dental Jurisdiction Board", "Istanbul Central Dental Authority", "Istanbul Dental Association", "Turkish Dental Association - Istanbul"],
      "Ankara": ["Ankara Dental Council", "Central Anatolia Dental Board", "Ankara Dental Licensing Authority", "Ankara Regional Dental Office", "Ankara Dental Examining Commission", "Ankara Public Health Dental", "Ankara Dental Jurisdiction Board", "Ankara Central Dental Authority", "Ankara Dental Association", "Turkish Dental Association - Ankara"],
      "Izmir": ["Izmir Dental Council", "Aegean Dental Board", "Izmir Dental Licensing Authority", "Izmir Regional Dental Office", "Izmir Dental Examining Commission", "Izmir Public Health Dental", "Izmir Dental Jurisdiction Board", "Izmir Central Dental Authority", "Izmir Dental Association", "Turkish Dental Association - Izmir"],
      "Bursa": ["Bursa Dental Council", "Bursa Regional Dental Board", "Bursa Dental Licensing Authority", "Bursa Regional Dental Office", "Bursa Dental Examining Commission", "Bursa Public Health Dental", "Bursa Dental Jurisdiction Board", "Bursa Central Dental Authority", "Bursa Dental Association", "Turkish Dental Association - Bursa"],
      "Antalya": ["Antalya Dental Council", "Mediterranean Dental Board", "Antalya Dental Licensing Authority", "Antalya Regional Dental Office", "Antalya Dental Examining Commission", "Antalya Public Health Dental", "Antalya Dental Jurisdiction Board", "Antalya Central Dental Authority", "Antalya Dental Association", "Turkish Dental Association - Antalya"]
    }
  },
  AL: {
    name: "Albania",
    cities: {
      "Tirana": ["Tirana Dental Council", "Albanian National Dental Board", "Tirana Dental Licensing Authority", "Tirana Regional Dental Office", "Tirana Dental Examining Commission", "Tirana Public Health Dental", "Tirana Dental Jurisdiction Board", "Tirana Central Dental Authority", "Tirana Dental Association", "Albanian Order of Dentists - Tirana"],
      "Durrës": ["Durrës Dental Council", "Durrës Regional Dental Board", "Durrës Dental Licensing Authority", "Durrës Regional Dental Office", "Durrës Dental Examining Commission", "Durrës Public Health Dental", "Durrës Dental Jurisdiction Board", "Durrës Central Dental Authority", "Durrës Dental Association", "Albanian Order of Dentists - Durrës"],
      "Vlorë": ["Vlorë Dental Council", "Vlorë Regional Dental Board", "Vlorë Dental Licensing Authority", "Vlorë Regional Dental Office", "Vlorë Dental Examining Commission", "Vlorë Public Health Dental", "Vlorë Dental Jurisdiction Board", "Vlorë Central Dental Authority", "Vlorë Dental Association", "Albanian Order of Dentists - Vlorë"],
      "Shkodër": ["Shkodër Dental Council", "Shkodër Regional Dental Board", "Shkodër Dental Licensing Authority", "Shkodër Regional Dental Office", "Shkodër Dental Examining Commission", "Shkodër Public Health Dental", "Shkodër Dental Jurisdiction Board", "Shkodër Central Dental Authority", "Shkodër Dental Association", "Albanian Order of Dentists - Shkodër"],
      "Elbasan": ["Elbasan Dental Council", "Elbasan Regional Dental Board", "Elbasan Dental Licensing Authority", "Elbasan Regional Dental Office", "Elbasan Dental Examining Commission", "Elbasan Public Health Dental", "Elbasan Dental Jurisdiction Board", "Elbasan Central Dental Authority", "Elbasan Dental Association", "Albanian Order of Dentists - Elbasan"]
    }
  },
  PT: {
    name: "Portugal",
    cities: {
      "Lisbon": ["Lisbon Dental Council", "Portuguese Dental Board", "Lisbon Dental Licensing Authority", "Lisbon Regional Dental Office", "Lisbon Dental Examining Commission", "Lisbon Public Health Dental", "Lisbon Dental Jurisdiction Board", "Lisbon Central Dental Authority", "Lisbon Dental Association", "Portuguese Order of Dentists - Lisbon"],
      "Porto": ["Porto Dental Council", "Northern Portugal Dental Board", "Porto Dental Licensing Authority", "Porto Regional Dental Office", "Porto Dental Examining Commission", "Porto Public Health Dental", "Porto Dental Jurisdiction Board", "Porto Central Dental Authority", "Porto Dental Association", "Portuguese Order of Dentists - Porto"],
      "Amadora": ["Amadora Dental Council", "Amadora Regional Dental Board", "Amadora Dental Licensing Authority", "Amadora Regional Dental Office", "Amadora Dental Examining Commission", "Amadora Public Health Dental", "Amadora Dental Jurisdiction Board", "Amadora Central Dental Authority", "Amadora Dental Association", "Portuguese Order of Dentists - Amadora"],
      "Braga": ["Braga Dental Council", "Braga Regional Dental Board", "Braga Dental Licensing Authority", "Braga Regional Dental Office", "Braga Dental Examining Commission", "Braga Public Health Dental", "Braga Dental Jurisdiction Board", "Braga Central Dental Authority", "Braga Dental Association", "Portuguese Order of Dentists - Braga"],
      "Setúbal": ["Setúbal Dental Council", "Setúbal Regional Dental Board", "Setúbal Dental Licensing Authority", "Setúbal Regional Dental Office", "Setúbal Dental Examining Commission", "Setúbal Public Health Dental", "Setúbal Dental Jurisdiction Board", "Setúbal Central Dental Authority", "Setúbal Dental Association", "Portuguese Order of Dentists - Setúbal"]
    }
  }
} as const;

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
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
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
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
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
                <SelectTrigger className="h-14! w-full rounded-xl border-border bg-card px-4 py-0">
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
            className="h-14 rounded-xl border-border bg-card px-4 py-0"
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
