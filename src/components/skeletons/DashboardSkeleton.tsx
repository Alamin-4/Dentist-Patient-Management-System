"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#F9FAFB]">
      {/* Top Navbar Skeleton */}
      <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border/70 bg-white px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="hidden h-10 w-64 rounded-lg md:block" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="hidden w-64 shrink-0 border-r border-border/80 bg-white p-4 lg:block">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="pt-6">
              <Skeleton className="h-4 w-28 rounded" />
              <div className="space-y-2.5 pt-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Cards Skeleton Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>

          {/* Main Card Skeleton */}
          <Skeleton className="h-96 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
