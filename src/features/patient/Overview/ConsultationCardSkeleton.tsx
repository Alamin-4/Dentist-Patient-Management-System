import { Skeleton } from "@/components/feedback/skeleton";

export function ConsultationCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-white p-5 md:p-6 shadow-[0_1px_0_rgba(17,50,84,0.02)] animate-pulse">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr_0.9fr] lg:items-start">
        {/* Doctor Info Group */}
        <div className="flex gap-4">
          <Skeleton className="size-16 rounded-full shrink-0" />
          <div className="min-w-0 space-y-2 flex-1 pt-1">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-7 w-24 rounded-lg mt-1" />
          </div>
        </div>

        {/* Procedure */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        {/* Budget */}
        <div className="space-y-2 lg:text-right">
          <Skeleton className="h-3.5 w-24 rounded lg:ml-auto" />
          <Skeleton className="h-6 w-20 rounded lg:ml-auto" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-5 flex flex-col gap-4 border-t border-[#EEF2F6] pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        <div className="flex flex-col gap-2 sm:items-end w-full sm:w-auto">
          <Skeleton className="w-full sm:w-36 h-11 rounded-lg" />
          <Skeleton className="w-28 h-4 rounded mt-1 sm:self-end" />
        </div>
      </div>
    </div>
  );
}
