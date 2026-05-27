import { overviewData } from "./overview-data";
import { OverviewStatCard } from "./overview-stat-card";

export function OverviewStatsSection() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewData.stats.map((stat) => (
        <OverviewStatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          subLabel={stat.subLabel}
          trend={stat.trend}
          icon={stat.icon}
          highlight={stat.highlight}
        />
      ))}
    </section>
  );
}
