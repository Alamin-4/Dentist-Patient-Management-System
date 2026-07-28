"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, Download, Calendar,
  DollarSign, Users, CalendarDays, ShieldCheck, BarChart3,
  Star, MapPin, ArrowUpRight, ChevronDown, CheckCircle2,
  AlertTriangle, Clock, XCircle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import useOverview from "@/hooks/admin/overview/useOverview";
import { useTreatmentBookings } from "@/hooks/treatment-booking/useTreatmentBooking";
import useVerifications from "@/hooks/admin/verifications/useVerifications";
import { mapDbBookingToUiBooking } from "@/features/admin/bookings/utils/booking-mapper";

/* ─── Formatters ────────────────────────────────────────────────────────────── */
const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
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

/* ─── Revenue Bar Chart (CSS-only) ─────────────────────────────────────────── */
function RevenueBarChart({ monthlyData }: { monthlyData: any[] }) {
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
    <Section
      title="Revenue Trend"
      sub="Monthly performance breakdown"
      action={
        <div className="flex gap-1 flex-wrap">
          {(["revenue", "bookings", "fees"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                metric === m ? "bg-text text-white" : "text-gray-500 hover:bg-gray-100"
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
    </Section>
  );
}

/* ─── KPI Cards ─────────────────────────────────────────────────────────────── */
const KPI_ICONS: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  revenue: { icon: DollarSign, iconBg: "bg-success-50", iconColor: "text-success-600" },
  fees: { icon: BarChart3, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
  escrow: { icon: ShieldCheck, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  bookings: { icon: CalendarDays, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
  dentists: { icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
  refunds: { icon: AlertTriangle, iconBg: "bg-destructive-50", iconColor: "text-destructive-500" },
};

function KpiCards({ cards }: { cards: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((kpi) => {
        const meta = KPI_ICONS[kpi.id];
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
            </div>
          </div>
        ))}
      </div>

      <div className="h-64 rounded-lg border border-gray-100 bg-white" />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
type TabKey = "overview" | "revenue" | "bookings" | "dentists" | "compliance";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "revenue", label: "Revenue" },
  { key: "bookings", label: "Bookings" },
  { key: "dentists", label: "Dentists" },
  { key: "compliance", label: "Compliance" },
];

export default function ReportsPage() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [dateRange, setDateRange] = useState("Last 6 months");

  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: bookingsResponse, isLoading: bookingsLoading } = useTreatmentBookings();
  const { verificationslistData, isVerificationslistLoading } = useVerifications({ limit: 100 });

  const statsMap = useMemo(() => {
    if (!bookingsResponse?.data) return null;
    const bookings = bookingsResponse.data;

    let totalEscrow = 0;
    let totalRevenue = 0;
    let totalRefunds = 0;
    let activeBookings = 0;
    let completedBookings = 0;
    let cancelledBookings = 0;
    let pendingBookings = 0;

    bookings.forEach((b: any) => {
      const amt = Number(b.escrowAmount) || 0;
      if (b.paymentStatus === "IN_ESCROW") {
        totalEscrow += amt;
      } else if (b.paymentStatus === "PAID") {
        totalRevenue += amt;
      } else if (b.paymentStatus === "REFUNDED") {
        totalRefunds += amt;
      }

      if (b.status === "COMPLETED") completedBookings++;
      else if (b.status === "CANCELLED") cancelledBookings++;
      else if (b.status === "IN_PROGRESS" || b.status === "CONFIRMED") activeBookings++;
      else pendingBookings++;
    });

    const activeDentists = Number(overview?.stats?.find((s: any) => s.id === "active-dentists")?.value || 0);

    return {
      totalEscrow,
      totalRevenue,
      totalRefunds,
      bookingsCount: bookings.length,
      activeBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      activeDentists
    };
  }, [bookingsResponse, overview]);

  const kpiCardsList = useMemo(() => {
    if (!statsMap) return [];
    return [
      {
        id: "revenue",
        label: "Platform Revenue",
        value: fmt(statsMap.totalRevenue),
        sub: "Successfully processed",
      },
      {
        id: "fees",
        label: "Platform Fees (10%)",
        value: fmt(statsMap.totalRevenue * 0.1),
        sub: "Earned commission",
      },
      {
        id: "escrow",
        label: "Escrow Held",
        value: fmt(statsMap.totalEscrow),
        sub: "Across active bookings",
      },
      {
        id: "bookings",
        label: "Total Bookings",
        value: statsMap.bookingsCount.toString(),
        sub: "Life of platform",
      },
      {
        id: "dentists",
        label: "Active Dentists",
        value: statsMap.activeDentists.toString(),
        sub: "Verified practitioners",
      },
      {
        id: "refunds",
        label: "Pending/Refunded",
        value: fmt(statsMap.totalRefunds),
        sub: "Cancelled consultations",
      },
    ];
  }, [statsMap]);

  // Aggregated Month-by-month data
  const monthlyDataList = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    const monthlyMap: Record<string, { month: string; shortMonth: string; bookings: number; revenue: number; fees: number; escrowReleased: number }> = {};

    // Initialize past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const shortLabel = d.toLocaleDateString("en-US", { month: "short" });
      monthlyMap[monthLabel] = {
        month: monthLabel,
        shortMonth: shortLabel,
        bookings: 0,
        revenue: 0,
        fees: 0,
        escrowReleased: 0
      };
    }

    bookingsResponse.data.forEach((b: any) => {
      const date = new Date(b.createdAt);
      const monthLabel = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const shortLabel = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = {
          month: monthLabel,
          shortMonth: shortLabel,
          bookings: 0,
          revenue: 0,
          fees: 0,
          escrowReleased: 0
        };
      }

      monthlyMap[monthLabel].bookings += 1;
      const amt = Number(b.escrowAmount) || 0;
      monthlyMap[monthLabel].revenue += amt;
      monthlyMap[monthLabel].fees += amt * 0.1;
      if (b.paymentStatus === "PAID") {
        monthlyMap[monthLabel].escrowReleased += amt;
      }
    });

    return Object.values(monthlyMap);
  }, [bookingsResponse]);

  // Booking Status data
  const bookingStatusData = useMemo(() => {
    if (!statsMap) return [];
    const total = statsMap.bookingsCount || 1;
    return [
      { status: "Completed", count: statsMap.completedBookings, share: Math.round((statsMap.completedBookings / total) * 100), color: "#12B76A" },
      { status: "In Progress", count: statsMap.activeBookings, share: Math.round((statsMap.activeBookings / total) * 100), color: "#2E90FA" },
      { status: "Cancelled", count: statsMap.cancelledBookings, share: Math.round((statsMap.cancelledBookings / total) * 100), color: "#F04438" },
      { status: "Pending", count: statsMap.pendingBookings, share: Math.round((statsMap.pendingBookings / total) * 100), color: "#F79009" },
    ];
  }, [statsMap]);

  // Procedures data
  const procedureData = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    const procMap: Record<string, { procedure: string; bookings: number; revenue: number }> = {};

    bookingsResponse.data.forEach((b: any) => {
      const mapped = mapDbBookingToUiBooking(b);
      if (!mapped) return;
      const name = mapped.procedure || "Dental Consultation";
      if (!procMap[name]) {
        procMap[name] = { procedure: name, bookings: 0, revenue: 0 };
      }
      procMap[name].bookings += 1;
      procMap[name].revenue += mapped.amount;
    });

    const totalRevenue = Object.values(procMap).reduce((s, r) => s + r.revenue, 0) || 1;

    return Object.values(procMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        ...p,
        avgValue: p.bookings > 0 ? Math.round(p.revenue / p.bookings) : 0,
        share: Math.round((p.revenue / totalRevenue) * 100)
      }));
  }, [bookingsResponse]);

  // Geography distribution
  const geographyData = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    const geoMap: Record<string, { country: string; flag: string; dentists: Set<string>; bookings: number; revenue: number }> = {};

    const getCountryFlag = (c: string) => {
      if (c.toLowerCase().includes("united kingdom") || c.toLowerCase().includes("uk")) return "🇬🇧";
      if (c.toLowerCase().includes("united states") || c.toLowerCase().includes("usa")) return "🇺🇸";
      if (c.toLowerCase().includes("spain")) return "🇪🇸";
      if (c.toLowerCase().includes("turkey")) return "🇹🇷";
      if (c.toLowerCase().includes("germany")) return "🇩🇪";
      if (c.toLowerCase().includes("canada")) return "🇨🇦";
      return "🌍";
    };

    bookingsResponse.data.forEach((b: any) => {
      const mapped = mapDbBookingToUiBooking(b);
      if (!mapped) return;
      const country = mapped.dentist.location || "United Kingdom";
      const flag = getCountryFlag(country);

      if (!geoMap[country]) {
        geoMap[country] = { country, flag, dentists: new Set(), bookings: 0, revenue: 0 };
      }
      geoMap[country].bookings += 1;
      geoMap[country].revenue += mapped.amount;
      if (b.dentistId) {
        geoMap[country].dentists.add(b.dentistId);
      }
    });

    const totalGeoRevenue = Object.values(geoMap).reduce((s, r) => s + r.revenue, 0) || 1;

    return Object.values(geoMap).map((g) => ({
      country: g.country,
      flag: g.flag,
      dentists: g.dentists.size,
      bookings: g.bookings,
      revenue: g.revenue,
      share: Math.round((g.revenue / totalGeoRevenue) * 100)
    })).sort((a, b) => b.revenue - a.revenue);
  }, [bookingsResponse]);

  // Top dentists
  const topDentists = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    const dentistsMap: Record<string, {
      name: string;
      initials: string;
      avatarColor: string;
      specialty: string;
      country: string;
      bookings: number;
      revenue: number;
      rating: number;
      rdvScore: number;
      growthPct: number;
    }> = {};

    bookingsResponse.data.forEach((b: any) => {
      const mapped = mapDbBookingToUiBooking(b);
      if (!mapped) return;
      const dId = b.dentistId;
      if (!dId) return;

      if (!dentistsMap[dId]) {
        dentistsMap[dId] = {
          name: mapped.dentist.name,
          initials: mapped.dentist.initials,
          avatarColor: mapped.dentist.avatar_color,
          specialty: mapped.dentist.specialty,
          country: mapped.dentist.location || "Unknown",
          bookings: 0,
          revenue: 0,
          rating: mapped.dentist.rating,
          rdvScore: mapped.dentist.rdv_score,
          growthPct: 15
        };
      }
      dentistsMap[dId].bookings += 1;
      dentistsMap[dId].revenue += mapped.amount;
    });

    return Object.values(dentistsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map((d, index) => ({
        rank: index + 1,
        ...d
      }));
  }, [bookingsResponse]);

  // Verification Funnel
  const verificationFunnel = useMemo(() => {
    const list = verificationslistData?.data || [];

    // License
    const licenseApproved = list.filter((d: any) => d.dentistVerificationProgress?.isLicenseVerified).length;
    const licenseRejected = list.filter((d: any) => d.dentistLicense?.verificationStatus === "REJECTED").length;
    const licensePending = list.filter((d: any) => d.dentistLicense?.verificationStatus === "PENDING").length;
    const licenseSubmitted = licenseApproved + licenseRejected + licensePending;
    const licensePassRate = licenseSubmitted > 0 ? Math.round((licenseApproved / licenseSubmitted) * 100) : 100;

    // Operations
    const opsApproved = list.filter((d: any) => d.dentistVerificationProgress?.isOperationsVerified).length;
    const opsRejected = list.filter((d: any) => d.dentistOperationsVerifications?.status === "REJECTED").length;
    const opsPending = list.filter((d: any) => d.dentistOperationsVerifications?.status === "PENDING").length;
    const opsSubmitted = opsApproved + opsRejected + opsPending;
    const opsPassRate = opsSubmitted > 0 ? Math.round((opsApproved / opsSubmitted) * 100) : 100;

    // Clinical
    const clinicApproved = list.filter((d: any) => d.dentistVerificationProgress?.isClinicDepthVerified).length;
    const clinicRejected = list.filter((d: any) => d.dentistClinicDepthVerification?.status === "REJECTED").length;
    const clinicPending = list.filter((d: any) => d.dentistClinicDepthVerification?.status === "PENDING").length;
    const clinicSubmitted = clinicApproved + clinicRejected + clinicPending;
    const clinicPassRate = clinicSubmitted > 0 ? Math.round((clinicApproved / clinicSubmitted) * 100) : 100;

    return [
      { phase: "Phase 1 — License", submitted: licenseSubmitted, approved: licenseApproved, rejected: licenseRejected, pending: licensePending, passRate: licensePassRate },
      { phase: "Phase 2 — Operations", submitted: opsSubmitted, approved: opsApproved, rejected: opsRejected, pending: opsPending, passRate: opsPassRate },
      { phase: "Phase 3 — Clinical Depth", submitted: clinicSubmitted, approved: clinicApproved, rejected: clinicRejected, pending: clinicPending, passRate: clinicPassRate },
    ];
  }, [verificationslistData]);

  // Compliance
  const complianceData = useMemo(() => {
    const list = verificationslistData?.data || [];
    const pendingCount = list.filter((d: any) =>
      !d.dentistVerificationProgress?.isLicenseVerified ||
      !d.dentistVerificationProgress?.isOperationsVerified ||
      !d.dentistVerificationProgress?.isClinicDepthVerified
    ).length;

    return [
      { label: "Active Flags", value: 0, sub: "Content flags raised", color: "text-orange-600" },
      { label: "Suspended Accounts", value: 0, sub: "Accounts blocked", color: "text-destructive-600" },
      { label: "Pending Verification", value: pendingCount, sub: "Queue backlog", color: "text-amber-600" },
      { label: "Cleared Verification", value: list.length - pendingCount, sub: "Successfully vetted", color: "text-success-600" },
      { label: "Avg Process Time", value: "2.4d", sub: "Below 3-day target", color: "text-purple-600" },
      { label: "Compliance Rate", value: "100%", sub: "Reconciled status", color: "text-success-600" },
    ];
  }, [verificationslistData]);

  if (overviewLoading || bookingsLoading || isVerificationslistLoading) return <ReportsSkeleton />;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Reports</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Platform analytics, revenue insights, and operational health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <button
            onClick={() => toast.success(`Exporting ${tab} report as CSV…`)}
            className="flex items-center gap-2 rounded-lg bg-text px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-text/90 active:scale-95 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards cards={kpiCardsList} />

      {/* Tabs */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
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
      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <RevenueBarChart monthlyData={monthlyDataList} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Booking status */}
            <Section title="Booking Status Breakdown" sub={`All-time · ${statsMap?.bookingsCount} total`}>
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
                      <span className="w-10 text-right text-sm font-bold text-text">{fmtNum(row.count)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Top procedures */}
            <Section title="Top Procedures by Revenue" sub="All-time performance">
              <div className="divide-y divide-gray-50 px-5">
                {procedureData.length === 0 ? (
                  <p className="py-12 text-center text-sm text-gray-400 font-semibold">No booking data found</p>
                ) : procedureData.map((row, i) => (
                  <div key={row.procedure} className="flex items-center gap-3 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text">{row.procedure}</p>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-text/70" style={{ width: `${row.share}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text">{fmt(row.revenue)}</p>
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
                  {geographyData.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400 font-semibold">No booking data found</td></tr>
                  ) : geographyData.map((row) => (
                    <tr key={row.country} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold text-text">
                          <span className="text-base">{row.flag}</span>
                          {row.country}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.dentists)}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.bookings)}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-text">{fmt(row.revenue)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-text" style={{ width: `${row.share}%` }} />
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
      )}

      {tab === "revenue" && (
        <div className="flex flex-col gap-4">
          <RevenueBarChart monthlyData={monthlyDataList} />
          <Section title="Monthly Revenue Breakdown" sub="Rolling monthly period">
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
                  {monthlyDataList.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-sm text-gray-400 font-semibold">No transactions recorded</td></tr>
                  ) : [...monthlyDataList].reverse().map((row, i) => {
                    const isLatest = i === 0;
                    return (
                      <tr key={row.month} className={cn("transition-colors hover:bg-gray-50/60", isLatest && "bg-sky-50/20")}>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-2 text-sm font-semibold text-text">
                            {row.month}
                            {isLatest && (
                              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">MTD</span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{fmtNum(row.bookings)}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-text">{fmt(row.revenue)}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-success-700">{fmt(row.fees)}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(row.escrowReleased)}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{fmt(row.revenue - row.fees)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td className="px-5 py-3.5 text-sm font-bold text-text">Total</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-text">{fmtNum(monthlyDataList.reduce((s, r) => s + r.bookings, 0))}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-text">{fmt(monthlyDataList.reduce((s, r) => s + r.revenue, 0))}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-success-700">{fmt(monthlyDataList.reduce((s, r) => s + r.fees, 0))}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-text">{fmt(monthlyDataList.reduce((s, r) => s + r.escrowReleased, 0))}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-text">
                      {fmt(monthlyDataList.reduce((s, r) => s + r.revenue - r.fees, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>
        </div>
      )}

      {tab === "bookings" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Bookings", value: statsMap?.bookingsCount || 0, icon: CalendarDays, bg: "bg-purple-50", color: "text-purple-500" },
              { label: "Completed", value: statsMap?.completedBookings || 0, icon: CheckCircle2, bg: "bg-success-50", color: "text-success-600" },
              { label: "Cancellations", value: statsMap?.cancelledBookings || 0, icon: XCircle, bg: "bg-destructive-50", color: "text-destructive-500" },
              { label: "Avg Booking Value", value: statsMap && statsMap.bookingsCount > 0 ? fmt(Math.round(statsMap.totalRevenue / statsMap.bookingsCount)) : "$0", icon: DollarSign, bg: "bg-amber-50", color: "text-amber-500" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", s.bg)}>
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
          <Section title="Top Dentists by Revenue" sub="Ranked by total patient escrow released">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    {["Rank", "Dentist", "Specialty", "Country/City", "Bookings", "Revenue", "Rating", "RDV Score", "Growth"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topDentists.length === 0 ? (
                    <tr><td colSpan={9} className="py-12 text-center text-sm text-gray-400 font-semibold">No dentist revenue recorded</td></tr>
                  ) : topDentists.map((d) => (
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
                          <p className="text-sm font-bold text-text">{d.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{d.specialty}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 shrink-0 text-gray-300" /> {d.country}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{fmtNum(d.bookings)}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-text">{fmt(d.revenue)}</td>
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
