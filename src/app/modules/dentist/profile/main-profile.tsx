'use client'

import { useMe } from "@/hooks/auth/useAuth";
import { BasicDetailsCard } from "./basic-details-card";
import { PricingPlaceholder } from "./pricing-placeholder";
import { ProfileHeader } from "./profile-header";
import { ReviewsPlaceholder } from "./reviews-placeholder";
import { VerificationSidebar } from "./verification-sidebar";

export default function DentistProfilePage() {
    const { user } = useMe()
    console.log(user)
    return (
        <div className="flex flex-col gap-6 ">
            {/* Top Section: Full Width Header */}
            <div className="w-full">
                <ProfileHeader />
            </div>

            {/* Main Content: Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                {/* Left Column: Details, Pricing, and Reviews */}
                <div className="flex flex-col gap-6">
                    <BasicDetailsCard />
                    <PricingPlaceholder />
                    <ReviewsPlaceholder />
                </div>

                {/* Right Column: Verification Sidebar */}
                <aside className="sticky top-6">
                    <VerificationSidebar />
                </aside>
            </div>
        </div>
    );
}
