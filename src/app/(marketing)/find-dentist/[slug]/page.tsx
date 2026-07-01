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
    const googleRating: number | null = d.googleRating ?? null;
    const doctoraliaRating: number | null = d.doctoraliaRating ?? null;
    const combinedRating: number | null =
      googleRating != null && doctoraliaRating != null
        ? (googleRating + doctoraliaRating) / 2
        : googleRating ?? doctoraliaRating ?? null;
    const reviewCount = d.googleReviewCount ?? d.doctoraliaReviewCount ?? 0;

    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty || "General Dentist",
      rating: combinedRating ?? 0,
      reviewCount,
      image: d.image || "/images/man-avatar.png",
      location: d.fullAddress || d.city || "Mexico",
      city: d.city || "",
      country: d.country || "Mexico",
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      price: d.price || 0,
      rdvScore: d.rdvScore || 0,
      verified: d.status === "VERIFIED",
      status: d.status,
      isClaimable: d.isClaimable,
      profileType: d.profileType || "CLAIMABLE",
      procedures: d.procedures || [],
      languages: d.languages || [],
      bio: d.description || d.bio || `Dr. ${d.name} is a highly dedicated professional specializing in ${d.specialty || "dentistry"} at ${d.clinicName || "their local clinic"}. Located in ${d.city || "Mexico"}, they are committed to providing outstanding dental care.`,
      googleRating: googleRating ?? combinedRating ?? 0,
      googleReviewCount: reviewCount,
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
