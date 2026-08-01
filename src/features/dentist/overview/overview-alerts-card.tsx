import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

interface Props {
  alerts: Array<{
    label: string;
    detail: string;
  }>;
}

export function OverviewAlertsCard({ alerts }: Props) {
  return (
    <SectionCard className="sm:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Alerts</h2>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const isBooking = alert.label.toLowerCase().includes("booking");
          return (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-100/50 bg-slate-50 p-4 hover:bg-slate-100 transition-all duration-200"
            >
              {/* Icon */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                {isBooking ? (
                  <AlertCircle className="size-5 text-admin-gold" />
                ) : (
                  <Clock className="size-5 text-admin-gold" />
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
    </SectionCard>
  );
}
