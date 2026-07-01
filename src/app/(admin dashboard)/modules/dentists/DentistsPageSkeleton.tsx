import { Skeleton } from '@/components/feedback/skeleton';
import { cn } from '@/lib/utils';

export function DentistsPageSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        ))}
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-100 px-4 pt-1">
        <Skeleton className="h-8 w-48" />
      </div>
      {/* Filters */}
      <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-40" />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              <th className="w-8 px-4 py-3"><Skeleton className="h-4 w-4" /></th>
              {[
                'Dentist',
                'Specialty',
                'Location',
                'Status',
                'Rating',
                'Bookings',
                'Joined',
                '',
              ].map((_, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="cursor-pointer transition-colors hover:bg-gray-50/80">
                <td className="px-4 py-3.5"><Skeleton className="h-4 w-4" /></td>
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-4 py-3.5"><Skeleton className="h-4 w-24" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}
