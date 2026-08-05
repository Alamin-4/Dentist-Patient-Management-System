import { Skeleton } from "@/components/feedback/skeleton";

export default function MarketingLoading() {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* 1. Hero Section Skeleton */}
      <section className="relative w-full bg-white py-12">
        <div className="mx-auto flex max-w-400 w-11/12 flex-col-reverse items-center justify-between gap-12 lg:flex-row">
          {/* Hero Left Content */}
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="space-y-4 max-w-xl">
              <Skeleton className="h-10 md:h-14 w-full max-w-lg rounded-lg" />
              <Skeleton className="h-10 md:h-14 w-4/5 rounded-lg" />
              <Skeleton className="h-6 w-3/4 rounded-md mt-2" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="w-full lg:max-w-4/5 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                <Skeleton className="h-12 w-full flex-1 rounded-lg" />
                <Skeleton className="h-12 w-full sm:w-32 rounded-lg bg-primary/20" />
              </div>
            </div>

            <Skeleton className="h-4 w-48 rounded" />
          </div>

          {/* Hero Right Image Banner Skeleton */}
          <div className="relative w-full lg:w-2/5">
            <Skeleton className="relative aspect-video lg:aspect-4/3 w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* 2. Verified Dentists Section Skeleton */}
      <section className="py-12 md:py-20 bg-white border-t border-slate-100">
        <div className="mx-auto mb-10 md:mb-12 w-11/12 max-w-400 space-y-3">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 max-w-full rounded" />
        </div>

        <div className="mx-auto flex w-11/12 max-w-400 flex-col rounded-md border border-slate-200 lg:flex-row">
          {/* Sidebar Procedure List Skeleton */}
          <div className="w-full lg:w-64 p-4 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-3 bg-slate-50/50">
            <Skeleton className="h-5 w-32 mb-4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>

          {/* Main Dentist Grid Skeleton */}
          <div className="flex-1 p-4 lg:p-6 space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3.5 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-28 rounded-lg bg-primary/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Trust Section Skeleton */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-400 w-11/12 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <Skeleton className="h-8 w-80 mx-auto rounded-md" />
            <Skeleton className="h-4 w-full max-w-xl mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200/80 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Smile Preview Section Skeleton */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-400 w-11/12 mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-4 max-w-xl">
              <Skeleton className="h-8 w-72 rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-11 w-48 rounded-lg bg-primary/20" />
            </div>
            <div className="space-y-3 w-full lg:w-80">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="w-full aspect-2/1 rounded-xl bg-slate-900/10" />
        </div>
      </section>

      {/* 5. CTA Section Skeleton */}
      <section className="py-16 bg-[#003366]">
        <div className="max-w-400 w-11/12 mx-auto flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-8 w-48 rounded-full bg-white/20" />
          <Skeleton className="h-10 w-72 md:w-96 rounded-lg bg-white/30" />
          <Skeleton className="h-12 w-full max-w-2xl rounded-xl bg-white/20" />
        </div>
      </section>
    </div>
  );
}
