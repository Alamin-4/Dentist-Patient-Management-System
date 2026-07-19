"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { MapPin, ImagePlus, Loader2 } from "lucide-react";
import { AddPhotoModal } from "./AddNewPhoto";

export interface PatientResult {
  id: string | number;
  title: string;
  doctor: string;
  location: string;
  beforeImg: string;
  afterImg: string;
}

export default function MyResultPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: results = [], isLoading } = useQuery<PatientResult[]>({
    queryKey: ["patient-results"],
    queryFn: async () => {
      try {
        const response = await apiClient.patients.getResults();
        const apiData = response?.data || response;
        return Array.isArray(apiData) ? apiData : [];
      } catch (err) {
        console.warn("Patient Results API route not found or ready:", err);
        return [];
      }
    },
  });

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8">My Result</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0F3659] animate-spin" />
          <p className="text-sm text-slate-500 mt-2">Loading results...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Result Cards */}
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="flex h-48 w-full bg-slate-50">
                <div className="relative w-1/2 h-full">
                  <Image
                    src={result.beforeImg}
                    alt="Before"
                    fill
                    className="object-cover border-r border-white/20"
                  />
                </div>
                <div className="relative w-1/2 h-full">
                  <Image
                    src={result.afterImg}
                    alt="After"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-5 space-y-1">
                <h3 className="text-xl font-bold text-[#1A1A2E]">
                  {result.title}
                </h3>
                <p className="text-slate-400 font-medium text-sm">
                  {result.doctor}
                </p>
                <div className="pt-3 border-t border-slate-50 mt-3 flex items-center gap-1.6 text-[#0F3659]">
                  <MapPin className="size-4" />
                  <span className="text-sm font-semibold">{result.location}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Photo Trigger */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 h-[320px] bg-[#F8FAFC]/50 hover:bg-slate-50 hover:border-[#0F3659] transition-all cursor-pointer"
          >
            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
              <ImagePlus className="size-6 text-[#0F3659]" />
            </div>
            <span className="text-[#0F3659] font-bold text-lg">
              Add New Photo
            </span>
          </button>
        </div>
      )}

      <AddPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
