import { OverviewActiveBookingsCard } from "./overview-active-bookings-card";
import { OverviewAlertsCard } from "./overview-alerts-card";
import { OverviewPerformanceCard } from "./overview-performance-card";
import { OverviewReferralsCard } from "./overview-referrals-card";
import { OverviewStatsSection } from "./overview-stats-section";

export default function MainOverviewPage() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Welcome back, Dr. Mick. Here is your practice overview.
        </p>
      </div>

      {/* 4-stat cards */}
      <OverviewStatsSection />

      {/* RDV performance + Alerts — side by side */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <OverviewPerformanceCard />
        <OverviewAlertsCard />
      </div>

      {/* Active bookings — full width */}
      <OverviewActiveBookingsCard />

      {/* Referral code — full width */}
      <OverviewReferralsCard />
    </div>
  );
}
