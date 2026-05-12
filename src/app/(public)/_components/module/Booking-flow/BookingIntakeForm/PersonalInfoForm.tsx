import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  getBookingData,
  updatePersonalInfo,
} from "@/lib/storage/bookingService";

export default function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const bookingData = getBookingData();
    if (bookingData.personalInfo) {
      setFormData(bookingData.personalInfo);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updatePersonalInfo(updated);
  };

  const labelStyle = "block text-[#1A1A2E] font-medium text-sm mb-2.5";
  const inputStyle =
    "w-full px-4 py-4 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113254]/10 focus:border-[#113254] placeholder-[#9EA9AA] font-normal transition-all";

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="lg:text-xl font-semibold text-[#1A1A2E] mb-8">
        Provide your personal Information
      </h2>

      <div className="space-y-6">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter Name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Name"
              value={formData.lastName}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelStyle}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="johnsmith@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className={labelStyle}>
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dateOfBirth"
            placeholder="MM/DD/YYYY"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Country Select */}
        <div>
          <label className={labelStyle}>
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`${inputStyle} appearance-none bg-white cursor-pointer`}
            >
              <option value="" disabled>
                Select Country
              </option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="mexico">Mexico</option>
              <option value="canada">Canada</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9EA9AA] pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
