"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDentistDirectoryDetail } from "@/hooks/dentist/useDentistDirectory";
import ProfilePageSkeleton from "@/features/marketing/find-dentists-page-components/DentistProfile/profile-page-skeleton";
import DentistNotFound from "./not-found";

const DentistProfile = dynamic(
  () =>
    import("@/features/marketing/find-dentists-page-components/DentistProfile/ProfilePage"),
  { ssr: false },
);

export default function ViewDentistProfile() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);

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
      specialty: d.specialty || "",
      rating: combinedRating ?? 0,
      reviewCount,
      image: d.image || "",
      location: d.fullAddress || d.city || "",
      city: d.city || "",
      country: d.country || "",
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
      bio: d.description || d.bio || "N/A",
      googleRating: googleRating ?? combinedRating ?? 0,
      googleReviewCount: reviewCount,
      dentistLicense: d.dentistLicense,
      dentistOperations: d.dentistOperations,
      materials: d.materials || [],
      backendId: d.backendId,
      claimedByUserId: d.claimedByUserId,
      userId: d.userId,
    };
  }, [directoryDetailResponse]);

  if (!mounted || isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !mappedDentist) {
    return <DentistNotFound />;
  }

  return (
    <main>
      <DentistProfile dentist={mappedDentist} />
    </main>
  );
}
