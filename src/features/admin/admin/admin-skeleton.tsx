import { Skeleton } from "@/components/feedback/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
        <Skeleton className="h-7 w-48 rounded-lg bg-slate-200" />
        <Skeleton className="h-4 w-72 rounded-full bg-slate-200/80" />
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3.5 rounded-lg border border-gray-100 bg-white p-5 shadow-xs"
          >
            <Skeleton className="h-11 w-11 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200" />
              <Skeleton className="h-8 w-28 rounded-lg bg-slate-200" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-3.5 w-14 rounded-md bg-slate-200" />
              <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200/80" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart + Verification Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Bookings & Revenue Chart Skeleton */}
        <div className="lg:col-span-3 flex flex-col gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md bg-slate-200" />
              <Skeleton className="h-3.5 w-60 rounded-full bg-slate-200/80" />
            </div>
            <Skeleton className="h-8 w-32 rounded-lg bg-slate-200" />
          </div>

          {/* Simulated Chart Bars Skeleton */}
          <div className="h-72 w-full rounded-xl bg-slate-50 border border-slate-100 p-6 flex items-end justify-between gap-3">
            {[40, 65, 30, 85, 55, 95, 70, 45, 80, 60, 90, 50].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton
                  className="w-full rounded-t-md bg-slate-200"
                  style={{ height: `${height}%` }}
                />
                <Skeleton className="h-3 w-6 rounded-md bg-slate-200/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Verification Queue Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 rounded-md bg-slate-200" />
              <Skeleton className="h-3.5 w-48 rounded-full bg-slate-200/80" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
          </div>

          <div className="space-y-4 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded-md bg-slate-200" />
                    <Skeleton className="h-3 w-24 rounded-md bg-slate-200/80" />
                  </div>
                </div>
                <Skeleton className="h-7 w-20 rounded-lg bg-slate-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-36 rounded-md bg-slate-200" />
            <Skeleton className="h-4 w-20 rounded-md bg-slate-200/80" />
          </div>

          <div className="space-y-3 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-white"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36 rounded-md bg-slate-200" />
                    <Skeleton className="h-3 w-28 rounded-md bg-slate-200/80" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-slate-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Skeleton className="h-5 w-36 rounded-md bg-slate-200" />
            <Skeleton className="h-4 w-16 rounded-md bg-slate-200/80" />
          </div>

          <div className="space-y-4 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3.5">
                <Skeleton className="h-9 w-9 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full max-w-70 rounded-md bg-slate-200" />
                  <Skeleton className="h-3 w-24 rounded-md bg-slate-200/80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
