export interface DemoPatientSource {
  patient_info: {
    name: string;
    image?: string;
    treatment_plan: string;
    email: string;
    procedure: string;
    status: string;
    payment_status: string;
    final_budget: number;
  };
  estimate_treatment_plan: {
    procedure_breakdown: Record<string, string | number>;
    estimate_amount_total: number;
  };
  final_treatment_plan: {
    status_tag: string;
    procedure_breakdown: Record<string, string | number>;
    final_total: number;
  };
  patient_timeline: Array<{
    event: string;
    date: string;
    details: string;
  }>;
  payment_and_documents: {
    payment_received_from_escrow?: number;
    attached_document?: {
      file_name: string;
      file_size: string;
    } | null;
  };
  review: {
    text: string;
    ratings: {
      communication: number;
      value_for_money: number;
      follow_through: number;
    };
  } | null;
}

export interface PatientMediaItem {
  id: string;
  label: string;
  imageSrc: string;
}

export interface PatientTimelineItem {
  event: string;
  date: string;
  details: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarImage?: string;
  procedure: string;
  country: string;
  patientCode: string;
  appointmentDate: string;
  treatmentPlan: string;
  status: string;
  paymentStatus: string;
  amount: string;
  finalBudget: string;
  travelingDates: string;
  approxBudget: string;
  schedule: {
    date: string;
    slot: string;
  };
  dentalHistory: {
    lastVisited: string;
    conditions: string;
    notes: string;
  };
  media: PatientMediaItem[];
  timeline: PatientTimelineItem[];
  estimateBreakdown: Array<{ label: string; price: string }>;
  estimateTotal: string;
  finalBreakdown: Array<{ label: string; price: string }>;
  finalTotal: string;
  finalStatusTag: string;
  paymentReceivedFromEscrow: string;
  attachedDocument: {
    fileName: string;
    fileSize: string;
  } | null;
  review: {
    text: string;
    ratings: {
      communication: string;
      valueForMoney: string;
      followThrough: string;
    };
  } | null;
  treatmentNote: string | null;
  consultationSummary: string;
}

const DEFAULT_MEDIA: PatientMediaItem[] = [
  { id: "media-1", label: "Lower Arch", imageSrc: "/images/smile-1.png" },
  { id: "media-2", label: "Upper Arch", imageSrc: "/images/smile-2.png" },
  { id: "media-3", label: "Front View", imageSrc: "/images/smile-3.png" },
  { id: "media-4", label: "X-Ray", imageSrc: "/images/ai-smile-preview.png" },
];

const DEFAULT_SCHEDULE = {
  date: "Wed 24 Jan, 2024",
  slot: "09:00 PM",
};

const DEFAULT_HISTORY = {
  lastVisited: "Wed 24 Jan, 2024",
  conditions: "Bone loss, Gum Disease",
  notes: "No notes added yet.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLabel(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeBreakdown(breakdown: Record<string, string | number>) {
  return Object.entries(breakdown).map(([label, price]) => ({
    label: formatLabel(label),
    price: typeof price === "number" ? formatCurrency(price) : price,
  }));
}

export function buildPatientRecords(
  records: DemoPatientSource[],
): PatientRecord[] {
  return records.map((record, index) => {
    const patientInfo = record.patient_info;
    const estimateBreakdown = normalizeBreakdown(
      record.estimate_treatment_plan?.procedure_breakdown ?? {},
    );
    const finalBreakdown = normalizeBreakdown(
      record.final_treatment_plan?.procedure_breakdown ?? {},
    );
    const finalBudgetValue = patientInfo.final_budget ?? 0;

    return {
      id: `patient-${index + 1}`,
      name: patientInfo.name,
      email: patientInfo.email,
      avatarInitials: getInitials(patientInfo.name),
      avatarImage: patientInfo.image,
      procedure: patientInfo.procedure,
      country: "United Kingdom",
      patientCode: `#RD-${7400 + index}`,
      appointmentDate: record.patient_timeline[0]?.date
        ? new Date(record.patient_timeline[0].date).toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          )
        : "June 15, 2026",
      treatmentPlan: patientInfo.treatment_plan,
      status: patientInfo.status,
      paymentStatus: patientInfo.payment_status,
      amount: formatCurrency(record.final_treatment_plan?.final_total ?? 0),
      finalBudget: formatCurrency(finalBudgetValue),
      travelingDates: "12–24 Jan, 2024",
      approxBudget: formatCurrency(
        record.estimate_treatment_plan?.estimate_amount_total ?? 0,
      ),
      schedule: DEFAULT_SCHEDULE,
      dentalHistory: DEFAULT_HISTORY,
      media: DEFAULT_MEDIA,
      timeline: record.patient_timeline ?? [],
      estimateBreakdown,
      estimateTotal: formatCurrency(
        record.estimate_treatment_plan?.estimate_amount_total ?? 0,
      ),
      finalBreakdown,
      finalTotal: formatCurrency(record.final_treatment_plan?.final_total ?? 0),
      finalStatusTag: record.final_treatment_plan?.status_tag ?? "",
      paymentReceivedFromEscrow: formatCurrency(
        record.payment_and_documents?.payment_received_from_escrow ?? 0,
      ),
      attachedDocument: record.payment_and_documents?.attached_document
        ? {
            fileName: record.payment_and_documents.attached_document.file_name,
            fileSize: record.payment_and_documents.attached_document.file_size,
          }
        : null,
      review: record.review
        ? {
            text: record.review.text,
            ratings: {
              communication: record.review.ratings.communication.toFixed(1),
              valueForMoney: record.review.ratings.value_for_money.toFixed(1),
              followThrough: record.review.ratings.follow_through.toFixed(1),
            },
          }
        : null,
      treatmentNote:
        patientInfo.treatment_plan === "rejected"
          ? "I’m not ready to proceed with treatment at this time"
          : patientInfo.treatment_plan === "awaiting response"
            ? "Waiting for patient to review and confirm the plan"
            : patientInfo.treatment_plan === "not-send"
              ? "The plan is still being drafted for approval"
              : null,
      consultationSummary:
        patientInfo.treatment_plan === "accepted"
          ? "Confirmed booking moved to the treatment schedule"
          : patientInfo.treatment_plan === "rejected"
            ? "Patient declined the updated treatment plan"
            : patientInfo.treatment_plan === "awaiting response"
              ? "Treatment estimate sent and awaiting patient feedback"
              : "Treatment plan is being prepared for review",
    };
  });
}

export function splitPatientRecords(records: PatientRecord[]) {
  return {
    consultations: records.filter(
      (record) => record.treatmentPlan !== "accepted",
    ),
    bookings: records.filter((record) => record.treatmentPlan === "accepted"),
  };
}

export function getTreatmentPlanBadgeClasses(status: string) {
  if (status === "accepted") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "rejected") {
    return "border-rose-200 bg-rose-50 text-rose-600";
  }

  if (status === "not-send") {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function getStatusBadgeClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("complete")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedStatus.includes("cancel")) {
    return "border-rose-200 bg-rose-50 text-rose-600";
  }

  if (normalizedStatus.includes("hold") || normalizedStatus.includes("draft")) {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
}

export function getTimelineBadgeClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("cancel")) {
    return "border-rose-200 bg-rose-50 text-rose-600";
  }

  if (normalizedStatus.includes("complete")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedStatus.includes("draft") || normalizedStatus.includes("hold")) {
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}
