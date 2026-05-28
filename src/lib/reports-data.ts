export type TrendDir = "up" | "down" | "flat";

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  sub: string;
  trend: number;
  trendDir: TrendDir;
  trendLabel: string;
};

export type MonthlyRow = {
  month: string;
  shortMonth: string;
  bookings: number;
  revenue: number;
  fees: number;
  escrowReleased: number;
};

export type TopDentist = {
  rank: number;
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
};

export type ProcedureRow = {
  procedure: string;
  bookings: number;
  revenue: number;
  avgValue: number;
  share: number;
};

export type BookingStatusRow = {
  status: string;
  count: number;
  share: number;
  color: string;
};

export type VerificationFunnelRow = {
  phase: string;
  submitted: number;
  approved: number;
  rejected: number;
  pending: number;
  passRate: number;
};

export type ComplianceRow = {
  label: string;
  value: number | string;
  sub: string;
  color: string;
};

export type GeographyRow = {
  country: string;
  flag: string;
  dentists: number;
  bookings: number;
  revenue: number;
  share: number;
};

/* ─── KPIs ─────────────────────────────────────────────────────────────────── */
export const kpiCards: KpiCard[] = [
  {
    id: "revenue",
    label: "Total Revenue (MTD)",
    value: "£38,400",
    sub: "May 2026",
    trend: 14.6,
    trendDir: "up",
    trendLabel: "vs Apr 2026",
  },
  {
    id: "fees",
    label: "Platform Fees (MTD)",
    value: "£3,840",
    sub: "10% of gross",
    trend: 14.6,
    trendDir: "up",
    trendLabel: "vs Apr 2026",
  },
  {
    id: "escrow",
    label: "Escrow Held",
    value: "£9,000",
    sub: "Across 6 bookings",
    trend: -2.4,
    trendDir: "down",
    trendLabel: "vs last week",
  },
  {
    id: "bookings",
    label: "Bookings (MTD)",
    value: "81",
    sub: "May 2026",
    trend: 8.2,
    trendDir: "up",
    trendLabel: "vs Apr 2026",
  },
  {
    id: "dentists",
    label: "Active Dentists",
    value: "1,284",
    sub: "+34 this week",
    trend: 2.7,
    trendDir: "up",
    trendLabel: "vs last month",
  },
  {
    id: "refunds",
    label: "Pending Refunds",
    value: "£810",
    sub: "2 open disputes",
    trend: 0,
    trendDir: "flat",
    trendLabel: "no change",
  },
];

/* ─── Monthly Revenue Trend ────────────────────────────────────────────────── */
export const monthlyData: MonthlyRow[] = [
  { month: "Dec 2025", shortMonth: "Dec", bookings: 62,  revenue: 28400, fees: 2840, escrowReleased: 24100 },
  { month: "Jan 2026", shortMonth: "Jan", bookings: 74,  revenue: 33600, fees: 3360, escrowReleased: 29800 },
  { month: "Feb 2026", shortMonth: "Feb", bookings: 68,  revenue: 30200, fees: 3020, escrowReleased: 26600 },
  { month: "Mar 2026", shortMonth: "Mar", bookings: 89,  revenue: 41800, fees: 4180, escrowReleased: 38400 },
  { month: "Apr 2026", shortMonth: "Apr", bookings: 94,  revenue: 44200, fees: 4420, escrowReleased: 40100 },
  { month: "May 2026", shortMonth: "May", bookings: 81,  revenue: 38400, fees: 3840, escrowReleased: 29500 },
];

/* ─── Top Performing Dentists ──────────────────────────────────────────────── */
export const topDentists: TopDentist[] = [
  { rank: 1, name: "Dr. Maya Patel",    initials: "MP", avatarColor: "#1A3A5C", specialty: "Orthodontics",          country: "USA",   bookings: 312, revenue: 48200, rating: 4.9, rdvScore: 98, growthPct: 18 },
  { rank: 2, name: "Dr. Elena Marquez", initials: "EM", avatarColor: "#1D4ED8", specialty: "Full Arch Implantology", country: "Spain", bookings: 218, revenue: 39600, rating: 4.8, rdvScore: 95, growthPct: 12 },
  { rank: 3, name: "Dr. Marcus Webb",   initials: "MW", avatarColor: "#7C3AED", specialty: "Teeth Whitening",        country: "UK",    bookings: 196, revenue: 29400, rating: 4.7, rdvScore: 91, growthPct: 9  },
  { rank: 4, name: "Dr. Aisha Patel",   initials: "AP", avatarColor: "#16A34A", specialty: "Invisalign",             country: "UAE",   bookings: 174, revenue: 26800, rating: 4.8, rdvScore: 93, growthPct: 21 },
  { rank: 5, name: "Dr. Sara Chen",     initials: "SC", avatarColor: "#1E3A5F", specialty: "Braces",                 country: "Canada",bookings: 161, revenue: 24100, rating: 4.6, rdvScore: 89, growthPct: 7  },
  { rank: 6, name: "Dr. Mehmet Aydin",  initials: "MA", avatarColor: "#059669", specialty: "Aesthetic Dentistry",    country: "Turkey",bookings: 143, revenue: 21600, rating: 4.9, rdvScore: 96, growthPct: 15 },
  { rank: 7, name: "Dr. Priya Nair",    initials: "PN", avatarColor: "#7C3AED", specialty: "Cosmetic Dentistry",     country: "UK",    bookings: 129, revenue: 19400, rating: 4.7, rdvScore: 90, growthPct: 5  },
  { rank: 8, name: "Dr. Liu Wei",       initials: "LW", avatarColor: "#0891B2", specialty: "Dental Implants",        country: "China", bookings: 118, revenue: 17800, rating: 4.5, rdvScore: 87, growthPct: 11 },
];

/* ─── Procedure Breakdown ──────────────────────────────────────────────────── */
export const procedureData: ProcedureRow[] = [
  { procedure: "All-on-4 Full Arch",    bookings: 94,  revenue: 141000, avgValue: 1500, share: 36 },
  { procedure: "Invisalign",            bookings: 78,  revenue:  93600, avgValue: 1200, share: 30 },
  { procedure: "Dental Implants",       bookings: 52,  revenue:  72800, avgValue: 1400, share: 20 },
  { procedure: "Teeth Whitening",       bookings: 44,  revenue:  19800, avgValue:  450, share:  9 },
  { procedure: "Veneers",               bookings: 24,  revenue:  16800, avgValue:  700, share:  5 },
];

/* ─── Booking Status Breakdown ─────────────────────────────────────────────── */
export const bookingStatusData: BookingStatusRow[] = [
  { status: "Completed",   count: 274, share: 62, color: "#12B76A" },
  { status: "In Progress", count: 87,  share: 20, color: "#2E90FA" },
  { status: "Cancelled",   count: 38,  share: 9,  color: "#F04438" },
  { status: "Pending",     count: 39,  share: 9,  color: "#F79009" },
];

/* ─── Verification Funnel ──────────────────────────────────────────────────── */
export const verificationFunnel: VerificationFunnelRow[] = [
  { phase: "Phase 1 — License",   submitted: 148, approved: 128, rejected: 12, pending: 8,  passRate: 86 },
  { phase: "Phase 2 — Operations",submitted: 128, approved: 112, rejected: 9,  pending: 7,  passRate: 88 },
  { phase: "Phase 3 — Clinical",  submitted: 112, approved: 98,  rejected: 8,  pending: 6,  passRate: 88 },
];

/* ─── Compliance Summary ───────────────────────────────────────────────────── */
export const complianceData: ComplianceRow[] = [
  { label: "Active Flags",       value: 14,   sub: "Across 12 dentists",      color: "text-orange-600" },
  { label: "Suspended Accounts", value: 8,    sub: "0.6% of total dentists",  color: "text-destructive-600" },
  { label: "Open Investigations",value: 3,    sub: "Avg 4.2 days open",        color: "text-amber-600" },
  { label: "Cleared This Month", value: 5,    sub: "Investigation resolved",   color: "text-success-600" },
  { label: "Fake Reviews Caught",value: 11,   sub: "AI high-confidence",       color: "text-purple-600" },
  { label: "Collusion Rate",     value: "0.6%",sub: "Below 1% target",        color: "text-success-600" },
];

/* ─── Geographic Distribution ──────────────────────────────────────────────── */
export const geographyData: GeographyRow[] = [
  { country: "United Kingdom", flag: "🇬🇧", dentists: 382, bookings: 94,  revenue: 88200, share: 27 },
  { country: "United States",  flag: "🇺🇸", dentists: 318, bookings: 81,  revenue: 74400, share: 22 },
  { country: "Spain",          flag: "🇪🇸", dentists: 214, bookings: 62,  revenue: 58600, share: 15 },
  { country: "Turkey",         flag: "🇹🇷", dentists: 198, bookings: 57,  revenue: 48200, share: 14 },
  { country: "Germany",        flag: "🇩🇪", dentists: 142, bookings: 38,  revenue: 36800, share: 10 },
  { country: "Other",          flag: "🌍", dentists: 164, bookings: 42,  revenue: 32400, share: 12 },
];
