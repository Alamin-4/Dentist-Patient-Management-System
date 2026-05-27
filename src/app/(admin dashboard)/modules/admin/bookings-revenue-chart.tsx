"use client";

import { useState } from "react";
import { chartData } from "./overview-data";
import { cn } from "@/lib/utils";

// ─── Chart constants ──────────────────────────────────────────────────────────

const VB_W = 580;
const VB_H = 200;
const PAD = { top: 16, right: 58, bottom: 38, left: 46 };
const PLOT_W = VB_W - PAD.left - PAD.right; // 476
const PLOT_H = VB_H - PAD.top - PAD.bottom; // 146
const BASELINE_Y = PAD.top + PLOT_H; // 162

// Booking Y scale: 150 → 460
const B_MIN = 150;
const B_MAX = 460;

// Revenue Y scale: $18k → $57k
const R_MIN = 18000;
const R_MAX = 57000;

// Y tick marks for left axis (bookings)
const B_TICKS = [150, 200, 250, 300, 350, 400, 450];
// Y tick marks for right axis (revenue)
const R_TICKS = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000];

function xOf(i: number) {
  return PAD.left + (i / (chartData.length - 1)) * PLOT_W;
}
function bYOf(v: number) {
  return PAD.top + PLOT_H - ((v - B_MIN) / (B_MAX - B_MIN)) * PLOT_H;
}
function rYOf(v: number) {
  return PAD.top + PLOT_H - ((v - R_MIN) / (R_MAX - R_MIN)) * PLOT_H;
}

/** Catmull-Rom → cubic bezier smooth path */
function smoothPath(pts: [number, number][], t = 0.18): string {
  if (pts.length < 2) return "";
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const cp1x = p1[0] + t * (p2[0] - p0[0]);
    const cp1y = p1[1] + t * (p2[1] - p0[1]);
    const cp2x = p2[0] - t * (p3[0] - p1[0]);
    const cp2y = p2[1] - t * (p3[1] - p1[1]);
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function areaPath(pts: [number, number][], baseY: number, t = 0.18): string {
  const line = smoothPath(pts, t);
  const n = pts.length;
  return `${line} L${pts[n - 1][0].toFixed(1)},${baseY.toFixed(1)} L${pts[0][0].toFixed(1)},${baseY.toFixed(1)} Z`;
}

// ─── Toggle type ─────────────────────────────────────────────────────────────

type View = "booking" | "revenue" | "both";

// ─── Component ───────────────────────────────────────────────────────────────

export function BookingsRevenueChart() {
  const [view, setView] = useState<View>("both");

  // Pre-compute point arrays
  const bookingPts = chartData.map(
    (d, i) => [xOf(i), bYOf(d.bookings)] as [number, number]
  );
  const revenuePts = chartData.map(
    (d, i) => [xOf(i), rYOf(d.revenue)] as [number, number]
  );

  const showBooking = view === "booking" || view === "both";
  const showRevenue = view === "revenue" || view === "both";

  const toggleBtn = (label: string, key: View) => (
    <button
      key={key}
      onClick={() => setView(key)}
      className={cn(
        "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
        view === key
          ? "border border-gray-200 bg-white text-[#1A1A2E] shadow-xs"
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      {label}
    </button>
  );

  // X-axis labels — show every other date to avoid crowding
  const xLabels = chartData.filter((_, i) => i % 2 === 0);

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-[#1A1A2E]">
            Bookings &amp; Revenue
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Daily volume &mdash; last 14 days
          </p>
        </div>
        {/* Toggle */}
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-50 p-0.5">
          {toggleBtn("Booking", "booking")}
          {toggleBtn("Revenue", "revenue")}
          {toggleBtn("Both", "both")}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5">
        {showBooking && (
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 rounded-full bg-[#1A1A2E]" />
            <span className="text-[12px] text-gray-500">Bookings</span>
          </div>
        )}
        {showRevenue && (
          <div className="flex items-center gap-2">
            <svg width="24" height="2" className="overflow-visible">
              <line
                x1="0"
                y1="1"
                x2="24"
                y2="1"
                stroke="#C9963F"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[12px] text-gray-500">Revenue</span>
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <div className="mt-4 flex-1 min-h-0" style={{ minHeight: 180 }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            {/* Booking gradient */}
            <linearGradient id="grad-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#1A1A2E" stopOpacity="0" />
            </linearGradient>
            {/* Revenue gradient */}
            <linearGradient id="grad-r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9963F" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#C9963F" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines (use booking tick values) */}
          {B_TICKS.map((tick) => {
            const y = bYOf(tick);
            return (
              <line
                key={tick}
                x1={PAD.left}
                y1={y}
                x2={PAD.left + PLOT_W}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Left Y-axis labels (Bookings) */}
          {B_TICKS.map((tick) => (
            <text
              key={tick}
              x={PAD.left - 6}
              y={bYOf(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="9"
              fill="#9CA3AF"
            >
              {tick}
            </text>
          ))}

          {/* Right Y-axis labels (Revenue) */}
          {R_TICKS.map((tick) => (
            <text
              key={tick}
              x={PAD.left + PLOT_W + 6}
              y={rYOf(tick)}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize="9"
              fill="#C9963F"
              opacity="0.7"
            >
              {`$${tick / 1000}k`}
            </text>
          ))}

          {/* X-axis labels */}
          {xLabels.map((d, idx) => {
            const realIdx = idx * 2;
            return (
              <text
                key={d.date}
                x={xOf(realIdx)}
                y={BASELINE_Y + 14}
                textAnchor="middle"
                fontSize="8.5"
                fill="#9CA3AF"
              >
                {d.date}
              </text>
            );
          })}

          {/* Booking area fill */}
          {showBooking && (
            <path
              d={areaPath(bookingPts, BASELINE_Y)}
              fill="url(#grad-b)"
            />
          )}

          {/* Revenue area fill */}
          {showRevenue && (
            <path
              d={areaPath(revenuePts, BASELINE_Y)}
              fill="url(#grad-r)"
            />
          )}

          {/* Booking line */}
          {showBooking && (
            <path
              d={smoothPath(bookingPts)}
              fill="none"
              stroke="#1A1A2E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Revenue dashed line */}
          {showRevenue && (
            <path
              d={smoothPath(revenuePts)}
              fill="none"
              stroke="#C9963F"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
