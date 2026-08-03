"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#F5F7FA]">
      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar Skeleton */}
        <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-white p-4 lg:flex lg:flex-col gap-4">
          {/* Logo */}
          <Skeleton className="h-10 w-40 rounded-lg mb-2" />

          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded mb-3" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="pt-4 space-y-1.5">
            <Skeleton className="h-4 w-24 rounded mb-3" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="mt-auto">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex flex-1 h-dvh flex-col overflow-y-auto">
          {/* Admin Navbar Skeleton */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-white px-5 md:px-7">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg lg:hidden" />
              <Skeleton className="h-6 w-44 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </header>

          {/* Page Content Skeleton */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-52 rounded-lg" />
                <Skeleton className="h-4 w-80 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>

            {/* Table Skeleton */}
            <div className="rounded-xl border border-border/70 bg-white overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-9 w-36 rounded-lg" />
              </div>
              <div className="divide-y divide-border/50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48 rounded" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
