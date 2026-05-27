import { OverviewHeader } from "./overview-header";
import { StatsCards } from "./stats-cards";
import { BookingsRevenueChart } from "./bookings-revenue-chart";
import { VerificationQueue } from "./verification-queue";
import { TopDentists } from "./top-dentists";
import { RecentActivity } from "./recent-activity";

export default function Admin() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Row 1: Greeting + action buttons ────────────────────────── */}
      <OverviewHeader />

      {/* ── Row 2: 4 stat cards ─────────────────────────────────────── */}
      <StatsCards />

      {/* ── Row 3: Chart (3/5) + Verification Queue (2/5) ───────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BookingsRevenueChart />
        </div>
        <div className="lg:col-span-2">
          <VerificationQueue />
        </div>
      </div>

      {/* ── Row 4: Top Dentists (1/2) + Recent Activity (1/2) ────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopDentists />
        <RecentActivity />
      </div>
    </div>
  );
}
