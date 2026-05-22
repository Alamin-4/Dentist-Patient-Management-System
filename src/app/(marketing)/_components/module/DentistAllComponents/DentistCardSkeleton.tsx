import { Skeleton } from "@/components/feedback/skeleton";

export default function DentistCardSkeleton() {
  return (
    <div className="relative w-full overflow-hidden border border-[#B3C6DC] bg-white rounded-lg">
      <div className="flex flex-col justify-between gap-4 p-4 xl:flex-row xl:gap-5 xl:p-6">
        <div className="flex flex-row gap-4 max-w-180 w-full">
          {/* Avatar + score column */}
          <div className="flex shrink-0 flex-col items-center gap-3 xl:w-35">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          {/* Info column */}
          <div className="min-w-0 space-y-3 w-full">
            <div className="space-y-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Price + buttons column */}
        <div className="flex flex-row sm:flex-col items-end justify-between gap-3 xl:min-w-42.5">
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-5 w-20 ml-auto" />
          </div>
          <div className="flex flex-wrap items-end justify-end gap-2">
            <Skeleton className="h-11 w-28 rounded-lg" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
