"use client";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { getBookingData, updatePersonalInfo } from "@/lib/storage/bookingService";
import { useMe } from "@/hooks/auth/useAuth";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Mexico",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Bangladesh",
  "Other",
];

interface PersonalInfoFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function PersonalInfoForm({
  errors = {},
  setErrors,
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(() => {
    const info = getBookingData().personalInfo || {};
    return {
      firstName: info.firstName || "",
      lastName: info.lastName || "",
      email: info.email || "",
      dateOfBirth: info.dateOfBirth || "",
      country: info.country || "",
    };
  });
  const { user } = useMe();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        dateOfBirth: "",
        country: "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updatePersonalInfo(updated);
    if (setErrors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const labelCls = "block text-[#1A1A2E] font-medium text-sm mb-2.5";
  const getInputCls = (name: string) => {
    const hasError = !!errors[name];
    return `w-full px-4 py-4 border rounded-lg focus:outline-none transition-all bg-white ${
      hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-100/50"
        : "border-[#E5E7EB] focus:ring-2 focus:ring-[#113254]/10 focus:border-[#113254]"
    } placeholder-[#9EA9AA]`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        Provide your personal Information
      </h2>

      <div className="space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter Name"
              value={formData.firstName || ""}
              onChange={handleChange}
              className={getInputCls("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className={labelCls}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Name"
              value={formData.lastName || ""}
              onChange={handleChange}
              className={getInputCls("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="johnsmith@gmail.com"
            value={formData.email || ""}
            onChange={handleChange}
            className={getInputCls("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.email}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className={labelCls}>
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              placeholder="MM/DD/YYYY"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              className={`${getInputCls("dateOfBirth")} pr-12`}
            />
            <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
          </div>
          {errors.dateOfBirth && (
            <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className={labelCls}>
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              className={`${getInputCls("country")} appearance-none cursor-pointer pr-12`}
            >
              <option value="" disabled>
                Select Country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
          </div>
          {errors.country && (
            <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              {errors.country}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
