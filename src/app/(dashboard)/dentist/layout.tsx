"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDentistProfileQuery, useDentistProgress } from "@/hooks/dentist/useDentist";
import { Loader2, ShieldOff, AlertCircle } from "lucide-react";
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

  const profileErr = dentistProfile.error as { message?: string; response?: { data?: { message?: string } } } | null;
  const isSuspendedError =
    profileErr?.message?.toLowerCase().includes("suspended") ||
    profileErr?.response?.data?.message?.toLowerCase().includes("suspended");

  useEffect(() => {
    if (!dentistProfile.isPending) {
      if (isSuspendedError) {
        return; // Stay on layout to render the suspended account banner
      }
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
  }, [dentistProfile.isPending, dentistProfile.isError, dentistProfile.data, isSuspendedError, router]);

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

  if (isSuspendedError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-xl w-full rounded-2xl border border-amber-200 bg-white p-8 shadow-md text-left space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ShieldOff className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading">
              Dentist Account Suspended
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed font-medium">
              Your dentist profile has been suspended by administration. Access to your consultation requests, appointments, and public directory listing is currently restricted.
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="h-4 w-4 text-amber-700" /> Administrative Notice
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              <li>Your profile is unlisted from patient search results.</li>
              <li>New patient consultation requests are temporarily disabled.</li>
              <li>Your license and credential records remain on file for verification.</li>
            </ul>
          </div>
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Need assistance or wish to submit an appeal?
            </span>
            <a
              href="mailto:support@rateddocs.com?subject=Account%20Suspension%20Appeal"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors shrink-0"
            >
              Contact Compliance Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (dentistProfile.isError || !dentistProfile.data) {
    return null;
  }

  return <>{children}</>;
}
