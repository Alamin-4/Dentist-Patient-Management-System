"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDentistDirectoryDetail } from "@/hooks/dentist/useDentistDirectory";
import ProfilePageSkeleton from "../../_components/module/DentistAllComponents/DentistProfile/profile-page-skeleton";

const DentistProfile = dynamic(
  () =>
    import("../../_components/module/DentistAllComponents/DentistProfile/ProfilePage"),
  { ssr: false },
);

export default function ViewDentistProfile() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const slug = params?.slug as string;
  const { data: directoryDetailResponse, isLoading, isError } = useDentistDirectoryDetail(slug, mounted);

  const mappedDentist = useMemo(() => {
    if (!directoryDetailResponse?.data) return null;
    const d = directoryDetailResponse.data;
    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty || "General Dentist",
      rating: d.rating || 5.0,
      reviewCount: d.reviewCount || 0,
      image: d.image || "/placeholder-avatar.png",
      location: d.fullAddress || d.city || "Mexico",
      city: d.city || "",
      country: d.country || "Mexico",
      price: d.price || 0,
      rdvScore: d.rdvScore || 0,
      verified: d.status === "VERIFIED",
      status: d.status,
      isClaimable: d.isClaimable,
      profileType: d.profileType || "CLAIMABLE",
      procedures: d.procedures || [],
      languages: d.languages || ["English", "Spanish"],
      bio: d.description || d.bio || `Dr. ${d.name} is a highly dedicated professional specializing in ${d.specialty || "dentistry"} at ${d.clinicName || "their local clinic"}. Located in ${d.city || "Mexico"}, they are committed to providing outstanding dental care.`,
      googleRating: d.googleRating || d.rating || 5.0,
      googleReviewCount: d.googleReviewCount || d.reviewCount || 0,
      dentistLicense: d.dentistLicense,
      dentistOperations: d.dentistOperations,
      materials: d.materials || [],
      backendId: d.backendId,
    };
  }, [directoryDetailResponse]);

  if (!mounted || isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !mappedDentist) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-[#003366]">Dentist Not Found</h1>
      </div>
    );
  }

  return (
    <main>
      <DentistProfile dentist={mappedDentist} />
    </main>
  );
}
