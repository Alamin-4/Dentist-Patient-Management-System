import { useState, useMemo } from "react";
import useOverview from "@/hooks/admin/overview/useOverview";
import { useTreatmentBookings } from "@/hooks/treatment-booking/useTreatmentBooking";
import useVerifications from "@/hooks/admin/verifications/useVerifications";
import { mapDbBookingToUiBooking } from "@/features/admin/bookings/utils/booking-mapper";

export type TabKey = "overview" | "revenue" | "bookings" | "dentists" | "compliance";

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

export function useReportsPageController() {
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

  const monthlyDataList = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    const monthlyMap: Record<string, { month: string; shortMonth: string; bookings: number; revenue: number; fees: number; escrowReleased: number }> = {};

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

  const verificationFunnel = useMemo(() => {
    const list = verificationslistData?.data || [];

    const licenseApproved = list.filter((d: any) => d.dentistVerificationProgress?.isLicenseVerified).length;
    const licenseRejected = list.filter((d: any) => d.dentistLicense?.verificationStatus === "REJECTED").length;
    const licensePending = list.filter((d: any) => d.dentistLicense?.verificationStatus === "PENDING").length;
    const licenseSubmitted = licenseApproved + licenseRejected + licensePending;
    const licensePassRate = licenseSubmitted > 0 ? Math.round((licenseApproved / licenseSubmitted) * 100) : 100;

    const opsApproved = list.filter((d: any) => d.dentistVerificationProgress?.isOperationsVerified).length;
    const opsRejected = list.filter((d: any) => d.dentistOperationsVerifications?.status === "REJECTED").length;
    const opsPending = list.filter((d: any) => d.dentistOperationsVerifications?.status === "PENDING").length;
    const opsSubmitted = opsApproved + opsRejected + opsPending;
    const opsPassRate = opsSubmitted > 0 ? Math.round((opsApproved / opsSubmitted) * 100) : 100;

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
      { label: "Pending Verification", value: pendingCount, sub: "Queue backlog", color: "text-accent" },
      { label: "Cleared Verification", value: list.length - pendingCount, sub: "Successfully vetted", color: "text-success-600" },
      { label: "Avg Process Time", value: "2.4d", sub: "Below 3-day target", color: "text-purple-600" },
      { label: "Compliance Rate", value: "100%", sub: "Reconciled status", color: "text-success-600" },
    ];
  }, [verificationslistData]);

  const isLoading = overviewLoading || bookingsLoading || isVerificationslistLoading;

  return {
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
  };
}
