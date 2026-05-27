import { Skeleton } from "@/components/feedback/skeleton";

export default function ResultCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#DDE5F0] bg-white shadow-[0_8px_24px_rgba(17,50,84,0.04)]">
      <div className="grid grid-cols-2 gap-0.5 bg-[#EEF3F8] p-0.5">
        <Skeleton className="aspect-square rounded-l-[18px] bg-slate-200" />
        <Skeleton className="aspect-square rounded-r-[18px] bg-slate-200" />
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-5 w-40 rounded-full" />
            <Skeleton className="h-4 w-36 rounded-full" />
          </div>

          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="h-px bg-[#E9EEF4]" />

        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full shrink-0" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
      </div>
    </article>
  );
}