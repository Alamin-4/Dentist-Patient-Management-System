import { Suspense } from "react";
import FindDentistComponents from "@/features/marketing/find-dentist-components/FindDentist";

export default function FindVerifiedDentistPage() {
  return (
    <div className="max-w-400 mx-auto w-11/12 py-6 lg:py-8">
      <Suspense fallback={
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Loading directory filters...</p>
        </div>
      }>
        <FindDentistComponents />
      </Suspense>
    </div>
  );
}
