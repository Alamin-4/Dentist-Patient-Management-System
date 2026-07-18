import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPatientMoney } from "./overview-data";

interface Props {
  activeBookings: any[];
}

/** Format date string nicely: e.g. "2026-06-15" -> "June 15, 2026" */
function formatDate(dateStr: string) {
  if (!dateStr || dateStr === "TBD") return "TBD";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

/** Travel date — prefer the second timeline event (first is usually "inquiry"). */
const getTravelDate = (patient: any) => {
  const rawDate = patient.patient_timeline?.[1]?.date ?? patient.patient_timeline?.[0]?.date ?? "TBD";
  return formatDate(rawDate);
};

/** Two-letter initials from a full name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "PT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Per-status badge style. */
function statusBadge(status: string) {
  if (status === "In Progress")
    return "bg-[#0F172A] text-white";
  return "bg-[#EFF6FF] text-[#1D4ED8]";
}

/** Per-status action hint. */
function actionText(status: string) {
  if (status === "In Progress") return "Submit Final Treatment Plan";
  return "Prepare for consultation";
}

export function OverviewActiveBookingsCard({ activeBookings }: Props) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,35,61,0.03)] sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">
          Active bookings
        </h2>
        <Link
          href="/dentist/bookings"
          className="text-sm font-bold text-[#CDA555] transition-colors hover:text-[#b08c43]"
        >
          View all
        </Link>
      </div>

      {/* Desktop table */}
      <div className="mt-5 hidden overflow-hidden md:block">
        <div className="divide-y divide-gray-100">
          {activeBookings.map((booking, index) => {
            const initials = getInitials(booking.patient_info.name);

            return (
              <div
                key={booking.id || `booking-${booking.patient_info.email}-${index}`}
                className="grid grid-cols-[2fr_1.1fr_0.9fr_1.4fr_auto] items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Patient */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-[#0F172A]",
                    )}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">
                      {booking.patient_info.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {booking.patient_info.procedure}
                    </p>
                  </div>
                </div>

                {/* Travel date */}
                <div>
                  <p className="text-xs font-semibold text-gray-400">Travel date</p>
                  <p className="mt-0.5 text-sm font-bold text-gray-900">
                    {getTravelDate(booking)}
                  </p>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2.5 py-1 text-xs font-bold",
                      statusBadge(booking.patient_info.status),
                    )}
                  >
                    {booking.patient_info.status}
                  </span>
                </div>

                {/* Price + action */}
                <div>
                  <p className="text-sm font-extrabold text-[#CDA555]">
                    {formatPatientMoney(booking.patient_info.final_budget)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {actionText(booking.patient_info.status)}
                  </p>
                </div>

                {/* View button */}
                <Link
                  href="/dentist/bookings"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 px-4 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-5 space-y-3 md:hidden">
        {activeBookings.map((booking, index) => {
          const initials = getInitials(booking.patient_info.name);

          return (
            <article
              key={booking.id || `booking-${booking.patient_info.email}-${index}`}
              className="rounded-xl border border-gray-100 bg-white p-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-[#0F172A]",
                    )}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {booking.patient_info.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {booking.patient_info.procedure}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-2 py-0.5 text-xs font-bold",
                    statusBadge(booking.patient_info.status),
                  )}
                >
                  {booking.patient_info.status}
                </span>
              </div>

              {/* Bottom row */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-400">Travel date</p>
                  <p className="text-sm font-bold text-gray-900">
                    {getTravelDate(booking)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#CDA555]">
                    {formatPatientMoney(booking.patient_info.final_budget)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {actionText(booking.patient_info.status)}
                  </p>
                </div>
              </div>

              {/* View link */}
              <Link
                href="/dentist/bookings"
                className="mt-3 flex items-center gap-1 text-xs font-bold text-[#CDA555]"
              >
                View booking <ChevronRight className="size-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
