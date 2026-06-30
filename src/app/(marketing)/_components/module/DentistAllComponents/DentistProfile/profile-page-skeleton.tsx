import { Skeleton } from "@/components/feedback/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-400 w-11/12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Left column */}
          <div className="w-full lg:flex-1 min-w-0 space-y-5">
            {/* Tab bar */}
            <div className="flex gap-2 flex-wrap">
              {[100, 80, 90, 96, 88].map((w, i) => (
                <Skeleton key={i} className="h-9 rounded-full" style={{ width: w }} />
              ))}
            </div>

            {/* Content card */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="w-full lg:w-110 lg:shrink-0">
            <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
              <div className="flex gap-5">
                <Skeleton className="size-24 rounded-full shrink-0" />
                <div className="space-y-2 flex-1 pt-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-8 w-36 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-7 w-24" />
                </div>
                <Skeleton className="h-14 w-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
