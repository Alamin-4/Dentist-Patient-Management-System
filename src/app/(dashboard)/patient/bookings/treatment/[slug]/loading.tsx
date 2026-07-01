import { Skeleton } from "@/components/feedback/skeleton";

export default function TreatmentDetailLoading() {
  return (
    <div>
      {/* Back + title */}
      <Skeleton className="w-12 h-4 rounded mb-4" />
      <Skeleton className="w-44 h-8 rounded mb-5" />

      {/* Doctor header card */}
      <div className="bg-white border border-[#CEE0F4] rounded-lg p-5 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="w-40 h-6 rounded" />
            <Skeleton className="w-24 h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
          <div className="shrink-0 space-y-2 min-w-32.5">
            <Skeleton className="w-16 h-3 rounded" />
            <Skeleton className="w-28 h-5 rounded" />
          </div>
          <div className="shrink-0 space-y-2 min-w-40">
            <Skeleton className="w-24 h-3 rounded" />
            <Skeleton className="w-36 h-5 rounded" />
          </div>
          <div className="shrink-0 space-y-2 text-right">
            <Skeleton className="w-20 h-3 rounded ml-auto" />
            <Skeleton className="w-16 h-7 rounded ml-auto" />
            <Skeleton className="w-14 h-4 rounded ml-auto" />
          </div>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — plan table */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="w-44 h-5 rounded" />
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 flex justify-between border-b border-slate-100">
                <Skeleton className="w-32 h-3 rounded" />
                <Skeleton className="w-10 h-3 rounded" />
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between px-4 py-3.5 border-b border-slate-50">
                  <Skeleton className="w-40 h-4 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              ))}
              <div className="flex justify-between px-4 py-4">
                <Skeleton className="w-28 h-5 rounded" />
                <Skeleton className="w-16 h-5 rounded" />
              </div>
            </div>
            <Skeleton className="w-full h-16 rounded-lg" />
          </div>
        </div>

        {/* Right — timeline */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-lg shadow-sm p-5 md:p-6">
            <Skeleton className="w-36 h-5 rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    {i < 4 && <Skeleton className="w-0.5 h-10 rounded mt-1" />}
                  </div>
                  <div className="flex-1 space-y-1.5 pb-4">
                    <Skeleton className="w-40 h-4 rounded" />
                    <Skeleton className="w-28 h-3 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="w-full h-11 rounded-lg mt-6" />
          </div>
        </div>
      </div>

      {/* Dispute footer */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <Skeleton className="w-14 h-4 rounded" />
      </div>
    </div>
  );
}
