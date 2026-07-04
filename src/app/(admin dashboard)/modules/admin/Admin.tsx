"use client";

import { Loader2 } from "lucide-react";
import useOverview from "@/hooks/admin/overview/useOverview";
import { OverviewHeader } from "./overview-header";
import { StatsCards } from "./stats-cards";
import { BookingsRevenueChart } from "./bookings-revenue-chart";
import { VerificationQueue } from "./verification-queue";
import { TopDentists } from "./top-dentists";
import { RecentActivity } from "./recent-activity";

export default function Admin() {
  const { data, isLoading } = useOverview();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OverviewHeader />

      <StatsCards stats={data?.stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BookingsRevenueChart chartData={data?.chart} />
        </div>
        <div className="lg:col-span-2">
          <VerificationQueue
            queue={data?.verificationQueue?.items}
            total={data?.verificationQueue?.total}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopDentists dentists={data?.topDentists} />
        <RecentActivity activities={data?.recentActivity} />
      </div>
    </div>
  );
}
