"use client";

import { CheckCircle2, Circle, ShieldCheck, Star, ShieldAlert, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type Dentist } from "@/features/marketing/_components/find-dentists-page-components/types";
import {
  getBookingDraft,
  saveBookingDraft,
  setSelectedDentistsForBooking,
} from "@/lib/storage/bookingService";
import { useCompareModalController } from "@/hooks/dentist/useCompareModalController";
import { ErrorState } from "@/components/shared/error-state";

const LANG_CODE: Record<string, string> = {
  English: "English",
  Spanish: "Spanish",
  French: "French",
  Portuguese: "Portuguese",
  German: "German",
  Italian: "Italian",
  Mandarin: "Mandarin",
  Japanese: "Japanese",
};

const langAbbr = (languages: string[]) =>
  languages.map((l) => LANG_CODE[l] ?? l.slice(0, 2).toUpperCase()).join(", ");

const estimateLow = (price: number) => Math.round((price * 2.2) / 20) * 20;
const estimateHigh = (price: number) => Math.round((price * 2.87) / 20) * 20;

export default function CompareModal() {
  const router = useRouter();
  const {
    showCompareModal,
    compareModalPurpose,
    selectedIds,
    dentists,
    unverifiedDentist,
    isLoading,
    isError,
    schedule,
    isPostBooking,
    toggleSelect,
    handleOpenChange,
    setSelectedDentistId,
    setBookingMode,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    refetch,
  } = useCompareModalController();

  const handleBook = () => {
    if (selectedIds.length === 0) return;
    setSelectedDentistId(selectedIds[0]);
    const selectedDentists = dentists.filter((dentist) =>
      selectedIds.includes(dentist.id),
    );
    const backendIds = selectedDentists
      .map((dentist) => String(dentist.backendId ?? dentist.id))
      .filter(Boolean);

    setSelectedDentistsForBooking(selectedIds, backendIds);

    const isRequestMode = selectedDentists.some((d) => d.status !== "VERIFIED");
    setBookingMode(isRequestMode ? "request" : "book");
    saveBookingDraft({ bookingMode: isRequestMode ? "request" : "book" });

    if (isRequestMode) {
      setShowBookingModal("startBooking");
      return;
    }

    if (schedule) {
      const draft = getBookingDraft();
      const q = selectedIds.join(",");
      const params = new URLSearchParams();
      if (q) params.set("dentistIds", q);
      if (draft.consultationId) {
        params.set("consultationId", String(draft.consultationId));
      }
      router.push(`/schedule?${params.toString()}`);
      return;
    }
    if (isPostBooking) {
      const q = selectedIds.join(",");
      const draft = getBookingDraft();
      const params = new URLSearchParams();
      params.set("dentistIds", q);
      if (draft.consultationId) {
        params.set("consultationId", String(draft.consultationId));
      }
      setShowCompareModal(false);
      setCompareModalPurpose("compare");
      router.push(`/schedule?${params.toString()}`);
    } else {
      setShowBookingModal("startBooking");
    }
  };

  const colCount = dentists.length;

  return (
    <Dialog open={showCompareModal} onOpenChange={handleOpenChange}>
      <DialogContent className={unverifiedDentist ? "sm:max-w-lg w-full p-8 rounded-xl overflow-hidden bg-white flex flex-col justify-center max-h-[92vh]" : "sm:max-w-4xl w-full p-0 rounded-lg overflow-hidden bg-white max-h-[92vh] flex flex-col"}>
        <DialogTitle className="sr-only">
          {unverifiedDentist
            ? "Verification Required"
            : isPostBooking
              ? "Your personalised estimates are ready"
              : "Compare Dentists"}
        </DialogTitle>

        {unverifiedDentist ? (
          <UnverifiedWarning dentist={unverifiedDentist} />
        ) : isError ? (
          <div className="p-8">
            <ErrorState
              title="Comparison Unavailable"
              message="Could not load details for comparison. Please try again."
              onRetry={refetch}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0 px-8 py-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                {isPostBooking ? "Your personalised estimates are ready" : "Compare Dentists"}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {isPostBooking ? "Select a dentist to continue" : "Compare verified dentist data, not marketing claims"}
              </p>
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto flex flex-col justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground font-medium animate-pulse">Loading dentist profiles...</span>
                </div>
              ) : (
                <ComparisonGrid
                  dentists={dentists}
                  selectedIds={selectedIds}
                  toggleSelect={toggleSelect}
                  isPostBooking={isPostBooking}
                  colCount={colCount}
                />
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex flex-col items-center gap-3 border-t border-border px-8 py-7">
              <button
                onClick={handleBook}
                disabled={selectedIds.length === 0 || isLoading}
                className="inline-flex items-center gap-3 rounded-lg bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
              >
                <span>
                  {dentists.filter((d) => selectedIds.includes(d.id)).some((d) => d.status !== "VERIFIED")
                    ? `Request Consultation${selectedIds.length > 1 ? "s" : ""}`
                    : schedule || isPostBooking
                      ? `Schedule ${selectedIds.length} Consult${selectedIds.length !== 1 ? "s" : ""}`
                      : "Book consultation"}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">
                  {selectedIds.length}
                </span>
              </button>

              {isPostBooking ? (
                <p className="text-sm text-muted-foreground text-center">
                  You&apos;ll only fill in your details once.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  By continuing you are agree with our{" "}
                  <a href="/terms" className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
                    terms and Conditions
                  </a>
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface UnverifiedWarningProps {
  dentist: Dentist;
}

function UnverifiedWarning({ dentist }: UnverifiedWarningProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl scale-150"></div>
        <div className="relative bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl p-4 shadow-sm">
          <ShieldAlert className="size-12 stroke-[1.5]" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Verification Required for Comparison
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        To guarantee the integrity of clinical metrics, surprise guarantees, and AI insights, RatedDocs only compares <span className="font-semibold text-[#003366]">Verified Dentists</span>.
        Without full verification audits, we cannot generate accurate price projections or compare credentials.
      </p>

      <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 mb-6 text-left">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-slate-200 border border-white shadow-sm">
          <Image
            src={dentist.image ?? "/images/man-avatar.png"}
            alt={dentist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-slate-700 truncate">
              {dentist.name}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
              {dentist.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {dentist.specialty ?? ""}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            {dentist.location?.city && <span>{dentist.location.city}</span>}
            {dentist.location?.city && dentist.location?.country && <span>•</span>}
            {dentist.location?.country && <span>{dentist.location.country}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ComparisonGridProps {
  dentists: Dentist[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  isPostBooking: boolean;
  colCount: number;
}

function ComparisonGrid({
  dentists,
  selectedIds,
  toggleSelect,
  isPostBooking,
  colCount,
}: ComparisonGridProps) {
  return (
    <div style={{ minWidth: `${200 + colCount * 220}px` }}>
      {/* Dentist header row */}
      <div
        className="px-8 pt-8 pb-4"
        style={{
          display: "grid",
          gridTemplateColumns: `180px repeat(${colCount}, 1fr)`,
        }}
      >
        <div />
        {dentists.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col items-center text-center px-4"
          >
            <Image
              src={doc.image ?? "/images/man-avatar.png"}
              alt={doc.name}
              width={80}
              height={80}
              className="size-20 rounded-full object-cover bg-muted mb-4"
            />
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                aria-label={`${selectedIds.includes(doc.id) ? "Deselect" : "Select"} ${doc.name}`}
                onClick={() => toggleSelect(doc.id)}
                className="shrink-0 transition-transform active:scale-90"
              >
                {selectedIds.includes(doc.id) ? (
                  <CheckCircle2 className="size-5 fill-primary text-primary stroke-white" />
                ) : (
                  <Circle
                    className={`size-5 transition-colors ${selectedIds.length >= 2
                      ? "text-gray-200 cursor-not-allowed"
                      : "text-gray-400 hover:text-primary"
                      }`}
                  />
                )}
              </button>
              <span className="text-[15px] font-semibold text-foreground">
                {doc.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground mb-2">
              {doc.specialty || ""}
            </span>
          </div>
        ))}
      </div>

      {/* Comparison rows */}
      <ComparisonRow
        label="RDV SCORE"
        colCount={colCount}
        values={dentists.map((d) => d.rdvScore ? `${d.rdvScore}/100` : "0")}
      />
      <ComparisonRow
        label="PATIENT RATING"
        colCount={colCount}
        values={dentists.map((d) => {
          const ratingVal = d?.rating?.combined ?? d?.rating?.google ?? d?.rating?.doctoralia ?? 0;
          const reviewCount = d?.rating?.googleReviewCount ?? d?.rating?.doctoraliaReviewCount ?? 0;
          if (ratingVal === 0 && reviewCount === 0) {
            return <span key={d.id} className="text-muted-foreground text-sm">No ratings yet</span>;
          }
          return (
            <span
              key={d.id}
              className="inline-flex items-center justify-center gap-1.5"
            >
              <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">
                {ratingVal.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({reviewCount} Reviews)
              </span>
            </span>
          );
        })}
      />
      <ComparisonRow
        label="LOCATION"
        colCount={colCount}
        values={dentists.map((d) => d.location?.fullAddress ?? d.location?.city ?? d.location?.country ?? "0")}
      />
      <ComparisonRow
        label="LANGUAGES"
        colCount={colCount}
        values={dentists.map((d) => d.languages && d.languages.length > 0 ? langAbbr(d.languages) : "N/A")}
      />
      <ComparisonRow
        label="ESTIMATE RANGE"
        colCount={colCount}
        isLast={!isPostBooking}
        values={dentists.map((d) =>
          isPostBooking ? (
            <span key={d.id} className="text-lg font-bold text-primary">
              ${estimateLow(d.price || 0).toLocaleString()} – $
              {estimateHigh(d.price || 0).toLocaleString()}
            </span>
          ) : (
            <span key={d.id} className="text-lg font-bold text-primary">
              ${(d.price || 0).toLocaleString()}
            </span>
          ),
        )}
      />

      {/* Guarantee banner */}
      {isPostBooking && (
        <div className="px-8 py-4 border-b border-border">
          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/5 border border-primary/20 rounded-lg">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            <p className="text-sm text-primary font-medium text-center">
              These estimates are binding and protected by the No Surprise Guarantee.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  values: React.ReactNode[];
  colCount: number;
  isLast?: boolean;
}

function ComparisonRow({
  label,
  values,
  colCount,
  isLast = false,
}: ComparisonRowProps) {
  return (
    <div
      className={`px-8 py-5 items-center ${isLast ? "" : "border-b border-border"}`}
      style={{
        display: "grid",
        gridTemplateColumns: `180px repeat(${colCount}, 1fr)`,
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {values.map((val, i) => (
        <div
          key={i}
          className="px-4 text-center text-[15px] font-medium text-foreground"
        >
          {val}
        </div>
      ))}
    </div>
  );
}
