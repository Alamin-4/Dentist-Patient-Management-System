"use client";

import CustomDesText from "@/features/shared/custom-des-text";
import CustomPrimaryHeading from "@/features/shared/custom-primary-heading";
import CustomSectionHeading from "@/features/shared/custom-section-heading";
import { RealPatientReviews, TransparentPricing, TrustedExpertCare, VerifiedBadge } from "@/svg-icon/svg";
import { Users, Search, ClipboardCheck } from "lucide-react";

const trustFeatures = [
  {
    title: "Verified Dentists",
    description: "Only verified dentists make it onto RatedDocs.",
    icon: VerifiedBadge,
  },
  {
    title: "Trusted Expert Care",
    description: "Top-trained dentists. Trusted materials. Full transparency.",
    icon: TrustedExpertCare,
  },
  {
    title: "Transparent Pricing",
    description: "Transparent pricing. No surprises. Ever.",
    icon: TransparentPricing,
  },
  {
    title: "Real Patient Reviews",
    description: "Real reviews. Verified patients. Zero fake feedback.",
    icon: RealPatientReviews,
  },
];

export default function WhyTrust() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="max-w-400 w-11/12 mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12 space-y-4">
          <CustomSectionHeading value={"Why Trust RatedDocs Verified Dentists?"} center_align={true} />
          <CustomDesText value="Every dentist on RatedDocs undergoes a strict verification process,
            including license checks, to ensure your confidence when booking
            your next appointment." center_align={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {trustFeatures.map((feature, index) => (
            <div key={index} className="group space-y-3 lg:space-y-5">
              <div className="flex flex-row gap-2 items-center">
                <div className="p-1 rounded-lg">{feature.icon}</div>
                <CustomPrimaryHeading value={feature.title} />
              </div>

              <div className="space-y-2">
                <p className="text-sec-text lg:text-lg font-medium">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
