"use client";

import { DollarSign, Users, CalendarDays, ShieldCheck, BarChart3, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const KPI_ICONS: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  revenue: { icon: DollarSign, iconBg: "bg-success-50", iconColor: "text-success-600" },
  fees: { icon: BarChart3, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  escrow: { icon: ShieldCheck, iconBg: "bg-accent/5", iconColor: "text-accent" },
  bookings: { icon: CalendarDays, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  dentists: { icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
  refunds: { icon: AlertTriangle, iconBg: "bg-destructive-50", iconColor: "text-destructive-500" },
};

interface KpiCard {
  id: string;
  label: string;
  value: string;
  sub: string;
}

interface KpiCardsProps {
  cards: KpiCard[];
}

export function KpiCards({ cards }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((kpi) => {
        const meta = KPI_ICONS[kpi.id];
        if (!meta) return null;
        const Icon = meta.icon;
        return (
          <div key={kpi.id} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.iconBg)}>
                <Icon className={cn("h-4.5 w-4.5", meta.iconColor)} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-text">{kpi.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">{kpi.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-400">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
