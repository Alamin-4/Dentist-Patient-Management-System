import { ChevronRight, Clock, AlertCircle } from "lucide-react";

interface Props {
  alerts: Array<{
    label: string;
    detail: string;
  }>;
}

export function OverviewAlertsCard({ alerts }: Props) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,35,61,0.03)] sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Alerts</h2>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const isBooking = alert.label.toLowerCase().includes("booking");
          return (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-blue-50/50 bg-[#F4F8FA] p-4 hover:bg-[#EBF3F8] transition-all duration-200"
            >
              {/* Icon */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                {isBooking ? (
                  <AlertCircle className="size-5 text-[#CDA555]" />
                ) : (
                  <Clock className="size-5 text-[#CDA555]" />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {alert.label}
                </p>
                <p className="mt-1 text-xs text-gray-500 leading-normal">
                  {alert.detail}
                </p>
              </div>

              {/* Chevron */}
              <ChevronRight className="size-4 shrink-0 text-gray-400" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
