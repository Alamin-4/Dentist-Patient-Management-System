"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  getBookingData,
  updateDentalHistory,
} from "@/lib/storage/bookingService";

const conditions = [
  "Bone loss",
  "Allergies",
  "Gum Disease",
  "TMJ Disorder",
  "Dental Anxiety",
  "Bruxism",
  "None of them",
];

const lastVisitOptions = [
  { value: "MONTH_6", label: "Less than 6 months ago" },
  { value: "MONTH_12", label: "6-12 months ago" },
  { value: "YEAR_1_PLUS", label: "Over a year ago" },
];

interface DentalHistoryFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function DentalHistoryForm({
  errors = {},
  setErrors,
}: DentalHistoryFormProps) {
  const initialHistory = getBookingData().dentalHistory;
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    initialHistory.conditions.length > 0
      ? initialHistory.conditions
      : ["Bone loss"],
  );
  const [lastVisit, setLastVisit] = useState(initialHistory.lastVisit);
  const [additionalInfo, setAdditionalInfo] = useState(
    initialHistory.additionalInfo,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsTouched(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCondition = (item: string) => {
    let updated: string[];
    if (item === "None of them") {
      updated = ["None of them"];
      setSelectedConditions(updated);
    } else {
      const filtered = selectedConditions.filter((c) => c !== "None of them");
      if (filtered.includes(item)) {
        updated = filtered.filter((c) => c !== item);
      } else {
        updated = [...filtered, item];
      }
      setSelectedConditions(updated);
    }
    updateDentalHistory({ conditions: updated });
  };

  const handleSelectOption = (value: string) => {
    setLastVisit(value);
    updateDentalHistory({ lastVisit: value });
    setIsDropdownOpen(false);
    setIsTouched(true);
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.lastVisit;
        return copy;
      });
    }
  };

  const handleAdditionalInfoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setAdditionalInfo(value);
    updateDentalHistory({ additionalInfo: value });
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.additionalInfo;
        return copy;
      });
    }
  };

  const hasLastVisitError = !!errors.lastVisit || (isTouched && !lastVisit);
  const lastVisitErrorMessage = errors.lastVisit || "Please select a time period";

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-text mb-8">
        Tell us about your dental history
      </h2>

      <div className="space-y-8">
        {/* Last Visit Select */}
        <div className="flex flex-col gap-3">
          <label className="text-[15px] font-medium text-sec-text">
            When did you last visit a dentist?
            <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsTouched(true);
              }}
              className={`w-full h-14 pl-5 pr-12 text-left bg-white border rounded-lg outline-none transition-all flex items-center justify-between cursor-pointer ${hasLastVisitError
                ? "border-red-500 ring-2 ring-red-100/50"
                : isDropdownOpen
                  ? "border-[#113254] ring-2 ring-[#113254]/5"
                  : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                } ${lastVisit ? "text-text font-medium" : "text-[#9CA3AF]"}`}
            >
              <span>
                {lastVisit
                  ? lastVisitOptions.find((opt) => opt.value === lastVisit)
                    ?.label || lastVisit
                  : "Select time period"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#113254]" : ""
                  }`}
              />
            </button>

            {hasLastVisitError && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {lastVisitErrorMessage}
              </p>
            )}

            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                {lastVisitOptions.map((option) => {
                  const isSelected = lastVisit === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectOption(option.value)}
                      className={`w-full text-left px-5 py-3.5 text-[15px] transition-colors flex items-center justify-between cursor-pointer ${isSelected
                        ? "bg-[#113254]/5 text-[#113254] font-semibold"
                        : "text-[#4B5563] hover:bg-slate-50 hover:text-text"
                        }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#113254]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Multi-select Pills */}
        <div className="flex flex-col gap-4">
          <label className="text-[15px] font-medium text-sec-text">
            Any existing dental conditions?
          </label>
          <div className="flex flex-wrap gap-3">
            {conditions.map((item) => {
              const isActive = selectedConditions.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleCondition(item)}
                  className={`px-6 py-2.5 rounded-full border text-[14px] font-medium transition-all
                    ${isActive
                      ? "bg-[#113254] border-[#113254] text-white"
                      : "bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]"
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-3">
          <label className="text-[15px] font-medium text-sec-text">
            Any other information to share?
          </label>
          <textarea
            placeholder="Enter here"
            value={additionalInfo}
            onChange={handleAdditionalInfoChange}
            className={`w-full min-h-32 p-5 border rounded-lg outline-none transition-all resize-none ${errors.additionalInfo
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100/50"
              : "border-[#E5E7EB] focus:border-[#113254]"
              } text-text placeholder:text-[#9CA3AF]`}
          />
          {errors.additionalInfo && (
            <p className="text-xs text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.additionalInfo}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
