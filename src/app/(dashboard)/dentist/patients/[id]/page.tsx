"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PatientDetails from "@/app/modules/dentist/patients-manage/patient-details-page";
import { useDentistPatientDetail } from "@/hooks/dentist/useDentist";

interface PatientDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = use(params);
  const { data: responseData, isLoading, isError } = useDentistPatientDetail(id);
  const patient = responseData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 space-y-6 animate-pulse">
        {/* Back Link skeleton */}
        <div className="h-4 w-32 bg-gray-200 rounded" />
        
        {/* Header section skeleton */}
        <div className="bg-white rounded-lg border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-60 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded" />
        </div>

        {/* Details grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-60 bg-white border border-border rounded-lg" />
            <div className="h-40 bg-white border border-border rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white border border-border rounded-lg" />
            <div className="h-64 bg-white border border-border rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="p-6">
        <Link
          href="/dentist/patients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-red-800">
            Patient Record Not Found
          </h3>
          <p className="mt-2 text-sm text-red-600">
            The patient profile details could not be retrieved from the server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <PatientDetails patient={patient} />
    </div>
  );
}
