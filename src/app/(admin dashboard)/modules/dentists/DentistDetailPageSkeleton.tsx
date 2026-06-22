import { Skeleton } from '@/components/feedback/skeleton';

export function DentistDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      {/* Hero Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          <div className="rounded-t-xl border-b border-gray-100 bg-white px-4 pt-1 shadow-sm">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="mt-4">
            {/* Overview content placeholders */}
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
