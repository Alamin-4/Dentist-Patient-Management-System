import type { License } from "@/types/license";
import type { QueueStatus, VerificationDentist, VerificationStats, PhaseStatus } from "./types";

interface QueueResponseObject {
  results?: License[];
  data?: License[];
  meta?: {
    total_verifications?: number;
    pending_review?: number;
    fully_approved?: number;
    rejected?: number;
  };
  pagination?: {
    page?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
  };
}

export const PAGE_SIZE = 50;

export const API_STATUS_BY_QUEUE_STATUS: Record<QueueStatus, string> = {
  pending: "SUBMITTED",
  approved: "APPROVED",
  rejected: "REJECTED",
};

export const mapApiStatus = (status: string): QueueStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === "APPROVED" || normalized === "VERIFIED") return "approved";
  if (normalized === "REJECTED") return "rejected";
  return "pending";
};

export function getRelativeTime(dateString: string | null | undefined) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays > 30) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0)
    return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

  return "just now";
}

function isQueueResponseObject(response: unknown): response is QueueResponseObject {
  return Boolean(response && typeof response === "object");
}

function getFileNameFromUrl(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  try {
    const parts = url.split("/");
    return parts[parts.length - 1] || fallback;
  } catch (e) {
    return fallback;
  }
}

const mapPhaseStatus = (status: string | null | undefined): PhaseStatus => {
  const s = status?.toUpperCase();
  if (s === "APPROVED" || s === "VERIFIED") return "approved";
  if (s === "REJECTED") return "rejected";
  if (s === "SUBMIT" || s === "SUBMITTED" || s === "PENDING") return "pending";
  return "locked";
};

export function normalizeVerificationDentist(item: any): VerificationDentist {
  let qStatus: QueueStatus = "pending";
  const lVer = item.license_verification?.toUpperCase();
  const oVer = item.operations_verification?.toUpperCase();
  const cVer = item.clinical_verification?.toUpperCase();

  if (lVer === "APPROVED" && oVer === "APPROVED" && cVer === "APPROVED") {
    qStatus = "approved";
  } else if (lVer === "REJECTED" || oVer === "REJECTED" || cVer === "REJECTED") {
    qStatus = "rejected";
  }

  // Parse clinical materials
  let ph3Specialties = undefined;
  if (item.clinical_step) {
    let materials = [];
    try {
      materials = typeof item.clinical_step.materials === "string"
        ? JSON.parse(item.clinical_step.materials)
        : item.clinical_step.materials || [];
    } catch (e) {
      materials = item.clinical_step.materials || [];
    }

    ph3Specialties = (materials || []).map((mat: any) => {
      let procName = `Procedure #${mat.own_procedure}`;
      if (item.operation_step?.procedures_feature) {
        const match = item.operation_step.procedures_feature.find(
          (p: any) => p.id === mat.own_procedure || p.procedure === mat.own_procedure
        );
        if (match) {
          procName = match.procedure_name;
        }
      }

      const docs = [];
      if (mat.ce_certificate) {
        docs.push({
          label: "CE Certificate",
          file_name: getFileNameFromUrl(mat.ce_certificate, "ce_certificate.pdf"),
          missing: false,
          href: mat.ce_certificate,
        });
      }
      if (mat.material_brands) {
        docs.push({
          label: "Material Brands",
          file_name: getFileNameFromUrl(mat.material_brands, "material_brands.pdf"),
          missing: false,
          href: mat.material_brands,
        });
      }
      if (mat.invoice) {
        docs.push({
          label: "Invoice",
          file_name: getFileNameFromUrl(mat.invoice, "invoice.pdf"),
          missing: false,
          href: mat.invoice,
        });
      }
      if (mat.protocol_pdf) {
        docs.push({
          label: "Protocol PDF",
          file_name: getFileNameFromUrl(mat.protocol_pdf, "protocol_pdf.pdf"),
          missing: false,
          href: mat.protocol_pdf,
        });
      }

      return {
        name: procName,
        doc_count: docs.length,
        status: docs.length > 0 ? ("complete" as const) : ("missing" as const),
        documents: docs,
      };
    });
  }

  return {
    id: item.id,
    created_at: item.license_step?.created_at || item.dentist?.created_at || "",
    updated_at: item.license_step?.updated_at || item.dentist?.updated_at || "",
    professional_headshot: item.license_step?.professional_headshot || "",
    city: item.license_step?.city || "",
    country: item.license_step?.country || "",
    registration_no: item.license_step?.registration_no || "",
    doc_type: item.license_step?.doc_type || "LICENSE",
    file: item.license_step?.file || "",
    status: item.license_step?.status || "SUBMITTED",
    is_verified: item.license_step?.is_verified || false,
    verified_at: item.license_step?.verified_at || null,
    reviewer_notes: item.license_step?.reviewer_notes || "",
    dentist: String(item.dentist?.id || item.dentist || ""),
    verification: String(item.id || ""),
    registration_authority: item.license_step?.registration_authority || "",

    // Adapted UI Properties
    queue_status: qStatus,
    dentist_name: item.dentist?.full_name || "Unknown Dentist",
    specialty: item.dentist?.specialty || "DENTIST",
    location: [item.license_step?.city, item.license_step?.country].filter(Boolean).join(", "),
    submitted_ago: getRelativeTime(item.license_step?.created_at || item.dentist?.created_at) || undefined,
    rdv_score: item.dentist?.rdv_score || 0,

    phases: {
      ph1: { status: item.license_step ? mapPhaseStatus(item.license_verification) : "locked" },
      ph2: { status: item.operation_step ? mapPhaseStatus(item.operations_verification) : "locked" },
      ph3: { status: item.clinical_step ? mapPhaseStatus(item.clinical_verification) : "locked" },
    },

    ph1_data: item.license_step ? {
      auto_approved: item.license_verification === "APPROVED",
      auto_approved_message: item.license_step.reviewer_notes || "Verified by Administrator",
      license: {
        number: item.license_step.registration_no,
        issuing_state: item.license_step.city || item.license_step.country || "",
      },
      government_id: {
        file_name: getFileNameFromUrl(item.license_step.file, "License document"),
        file_size: "",
        verified_note: item.license_step.reviewer_notes || "Document is valid",
      },
      selfie: {
        file_name: getFileNameFromUrl(item.license_step.professional_headshot, "Headshot photo"),
        ai_match_score: item.face_match_score || 0,
        confidence: item.face_match_score ? `${item.face_match_score}%` : "N/A",
      }
    } : undefined,

    ph2_data: item.operation_step ? {
      rejection_reason: item.operation_step.reviewer_notes || "",
      sterilization_evidence: {
        video_walkthrough: item.operation_step.sterilization_verification?.walkthrough_video ? {
          file_name: getFileNameFromUrl(item.operation_step.sterilization_verification.walkthrough_video, "walkthrough_video.mp4"),
          file_size: "",
          href: item.operation_step.sterilization_verification.walkthrough_video
        } : undefined,
        jci_certificate: item.operation_step.sterilization_verification?.jci_certificate ? {
          file_name: getFileNameFromUrl(item.operation_step.sterilization_verification.jci_certificate, "jci_certificate.pdf"),
          file_size: "",
          href: item.operation_step.sterilization_verification.jci_certificate
        } : undefined,
      },
      procedure_pricing: (item.operation_step.procedures_feature || []).map((proc: any) => ({
        procedure: proc.procedure_name,
        price: parseFloat(proc.price) || 0,
        notes: proc.option_notes || "",
      })),
      no_surprise_guarantee: item.operation_step.no_surprise_guarantee ? {
        description: `Allowed variation: ${item.operation_step.no_surprise_guarantee.allowed_variation_percent}%`,
        signer_name: item.operation_step.no_surprise_guarantee.signer_name,
        typed_signature: item.operation_step.no_surprise_guarantee.typed_signature,
        agreed_at: item.operation_step.no_surprise_guarantee.signed_at,
      } : undefined
    } : undefined,

    ph3_data: item.clinical_step ? {
      rejection_reason: item.clinical_step.reviewer_notes || "",
      clinic_location: typeof item.clinical_step.clinic_address === "string"
        ? item.clinical_step.clinic_address
        : item.clinical_step.clinic_address?.address || "",
      specialties: ph3Specialties,
    } : undefined,
  };
}

export function normalizeLicenseQueue(response: unknown) {
  const licenses = Array.isArray(response)
    ? response
    : isQueueResponseObject(response)
      ? response.data ?? response.results ?? []
      : [];

  const mappedLicenses = licenses.map<VerificationDentist>(normalizeVerificationDentist);

  const pageCounts = mappedLicenses.reduce(
    (acc, license) => {
      acc.total_verifications += 1;
      if (license.queue_status === "pending") acc.pending_review += 1;
      if (license.queue_status === "approved") acc.fully_approved += 1;
      if (license.queue_status === "rejected") acc.rejected += 1;
      return acc;
    },
    {
      total_verifications: 0,
      pending_review: 0,
      fully_approved: 0,
      rejected: 0,
    } satisfies VerificationStats,
  );

  const serverMeta = isQueueResponseObject(response) ? response.meta : undefined;
  const serverPagination = isQueueResponseObject(response) ? response.pagination : undefined;

  const meta: VerificationStats = {
    total_verifications: serverMeta?.total_verifications ?? pageCounts.total_verifications,
    pending_review: serverMeta?.pending_review ?? pageCounts.pending_review,
    fully_approved: serverMeta?.fully_approved ?? pageCounts.fully_approved,
    rejected: serverMeta?.rejected ?? pageCounts.rejected,
  };

  return {
    mappedLicenses,
    meta,
    pagination: {
      page: serverPagination?.page ?? 1,
      limit: serverPagination?.limit ?? PAGE_SIZE,
      total: serverPagination?.totalItems ?? mappedLicenses.length,
      totalPages: serverPagination?.totalPages ?? 1,
    },
  };
}
