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
    : "";

  return (
    <PageContainer className="space-y-6">
      <HeadingGroup
        title="Dashboard"
        description={`Welcome back, ${displayName}. Here is your practice overview.`}
      />

      <OverviewStatsSection stats={overview.stats} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewPerformanceCard chart={overview.chart} />
        <OverviewAlertsCard alerts={overview.alerts} />
      </div>

      <OverviewActiveBookingsCard activeBookings={overview.activeBookings} />

      <OverviewReferralsCard referralCode={overview.referralCode} />
    </PageContainer>
  );
}
