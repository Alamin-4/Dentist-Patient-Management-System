import {
  Stethoscope,
  Users,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { statCards, type StatCard } from "./overview-data";
import { cn } from "@/lib/utils";

function StatIcon({ icon, bg, color }: { icon: StatCard["icon"]; bg: string; color: string }) {
  const cls = cn("h-5 w-5", color);
  const icons = {
    stethoscope: <Stethoscope className={cls} />,
    users: <Users className={cls} />,
    calendar: <CalendarDays className={cls} />,
    dollar: <DollarSign className={cls} />,
  };

  return (
    <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", bg)}>
      {icons[icon]}
    </div>
  );
}

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <StatIcon icon={card.icon} bg={card.iconBg} color={card.iconColor} />

      <div>
        <p className="text-sm text-gray-500">{card.label}</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-[#1A1A2E]">
          {card.value}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-semibold",
            card.trendUp ? "text-emerald-600" : "text-red-500"
          )}
        >
          {card.trendUp ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {card.trend}
        </span>
        <span className="text-xs text-gray-400">{card.comparison}</span>
      </div>
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <StatCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
