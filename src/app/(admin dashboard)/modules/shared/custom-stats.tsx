"use client";

import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

interface CustomStatsProps {
  stats: StatItem[];
  className?: string;
}

export function CustomStats({ stats, className }: CustomStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
              {stat.label}
            </p>
            {stat.icon && (
              <span className="shrink-0 text-gray-300">{stat.icon}</span>
            )}
          </div>
          <p className={cn("mt-1.5 text-2xl font-bold tracking-tight sm:text-[28px]", stat.valueColor ?? "text-[#1A1A2E]")}>
            {stat.value}
          </p>
          {stat.sub && <p className="mt-1 text-xs text-gray-500">{stat.sub}</p>}
        </div>
      ))}
    </div>
  );
}
