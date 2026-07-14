import React from "react";
import { CustomStats } from "@/app/(admin-dashboard)/modules/shared/custom-stats";

interface SpecialtyStatsProps {
  isLoading: boolean;
  total: number;
  recent: number;
}

export function SpecialtyStats({ isLoading, total, recent }: SpecialtyStatsProps) {
  return (
    <CustomStats
      stats={[
        {
          label: "TOTAL SPECIALTIES",
          value: isLoading ? "..." : total.toLocaleString(),
        },
        {
          label: "RECENT (LAST 30 DAYS)",
          value: isLoading ? "..." : recent.toLocaleString(),
        },
      ]}
      className="grid-cols-1 sm:grid-cols-2"
    />
  );
}
