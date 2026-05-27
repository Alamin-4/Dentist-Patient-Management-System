import patients from "../../../../../public/demo/patinets.json";

type PatientRecord = {
  patient_info: {
    name: string;
    image: string;
    treatment_plan: string;
    email: string;
    procedure: string;
    status: string;
    payment_status: string;
    final_budget: number;
  };
  estimate_treatment_plan: {
    estimate_amount_total: number;
  };
  final_treatment_plan: {
    final_total: number;
    status_tag: string;
  };
  patient_timeline: Array<{
    event: string;
    date: string;
    details: string;
  }>;
  payment_and_documents: {
    attached_document: {
      file_name: string;
      file_size: string;
    } | null;
  };
  review: null | {
    text: string;
  };
};

export type OverviewPatient = PatientRecord;
export type BadgeColor = "success" | "sky" | "warning" | "destructive";
export type StatIcon = "calendar" | "clock" | "dollar" | "target";
export type StatTrend = "positive" | "negative" | "neutral";

const records = patients as PatientRecord[];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatMoney = (value: number) => money.format(value);

const activeBookings = records
  .filter((record) => record.patient_info.status === "In Progress")
  .sort((first, second) => second.patient_info.final_budget - first.patient_info.final_budget)
  .slice(0, 3);

const acceptedCases = records.filter((record) => record.patient_info.treatment_plan === "accepted");
const completedCases = records.filter((record) => record.patient_info.status === "Completed");
const pendingCases = records.filter((record) =>
  ["awaiting response", "not-send", "Drafting", "Awaiting Verification"].includes(
    record.patient_info.treatment_plan,
  ),
);
const cancelledCases = records.filter((record) => record.patient_info.status === "Cancelled");

const monthlyRevenue = [...acceptedCases, ...completedCases].reduce(
  (sum, record) => sum + record.patient_info.final_budget,
  0,
);

const estimateTotal = records.reduce(
  (sum, record) => sum + record.estimate_treatment_plan.estimate_amount_total,
  0,
);

const finalTotal = records.reduce(
  (sum, record) => sum + record.final_treatment_plan.final_total,
  0,
);

const verifiedRate = Math.round(((acceptedCases.length + completedCases.length) / records.length) * 100);
const estimateAccuracy = Math.round((finalTotal / Math.max(estimateTotal, 1)) * 100);
const disputeRate = Math.round((cancelledCases.length / records.length) * 100);

const pendingFirst = pendingCases[0];
const firstPendingName = pendingFirst
  ? `${pendingFirst.patient_info.name.split(" ")[0]} ${pendingFirst.patient_info.name.split(" ").slice(-1)[0]?.[0] ?? ""}.`
  : null;

const awaitingRecord = records.find((r) => r.patient_info.treatment_plan === "awaiting response");
const awaitingName = awaitingRecord
  ? `${awaitingRecord.patient_info.name.split(" ")[0]} ${awaitingRecord.patient_info.name.split(" ").slice(-1)[0]?.[0] ?? ""}.`
  : null;

const alerts = [
  {
    label: "New booking request",
    detail: firstPendingName
      ? `${firstPendingName} is interested in ${pendingFirst!.patient_info.procedure}. Respond within 24 hours.`
      : "You have a new booking request. Respond within 24 hours.",
  },
  {
    label: "Estimate overdue",
    detail: awaitingName
      ? `Your estimate for ${awaitingName} is due in 4 hours.`
      : "You have an overdue estimate that needs attention.",
  },
];

const referralSummary = [
  { label: "Verified cases", value: acceptedCases.length + completedCases.length },
  { label: "Pending replies", value: pendingCases.length },
  { label: "Cancelled cases", value: cancelledCases.length },
];

export const overviewData = {
  stats: [
    {
      label: "Active bookings",
      value: activeBookings.length,
      subLabel: "+1 this week",
      trend: "positive" as StatTrend,
      icon: "calendar" as StatIcon,
      accent: "Active bookings",
    },
    {
      label: "Pending estimates",
      value: pendingCases.length,
      subLabel: "Respond within 48 hours",
      trend: "neutral" as StatTrend,
      icon: "clock" as StatIcon,
      accent: "Pending estimates",
      highlight: true,
    },
    {
      label: "Monthly revenue",
      value: formatMoney(monthlyRevenue),
      subLabel: "+18% vs last month",
      trend: "positive" as StatTrend,
      icon: "dollar" as StatIcon,
      accent: "Monthly revenue",
    },
    {
      label: "Estimate accuracy rate",
      value: `${estimateAccuracy}%`,
      subLabel: `${estimateAccuracy} of 100 bookings within 15%`,
      trend: "neutral" as StatTrend,
      icon: "target" as StatIcon,
      accent: "Estimate accuracy rate",
    },
  ],
  chart: {
    score: verifiedRate,
    completed: acceptedCases.length + completedCases.length,
    total: records.length,
    labels: [
      {
        label: "Booking completion rate",
        value: `${verifiedRate}%`,
        badge: "Excellent",
        badgeColor: "success" as BadgeColor,
      },
      {
        label: "Dispute rate",
        value: `${disputeRate}%`,
        badge: "Clean",
        badgeColor: "success" as BadgeColor,
      },
      {
        label: "Estimate accuracy",
        value: `${estimateAccuracy}%`,
        badge: "High",
        badgeColor: "sky" as BadgeColor,
      },
      {
        label: "Profile freshness",
        value: "Updated 3 days ago",
        badge: "Fresh",
        badgeColor: "success" as BadgeColor,
      },
    ],
  },
  alerts,
  activeBookings,
  referralSummary,
};

export function formatPatientMoney(value: number) {
  return formatMoney(value);
}
