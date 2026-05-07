"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import MatchFound from "./match-found";

const formSchema = z.object({
  country: z.string().min(1),
  city: z.string().min(1),
  authority: z.string().min(1),
  regNo: z.string().min(1),
});

export default function VerifyPage() {
  const [isVerified, setIsVerified] = useState(false);
  const { control, register } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "USA",
      city: "California",
      authority: "California Medical Board",
      regNo: "CA-123456",
    },
  });

  return (
    <div className="max-w-360 w-11/12 mx-auto py-20 space-y-32">
      {/* STEP 1: LICENCE VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="text-[#10436B] text-xs font-bold uppercase tracking-widest">
            Step 1
          </span>
          <h2 className="text-[32px] font-bold text-[#10436B] mt-2">
            Verify your dental licence
          </h2>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-14! border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">USA</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">City</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-14! border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="California">California</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Registration Authority
              </Label>
              <Controller
                name="authority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-14! border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="California Medical Board">
                        California Medical Board
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium">
                Registration No
              </Label>
              <Input {...register("regNo")} className="h-14! border-gray-200" />
            </div>
          </div>

          {/* This only appears when the form is "processed" */}
          <div className="mt-4">
            <MatchFound
              doctorName="Dr. Alex Hemsworth"
              specialty="Orthodontist"
            />
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-100 w-full" />

      {/* STEP 2: HEADSHOT UPLOAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <span className="text-[#10436B] text-xs font-bold uppercase tracking-widest">
            Step 2
          </span>
          <h2 className="text-[32px] font-bold text-[#10436B] mt-2">
            Upload your professional headshot
          </h2>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center gap-10">
            <div className="w-[140px] h-[140px] rounded-full overflow-hidden bg-gray-100">
              <img
                src="/doctor-placeholder.png"
                alt="Headshot"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="px-10 py-3 rounded-xl border-2 border-[#10436B] text-[#10436B] font-bold hover:bg-gray-50 transition-all">
              Re-Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
