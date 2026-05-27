import { OverviewPageSkeleton } from "@/app/modules/dentist/overview/overview-page-skeleton";

export default function DentistOverviewLoading() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <OverviewPageSkeleton />
    </div>
  );
}
