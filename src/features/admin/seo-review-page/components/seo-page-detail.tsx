"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Star, ThumbsUp, ThumbsDown, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import seoPagesData from "@/lib/seo-pages-data";
import { cn } from "@/lib/utils";

type SEOPage = (typeof seoPagesData.pages)[number];

interface SEOPageDetailProps {
  page: SEOPage;
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", sizes[size])}
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
        <Star
          key={i}
          className={cn(sz, i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200")}
        />
      ))}
    </span>
  );
}

/* ─── Before/After Photos placeholder ───────────────────────────────────── */
function PhotosSection() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#1A1A2E]">Before &amp; After Photos</h3>
      <p className="mt-0.5 text-xs text-gray-400">Submitted by the patient · verified by RatedDocs</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {["Before", "After"].map((label) => (
          <div
            key={label}
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gray-100"
          >
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <span className="text-sm font-medium text-gray-400">{label}</span>
            </div>
            {label === "Before" && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-[#1A1A2E] shadow-sm">
                <ShieldCheck className="h-3 w-3 text-blue-500" /> Verified RatedDocs Patient
              </div>
            )}
            {label === "After" && (
              <div className="absolute bottom-2 right-2 rounded-full bg-[#1A1A2E]/80 px-2 py-0.5 text-xs font-medium text-white">
                RatedDocs
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Related review card ────────────────────────────────────────────────── */
function RelatedReviewCard({ page }: { page: SEOPage }) {
  const month = page.published_date.split(" ").slice(0, 2).join(" ");
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={page.patient_initials} color={page.patient_avatar_color} size="sm" />
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">{page.patient_name}</p>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" /> {page.patient_location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Stars rating={page.rating} small />
          <span className="text-sm font-semibold text-[#1A1A2E]">{page.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {page.patient_verified && (
          <span className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
            <CheckCircle2 className="h-3 w-3" /> Verified RatedDocs Patient
          </span>
        )}
        <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
          {page.procedure}
        </span>
      </div>

      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Written Review</p>
      <p className="mt-1 text-sm italic text-gray-600 leading-relaxed line-clamp-2">
        &ldquo;{page.review_content}&rdquo;
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Dentist: {page.dentist_name}</span>
          <span className="text-gray-200">·</span>
          <span>{month}</span>
        </div>
        <Link
          href={`/admin/seo-review-pages/${page.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-[#1A1A2E] hover:text-gray-600 transition-colors"
        >
          Read full review <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Main detail component ──────────────────────────────────────────────── */
export default function SEOPageDetail({ page }: SEOPageDetailProps) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const yesCount = page.helpful_yes + (helpful === "yes" ? 1 : 0);
  const noCount = page.helpful_no + (helpful === "no" ? 1 : 0);

  const relatedPages = seoPagesData.pages
    .filter((p) => p.id !== page.id && p.status === "published")
    .slice(0, 3);

  const reviewMonth = page.published_date.split(" ").slice(0, 2).join(" ");

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/seo-review-pages"
          className="flex items-center gap-1.5 font-medium text-[#1A1A2E] hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> SEO Review Pages
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">{page.dentist_name}</span>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* ── Left: review content ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Review card */}
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            {/* Patient header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar initials={page.patient_initials} color={page.patient_avatar_color} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#1A1A2E]">{page.patient_name}</p>
                    <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="h-3 w-3" /> {page.patient_location}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {page.patient_verified && (
                <span className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                  <CheckCircle2 className="h-3 w-3" /> Verified RatedDocs Patient
                </span>
              )}
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {page.procedure}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {reviewMonth}
              </span>
            </div>

            {/* Overall rating */}
            <div className="mt-4 flex items-center gap-2">
              <Stars rating={page.rating} />
              <span className="text-2xl font-bold text-[#1A1A2E]">{page.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">/ 5</span>
            </div>

            {/* Ratings breakdown */}
            <div className="mt-4 space-y-2.5">
              {page.ratings_breakdown.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} small />
                    <span className="w-4 text-right text-sm font-semibold text-[#1A1A2E]">{r.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Review text */}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Written Review</p>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm italic leading-relaxed text-gray-700">
                &ldquo;{page.review_content}&rdquo;
              </div>
            </div>

            {/* Review meta */}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-50 pt-4 text-xs text-gray-400">
              <span>Procedure: <span className="font-medium text-gray-600">{page.procedure}</span></span>
              <span className="text-gray-200">·</span>
              <span>Dentist: <span className="font-medium text-gray-600">{page.dentist_name}</span></span>
              <span className="text-gray-200">·</span>
              <span>Published {page.published_date}</span>
            </div>
          </div>

          {/* Helpful votes */}
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#1A1A2E]">Was this review helpful?</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setHelpful("yes")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  helpful === "yes"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <ThumbsUp className="h-4 w-4" /> Yes · {yesCount}
              </button>
              <button
                onClick={() => setHelpful("no")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  helpful === "no"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <ThumbsDown className="h-4 w-4" /> No · {noCount}
              </button>
            </div>
          </div>

          {/* Before & After Photos */}
          {page.has_photos && <PhotosSection />}

          {/* Related Reviews */}
          {relatedPages.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1A1A2E]">Related Reviews</h2>
                <Link href="/admin/seo-review-pages" className="text-sm font-semibold text-[#1A1A2E] hover:text-gray-600 transition-colors">
                  See all
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {relatedPages.map((p) => (
                  <RelatedReviewCard key={p.id} page={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: dentist sidebar ── */}
        <div className="w-full shrink-0 lg:w-72 xl:w-80">
          <div className="rounded-lg bg-[#1A1A2E] p-5 text-white shadow-lg">
            {/* Dentist avatar */}
            <div className="flex flex-col items-center text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: page.dentist_avatar_color }}
              >
                {page.dentist_initials}
              </div>
              <h3 className="mt-3 text-base font-bold">{page.dentist_name}</h3>
              <p className="mt-0.5 text-xs text-white/60">
                {page.dentist_title} — {page.dentist_specialty}
              </p>
            </div>

            {/* Verified badge */}
            {page.dentist_verified && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">RDV Verified Dentist</span>
              </div>
            )}

            {/* Location & rating */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-white/40" />
                <span>{page.dentist_location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stars rating={Math.round(page.dentist_rating)} small />
                <span className="text-sm font-semibold text-white">{page.dentist_rating.toFixed(1)}</span>
                <span className="text-xs text-white/50">({page.dentist_review_count} reviews)</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/admin/dentists`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              View {page.dentist_name.split(" ")[1]}&apos;s full profile
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            {/* Trust section */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                Why Trust RatedDocs?
              </p>
              <div className="space-y-2">
                {[
                  "Reviews only from verified patients",
                  "Every dentist background-checked",
                  "Prices guaranteed before you book",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    <span className="text-xs text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
