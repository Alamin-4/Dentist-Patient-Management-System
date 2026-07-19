"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { getBookingData, updateTreatmentDetails } from "@/lib/storage/bookingService";

interface TreatmentDetailsFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function TreatmentDetailsForm({
  errors = {},
  setErrors,
}: TreatmentDetailsFormProps) {
  const initialData = getBookingData();
  const [budget, setBudget] = useState(initialData.budget);
  const [travelFrom, setTravelFrom] = useState(initialData.travelFrom);
  const [travelTo, setTravelTo] = useState(initialData.travelTo);

  const handleBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value);
    updateTreatmentDetails({ budget: e.target.value });
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.budget;
        return copy;
      });
    }
  };

  const handleTravelFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTravelFrom(e.target.value);
    updateTreatmentDetails({ travelFrom: e.target.value });
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.travelFrom;
        return copy;
      });
    }
  };

  const handleTravelTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTravelTo(e.target.value);
    updateTreatmentDetails({ travelTo: e.target.value });
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.travelTo;
        return copy;
      });
    }
  };

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
            className={`flex items-center h-14 w-full border rounded-lg overflow-hidden transition-colors ${
              errors.budget
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
              value={budget}
              onChange={handleBudget}
              className="flex-1 px-4 h-full outline-none text-[#1A1A2E] font-semibold text-[16px] bg-white"
            />
          </div>
          {errors.budget && (
            <p className="text-xs text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.budget}
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
                placeholder="06/10/2025"
                value={travelFrom}
                onChange={handleTravelFrom}
                hasError={!!errors.travelFrom}
              />
              {errors.travelFrom && (
                <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {errors.travelFrom}
                </p>
              )}
            </div>
            <div>
              <DateInput
                placeholder="24/10/2025"
                value={travelTo}
                onChange={handleTravelTo}
                hasError={!!errors.travelTo}
              />
              {errors.travelTo && (
                <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {errors.travelTo}
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center h-14 border rounded-lg transition-colors ${
        hasError
          ? "border-red-500 ring-2 ring-red-100/50"
          : "border-[#E5E7EB] focus-within:border-[#113254]"
      }`}
    >
      <input
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full px-5 pr-12 outline-none text-[#1A1A2E] font-semibold text-[16px] bg-transparent cursor-pointer"
      />
      <CalendarDays className="absolute right-4 w-5 h-5 text-[#6B7280] pointer-events-none" />
    </div>
  );
}
