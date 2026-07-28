"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/auth/useAuth";
import { Loader2 } from "lucide-react";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/?modal=signin");
      return;
    }

    const role = user.role;
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.replace("/admin/profile");
    } else if (role === "DENTIST") {
      router.replace("/dentist/profile");
    } else if (role === "PATIENT") {
      router.replace("/patient/settings");
    } else {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-[#10436B]" />
        <div className="text-center">
          <p className="text-sm font-semibold text-text">Loading profile</p>
          <p className="text-xs text-gray-400 mt-1">Please wait while we redirect you...</p>
        </div>
      </div>
    </div>
  );
}
