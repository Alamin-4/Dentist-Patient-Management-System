import dentistsData from "@/lib/dentists-data";
import { type AdminDentist } from "@/hooks/admin/dentist/useDentist";

export enum AccountStatus {
  ACTIVE,
  SUSPENDED,
  BLOCKED,
  DELETED

}

export type Dentist = Omit<
  (typeof dentistsData.dentists)[number],
  "profile"
> & {
  slug?: string | null;
  membershipPlan?: string | null;
  membershipPaidAt?: string | null;
  stripeSubscriptionId?: string | null;
  profile: Omit<
    (typeof dentistsData.dentists)[number]["profile"],
    "verification"
  > & {
    verification: {
      phase1: (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase1"] & {
        id?: number;
      };
      phase2: Omit<
        (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase2"],
        "rejection_reason"
      > & {
        id?: number;
        rejection_reason?: string | null;
      };
      phase3: (typeof dentistsData.dentists)[number]["profile"]["verification"]["phase3"] & {
        id?: number;
      };
    };
  };
};

export type StatusFilter =
  | "all"
  | "active"
  | "pending"
  | "suspended"
  | "rejected"
  | "unclaimed";

export const PAGE_SIZE = 8;

export const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600",
  pending: "bg-accent/5 text-accent",
  suspended: "bg-red-50 text-red-500",
  rejected: "bg-gray-100 text-gray-500",
  unclaimed: "bg-[#F3F4F6] text-[#4B5563]", // clean gray look for unclaimed/imported
};

export const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  pending: "bg-accent",
  suspended: "bg-red-500",
  rejected: "bg-gray-400",
  unclaimed: "bg-gray-400",
};

export const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  rejected: "Rejected",
  unclaimed: "Unclaimed Directory",
};

export const SPECIALTIES = ["All specialties"];

import { locationData } from "@/core/lib/location-data";

export const CITIES = [
  "All cities",
  ...Array.from(
    new Set(
      Object.values(locationData).flatMap((c) => Object.keys(c.cities))
    )
  ).sort(),
];

export const mapSpecialty = (s?: string): string => {
  if (!s) return "General";
  const upper = s.toUpperCase();
  if (upper.includes("ORTHO")) return "Orthodontics";
  if (upper.includes("ENDO")) return "Endodontics";
  if (upper.includes("PEDIATRIC") || upper.includes("PEDO")) return "Pediatric";
  if (upper.includes("COSMETIC")) return "Cosmetic";
  if (upper.includes("PERIODON")) return "Periodontics";
  if (upper.includes("SURGERY") || upper.includes("SURGEON"))
    return "Oral Surgery";
  if (upper.includes("PROSTHO")) return "Prosthodontics";
  return "General";
};

export function getFileNameFromUrl(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    const parts = url.split("/");
    return parts[parts.length - 1] || fallback;
  } catch (e) {
    return fallback;
  }
}

export const mapVerificationStatus = (status?: string): string => {
  if (!status) return "not_started";
  const upper = status.toUpperCase();
  if (upper === "APPROVED" || upper === "VERIFIED") return "complete";
  if (upper === "REJECTED") return "rejected";
  if (upper === "SUBMITTED" || upper === "SUBMIT" || upper === "PENDING") return "SUBMITTED";
  return "not_started";
};

export function mapApiDentistToUIDentist(d: AdminDentist): Dentist {
  const anyD = d as any;
  let location = "";
  if (anyD.city || anyD.country) {
    location = [anyD.city, anyD.country].filter(Boolean).filter((x: string) => x !== "0").join(", ");
  } else if (anyD.license_step?.city || anyD.license_step?.country) {
    location = [anyD.license_step.city, anyD.license_step.country].filter(Boolean).filter((x: string) => x !== "0").join(", ");
  } else if (anyD.clinical_step?.clinic_address) {
    location = anyD.clinical_step.clinic_address;
  } else if (d.dentist_verification?.clinical_path_verification?.clinic_address) {
    const clinicAddr = d.dentist_verification.clinical_path_verification.clinic_address;
    location = typeof clinicAddr === "string" ? clinicAddr : (clinicAddr?.address || "");
  } else if (d.dentist_address?.[0]) {
    location = [d.dentist_address[0].city, d.dentist_address[0].country].filter(Boolean).filter((x: string) => x !== "0").join(", ");
  }

  if (!location || location === "0" || location === "0, 0") {
    location = "N/A";
  }

  let status: StatusFilter = "pending";
  if (d.is_directory_only) {
    status = "unclaimed";
  } else if (anyD.user?.status === "SUSPENDED" || anyD.user_profile?.status === "SUSPENDED") {
    status = "suspended";
  } else if (d.queue_status === "approved" || d.is_verified) {
    status = "active";
  } else if (d.queue_status === "rejected") {
    status = "rejected";
  } else {
    status = "pending";
  }

  const dentistName =
    d.full_name ||
    anyD.name ||
    anyD.user?.name ||
    anyD.user_profile?.name ||
    "Dentist";

  const initials = dentistName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "D";

  const colors = [
    "#1A3A5C",
    "#1E40AF",
    "#0F172A",
    "#7C3AED",
    "#0891B2",
    "#0D9488",
    "#4F46E5",
  ];
  let hash = 0;
  for (let i = 0; i < (d.full_name || "").length; i++) {
    hash = (d.full_name || "").charCodeAt(i) + ((hash << 5) - hash);
  }
  const avatarColor = colors[Math.abs(hash) % colors.length];

  // Extract Phase 2 Files
  const phase2Files = [];
  const steril = d.dentist_verification?.operation_verification?.sterilization_verification;
  if (steril?.jci_certificate) {
    phase2Files.push({
      name: getFileNameFromUrl(steril.jci_certificate, "JCI Certificate"),
      size: "",
      type: "pdf"
    });
  }
  if (steril?.walkthrough_video) {
    phase2Files.push({
      name: getFileNameFromUrl(steril.walkthrough_video, "Sterilization Walkthrough"),
      size: "",
      type: "video"
    });
  }

  // Extract Phase 3 specialties / categories
  let materials = [];
  try {
    const rawMaterials = d.dentist_verification?.clinical_path_verification?.materials;
    materials = typeof rawMaterials === "string"
      ? JSON.parse(rawMaterials)
      : rawMaterials || [];
  } catch (e) {
    materials = d.dentist_verification?.clinical_path_verification?.materials || [];
  }

  const phase3Categories = (materials || []).map((mat: any) => {
    let procName = `Procedure #${mat.own_procedure}`;
    if (d.dentist_verification?.operation_verification?.procedures_feature) {
      const match = d.dentist_verification.operation_verification.procedures_feature.find(
        (p: any) => p.id === mat.own_procedure || p.procedure === mat.own_procedure
      );
      if (match) {
        procName = match.procedure_name;
      }
    }

    const catFiles = [];
    if (mat.ce_certificate) {
      catFiles.push({
        name: getFileNameFromUrl(mat.ce_certificate, "CE Certificate"),
        size: "",
        type: "pdf"
      });
    }
    if (mat.material_brands) {
      catFiles.push({
        name: getFileNameFromUrl(mat.material_brands, "Material Brands"),
        size: "",
        type: "pdf"
      });
    }
    if (mat.invoice) {
      catFiles.push({
        name: getFileNameFromUrl(mat.invoice, "Invoice"),
        size: "",
        type: "pdf"
      });
    }
    if (mat.protocol_pdf) {
      catFiles.push({
        name: getFileNameFromUrl(mat.protocol_pdf, "Protocol PDF"),
        size: "",
        type: "pdf"
      });
    }

    return {
      name: procName,
      files: catFiles
    };
  });

  return {
    id: String(d.id),
    slug: d.slug || null,
    name: dentistName,
    initials,
    avatar_color: avatarColor,
    email: d.user?.email || anyD.user_profile?.email || anyD.email || "",
    phone: d.phone || d.user?.phone || anyD.user_profile?.phone || "",
    location,
    specialty: mapSpecialty(d.specialty),
    experience_years: d.experience_years || 0,
    languages: [],
    status,
    rating: d.rating_avg || 0,
    review_count: d.total_reviews || 0,
    bookings: 0,
    joined: d.created_at
      ? new Date(d.created_at).toISOString().split("T")[0]
      : "N/A",
    rdv_score: d.rdv_score || 0,
    rdv_verified: d.is_verified,
    membershipPlan: anyD.membershipPlan || null,
    membershipPaidAt: anyD.membershipPaidAt || null,
    stripeSubscriptionId: anyD.stripeSubscriptionId || null,
    profile: {
      stats: {
        total_bookings: { count: 0, growth_this_month: 0 },
        revenue_lifetime: { amount: 0, avg_per_visit: 0 },
        cancellation_rate: { pct: "0%", benchmark: "5.7%" },
        estimate_accuracy: { pct: "0%", note: "No data" },
        avg_response_time: { value: "0", note: "No data" },
      },
      performance: {
        show_up_rate: 0,
        five_star_reviews: 0,
        repeat_patients: 0,
        estimate_accuracy: 0,
      },
      verification: {
        phase1: {
          id: d.dentist_verification?.dentist_license_verification?.id,
          label: "Phase 1 — Identity",
          status: mapVerificationStatus(
            d.dentist_verification?.license_verification,
          ),
          country:
            d.dentist_verification?.dentist_license_verification?.country ||
            "N/A",
          city:
            d.dentist_verification?.dentist_license_verification?.city || "N/A",
          registration_authority:
            d.dentist_verification?.dentist_license_verification
              ?.registration_authority_name || "N/A",
          registration_no:
            d.dentist_verification?.dentist_license_verification
              ?.registration_no || "N/A",
          files: [],
        },
        phase2: {
          id: d.dentist_verification?.operation_verification?.id,
          label: "Phase 2 — Operations",
          status: mapVerificationStatus(
            d.dentist_verification?.operations_verification,
          ),
          rejection_reason: d.dentist_verification?.operation_verification?.reviewer_notes || null,
          services: (d.dentist_verification?.operation_verification?.procedures_feature || []).map((p: any) => ({
            name: p.procedure_name,
            description: p.option_notes || "",
            price: parseFloat(p.price) || 0,
          })),
          files: phase2Files,
        },
        phase3: {
          id: d.dentist_verification?.clinical_path_verification?.id,
          label: "Phase 3 — Clinical",
          status: mapVerificationStatus(
            d.dentist_verification?.clinical_verification,
          ),
          clinic_location: d.dentist_verification?.clinical_path_verification?.clinic_address
            ? (typeof d.dentist_verification.clinical_path_verification.clinic_address === "string"
              ? d.dentist_verification.clinical_path_verification.clinic_address
              : d.dentist_verification.clinical_path_verification.clinic_address.address || "N/A")
            : "N/A",
          categories: phase3Categories,
        },
      },
      bookings: [],
      consultations: [],
      reviews: [],
    },
  };
}
