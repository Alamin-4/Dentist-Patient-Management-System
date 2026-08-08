"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const isClaimed = dentist.status === "CLAIMED" || dentist.status === "VERIFIED";
  const showPlaceholder = !dentist.verified && activeTab !== "overview";

  return (
    <main className="min-h-dvh bg-[#F8FAFC]">
      <div className="mx-auto max-w-320 w-11/12 py-8 lg:py-12">
        <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-6 items-start">
          <div className="w-full lg:flex-1 min-w-0 space-y-5">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {showPlaceholder ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center space-y-5 shadow-sm">
                <div className="mx-auto size-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <ShieldAlert className="size-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-primary">
                    {isClaimed ? "Verification Pending" : "Profile Not Yet Claimed"}
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    {isClaimed
                      ? `Dr. ${dentist.name} has claimed this profile. Verified details are currently being reviewed by the RatedDocs verification team.`
                      : `Verified pricing, sterilisation protocols, and material certifications will be published once Dr. ${dentist.name} claims this profile and completes the RatedDocs 3-phase verification.`
                    }
                  </p>
                </div>

              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    {dentist.bio && dentist.bio !== "N/A" && (
                      <AboutSection name={dentist.name} bio={dentist.bio} />
                    )}

                    {dentist.verified && dentist.procedures && dentist.procedures.length > 0 && dentist.procedures.some((p: any) => p && typeof p === 'object' && 'price' in p) && (
                      <PricingSection procedures={dentist.procedures} />
                    )}

                    <ReviewSection
                      slug={dentist.slug}
                      dentist={dentist}
                      googleRating={dentist.googleRating}
                      googleReviewCount={dentist.googleReviewCount}
                      isReviewModalOpen={isReviewModalOpen}
                      setIsReviewModalOpen={setIsReviewModalOpen}
                      onSeeAllReviews={() => setActiveTab("reviews")}
                    />

                    {dentist.verified && (
                      <ProtocolSection
                        dentistLicense={dentist.dentistLicense}
                        dentistOperations={dentist.dentistOperations}
                      />
                    )}

                    {dentist.verified && dentist.materials && dentist.materials.length > 0 && (
                      <MaterialsSection
                        procedures={dentist.procedures}
                        materials={dentist.materials}
                      />
                    )}

                    {dentist.verified && dentist.results && dentist.results.length > 0 && (
                      <ResultsSection results={dentist.results} dentistName={dentist.name} />
                    )}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <PricingSection procedures={dentist.procedures} />
                )}

                {activeTab === "reviews" && (
                  <ReviewSection
                    slug={dentist.slug}
                    dentist={dentist}
                    googleRating={dentist.googleRating}
                    googleReviewCount={dentist.googleReviewCount}
                    isReviewModalOpen={isReviewModalOpen}
                    setIsReviewModalOpen={setIsReviewModalOpen}
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

                {activeTab === "results" && (
                  <ResultsSection results={dentist.results} dentistName={dentist.name} />
                )}
              </>
            )}
          </div>

          <div className="w-full lg:max-w-xs lg:shrink-0">
            <BookingSidebar dentist={dentist} />
          </div>
        </div>
      </div>
    </main>
  );
}
