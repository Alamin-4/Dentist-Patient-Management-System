import { Suspense } from "react";
import FindDentistComponents from "../_components/module/find-dentist-components/FindDentist";

export default function FindVerifiedDentistPage() {
  return (
    <div className="max-w-400 mx-auto w-11/12">
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10436B] border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Loading directory filters...</p>
        </div>
      }>
        <FindDentistComponents />
      </Suspense>
    </div>
  );
}
