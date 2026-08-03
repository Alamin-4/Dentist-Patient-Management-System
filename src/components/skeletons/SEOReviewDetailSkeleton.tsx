"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SEOReviewDetailSkeleton() {
  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl border border-border/70 bg-white overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-border/50 px-5 py-4 flex items-center justify-between">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="p-5 space-y-5">
          {/* Meta fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          {/* Description / long text field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>

          {/* Content body */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>

          {/* Tags / keywords row */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
