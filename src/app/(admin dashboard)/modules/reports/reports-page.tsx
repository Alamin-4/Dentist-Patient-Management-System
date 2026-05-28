"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Download, Calendar,
  DollarSign, Users, CalendarDays, ShieldCheck, BarChart3,
  Star, MapPin, ArrowUpRight, ChevronDown, CheckCircle2,
  AlertTriangle, Clock, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  kpiCards, monthlyData, topDentists, procedureData,
  bookingStatusData, verificationFunnel, complianceData, geographyData,
} from "@/lib/reports-data";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";

/* ─── Formatters ────────────────────────────────────────────────────────────── */
const fmt    = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `£${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

/* ─── Avatar ────────────────────────────────────────────────────────────────── */
function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", sz)}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}


/* ─── Section wrapper ───────────────────────────────────────────────────────── */
function Section({ title, sub, action, children }: {
  title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A2E]">{title}</h3>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Revenue Bar Chart (CSS-only) ─────────────────────────────────────────── */
function RevenueBarChart() {
  const [metric, setMetric] = useState<"revenue" | "bookings" | "fees">("revenue");

  const vals = monthlyData.map((r) => r[metric]);
  const max  = Math.max(...vals);

  const labels: Record<typeof metric, string> = {
    revenue:  "Gross Revenue",
    bookings: "Bookings",
    fees:     "Platform Fees",
  };

  const formatVal = (v: number) => metric === "bookings" ? String(v) : fmt(v);

  return (
    <Section
      title="Revenue Trend"
      sub="Last 6 months"
      action={
        <div className="flex gap-1 flex-wrap">
          {(["revenue", "bookings", "fees"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                metric === m ? "bg-[#1A1A2E] text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {labels[m]}
            </button>
          ))}
        </div>
      }
    >
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
              const v      = row[metric];
              const h      = max > 0 ? (v / max) * 100 : 0;
              const isLast = i === monthlyData.length - 1;
              return (
                <div key={row.month} className="group relative flex flex-1 flex-col items-center">
                  {/* Hover tooltip */}
                  <div className="pointer-events-none absolute bottom-full mb-2 hidden rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg group-hover:block z-10 whitespace-nowrap text-center">
                    <p className="text-xs font-bold text-[#1A1A2E]">{formatVal(v)}</p>
                    <p className="text-[10px] text-gray-400">{row.month}</p>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-t-lg" style={{ height: `${h}%` }}>
                    <div className={cn(
                      "absolute inset-0 rounded-t-lg transition-all",
                      isLast ? "bg-[#1A1A2E]" : "bg-[#1A1A2E]/20 group-hover:bg-[#1A1A2E]/50"
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
          { label: "Total Revenue",  value: fmt(monthlyData.reduce((s, r) => s + r.revenue, 0)) },
          { label: "Total Fees",     value: fmt(monthlyData.reduce((s, r) => s + r.fees, 0)) },
          { label: "Total Bookings", value: fmtNum(monthlyData.reduce((s, r) => s + r.bookings, 0)) },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5 py-3.5">
            <p className="text-[11px] font-medium text-gray-400">{s.label}</p>
            <p className="text-lg font-bold text-[#1A1A2E]">{s.value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─── KPI Cards ─────────────────────────────────────────────────────────────── */
const KPI_ICONS: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  revenue:  { icon: DollarSign,    iconBg: "bg-success-50",        iconColor: "text-success-600"     },
  fees:     { icon: BarChart3,     iconBg: "bg-sky-50",             iconColor: "text-sky-600"         },
  escrow:   { icon: ShieldCheck,   iconBg: "bg-amber-50",           iconColor: "text-amber-500"       },
  bookings: { icon: CalendarDays,  iconBg: "bg-purple-50",          iconColor: "text-purple-500"      },
  dentists: { icon: Users,         iconBg: "bg-gray-100",           iconColor: "text-gray-600"        },
  refunds:  { icon: AlertTriangle, iconBg: "bg-destructive-50",     iconColor: "text-destructive-500" },
};

function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {kpiCards.map((kpi) => {
        const meta = KPI_ICONS[kpi.id];
        const Icon = meta.icon;
        return (
          <div key={kpi.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", meta.iconBg)}>
                <Icon className={cn("h-4.5 w-4.5", meta.iconColor)} />
              </div>
              {kpi.trend !== 0 && (
                <span className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  kpi.trendDir === "up"   ? "bg-success-50 text-success-700"         :
                  kpi.trendDir === "down" ? "bg-destructive-50 text-destructive-700" :
                  "bg-gray-100 text-gray-500"
                )}>
                  {kpi.trendDir === "up"
                    ? <TrendingUp className="h-2.5 w-2.5" />
                    : <TrendingDown className="h-2.5 w-2.5" />}
                  {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-[#1A1A2E]">{kpi.value}</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">{kpi.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-400">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Overview Tab ──────────────────────────────────────────────────────────── */
function OverviewTab() {
  return (
    <div className="flex flex-col gap-4">
      <RevenueBarChart />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Booking status */}
        <Section title="Booking Status Breakdown" sub="All-time · 438 total">
          <div className="divide-y divide-gray-50 px-5">
            {bookingStatusData.map((row) => (
              <div key={row.status} className="flex items-center gap-3 py-3.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="flex-1 text-sm font-medium text-gray-700">{row.status}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${row.share}%`, backgroundColor: row.color }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-gray-500">{row.share}%</span>
                  <span className="w-10 text-right text-sm font-bold text-[#1A1A2E]">{fmtNum(row.count)}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Top procedures */}
        <Section title="Top Procedures by Revenue" sub="All-time performance">
          <div className="divide-y divide-gray-50 px-5">
            {procedureData.map((row, i) => (
              <div key={row.procedure} className="flex items-center gap-3 py-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1A1A2E]">{row.procedure}</p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#1A1A2E]/70" style={{ width: `${row.share}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A1A2E]">{fmt(row.revenue)}</p>
                  <p className="text-[10px] text-gray-400">{fmtNum(row.bookings)} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Geography */}
      <Section title="Revenue by Country" sub="Dentist locations · All-time">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {["Country", "Dentists", "Bookings", "Revenue", "Share"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {geographyData.map((row) => (
                <tr key={row.country} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
                      <span className="text-base">{row.flag}</span>
                      {row.country}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.dentists)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.bookings)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#1A1A2E]">{fmt(row.revenue)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#1A1A2E]" style={{ width: `${row.share}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{row.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ─── Revenue Tab ───────────────────────────────────────────────────────────── */
function RevenueTab() {
  return (
    <div className="flex flex-col gap-4">
      <RevenueBarChart />
      <Section title="Monthly Revenue Breakdown" sub="6-month period · Dec 2025 – May 2026">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {["Month", "Bookings", "Gross Revenue", "Platform Fees (10%)", "Escrow Released", "Net to Dentists"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...monthlyData].reverse().map((row, i) => {
                const isLatest = i === 0;
                return (
                  <tr key={row.month} className={cn("transition-colors hover:bg-gray-50/60", isLatest && "bg-sky-50/20")}>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
                        {row.month}
                        {isLatest && (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">MTD</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmtNum(row.bookings)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#1A1A2E]">{fmt(row.revenue)}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-success-700">{fmt(row.fees)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(row.escrowReleased)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(row.revenue - row.fees)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-5 py-3.5 text-sm font-bold text-[#1A1A2E]">6-Month Total</td>
                <td className="px-5 py-3.5 text-sm font-bold text-[#1A1A2E]">{fmtNum(monthlyData.reduce((s, r) => s + r.bookings, 0))}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-[#1A1A2E]">{fmt(monthlyData.reduce((s, r) => s + r.revenue, 0))}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-success-700">{fmt(monthlyData.reduce((s, r) => s + r.fees, 0))}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-[#1A1A2E]">{fmt(monthlyData.reduce((s, r) => s + r.escrowReleased, 0))}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-[#1A1A2E]">
                  {fmt(monthlyData.reduce((s, r) => s + r.revenue - r.fees, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ─── Bookings Tab ──────────────────────────────────────────────────────────── */
function BookingsTab() {
  const summaryCards = [
    { label: "Total Bookings",    value: "438",  icon: CalendarDays, bg: "bg-purple-50",          color: "text-purple-500"      },
    { label: "Completed",         value: "274",  icon: CheckCircle2, bg: "bg-success-50",          color: "text-success-600"     },
    { label: "Cancellations",     value: "38",   icon: XCircle,      bg: "bg-destructive-50",      color: "text-destructive-500" },
    { label: "Avg Booking Value", value: "£474", icon: DollarSign,   bg: "bg-amber-50",            color: "text-amber-500"       },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.bg)}>
                <Icon className={cn("h-4.5 w-4.5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1A1A2E]">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Status Breakdown" sub="All bookings">
          <div className="divide-y divide-gray-50 px-5">
            {bookingStatusData.map((row) => (
              <div key={row.status} className="flex items-center gap-3 py-4">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="flex-1 text-sm font-medium text-gray-700">{row.status}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${row.share}%`, backgroundColor: row.color }} />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-gray-400">{row.share}%</span>
                  <span className="w-10 text-right text-base font-bold text-[#1A1A2E]">{fmtNum(row.count)}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Procedure Performance" sub="Revenue per procedure">
          <div className="divide-y divide-gray-50 px-5">
            {procedureData.map((row, i) => (
              <div key={row.procedure} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1A1A2E]">{row.procedure}</p>
                  <p className="text-xs text-gray-400">{fmtNum(row.bookings)} bookings · avg {fmt(row.avgValue)}</p>
                </div>
                <p className="text-sm font-bold text-[#1A1A2E]">{fmt(row.revenue)}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ─── Dentists Tab ──────────────────────────────────────────────────────────── */
function DentistsTab() {
  const summaryCards = [
    { label: "Total Dentists",  value: "1,418", icon: Users,        bg: "bg-gray-100",    color: "text-gray-600"    },
    { label: "Active",          value: "1,284", icon: CheckCircle2, bg: "bg-success-50",  color: "text-success-600" },
    { label: "Pending Verify",  value: "12",    icon: Clock,        bg: "bg-amber-50",    color: "text-amber-500"   },
    { label: "New This Week",   value: "+34",   icon: TrendingUp,   bg: "bg-sky-50",      color: "text-sky-600"     },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.bg)}>
                <Icon className={cn("h-4.5 w-4.5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1A1A2E]">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Section title="Top Dentists by Revenue" sub="All-time · Top 8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                {["Rank", "Dentist", "Specialty", "Country", "Bookings", "Revenue", "Rating", "RDV Score", "Growth"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topDentists.map((d) => (
                <tr key={d.rank} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      d.rank === 1 ? "bg-amber-100 text-amber-700" :
                      d.rank === 2 ? "bg-gray-200 text-gray-600" :
                      d.rank === 3 ? "bg-orange-100 text-orange-600" :
                      "bg-gray-100 text-gray-500"
                    )}>
                      {d.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={d.initials} color={d.avatarColor} size="sm" />
                      <p className="text-sm font-bold text-[#1A1A2E]">{d.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{d.specialty}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3 shrink-0 text-gray-300" /> {d.country}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{fmtNum(d.bookings)}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-[#1A1A2E]">{fmt(d.revenue)}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {d.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                      {d.rdvScore}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success-700">
                      <ArrowUpRight className="h-3.5 w-3.5" /> +{d.growthPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Verification Funnel" sub="Current cohort · All phases">
        <div className="divide-y divide-gray-50 px-5">
          {verificationFunnel.map((row) => (
            <div key={row.phase} className="py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#1A1A2E]">{row.phase}</p>
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold",
                  row.passRate >= 85 ? "bg-success-50 text-success-700" : "bg-amber-50 text-amber-700"
                )}>
                  {row.passRate}% pass rate
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Submitted", val: row.submitted, color: "text-gray-700",        dot: "bg-gray-400" },
                  { label: "Approved",  val: row.approved,  color: "text-success-700",     dot: "bg-success-500" },
                  { label: "Rejected",  val: row.rejected,  color: "text-destructive-600", dot: "bg-destructive-400" },
                  { label: "Pending",   val: row.pending,   color: "text-amber-600",        dot: "bg-amber-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                    <p className={cn("text-xl font-bold", s.color)}>{s.val}</p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-gray-400">
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ─── Compliance Tab ─────────────────────────────────────────────────────────── */
function ComplianceTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {complianceData.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
            <p className="mt-1 text-xs font-semibold text-[#1A1A2E]">{item.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-400">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Verification Pass Rates" sub="By phase · Current cohort">
          <div className="divide-y divide-gray-50 px-5">
            {verificationFunnel.map((row) => (
              <div key={row.phase} className="flex items-center gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{row.phase}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {row.approved} approved · {row.rejected} rejected · {row.pending} pending
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-success-500"
                      style={{ width: `${row.passRate}%` }}
                    />
                  </div>
                </div>
                <span className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-sm font-bold",
                  row.passRate >= 85 ? "bg-success-50 text-success-700" : "bg-amber-50 text-amber-700"
                )}>
                  {row.passRate}%
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Platform Health" sub="System-wide compliance metrics">
          <div className="divide-y divide-gray-50 px-5">
            {[
              { label: "Escrow Accuracy",        val: "99.4%", ok: true,  note: "All funds reconciled" },
              { label: "Avg Verification Time",  val: "2.3d",  ok: true,  note: "Below 3-day target" },
              { label: "Anti-Collusion Rate",    val: "0.6%",  ok: true,  note: "Under 1% threshold" },
              { label: "Fake Review Detection",  val: "94%",   ok: true,  note: "AI model accuracy" },
              { label: "Refund Processing Time", val: "3.1d",  ok: false, note: "Target is <2 days" },
              { label: "Open Investigations",    val: "3",     ok: false, note: "Avg 4.2 days outstanding" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  {item.ok
                    ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                    : <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E]">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                </div>
                <span className={cn("shrink-0 text-sm font-bold", item.ok ? "text-success-700" : "text-amber-600")}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ─── Date Range Selector ───────────────────────────────────────────────────── */
const DATE_RANGES = ["Last 30 days", "Last 90 days", "Last 6 months", "Last 12 months", "All time"];

function DateRangeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
      >
        <Calendar className="h-3.5 w-3.5 text-gray-400" />
        {value}
        <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false); }}
                className={cn("w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                  value === r ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
type TabKey = "overview" | "revenue" | "bookings" | "dentists" | "compliance";

const TABS = [
  { key: "overview",   label: "Overview"   },
  { key: "revenue",    label: "Revenue"    },
  { key: "bookings",   label: "Bookings"   },
  { key: "dentists",   label: "Dentists"   },
  { key: "compliance", label: "Compliance" },
];

export default function ReportsPage() {
  const [tab, setTab]             = useState<TabKey>("overview");
  const [dateRange, setDateRange] = useState("Last 6 months");

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Reports</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Platform analytics, revenue insights, and operational health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <button
            onClick={() => toast.success(`Exporting ${tab} report as CSV…`)}
            className="flex items-center gap-2 rounded-xl bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1A1A2E]/90 active:scale-95 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Tabs */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <CustomTab
            tabs={TABS}
            active={tab}
            onChange={(k) => setTab(k as TabKey)}
            variant="underline"
            className="min-w-max px-2 pt-1"
          />
        </div>
      </div>

      {/* Tab content */}
      {tab === "overview"   && <OverviewTab />}
      {tab === "revenue"    && <RevenueTab />}
      {tab === "bookings"   && <BookingsTab />}
      {tab === "dentists"   && <DentistsTab />}
      {tab === "compliance" && <ComplianceTab />}
    </div>
  );
}
