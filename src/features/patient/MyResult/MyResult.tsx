"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { MapPin, ImagePlus, Loader2, UserCheck } from "lucide-react";
import { AddPhotoModal } from "./AddNewPhoto";
import { normalizeApiError } from "@/api/error-handler";

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

  const { data: results = [], isLoading, error } = useQuery<PatientResult[], Error>({
    queryKey: ["patient-results"],
    queryFn: async () => {
      const response = await apiClient.patients.getResults();
      const apiData = response?.data || response;
      return Array.isArray(apiData) ? apiData : [];
    },
    retry: false,
  });

  const apiError = error ? normalizeApiError(error) : null;
  const isPersonalizationMissing =
    apiError?.statusCode === 404 ||
    apiError?.message?.includes("personalization") ||
    apiError?.message?.includes("profile not found");

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8">My Result</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0F3659] animate-spin" />
          <p className="text-sm text-slate-500 mt-2">Loading results...</p>
        </div>
      ) : isPersonalizationMissing ? (
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-slate-50/50 border border-slate-100 rounded-3xl max-w-xl mx-auto my-12 space-y-6 shadow-sm">
          <div className="size-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F3659]">
            <UserCheck className="size-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Profile Personalization Required</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              Please complete your profile personalization details first so we can track and display your dental treatment results correctly.
            </p>
          </div>
          <Link
            href="/patient/settings"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#0F3659] text-white font-bold text-sm hover:bg-[#0a2640] transition-colors shadow-md shadow-[#0F3659]/10"
          >
            Complete Personalization
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Result Cards */}
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
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
            className="group border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 h-80 bg-[#F8FAFC]/50 hover:bg-slate-50 hover:border-[#0F3659] transition-all cursor-pointer shadow-sm"
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
