import { Skeleton } from "@/components/feedback/skeleton";

export function DoctorCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-lg border border-border overflow-hidden animate-pulse">
      {/* Main Content Area */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <Skeleton className="w-16 lg:w-20 h-16 lg:h-20 rounded-full" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>

        {/* Middle: Doctor Info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 md:h-7 w-40 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-36 rounded mt-1" />
        </div>

        {/* Right: Procedure Info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
          <Skeleton className="h-3.5 w-24 rounded md:ml-auto" />
          <Skeleton className="h-6 w-20 rounded md:ml-auto" />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="border-t border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <Skeleton className="h-4 flex-1 max-w-md rounded" />
        </div>
        <Skeleton className="w-full md:w-36 h-11 rounded-lg shrink-0" />
      </div>
    </div>
  );
}
