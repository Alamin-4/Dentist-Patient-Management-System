import InProgressBookingCardSkeleton from "@/app/(dashboard)/patient/_components/Module/MyBooking/InProgressBookingCardSkeleton";
import { Skeleton } from "@/components/feedback/skeleton";

export default function BookingsLoading() {
  return (
    <div>
      {/* Page title */}
      <Skeleton className="w-36 h-8 rounded mb-4" />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E5E7EB] pb-0 mb-5">
        <Skeleton className="w-24 h-8 rounded-sm" />
        <Skeleton className="w-20 h-8 rounded-sm" />
        <Skeleton className="w-16 h-8 rounded-sm" />
      </div>

      {/* Card skeleton */}
      <InProgressBookingCardSkeleton />
    </div>
  );
}
