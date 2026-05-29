"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDaysIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  treatment: z.string().min(1, "Treatment is required"),
  budget: z.string().optional(),
  travelFrom: z.string().optional(),
  travelTo: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "India",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "Singapore",
  "UAE",
  "Saudi Arabia",
  "Nigeria",
  "South Africa",
  "New Zealand",
  "Netherlands",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const TREATMENTS = [
  "Dental Implants",
  "Teeth Whitening",
  "Veneers",
  "Orthodontics / Braces",
  "Invisalign",
  "Root Canal",
  "Crowns & Bridges",
  "Dentures",
  "Gum Treatment",
  "Tooth Extraction",
  "General Checkup",
];

// ─── Internal helpers ─────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-sm font-medium text-foreground">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </span>
  );
}

function DateInputField({
  hasError,
  placeholder = "MM/DD/YYYY",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        className={cn("!h-12 rounded-xl pr-10", hasError && "border-destructive", className)}
        {...props}
      />
      <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PersonalizeComparisonModal() {
  const {
    showPersonalizeModal,
    setShowPersonalizeModal,
    setShowCompareModal,
  } = useStateContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { budget: "", travelFrom: "", travelTo: "" },
  });

  const openCompare = () => {
    setShowPersonalizeModal(false);
    setShowCompareModal(true);
  };

  return (
    <Dialog open={showPersonalizeModal} onOpenChange={setShowPersonalizeModal}>
      <DialogContent className="sm:max-w-[590px] gap-6 p-8 rounded-xl">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-bold font-heading text-foreground leading-tight">
            Personalize your comparison
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Tell us a little about your needs so we can highlight what matters
            most across your 3 selected dentists.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(openCompare)} noValidate>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>First Name</FieldLabel>
              <Input
                placeholder="Enter Name"
                className={cn("!h-12 rounded-xl", errors.firstName && "border-destructive")}
                {...register("firstName")}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Last Name</FieldLabel>
              <Input
                placeholder="Enter Name"
                className={cn("!h-12 rounded-xl", errors.lastName && "border-destructive")}
                {...register("lastName")}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Phone Number</FieldLabel>
              <Input
                type="tel"
                placeholder="Enter Phone Number"
                className={cn("!h-12 rounded-xl", errors.phoneNumber && "border-destructive")}
                {...register("phoneNumber")}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Country</FieldLabel>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "w-full !h-12 rounded-xl",
                        errors.country && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Gender</FieldLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "w-full !h-12 rounded-xl",
                        errors.gender && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Date of Birth</FieldLabel>
              <DateInputField
                hasError={!!errors.dateOfBirth}
                {...register("dateOfBirth")}
              />
            </div>

            {/* Treatment */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Which treatment are you considering?</FieldLabel>
              <Controller
                name="treatment"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={cn(
                        "w-full !h-12 rounded-xl",
                        errors.treatment && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Select Procedures" />
                    </SelectTrigger>
                    <SelectContent>
                      {TREATMENTS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>What&apos;s your rough budget?</FieldLabel>
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <div className="flex h-full shrink-0 items-center border-r border-input px-3">
                  <span className="text-sm text-muted-foreground">$</span>
                </div>
                <input
                  placeholder="10,500"
                  className="h-full flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  {...register("budget")}
                />
              </div>
            </div>

            {/* Travel Dates */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <FieldLabel>When are you planning to travel?</FieldLabel>
              <div className="grid grid-cols-2 gap-4">
                <DateInputField
                  placeholder="DD/MM/YYYY"
                  {...register("travelFrom")}
                />
                <DateInputField
                  placeholder="DD/MM/YYYY"
                  {...register("travelTo")}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-base font-medium"
            >
              Show my comparison →
            </Button>
            <button
              type="button"
              onClick={openCompare}
              className="text-center text-sm font-medium text-primary hover:underline"
            >
              Skip , just show the comparison
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
