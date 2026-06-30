"use client";

import { useState } from "react";
import ProfileTabs, { type ProfileTab } from "./ProfileTabs";
import AboutSection from "./AboutSection";
import ReviewSection from "./ReviewSection";
import ProtocolSection from "./ProtocolSection";
import PricingSection from "./PricingSection";
import MaterialsSection from "./MaterialsSection";
import ResultsSection from "./ResultsSection";
import BookingSidebar from "./BookingSidebar";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DentistProfilePage({ dentist }: { dentist: any }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const showPlaceholder = !dentist.verified && activeTab !== "overview";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-400 w-11/12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Left Column */}
          <div className="w-full lg:flex-1 min-w-0 space-y-5">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "overview" && (
              <AboutSection name={dentist.name} bio={dentist.bio} />
            )}

            {showPlaceholder ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center space-y-5 shadow-sm">
                <div className="mx-auto size-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <ShieldAlert className="size-8 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#0E3E65]">Verification Pending</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Verified pricing, sterilisation protocols, and material certifications will be published once Dr. {dentist.name} claims this profile and completes the RatedDocs 3-phase verification.
                  </p>
                </div>
                {dentist.status === "UNVERIFIED" && dentist.isClaimable && (
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-sm transition-colors"
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.set("claim", "true");
                        window.history.pushState({}, "", url.toString());
                        window.dispatchEvent(new Event("popstate"));
                      }}
                    >
                      Are you Dr. {dentist.name}? Claim Profile
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {activeTab === "pricing" && <PricingSection procedures={dentist.procedures} />}
                {activeTab === "reviews" && (
                  <ReviewSection
                    googleRating={dentist.googleRating}
                    googleReviewCount={dentist.googleReviewCount}
                  />
                )}
                {activeTab === "protocols" && (
                  <ProtocolSection
                    dentistLicense={dentist.dentistLicense}
                    dentistOperations={dentist.dentistOperations}
                  />
                )}
                {activeTab === "materials" && (
                  <MaterialsSection
                    procedures={dentist.procedures}
                    materials={dentist.materials}
                  />
                )}
                {activeTab === "results" && <ResultsSection />}
              </>
            )}
          </div>

          {/* Right Column — sticky sidebar */}
          <div className="w-full lg:w-110 lg:shrink-0">
            <BookingSidebar dentist={dentist} />
          </div>
        </div>
      </div>
    </main>
  );
}
