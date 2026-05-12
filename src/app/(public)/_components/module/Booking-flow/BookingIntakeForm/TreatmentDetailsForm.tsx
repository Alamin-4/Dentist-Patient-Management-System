"use client";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import {
  getBookingData,
  updateTreatmentDetails,
} from "@/lib/storage/bookingService";

export default function TreatmentDetailsForm() {
  const [formData, setFormData] = useState({
    budget: "",
    treatmentDate: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const bookingData = getBookingData();
    setFormData({
      budget: bookingData.budget,
      treatmentDate: bookingData.treatmentDate,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    updateTreatmentDetails(updated);
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-8">
        When you would like to do the treatment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approximate Budget Field */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            Approximate budget
          </label>
          <div className="flex items-center h-14 w-full border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:border-[#113254] transition-colors">
            <div className="flex items-center justify-center w-12 h-full bg-[#F9FAFB] border-r border-[#E5E7EB]">
              <span className="text-[#9CA3AF] font-medium">$</span>
            </div>
            <input
              type="text"
              name="budget"
              placeholder="10,500"
              value={formData.budget}
              onChange={handleChange}
              className="flex-1 px-4 h-full outline-none text-[#1A1A2E] font-semibold text-[16px]"
            />
          </div>
        </div>

        {/* Date Field */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#4B5563]">
            Date to visit/ treatment
          </label>
          <div className="relative flex items-center h-14 w-full border border-[#E5E7EB] rounded-xl focus-within:border-[#113254] transition-colors">
            <input
              type="text"
              name="treatmentDate"
              placeholder="06/10/2025"
              value={formData.treatmentDate}
              onChange={handleChange}
              className="w-full h-full px-5 outline-none text-[#1A1A2E] font-semibold text-[16px] bg-transparent"
            />
            <div className="absolute right-4 pointer-events-none">
              <Calendar className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
