import { Suspense } from "react";
import FindDentistComponents from "@/features/marketing/find-dentist-components/FindDentist";
import { PageContainer } from "@/components/shared/page-container";

export default function FindVerifiedDentistPage() {
  return (
    <PageContainer>
      <Suspense fallback={
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Loading directory filters...</p>
        </div>
      }>
        <FindDentistComponents />
      </Suspense>
    </PageContainer>
  );
}
