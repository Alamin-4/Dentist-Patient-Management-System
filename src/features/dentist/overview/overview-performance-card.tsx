import { cn } from "@/lib/utils";

interface Props {
  chart: {
    score: number;
    completed: number;
    total: number;
    labels: Array<{
      label: string;
      value: string;
      badge: string;
    }>;
  };
}

export function OverviewPerformanceCard({ chart }: Props) {
  // Clamp to valid percentage
  const pct = Math.min(Math.max(chart.score, 0), 100);

  // SVG Ring Calculations
  const radius = 70;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,35,61,0.03)] sm:p-8">
      {/* Main layout: chart left + metrics right */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
        {/* SVG Donut chart */}
        <div className="shrink-0 relative flex size-44 items-center justify-center">
          <svg className="size-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#FEF3C7"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#F3C043"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Inner labels */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg lg:text-xl font-bold text-[#D48D1D]">
              {chart.score}%
            </span>
            <span className="mt-1.5 text-sm text-[#D48D1D]">
              RDV Score
            </span>
          </div>
        </div>

        {/* Metrics list */}
        <div className="w-full flex-1 divide-y divide-gray-100">
          {chart.labels.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <p className="min-w-0 flex-1 text-sm font-semibold text-gray-400">
                {item.label}
              </p>
              <p className="shrink-0 text-sm font-extrabold text-gray-900">
                {item.value}
              </p>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-xs font-bold bg-badge/11 text-badge",
                )}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="mt-6 border-t border-gray-100 pt-4 text-xs font-semibold leading-relaxed text-gray-400">
        Review sentiment is displayed separately and does not affect your RDV
        Score.
      </p>
    </section>
  );
}
