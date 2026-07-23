"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search, X, Star, Shield, CheckCircle2, XCircle,
  AlertTriangle, Image, CheckCircle, Loader2
} from "lucide-react";
import { useTreatmentBookings } from "@/hooks/treatment-booking/useTreatmentBooking";
import { mapDbBookingToUiBooking } from "@/features/admin/bookings/utils/booking-mapper";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Review = {
  id: string;
  reviewer_name: string;
  reviewer_initials: string;
  reviewer_avatar_color: string;
  dentist_name: string;
  dentist_initials: string;
  dentist_avatar_color: string;
  dentist_specialty: string;
  procedure: string;
  booking_id: string;
  date: string;
  rating: number;
  has_photos: boolean;
  ai_confidence?: string;
  ai_flag?: { reason: string } | null;
  review_content: string;
  ratings_breakdown: Array<{ label: string; rating: number }>;
  submission_context: {
    submitted: string;
    published?: string | null;
    rejected?: string | null;
  };
  tab: "flagged" | "published" | "rejected";
  location: string;
};

type TabKey = "flagged" | "published" | "rejected";

/* ─── helpers ──────────────────────────────────────────────────────────── */
function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm")}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function Stars({ rating, small }: { rating: number; small?: boolean }) {
  const sz = small ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(sz, i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100")} />
      ))}
    </span>
  );
}

function ConfidenceBadge({ label }: { label: string }) {
  const isHigh = label === "High confidence" || label === "Auto-approved";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold border",
      isHigh ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
    )}>
      {label}
    </span>
  );
}

/* ─── Review row (Flagged) ─────────────────────────────────────────────── */
function FlaggedRow({ review, onView }: { review: Review; onView: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-3.5 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <Avatar initials={review.reviewer_initials} color={review.reviewer_avatar_color} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">{review.reviewer_name}</p>
            <Stars rating={review.rating} small />
            <span className="text-sm font-semibold text-[#1A1A2E]">{review.rating.toFixed(1)}</span>
            {review.ai_confidence && <ConfidenceBadge label={review.ai_confidence} />}
            {review.has_photos && (
              <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                <Image className="h-3 w-3" /> Photos
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Avatar initials={review.dentist_initials} color={review.dentist_avatar_color} size="sm" />
            <span className="text-xs text-gray-500">{review.dentist_name}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-500">{review.procedure}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.booking_id}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
      </div>
      <button onClick={onView} className="ml-3 shrink-0 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1A1A2E] hover:bg-gray-50 transition-colors">
        View review
      </button>
    </div>
  );
}

/* ─── Review row (Published) ───────────────────────────────────────────── */
function PublishedRow({ review, onView }: { review: Review; onView: () => void }) {
  const isAdmin = review.ai_flag;
  return (
    <div className="flex items-start justify-between border-b border-gray-50 py-3.5 last:border-0">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <Avatar initials={review.reviewer_initials} color={review.reviewer_avatar_color} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">{review.reviewer_name}</p>
            <Stars rating={review.rating} small />
            <span className="text-sm font-semibold text-[#1A1A2E]">{review.rating.toFixed(1)}</span>
            {isAdmin ? (
              <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                <CheckCircle2 className="h-3 w-3" /> Admin approved
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> Auto-published
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Avatar initials={review.dentist_initials} color={review.dentist_avatar_color} size="sm" />
            <span className="text-xs text-gray-500">{review.dentist_name}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-500">{review.procedure}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.booking_id}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          {review.review_content && <p className="mt-1.5 truncate text-xs text-gray-400">{review.review_content}</p>}
        </div>
      </div>
      <button onClick={onView} className="ml-3 shrink-0 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1A1A2E] hover:bg-gray-50 transition-colors">
        View
      </button>
    </div>
  );
}

/* ─── Review row (Rejected) ────────────────────────────────────────────── */
function RejectedRow({ review, onView }: { review: Review; onView: () => void }) {
  const shortReason = "Low rating or inappropriate content policy violation";
  return (
    <div className="flex items-start justify-between border-b border-gray-50 py-3.5 last:border-0">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <Avatar initials={review.reviewer_initials} color={review.reviewer_avatar_color} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">{review.reviewer_name}</p>
            <Stars rating={review.rating} small />
            <span className="text-sm font-semibold text-[#1A1A2E]">{review.rating.toFixed(1)}</span>
            <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              <XCircle className="h-3 w-3" /> Rejected
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Avatar initials={review.dentist_initials} color={review.dentist_avatar_color} size="sm" />
            <span className="text-xs text-gray-500">{review.dentist_name}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-500">{review.procedure}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.booking_id}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          {shortReason && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
              <XCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{shortReason}</span>
            </div>
          )}
        </div>
      </div>
      <button onClick={onView} className="ml-3 shrink-0 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-[#1A1A2E] hover:bg-gray-50 transition-colors">
        View details
      </button>
    </div>
  );
}

/* ─── Review Drawer ────────────────────────────────────────────────────── */
function ReviewDrawer({ review, onClose, onAction }: { review: Review | null; onClose: () => void; onAction: (id: string, action: "published" | "rejected") => void }) {
  const open = !!review;

  if (typeof window !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (!review) return null;

  const isF = review.tab === "flagged";
  const isP = review.tab === "published";
  const isR = review.tab === "rejected";
  const isAdmin = review.ai_flag;
  const aiFlag = review.ai_flag;
  const rejectionReason = "This review was rejected by admin for violating our standard content guidelines.";
  const context = review.submission_context;

  const contextRows = [
    { label: "Patient", value: <span className="flex items-center gap-2 justify-end"><Avatar initials={review.reviewer_initials} color={review.reviewer_avatar_color} size="sm" /><span>{review.reviewer_name}</span></span> },
    { label: "Dentist", value: <span className="flex items-center gap-2 justify-end"><Avatar initials={review.dentist_initials} color={review.dentist_avatar_color} size="sm" /><span>{review.dentist_name}</span><span className="text-gray-400">{review.dentist_specialty}</span></span> },
    { label: "Procedure", value: review.procedure },
    { label: "Booking ID", value: <span className="font-semibold text-blue-600">{review.booking_id}</span> },
    { label: "Location", value: review.location },
    ...(context.submitted ? [{ label: "Submitted", value: context.submitted }] : []),
    ...(context.published ? [{ label: "Published", value: context.published }] : []),
    ...(context.rejected ? [{ label: "Rejected", value: context.rejected }] : []),
  ];

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/30 transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")} onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-120 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}>
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <Avatar initials={review.reviewer_initials} color={review.reviewer_avatar_color} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#1A1A2E]">{review.reviewer_name}</p>
                {isF && <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700"><AlertTriangle className="h-3 w-3" />Flagged for review</span>}
                {isP && !isAdmin && <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" />Auto-published</span>}
                {isP && isAdmin && <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600"><CheckCircle2 className="h-3 w-3" />Admin approved</span>}
                {isR && <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600"><XCircle className="h-3 w-3" />Rejected</span>}
              </div>
              <p className="mt-0.5 text-xs text-gray-400">Review of {review.dentist_name} · {review.procedure}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Rejected banner */}
          {isR && rejectionReason && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">Rejection reason</p>
                <p className="mt-0.5 text-xs text-red-500">{rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Published auto banner */}
          {isP && !isAdmin && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p>This review passed AI content screening automatically and was published without requiring admin action.</p>
            </div>
          )}

          {/* AI flag */}
          {aiFlag && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-amber-700">
                    {isR ? "Original AI flag" : "AI moderation flag"}
                  </p>
                  {review.ai_confidence && <ConfidenceBadge label={review.ai_confidence} />}
                </div>
                <p className="mt-0.5 text-xs text-amber-600">{aiFlag.reason}</p>
              </div>
            </div>
          )}

          {/* Review content */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Review Content</p>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-[#1A1A2E]">
              {review.review_content || "No comments written."}
            </div>
            {review.has_photos && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                <Image className="h-3.5 w-3.5" /> Patient attached photos
              </p>
            )}
          </div>

          {/* Ratings breakdown */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Ratings Breakdown</p>
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Stars rating={review.rating} />
                <span className="font-bold text-[#1A1A2E]">{review.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">overall</span>
              </div>
              <div className="space-y-2.5">
                {review.ratings_breakdown.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{r.label}</span>
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} small />
                      <span className="w-4 text-right text-sm font-semibold text-[#1A1A2E]">{r.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission context */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Submission Context</p>
            <div className="rounded-lg border border-gray-100 bg-white divide-y divide-gray-50">
              {contextRows.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-medium text-[#1A1A2E]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer — only for flagged */}
        {isF && (
          <div className="shrink-0 border-t border-gray-100 px-5 py-4">
            <p className="mb-3 flex items-start gap-1.5 text-xs text-gray-400">
              <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-[9px]">i</span>
              Publishing makes this review visible on the dentist&apos;s public profile. Rejecting removes it from the queue permanently.
            </p>
            <div className="flex gap-3">
              <button onClick={() => onAction(review.id, "rejected")} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <XCircle className="h-4 w-4" /> Reject review
              </button>
              <button onClick={() => onAction(review.id, "published")} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
                <CheckCircle className="h-4 w-4" /> Publish review
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */
function ReviewsSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-gray-200" />
        <div className="h-4 w-96 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-7 w-16 rounded bg-gray-200" />
            <div className="mt-1.5 h-3.5 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="h-14 rounded-lg border border-blue-200 bg-blue-50/50" />

      <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex gap-4">
            <div className="h-6 w-16 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded bg-gray-200" />
          </div>
          <div className="h-8 w-44 rounded bg-gray-200" />
        </div>
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="h-9 w-9 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-80 rounded bg-gray-200" />
              </div>
              <div className="h-8 w-24 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function Reviews() {
  const { data: bookingsResponse, isLoading, isError } = useTreatmentBookings();
  const [activeTab, setActiveTab] = useState<TabKey>("flagged");
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderations, setModerations] = useState<Record<string, "published" | "rejected">>({});

  // Sync moderations from localstorage
  useEffect(() => {
    const keys = Object.keys(localStorage);
    const modMap: Record<string, "published" | "rejected"> = {};
    keys.forEach((key) => {
      if (key.startsWith("rateddocs_review_status_")) {
        const bookingId = key.replace("rateddocs_review_status_", "");
        const status = localStorage.getItem(key);
        if (status === "published" || status === "rejected") {
          modMap[bookingId] = status;
        }
      }
    });
    setModerations(modMap);
  }, []);

  const reviewsList = useMemo(() => {
    if (!bookingsResponse?.data) return [];

    const list: Review[] = [];
    bookingsResponse.data.forEach((b: any) => {
      const reviewData = b.metadata?.review;
      if (!reviewData) return;

      const mapped = mapDbBookingToUiBooking(b);
      if (!mapped) return;
      const rating = (Number(reviewData.ratingCommunication || 5) +
        Number(reviewData.ratingValueForMoney || 5) +
        Number(reviewData.ratingFollowThrough || 5)) / 3;

      const savedStatus = moderations[b.id];
      const defaultStatus = rating < 3.5 ? "flagged" : "published";
      const tab = savedStatus || defaultStatus;

      const dateStr = new Date(reviewData.submittedAt || b.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      list.push({
        id: b.id,
        reviewer_name: mapped.patient.name,
        reviewer_initials: mapped.patient.initials,
        reviewer_avatar_color: mapped.patient.avatar_color,
        dentist_name: mapped.dentist.name,
        dentist_initials: mapped.dentist.initials,
        dentist_avatar_color: mapped.dentist.avatar_color,
        dentist_specialty: mapped.dentist.specialty,
        procedure: mapped.procedure,
        booking_id: `B-${b.id.substring(0, 8).toUpperCase()}`,
        date: dateStr,
        rating,
        has_photos: !!reviewData.afterPhotoUrl,
        ai_confidence: rating >= 3.5 ? "Auto-approved" : "Needs Review",
        ai_flag: rating < 3.5 ? { reason: "Low overall rating flagged for moderation review." } : null,
        review_content: reviewData.comments || "",
        ratings_breakdown: [
          { label: "Communication", rating: Number(reviewData.ratingCommunication || 0) },
          { label: "Value for Money", rating: Number(reviewData.ratingValueForMoney || 0) },
          { label: "Follow Through", rating: Number(reviewData.ratingFollowThrough || 0) }
        ],
        submission_context: {
          submitted: dateStr,
          published: tab === "published" ? dateStr : null,
          rejected: tab === "rejected" ? dateStr : null
        },
        tab,
        location: mapped.patient.location || "N/A"
      });
    });

    return list;
  }, [bookingsResponse, moderations]);

  const meta = useMemo(() => {
    let totalSubmitted = reviewsList.length;
    let autoPublished = reviewsList.filter((r) => r.tab === "published").length;
    let flaggedForReview = reviewsList.filter((r) => r.tab === "flagged").length;
    let rejected = reviewsList.filter((r) => r.tab === "rejected").length;

    return {
      total_submitted: totalSubmitted,
      auto_published: autoPublished,
      flagged_for_review: flaggedForReview,
      rejected
    };
  }, [reviewsList]);

  const tabs = [
    { key: "flagged", label: "Flagged", count: meta.flagged_for_review },
    { key: "published", label: "Published", count: meta.auto_published },
    { key: "rejected", label: "Rejected", count: meta.rejected },
  ];

  const filtered = useMemo(() => {
    let list = reviewsList.filter((r) => r.tab === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.reviewer_name.toLowerCase().includes(q) ||
        r.dentist_name.toLowerCase().includes(q) ||
        r.procedure.toLowerCase().includes(q) ||
        r.booking_id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reviewsList, activeTab, search]);

  const handleAction = (id: string, action: "published" | "rejected") => {
    localStorage.setItem(`rateddocs_review_status_${id}`, action);
    setModerations((prev) => ({ ...prev, [id]: action }));
    setSelectedReview(null);
    toast.success(`Review ${action === "published" ? "published successfully" : "rejected"}.`);
  };

  if (isLoading) return <ReviewsSkeleton />;

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-red-500 font-semibold">Failed to load reviews list.</p>
      </div>
    );
  }

  const footerText = `Showing ${filtered.length} of ${filtered.length} ${activeTab} reviews`;

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Reviews &amp; Ratings</h1>
          <p className="mt-0.5 text-sm text-gray-500">AI screens every review automatically. Only flagged content reaches this queue.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total submitted", value: meta.total_submitted, sub: "All time", color: "text-[#1A1A2E]" },
            { label: "Published", value: meta.auto_published, sub: "Live on profiles", color: "text-emerald-600" },
            { label: "Flagged for review", value: meta.flagged_for_review, sub: "Awaiting decision", color: "text-amber-600" },
            { label: "Rejected", value: meta.rejected, sub: "Not published", color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={cn("mt-1 text-3xl font-bold tracking-tight", s.color)}>{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* AI Banner */}
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3.5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <div className="text-sm">
            <p className="font-semibold text-blue-700">AI-first moderation is active</p>
            <p className="mt-0.5 text-blue-600">When a patient submits a review, the system verifies their booking exists and runs an AI content scan. Clean reviews are auto-published instantly — no admin action needed. Only reviews flagged for inappropriate content, trust issues, or policy violations appear here for your decision.</p>
          </div>
        </div>

        {/* Tabs + table */}
        <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 pt-1">
            <CustomTab tabs={tabs} active={activeTab} onChange={(k) => { setActiveTab(k as TabKey); setSearch(""); }} />
            <div className="relative py-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="h-8 w-44 rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
              />
            </div>
          </div>

          <div className="px-4">
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-gray-400 font-semibold">No reviews found</p>
            )}
            {activeTab === "flagged" && filtered.map((r) => <FlaggedRow key={r.id} review={r} onView={() => setSelectedReview(r)} />)}
            {activeTab === "published" && filtered.map((r) => <PublishedRow key={r.id} review={r} onView={() => setSelectedReview(r)} />)}
            {activeTab === "rejected" && filtered.map((r) => <RejectedRow key={r.id} review={r} onView={() => setSelectedReview(r)} />)}
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-400">{footerText}</p>
          </div>
        </div>
      </div>

      <ReviewDrawer review={selectedReview} onClose={() => setSelectedReview(null)} onAction={handleAction} />
    </>
  );
}
