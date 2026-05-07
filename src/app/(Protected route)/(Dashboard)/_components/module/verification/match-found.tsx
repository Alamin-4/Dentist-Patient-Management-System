"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MatchFoundProps {
  doctorName?: string;
  specialty?: string;
  imageUrl?: string;
  onConfirm?: () => void;
  onReject?: () => void;
}

export default function MatchFound({
  doctorName = "Dr. Alex Hemsworth",
  specialty = "Orthodontist",
  imageUrl = "https://i.pravatar.cc/150?u=alex", // Placeholder
  onConfirm,
  onReject,
}: MatchFoundProps) {
  return (
    <section className="w-full py-8">
      <div className="max-w-360 w-11/12 mx-auto">
        <div className="bg-[#F4F9FD] rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-[#10436B]">Match Found</h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Doctor Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
                <img
                  src={imageUrl}
                  alt={doctorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#10436B] leading-tight">
                  {doctorName}
                </h3>
                <p className="text-gray-500 font-medium">{specialty}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={onConfirm}
                className="flex-1 md:flex-none px-8 py-3.5 bg-[#10436B] text-white font-bold rounded-xl hover:bg-[#0D3658] transition-all active:scale-95 shadow-md shadow-blue-900/10"
              >
                Yes this is me
              </button>
              <button
                onClick={onReject}
                className="flex-1 md:flex-none px-8 py-3.5 bg-transparent text-[#10436B] font-bold rounded-xl border-2 border-[#10436B] hover:bg-white transition-all active:scale-95"
              >
                Not me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}