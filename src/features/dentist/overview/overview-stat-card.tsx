import { CalendarDays, Clock, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatIcon, StatTrend } from "./overview-data";
import { SectionCard } from "@/components/shared/section-card";

const ICON_MAP: Record<StatIcon, React.ElementType> = {
  calendar: CalendarDays,
  clock: Clock,
  dollar: DollarSign,
  target: Target,
};

const ICON_STYLES: Record<StatIcon, { bg: string; text: string }> = {
  calendar: { bg: "bg-secondary", text: "text-brand-medium-navy" },
  clock: { bg: "bg-accent/10/70", text: "text-accent/95" },
  dollar: { bg: "bg-secondary", text: "text-brand-medium-navy" },
  target: { bg: "bg-secondary", text: "text-brand-medium-navy" },
};

interface OverviewStatCardProps {
  label: string;
  value: string | number;
  subLabel: string;
  trend: StatTrend;
  icon: StatIcon;
  highlight?: boolean;
  className?: string;
}

export function OverviewStatCard({
  label,
  value,
  subLabel,
  trend,
  icon,
  highlight,
  className,
}: OverviewStatCardProps) {
  const Icon = ICON_MAP[icon];
  const style = ICON_STYLES[icon] || { bg: "bg-gray-100", text: "text-gray-500" };

  return (
    <SectionCard
      className={cn(
        "p-6",
        className,
      )}
    >
      {/* Label row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-gray-400">{label}</p>
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", style.bg, style.text)}>
          <Icon className="size-5" />
        </div>
      </div>

      {/* Value */}
      <p
        className={cn(
          "mt-4 text-3xl font-extrabold tracking-tight text-gray-900",
        )}
      >
        {String(value)}
      </p>

      {/* Sub-label */}
      {trend === "positive" ? (
        <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#10B981]">
          <span>↑</span>
          <span>{subLabel}</span>
        </div>
      ) : (
        <p className="mt-2 text-xs font-semibold text-gray-400">{subLabel}</p>
      )}
    </SectionCard>
  );
}
