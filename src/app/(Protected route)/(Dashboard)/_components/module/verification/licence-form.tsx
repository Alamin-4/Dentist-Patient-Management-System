"use client";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "Please select a city"),
  authority: z.string().min(1, "Please select a registration authority"),
  regNo: z.string().min(3, "Registration number is required"),
});

type FormData = z.infer<typeof formSchema>;

export function LicenceForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      city: "",
      authority: "",
      regNo: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Country - Controlled via Controller for Select */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "h-14 border-gray-200",
                    errors.country && "border-red-500",
                  )}
                >
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>

        {/* City - Controlled via Controller for Select */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "h-14 border-gray-200",
                    errors.city && "border-red-500",
                  )}
                >
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Authority - Controlled via Controller for Select */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">
            Registration Authority
          </Label>
          <Controller
            name="authority"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(
                    "h-14 border-gray-200",
                    errors.authority && "border-red-500",
                  )}
                >
                  <SelectValue placeholder="Select Authority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cmb">California Medical Board</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.authority && (
            <p className="text-xs text-red-500">{errors.authority.message}</p>
          )}
        </div>

        {/* Registration No - Standard register for Input */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-gray-700">
            Registration No
          </Label>
          <Input
            {...register("regNo")}
            placeholder="e.g. CA-123456"
            className={cn(
              "h-14 border-gray-200 px-4",
              errors.regNo && "border-red-500",
            )}
          />
          {errors.regNo && (
            <p className="text-xs text-red-500">{errors.regNo.message}</p>
          )}
        </div>
      </div>

      <div className="flex pt-2">
        <Button
          type="submit"
          className="h-12 w-32 bg-[#163E5C] font-bold text-white hover:bg-[#113149]"
        >
          Verify
        </Button>
      </div>
    </form>
  );
}
