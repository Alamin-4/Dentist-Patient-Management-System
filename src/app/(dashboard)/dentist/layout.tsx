"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDentistProfileQuery, useDentistProgress } from "@/hooks/dentist/useDentist";
import { Loader2 } from "lucide-react";
import type { DentistVerificationProgress } from "@/features/dentist/overview/verification-progress.types";

export default function DentistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dentistProfile = useDentistProfileQuery();
  const { data: progressData, isLoading: isProgressLoading } = useDentistProgress();
  const router = useRouter();

  const progress = progressData?.data as DentistVerificationProgress | undefined;

  useEffect(() => {
    if (!dentistProfile.isPending) {
      if (dentistProfile.isError || !dentistProfile.data) {
        router.replace("/register-doctor");
        return;
      }
      const dentist = dentistProfile.data?.data?.dentist;
      const hasProfData = !!dentist?.dentistProfessionalData?.legalName;
      if (!hasProfData) {
        router.replace("/register-doctor?dentist=professional-info");
      }
    }
  }, [dentistProfile.isPending, dentistProfile.isError, dentistProfile.data, router]);

  // Guard: claimed profile dentists who haven't paid must complete payment first
  useEffect(() => {
    if (!isProgressLoading && progress) {
      const isClaimedUnpaid = progress.is_claimed_profile && !progress.is_membership_paid;
      if (isClaimedUnpaid && progress.directory_slug) {
        router.replace(`/find-dentists/${progress.directory_slug}/claim`);
      }
    }
  }, [isProgressLoading, progress, router]);

  if (dentistProfile.isPending || isProgressLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (dentistProfile.isError || !dentistProfile.data) {
    return null;
  }

  return <>{children}</>;
}
