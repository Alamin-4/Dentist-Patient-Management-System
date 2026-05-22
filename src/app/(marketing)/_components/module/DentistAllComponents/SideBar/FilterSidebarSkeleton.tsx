import { Skeleton } from "@/components/feedback/skeleton";

function SectionBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mb-2 border-b border-slate-100 pb-4 space-y-3">
      <Skeleton className="h-3 w-24" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full rounded" />
      ))}
    </div>
  );
}

export default function FilterSidebarSkeleton() {
  return (
    <aside className="flex w-full flex-col rounded-[18px] border border-slate-200 bg-[#f8f9fb] p-5 shadow-sm lg:min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>

      {/* Procedure / Country / City */}
      <SectionBlock rows={1} />
      <SectionBlock rows={1} />
      <SectionBlock rows={1} />

      {/* Price range */}
      <div className="mb-2 border-b border-slate-100 pb-4 space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-2 w-full rounded-full mt-6 mb-5" />
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-9 rounded-xl" />
          <Skeleton className="flex-1 h-9 rounded-xl" />
        </div>
      </div>

      {/* RDV Score checkboxes */}
      <div className="mb-2 border-b border-slate-100 pb-4 space-y-3.5">
        <Skeleton className="h-4 w-20" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-4.5 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Rating checkboxes */}
      <div className="mb-2 border-b border-slate-100 pb-4 space-y-3.5">
        <Skeleton className="h-4 w-14" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-4.5 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="mb-2 border-b border-slate-100 pb-4 space-y-3.5">
        <Skeleton className="h-4 w-20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-4.5 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="pb-2 space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="size-6 rounded-full" />
        </div>
        <div className="grid grid-cols-7 gap-y-3 mt-2">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} className="size-7 rounded-full mx-auto" />
          ))}
        </div>
      </div>
    </aside>
  );
}
