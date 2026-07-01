"use client";

import { useMe } from "@/hooks/auth/useAuth";
import { BasicDetailsCard } from "./basic-details-card";
import { PricingPlaceholder } from "./pricing-placeholder";
import { ProfileHeader } from "./profile-header";
import { ReviewsPlaceholder } from "./reviews-placeholder";
import { VerificationSidebar } from "./verification-sidebar";
import useDentist from "@/hooks/dentist/useDentist";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

export default function DentistProfilePage() {
  const { user } = useMe();
  const { dentistProfile } = useDentist();
  const { rdvScore } = useVerificationProgress();
  if (dentistProfile.isPending) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">

        <div className="h-36 w-full bg-gray-100/70 rounded-lg"></div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            <div className="h-48 w-full bg-gray-100/70 rounded-lg"></div>
            <div className="h-64 w-full bg-gray-100/70 rounded-lg"></div>
            <div className="h-40 w-full bg-gray-100/70 rounded-lg"></div>
          </div>
          <div className="h-[450px] w-full bg-gray-100/70 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (dentistProfile.isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Failed to load profile</h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          We encountered an error loading your dentist profile. Please refresh the page or try again later.
        </p>
        <button
          onClick={() => dentistProfile.refetch()}
          className="mt-6 rounded-lg bg-[#163E5C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#113149] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const dentist = dentistProfile.data?.data?.dentist;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section: Full Width Header */}
      <div className="w-full">
        <ProfileHeader dentist={dentist} rdvScore={rdvScore} />
      </div>

      {/* Main Content: Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Details, Pricing, and Reviews */}
        <div className="flex flex-col gap-6">
          <BasicDetailsCard dentist={dentist} />
          <PricingPlaceholder dentist={dentist} />
          <ReviewsPlaceholder dentist={dentist} />
        </div>

        {/* Right Column: Verification Sidebar */}
        <aside className="sticky top-6">
          <VerificationSidebar />
        </aside>
      </div>
    </div>
  );
}
