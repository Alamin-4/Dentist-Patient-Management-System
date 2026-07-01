export default function PatientOverviewSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Page title */}
      <div className="h-8 w-36 bg-gray-200 rounded-lg mb-8" />

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4"
          >
            <div className="size-12 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Consultation section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
        {/* Section heading */}
        <div className="h-6 w-36 bg-gray-200 rounded mb-6" />

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 pb-4 mb-6">
          {[96, 56, 128].map((w, i) => (
            <div key={i} className={`h-4 bg-gray-200 rounded`} style={{ width: w }} />
          ))}
        </div>

        {/* Consultation card skeletons */}
        {[0, 1].map((i) => (
          <div
            key={i}
            className="mb-5 last:mb-0 border border-gray-100 rounded-lg p-6"
          >
            {/* Top row */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-gray-100">
              {/* Doctor info */}
              <div className="flex gap-4">
                <div className="size-16 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 pt-1">
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-4 w-28 bg-gray-100 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                  <div className="h-6 w-28 bg-gray-100 rounded-full mt-1" />
                </div>
              </div>
              {/* Procedure */}
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-5 w-32 bg-gray-200 rounded" />
              </div>
              {/* Budget */}
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-6 w-36 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center mt-6 gap-4">
              <div className="space-y-2">
                <div className="h-5 w-44 bg-gray-200 rounded" />
                <div className="h-4 w-52 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
              <div className="h-11 w-36 bg-gray-200 rounded-lg shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
