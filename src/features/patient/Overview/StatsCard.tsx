import { Skeleton } from "@/components/feedback/skeleton";

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  isLoading?: boolean;
}

export const StatCard = ({ icon, value, label, isLoading }: StatProps) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4 w-full">
    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#113254] border border-gray-50">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-text">{value}</h3>
          <p className="text-sm font-medium text-sec-text">{label}</p>
        </>
      )}
    </div>
  </div>
);
