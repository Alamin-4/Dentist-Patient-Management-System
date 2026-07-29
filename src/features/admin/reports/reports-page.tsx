"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Download, Calendar,
  Star, MapPin, ArrowUpRight, ChevronDown, CheckCircle2,
  AlertTriangle, Clock, XCircle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { useReportsPageController, TabKey } from "@/core/hooks/admin/useReportsPageController";
import { RevenueBarChart } from "./components/RevenueBarChart";
import { KpiCards } from "./components/KpiCards";
import { GeographyTable } from "./components/GeographyTable";
import { TopDentistsTable } from "./components/TopDentistsTable";

/* ─── Formatters ────────────────────────────────────────────────────────────── */
const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

/* ─── Section wrapper ───────────────────────────────────────────────────────── */
function Section({ title, sub, action, children }: {
  title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-text">{title}</h3>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
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
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
      >
        <Calendar className="h-3.5 w-3.5 text-gray-400" />
        {value}
        <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
            {DATE_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false); }}
                className={cn("w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                  value === r ? "font-semibold text-text" : "text-gray-600")}
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

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */
function ReportsSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 rounded bg-gray-200" />
          <div className="h-10 w-24 rounded bg-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="h-9 w-9 rounded bg-gray-200" />
            <div className="mt-3 space-y-1.5">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-3.5 w-16 rounded bg-gray-200" />
              <div className="h-3 w-12 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-gray-100 bg-white h-72" />
        <div className="rounded-lg border border-gray-100 bg-white h-72" />
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function ReportsPage() {
  const {
    tab,
    setTab,
    dateRange,
    setDateRange,
    isLoading,
    kpiCardsList,
    monthlyDataList,
    bookingStatusData,
    procedureData,
    geographyData,
    topDentists,
    verificationFunnel,
    complianceData,
    statsMap,
  } = useReportsPageController();

  const handleExport = () => {
    toast.success("CSV export initialized!");
  };

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  const tabOptions = [
    { key: "overview", label: "Overview" },
    { key: "revenue", label: "Revenue Detail" },
    { key: "bookings", label: "Bookings" },
    { key: "dentists", label: "Dentists & Verification" },
    { key: "compliance", label: "Compliance & Safety" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text lg:text-3xl">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor transaction volumes, compliance funnels, and operator performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-px">
        <CustomTab
          tabs={tabOptions}
          active={tab}
          onChange={(key) => setTab(key as TabKey)}
        />
      </div>

      {/* KPI Stats Grid */}
      <KpiCards cards={kpiCardsList} />

      {/* Tab Panels */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueBarChart monthlyData={monthlyDataList} />
          </div>

          <div className="flex flex-col gap-4">
            <Section title="Verifications Cohort" sub="Active verification pipeline">
              <div className="divide-y divide-gray-50 px-5">
                {verificationFunnel.map((row) => (
                  <div key={row.phase} className="flex items-center justify-between gap-4 py-4.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text">{row.phase}</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-success-500" style={{ width: `${row.passRate}%` }} />
                      </div>
                    </div>
                    <span className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
                      row.passRate >= 85 ? "bg-success-50 text-success-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {row.passRate}% pass
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Active Bookings Status" sub="Pending checkout vs ongoing">
              <div className="flex flex-col gap-3 px-5 py-4.5">
                {bookingStatusData.map((row) => (
                  <div key={row.status} className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                      {row.status}
                    </span>
                    <span className="text-text">{fmtNum(row.count)} ({row.share}%)</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {tab === "revenue" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GeographyTable geographyData={geographyData} />
          </div>

          <Section title="Escrow Allocation Status" sub="Breakdown of funds distribution">
            <div className="flex flex-col gap-6 p-5">
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-3xl font-bold tracking-tight text-text">
                  {fmt(statsMap?.totalEscrow || 0)}
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-400">Total Funds in Hold Status</p>
              </div>
              <div className="space-y-3.5">
                {[
                  { label: "Active Escrow Dep.", value: fmt(statsMap?.totalEscrow || 0), pct: 100, color: "bg-amber-500" },
                  { label: "Released Payouts", value: fmt(statsMap?.totalRevenue || 0), pct: 0, color: "bg-success-500" },
                  { label: "Processing Refunds", value: fmt(statsMap?.totalRefunds || 0), pct: 0, color: "bg-destructive-400" },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-text">{row.value}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {tab === "bookings" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Bookings", value: fmtNum(statsMap?.bookingsCount || 0), icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Active Operations", value: fmtNum(statsMap?.activeBookings || 0), icon: Clock, color: "text-sky-600", bg: "bg-sky-50" },
              { label: "Completed Journeys", value: fmtNum(statsMap?.completedBookings || 0), icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50" },
              { label: "Cancelled consultations", value: fmtNum(statsMap?.cancelledBookings || 0), icon: XCircle, color: "text-destructive-600", bg: "bg-destructive-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", s.bg)}>
                    <Icon className={cn("h-4.5 w-4.5", s.color)} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-text">{s.value}</p>
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
                      <span className="w-10 text-right text-base font-bold text-text">{fmtNum(row.count)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Procedure Performance" sub="Revenue per procedure">
              <div className="divide-y divide-gray-50 px-5">
                {procedureData.length === 0 ? (
                  <p className="py-12 text-center text-sm text-gray-400 font-semibold">No booking data found</p>
                ) : procedureData.map((row, i) => (
                  <div key={row.procedure} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-semibold text-text">{row.procedure}</p>
                      <p className="text-xs text-gray-400">{fmtNum(row.bookings)} bookings · avg {fmt(row.avgValue)}</p>
                    </div>
                    <p className="text-sm font-bold text-text">{fmt(row.revenue)}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {tab === "dentists" && (
        <div className="flex flex-col gap-4">
          <TopDentistsTable topDentists={topDentists} />

          <Section title="Verification Funnel" sub="Current cohort · All phases">
            <div className="divide-y divide-gray-50 px-5">
              {verificationFunnel.map((row) => (
                <div key={row.phase} className="py-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text">{row.phase}</p>
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      row.passRate >= 85 ? "bg-success-50 text-success-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {row.passRate}% pass rate
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Submitted", val: row.submitted, color: "text-gray-700", dot: "bg-gray-400" },
                      { label: "Approved", val: row.approved, color: "text-success-700", dot: "bg-success-500" },
                      { label: "Rejected", val: row.rejected, color: "text-destructive-600", dot: "bg-destructive-400" },
                      { label: "Pending", val: row.pending, color: "text-amber-600", dot: "bg-amber-400" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
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
      )}

      {tab === "compliance" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {complianceData.map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm text-center">
                <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
                <p className="mt-1 text-xs font-semibold text-text">{item.label}</p>
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
                      <p className="text-sm font-semibold text-text">{row.phase}</p>
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
                  { label: "Escrow Accuracy", val: "100%", ok: true, note: "All funds reconciled" },
                  { label: "Avg Verification Time", val: "2.4d", ok: true, note: "Below 3-day target" },
                  { label: "Fake Review Detection", val: "95%", ok: true, note: "AI scan screening active" },
                  { label: "Refund Processing Time", val: "1.2d", ok: true, note: "Below 2-day target" },
                  { label: "Open Investigations", val: "0", ok: true, note: "No active compliance flags" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      {item.ok
                        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                        : <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">{item.label}</p>
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
      )}
    </div>
  );
}
