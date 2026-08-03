"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RegisterPageSkeleton() {
  return (
    <main className="flex min-h-dvh w-full flex-col lg:flex-row bg-white">
      {/* Left Banner — solid color placeholder, no shimmer on brand color */}
      <section className="relative hidden w-full flex-col bg-primary p-6 xl:p-10 lg:flex lg:w-3/5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40 rounded-lg bg-white/20" />
        </div>
        <div className="flex flex-1 items-center">
          <div className="space-y-3 max-w-xl">
            <Skeleton className="h-8 w-full rounded-lg bg-white/20" />
            <Skeleton className="h-8 w-4/5 rounded-lg bg-white/20" />
            <Skeleton className="h-8 w-3/5 rounded-lg bg-white/20" />
          </div>
        </div>
      </section>

      {/* Right Form Section */}
      <section className="flex flex-col items-center justify-center w-full min-h-dvh px-4 py-4 md:px-6 md:py-6 lg:w-2/5 mx-auto">
        <div className="w-full max-w-sm space-y-6 mx-auto">
          {/* Back button */}
          <Skeleton className="h-5 w-16 rounded" />

          {/* Heading */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="h-11 w-full rounded-lg" />

          {/* Footer link */}
          <Skeleton className="h-4 w-48 rounded mx-auto" />
        </div>
      </section>
    </main>
  );
}
