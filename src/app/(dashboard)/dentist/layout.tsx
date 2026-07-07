"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useDentist from "@/hooks/dentist/useDentist";
import { Loader2 } from "lucide-react";

export default function DentistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dentistProfile } = useDentist();
  const router = useRouter();

  useEffect(() => {
    if (!dentistProfile.isPending && dentistProfile.data) {
      const dentist = dentistProfile.data?.data?.dentist;
      const hasProfData = !!dentist?.dentistProfessionalData?.legalName;
      if (!hasProfData) {
        router.replace("/register-doctor?dentist=professional-info");
      }
    }
  }, [dentistProfile.isPending, dentistProfile.data, router]);

  if (dentistProfile.isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0E3E65]" />
      </div>
    );
  }

  return <>{children}</>;
}
