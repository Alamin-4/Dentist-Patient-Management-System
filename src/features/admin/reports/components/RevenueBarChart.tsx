"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

interface MonthlyDataRow {
  month: string;
  shortMonth: string;
  revenue: number;
  bookings: number;
  fees: number;
  escrowReleased: number;
}

interface RevenueBarChartProps {
  monthlyData: MonthlyDataRow[];
}

export function RevenueBarChart({ monthlyData }: { monthlyData: any[] }) {
  const [metric, setMetric] = useState<"revenue" | "bookings" | "fees">("revenue");

  const vals = monthlyData.map((r) => r[metric]);
  const max = Math.max(...vals, 1);

  const labels: Record<typeof metric, string> = {
    revenue: "Gross Revenue",
    bookings: "Bookings",
    fees: "Platform Fees",
  };

  const formatVal = (v: number) => metric === "bookings" ? String(v) : fmt(v);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-text">Revenue Trend</h3>
          <p className="mt-0.5 text-xs text-gray-400">Monthly performance breakdown</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["revenue", "bookings", "fees"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                metric === m ? "bg-text text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {labels[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-4">
        <div className="relative h-52">
          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute left-8 right-0 border-t border-dashed border-gray-100"
              style={{ bottom: `${pct}%` }}
            >
              {pct > 0 && (
                <span className="absolute -top-3 left-0 -translate-x-full pr-2 text-[10px] text-gray-400">
                  {formatVal(Math.round((pct / 100) * max))}
                </span>
              )}
            </div>
          ))}

          {/* Bars */}
          <div className="absolute inset-0 flex items-end gap-2 pl-8">
            {monthlyData.map((row, i) => {
              const v = row[metric];
              const h = max > 0 ? (v / max) * 100 : 0;
              const isLast = i === monthlyData.length - 1;
              return (
                <div key={row.month} className="group relative flex flex-1 flex-col items-center">
                  {/* Hover tooltip */}
                  <div className="pointer-events-none absolute bottom-full mb-2 hidden rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-lg group-hover:block z-10 whitespace-nowrap text-center">
                    <p className="text-xs font-bold text-text">{formatVal(v)}</p>
                    <p className="text-[10px] text-gray-400">{row.month}</p>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height: `${h}%` }}>
                    <div className={cn(
                      "absolute inset-0 rounded-t-lg transition-all",
                      isLast ? "bg-text" : "bg-text/20 group-hover:bg-text/50"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis */}
        <div className="mt-2 flex gap-2 pl-8">
          {monthlyData.map((r) => (
            <div key={r.shortMonth} className="flex-1 text-center text-[11px] font-medium text-gray-400">
              {r.shortMonth}
            </div>
          ))}
        </div>
      </div>

      {/* Footer totals */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
        {[
          { label: "Total Revenue", value: fmt(monthlyData.reduce((s, r) => s + r.revenue, 0)) },
          { label: "Total Fees", value: fmt(monthlyData.reduce((s, r) => s + r.fees, 0)) },
          { label: "Total Bookings", value: fmtNum(monthlyData.reduce((s, r) => s + r.bookings, 0)) },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5 py-3.5">
            <p className="text-[11px] font-medium text-gray-400">{s.label}</p>
            <p className="text-lg font-bold text-text">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
