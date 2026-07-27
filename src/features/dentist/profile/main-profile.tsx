"use client";

import { useState } from "react";
import { useMe } from "@/hooks/auth/useAuth";
import { BasicDetailsCard } from "./basic-details-card";
import { PricingPlaceholder } from "./pricing-placeholder";
import { ProfileHeader } from "./profile-header";
import { ReviewsPlaceholder } from "./reviews-placeholder";
import { VerificationSidebar } from "./verification-sidebar";
import { ClinicalDepthCard } from "./clinical-depth-card";
import { useDentistProfileQuery } from "@/hooks/dentist/useDentist";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

export default function DentistProfilePage() {
  const { user } = useMe();
  const dentistProfile = useDentistProfileQuery();
  const { rdvScore } = useVerificationProgress();
  const [activeTab, setActiveTab] = useState<"overview" | "operations" | "clinical-depth" | "reviews">("overview");

  if (dentistProfile.isPending) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-36 w-full bg-gray-100/70 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            <div className="h-12 w-full bg-gray-100/70 rounded-lg"></div>
            <div className="h-64 w-full bg-gray-100/70 rounded-lg"></div>
          </div>
          <div className="h-75 w-full bg-gray-100/70 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (dentistProfile.isError) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
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

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "operations", label: "Operations" },
    { key: "clinical-depth", label: "Clinical Depth" },
    { key: "reviews", label: "Reviews" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 relative min-h-screen pb-16">
      {/* Top Section: Full Width Header */}
      <div className="w-full">
        <ProfileHeader dentist={dentist} rdvScore={rdvScore} />
      </div>

      {/* Main Content: Grid Layout (Full Width for Reviews Tab) */}
      <div className={activeTab === "reviews" ? "w-full" : "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"}>
        {/* Left Column: Details with Tab navigation */}
        <div className="flex flex-col gap-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-4 text-sm font-bold transition-all relative ${isActive ? "text-[#163E5C]" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#163E5C] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Component */}
          <div>
            {activeTab === "overview" && <BasicDetailsCard dentist={dentist} />}
            {activeTab === "operations" && <PricingPlaceholder dentist={dentist} />}
            {activeTab === "clinical-depth" && <ClinicalDepthCard dentist={dentist} />}
            {activeTab === "reviews" && <ReviewsPlaceholder dentist={dentist} />}
          </div>
        </div>

        {/* Right Column: Verification Sidebar */}
        {activeTab !== "reviews" && (
          <aside className="sticky top-6">
            <VerificationSidebar />
          </aside>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20ba5a] transition-all hover:scale-110 active:scale-95 duration-200"
      >
        <svg
          className="h-7 w-7 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.99L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.218h.004c5.506 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.18-2.92-7.062C17.18 3.036 14.67 2 12.012 2zm5.72 14.158c-.313.88-1.534 1.576-2.13 1.635-.596.06-1.104.287-3.71-.786-3.327-1.369-5.425-4.736-5.59-4.956-.167-.22-1.337-1.777-1.337-3.389 0-1.613.845-2.406 1.144-2.736.299-.33.653-.412.871-.412.218 0 .436.002.626.01.196.009.457-.074.717.552.26.626.892 2.179.97 2.335.078.156.13.338.026.551-.104.214-.156.345-.313.525-.156.18-.328.324-.467.487-.156.162-.318.339-.136.65.182.312.809 1.334 1.734 2.16 1.193 1.065 2.195 1.393 2.507 1.55.312.155.494.13.676-.08.182-.21.78-.909.988-1.22.208-.311.416-.26.702-.156.286.104 1.819.858 2.131 1.013.312.156.52.234.598.37.078.136.078.79-.235 1.671z" />
        </svg>
      </a>
    </div>
  );
}
