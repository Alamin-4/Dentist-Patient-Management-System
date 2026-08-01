"use client";

import { useDentistOverview } from "@/hooks/dentist/useDentist";
import { useMe } from "@/hooks/auth/useAuth";
import { OverviewActiveBookingsCard } from "./overview-active-bookings-card";
import { OverviewAlertsCard } from "./overview-alerts-card";
import { OverviewPageSkeleton } from "./overview-page-skeleton";
import { OverviewPerformanceCard } from "./overview-performance-card";
import { OverviewReferralsCard } from "./overview-referrals-card";
import { OverviewStatsSection } from "./overview-stats-section";
import { PageContainer } from "@/components/shared/page-container";
import { HeadingGroup } from "@/components/shared/heading-group";

export default function MainOverviewPage() {
  const { data, isLoading } = useDentistOverview();
  const { user } = useMe();

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

  const displayName = user?.name 
    ? (user.name.toLowerCase().startsWith("dr.") ? user.name : `Dr. ${user.name}`)
    : "Dr. Mick";

  return (
    <PageContainer className="space-y-6">
      {/* Page header */}
      <HeadingGroup
        title="Dashboard"
        description={`Welcome back, ${displayName}. Here is your practice overview.`}
      />

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
    </PageContainer>
  );
}
