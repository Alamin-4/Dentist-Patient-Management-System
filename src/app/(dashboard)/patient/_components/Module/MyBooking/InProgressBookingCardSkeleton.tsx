import { Skeleton } from "@/components/feedback/skeleton";

export default function InProgressBookingCardSkeleton() {
  return (
    <div className="bg-white border border-[#CEE0F4] rounded-2xl overflow-hidden">
      {/* Top Section */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Avatar + badges */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="w-16 h-4 rounded" />
          <Skeleton className="w-20 h-5 rounded" />
        </div>

        {/* Doctor info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="w-40 h-6 rounded" />
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-36 h-4 rounded" />
        </div>

        {/* Procedure */}
        <div className="shrink-0 space-y-2 min-w-[130px]">
          <Skeleton className="w-16 h-3 rounded" />
          <Skeleton className="w-28 h-5 rounded" />
        </div>

        {/* Appointment */}
        <div className="shrink-0 space-y-2 min-w-[170px]">
          <Skeleton className="w-24 h-3 rounded" />
          <Skeleton className="w-36 h-5 rounded" />
        </div>

        {/* Budget */}
        <div className="shrink-0 space-y-2 text-right">
          <Skeleton className="w-20 h-3 rounded ml-auto" />
          <Skeleton className="w-16 h-7 rounded ml-auto" />
          <Skeleton className="w-14 h-4 rounded ml-auto" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-t border-slate-100 px-5 md:px-6 py-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full shrink-0" />
              <Skeleton className="w-24 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-100 px-5 md:px-6 py-4 flex items-center justify-between gap-4">
        <Skeleton className="flex-1 max-w-md h-4 rounded" />
        <Skeleton className="w-28 h-10 rounded-lg shrink-0" />
      </div>
    </div>
  );
}
