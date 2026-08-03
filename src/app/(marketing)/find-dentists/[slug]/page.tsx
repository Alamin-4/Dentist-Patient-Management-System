"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDentistDirectoryDetail } from "@/hooks/dentist/useDentistDirectory";
import ProfilePageSkeleton from "@/features/marketing/find-dentists-page-components/DentistProfile/profile-page-skeleton";
import DentistNotFound from "./not-found";
import { mapApiDentist } from "@/features/marketing/find-dentists-page-components/types";

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
    const base = mapApiDentist(d);

    return {
      ...base,
      bio: d.description || d.bio || "N/A",
      procedures: d.procedures || [],
      dentistLicense: d.dentistLicense,
      dentistOperations: d.dentistOperations,
      materials: d.materials || [],
      results: d.results || [],
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
