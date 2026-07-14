"use client";

import { useDentistOverview } from "@/hooks/dentist/useDentist";
import { OverviewActiveBookingsCard } from "./overview-active-bookings-card";
import { OverviewAlertsCard } from "./overview-alerts-card";
import { OverviewPageSkeleton } from "./overview-page-skeleton";
import { OverviewPerformanceCard } from "./overview-performance-card";
import { OverviewReferralsCard } from "./overview-referrals-card";
import { OverviewStatsSection } from "./overview-stats-section";

export default function MainOverviewPage() {
  const { data, isLoading } = useDentistOverview();

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  const overview = data?.data || {
    stats: [],
    chart: { score: 0, completed: 0, total: 0, labels: [] },
    alerts: [],
    activeBookings: [],
    referralCode: "RD-DR-MEMBER",
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Welcome back. Here is your practice overview.
        </p>
      </div>

      {/* 4-stat cards */}
      <OverviewStatsSection stats={overview.stats} />

      {/* RDV performance + Alerts — side by side */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewPerformanceCard chart={overview.chart} />
        <OverviewAlertsCard alerts={overview.alerts} />
      </div>

      {/* Active bookings — full width */}
      <OverviewActiveBookingsCard activeBookings={overview.activeBookings} />

      {/* Referral code — full width */}
      <OverviewReferralsCard referralCode={overview.referralCode} />
    </div>
  );
}
