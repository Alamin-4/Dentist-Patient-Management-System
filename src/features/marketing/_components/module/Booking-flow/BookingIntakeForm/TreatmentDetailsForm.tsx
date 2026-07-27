"use client";

import { useEffect, useState, useRef } from "react";
import { CalendarDays } from "lucide-react";
import { getBookingData, updateTreatmentDetails } from "@/lib/storage/bookingService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MiniCalendar from "@/app/(marketing)/schedule/_components/MiniCalendar";
import { format, parseISO, isValid } from "date-fns";

export const treatmentDetailsSchema = z.object({
  budget: z.string().min(1, "Budget is required").refine((val) => {
    const parsed = Number(val.replace(/,/g, ""));
    return !isNaN(parsed) && parsed > 0;
  }, {
    message: "Approximate budget must be a valid positive number",
  }),
  travelFrom: z.string().min(1, "Start travel date is required"),
  travelTo: z.string().min(1, "End travel date is required"),
}).refine((data) => {
  if (data.travelFrom && data.travelTo) {
    return new Date(data.travelTo) >= new Date(data.travelFrom);
  }
  return true;
}, {
  message: "End travel date must be on or after start travel date",
  path: ["travelTo"],
});

type TreatmentDetailsFormValues = z.infer<typeof treatmentDetailsSchema>;

interface TreatmentDetailsFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function TreatmentDetailsForm({
  errors: parentErrors = {},
  setErrors,
}: TreatmentDetailsFormProps) {
  const initialData = getBookingData();

  const {
    register,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<TreatmentDetailsFormValues>({
    resolver: zodResolver(treatmentDetailsSchema),
    defaultValues: {
      budget: initialData.budget || "",
      travelFrom: initialData.travelFrom || "",
      travelTo: initialData.travelTo || "",
    },
    mode: "onChange",
  });

  // Explicitly register custom calendar fields with React Hook Form
  useEffect(() => {
    register("travelFrom");
    register("travelTo");
  }, [register]);

  // Watch values to update booking storage draft
  const budgetVal = watch("budget");
  const travelFromVal = watch("travelFrom");
  const travelToVal = watch("travelTo");

  useEffect(() => {
    updateTreatmentDetails({
      budget: budgetVal || "",
      travelFrom: travelFromVal || "",
      travelTo: travelToVal || "",
    });

    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        if (budgetVal) delete copy.budget;
        if (travelFromVal) delete copy.travelFrom;
        if (travelToVal) delete copy.travelTo;
        return copy;
      });
    }
  }, [budgetVal, travelFromVal, travelToVal, setErrors]);

  const activeErrors = { ...formErrors, ...parentErrors };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        Help us create your estimate comparison
      </h2>

      <div className="space-y-6">
        {/* Budget */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            Approximate budget
          </label>
          <div
            className={`flex items-center h-14 w-full border rounded-lg overflow-hidden transition-colors ${activeErrors.budget
              ? "border-red-500 ring-2 ring-red-100/50"
              : "border-[#E5E7EB] focus-within:border-[#113254]"
              }`}
          >
            <div className="flex items-center justify-center w-12 h-full bg-[#F9FAFB] border-r border-[#E5E7EB] shrink-0">
              <span className="text-[#9CA3AF] font-medium">$</span>
            </div>
            <input
              type="text"
              placeholder="10,500"
              {...register("budget")}
              className="flex-1 px-4 h-full outline-none text-[#1A1A2E] font-semibold text-[16px] bg-white"
            />
          </div>
          {activeErrors.budget && (
            <p className="text-xs text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {String(activeErrors.budget.message || activeErrors.budget)}
            </p>
          )}
        </div>

        {/* Travel dates */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            When are you planning to travel?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <DateInput
                placeholder="Start travel date"
                value={travelFromVal}
                onChange={(val) => setValue("travelFrom", val, { shouldValidate: true })}
                hasError={!!activeErrors.travelFrom}
              />
              {activeErrors.travelFrom && (
                <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {String(activeErrors.travelFrom.message || activeErrors.travelFrom)}
                </p>
              )}
            </div>
            <div>
              <DateInput
                placeholder="End travel date"
                value={travelToVal}
                onChange={(val) => setValue("travelTo", val, { shouldValidate: true })}
                hasError={!!activeErrors.travelTo}
              />
              {activeErrors.travelTo && (
                <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {String(activeErrors.travelTo.message || activeErrors.travelTo)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInput({
  placeholder,
  value,
  onChange,
  hasError,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside detection to close calendar popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dateValue = value ? parseISO(value) : null;
  const displayString = dateValue && isValid(dateValue) ? format(dateValue, "MMM dd, yyyy") : "";

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD for standard form inputs
      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-between h-14 border rounded-lg transition-colors cursor-pointer px-5 bg-white ${hasError
          ? "border-red-500 ring-2 ring-red-100/50"
          : "border-[#E5E7EB] hover:border-[#CBD5E1] focus-within:border-[#113254]"
          }`}
      >
        <span className={`text-[15px] font-semibold ${displayString ? "text-[#1A1A2E]" : "text-[#9CA3AF]"}`}>
          {displayString || placeholder}
        </span>
        <CalendarDays className="w-5 h-5 text-[#6B7280]" />
      </div>

      {isOpen && (
        <div className="absolute bottom-15 left-0 z-50 bg-white border border-slate-200 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <MiniCalendar
            selected={dateValue}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
