/**
 * consultation-state.ts
 *
 * Single source of truth for computing a consultation's display / action
 * intent.  No component or handler may independently re-implement
 * `isWithinMeetingWindow` logic.  Everything that needs to know "can the
 * patient join?" or "what label should the button show?" calls
 * `resolveConsultationState` with a `now` timestamp.
 *
 * Keeping `now` as an explicit argument makes the function a pure function
 * that is trivially unit-testable without mocking `Date.now`.
 */

import type { ConsultationItem } from "@/types";

// ─── Public Intent Type ───────────────────────────────────────────────────────

/**
 * The exhaustive set of display states a consultation card can be in.
 * The label, button behaviour, and any alert messages are derived from
 * exactly one value of this union — never from separate boolean variables.
 */
export type ConsultationDisplayState =
  | "reschedule-missed"     // status === MISSED
  | "reschedule-expired"    // status === SCHEDULED/ACTIVE but window already passed
  | "view-details"          // status === SCHEDULED/ACTIVE, window not yet open — SAFE default
  | "join"                  // within 5-min early buffer OR during meeting
  | "awaiting-approval"     // status === PENDING
  | "schedule-slot"         // status === ACCEPTED — patient needs to pick a slot
  | "completed";            // status === COMPLETED

// ─── Timezone Parsing ─────────────────────────────────────────────────────────

/**
 * Convert a human-readable timezone string (e.g. "UTC+5:30", "EST") into an
 * offset in minutes east of UTC.  Returns 0 for unrecognised strings so the
 * caller always gets a valid number.
 */
export function parseTimezoneOffsetMinutes(tzStr?: string | null): number {
  if (!tzStr) return 0;

  // Handle explicit UTC/GMT offsets: "UTC+5", "GMT-8", "UTC+5:30"
  const regex = /(?:UTC|GMT)\s*([+-])\s*(\d+)(?::(\d+))?/i;
  const match = tzStr.match(regex);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
  }

  // Named abbreviations
  if (tzStr.includes("EST")) return -5 * 60;
  if (tzStr.includes("CST")) return -6 * 60;
  if (tzStr.includes("MST")) return -7 * 60;
  if (tzStr.includes("PST")) return -8 * 60;
  if (tzStr.includes("CET")) return 1 * 60;
  if (tzStr.includes("AEST")) return 10 * 60;
  // "BST" in the context of this app means Bangladesh Standard Time (UTC+6),
  // NOT British Summer Time (UTC+1). Keep consistent with existing behaviour.
  if (tzStr.includes("BST")) return 6 * 60;

  return 0;
}

// ─── Start-Time Calculator ────────────────────────────────────────────────────

/**
 * Given a scheduled date string (ISO or any Date-parseable format), a time
 * string (HH:MM or HH:MM AM/PM), and an optional timezone string, return the
 * Unix timestamp (ms) of the meeting's UTC start time.
 *
 * Returns `null` if the inputs are missing or cannot be parsed.
 */
export function getConsultationStartUtcMs(
  scheduledDate: string | Date | null | undefined,
  scheduledTime: string | null | undefined,
  timezoneStr?: string | null,
): number | null {
  if (!scheduledDate || !scheduledTime) return null;

  let dObj: Date;
  try {
    dObj = new Date(scheduledDate);
    if (isNaN(dObj.getTime())) return null;
  } catch {
    return null;
  }

  const year = dObj.getUTCFullYear();
  const month = dObj.getUTCMonth();
  const day = dObj.getUTCDate();

  const timeParts = scheduledTime.split(":");
  let hours = parseInt(timeParts[0], 10);
  let minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

  if (isNaN(hours) || isNaN(minutes)) return null;

  // Handle 12-hour format suffixes
  const upperTime = scheduledTime.toUpperCase();
  if (upperTime.includes("PM") && hours < 12) hours += 12;
  else if (upperTime.includes("AM") && hours === 12) hours = 0;

  const localUtcMs = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const offsetMinutes = parseTimezoneOffsetMinutes(timezoneStr);
  return localUtcMs - offsetMinutes * 60 * 1000;
}

// ─── Boundary Timestamps ─────────────────────────────────────────────────────

export interface ConsultationBoundaries {
  /** ms before scheduled start that the join window opens (5 minutes) */
  windowOpenMs: number;
  /** Scheduled start time in UTC ms */
  startMs: number;
  /** Scheduled end time in UTC ms */
  endMs: number;
}

/**
 * Return the three key boundary timestamps for a consultation, or `null` if
 * schedule data is missing / malformed.
 */
export function getConsultationBoundaries(
  consultation: ConsultationItem,
): ConsultationBoundaries | null {
  const EARLY_BUFFER_MS = 5 * 60 * 1000;
  const startMs = getConsultationStartUtcMs(
    consultation.scheduledDate,
    consultation.scheduledTime,
    consultation.timezone,
  );
  if (startMs === null) return null;

  const durationMs = (consultation.durationMinutes || 15) * 60 * 1000;
  return {
    windowOpenMs: startMs - EARLY_BUFFER_MS,
    startMs,
    endMs: startMs + durationMs,
  };
}

// ─── Core Resolver ────────────────────────────────────────────────────────────

/**
 * The single function that resolves a consultation to a `ConsultationDisplayState`.
 *
 * @param consultation  - The consultation object from the API.
 * @param now           - Current Unix timestamp in ms (pass `Date.now()`).
 *                        Accepting it as a parameter makes this purely testable.
 *
 * Fail-safe rule: when ambiguity exists (e.g. missing/malformed data) the
 * function NEVER resolves to "join".  It falls back to "view-details" or the
 * appropriate non-join state.
 */
export function resolveConsultationState(
  consultation: ConsultationItem,
  now: number,
): ConsultationDisplayState {
  const statusUpper = consultation.requestStatus?.toUpperCase() ?? "";

  // ── Terminal states ────────────────────────────────────────────────────────
  if (statusUpper === "COMPLETED") return "completed";
  if (statusUpper === "MISSED") return "reschedule-missed";
  if (statusUpper === "CANCELLED") return "view-details"; // shouldn't normally show, but safe

  // ── Needs approval or slot ─────────────────────────────────────────────────
  if (statusUpper === "PENDING") return "awaiting-approval";
  if (statusUpper === "ACCEPTED") return "schedule-slot";

  // ── Time-sensitive states (SCHEDULED / ACTIVE) ─────────────────────────────
  if (statusUpper === "SCHEDULED" || statusUpper === "ACTIVE") {
    const boundaries = getConsultationBoundaries(consultation);

    // Missing / malformed schedule data → fail safe, never "join"
    if (!boundaries) return "view-details";

    const { windowOpenMs, endMs } = boundaries;

    // Window has already fully closed → expired
    if (now > endMs) return "reschedule-expired";

    // Within the join window (5 min early buffer OR during meeting)
    if (now >= windowOpenMs && now <= endMs) return "join";

    // Not yet in window → show details
    return "view-details";
  }

  // Unknown status → safest non-join fallback
  return "view-details";
}

// ─── Derived Label Helper ─────────────────────────────────────────────────────

/**
 * Map a `ConsultationDisplayState` to the button label shown in the card.
 * Kept here alongside the resolver so label ↔ state coupling is co-located
 * and any future rename is a single-file change.
 */
export function getConsultationActionLabel(state: ConsultationDisplayState): string {
  switch (state) {
    case "reschedule-missed":
    case "reschedule-expired":
      return "Reschedule";
    case "schedule-slot":
      return "Schedule Slot";
    case "awaiting-approval":
      return "Awaiting Approval";
    case "completed":
      return "Book New Slot";
    case "join":
      return "Join Consultation";
    case "view-details":
      return "View Details";
  }
}

// ─── Next Boundary Calculator (for smart timeout scheduling) ─────────────────

/**
 * Return how many ms from `now` until the next state-change boundary for this
 * consultation.  Used by `useConsultationState` to schedule a `setTimeout`
 * exactly at the next relevant moment rather than polling on an interval.
 *
 * Returns `null` when no future boundary exists (terminal / no schedule data).
 */
export function msUntilNextBoundary(
  consultation: ConsultationItem,
  now: number,
): number | null {
  const statusUpper = consultation.requestStatus?.toUpperCase() ?? "";

  // Terminal states never change
  if (
    statusUpper === "COMPLETED" ||
    statusUpper === "MISSED" ||
    statusUpper === "CANCELLED" ||
    statusUpper === "PENDING" ||
    statusUpper === "ACCEPTED"
  ) {
    return null;
  }

  const boundaries = getConsultationBoundaries(consultation);
  if (!boundaries) return null;

  const { windowOpenMs, endMs } = boundaries;

  // Collect all future boundaries
  const futureBoundaries = [windowOpenMs, endMs].filter((t) => t > now);
  if (futureBoundaries.length === 0) return null;

  return Math.min(...futureBoundaries) - now;
}

// ─── Tab Assignment ───────────────────────────────────────────────────────────

/**
 * The three tabs a consultation can be routed to in either the patient
 * or dentist dashboard.  Tab *labels* may differ between views
 * ("estimate-updates" vs "Treatment Estimate"); this type uses the
 * canonical key and each view maps it to its own display string.
 */
export type ConsultationTab = "upcoming" | "active" | "estimate-updates";

/**
 * Returns true if the consultation's scheduled date falls on today's
 * calendar date, adjusted for the consultation's timezone.
 *
 * Derives the local date from `getConsultationBoundaries(c).startMs`
 * rather than re-parsing `c.scheduledDate` — shares the same UTC
 * timestamp used by `isConsultationPast` and `resolveConsultationState`,
 * keeping timezone computation on a single code path.
 *
 * @param c   - Consultation object.
 * @param now - Unix timestamp in ms (pass `Date.now()`).
 */
export function isConsultationToday(c: ConsultationItem, now: number): boolean {
  const boundaries = getConsultationBoundaries(c);
  if (!boundaries) return false; // no parseable schedule → cannot be "today"

  const offsetMinutes = parseTimezoneOffsetMinutes(c.timezone);

  // startMs = Date.UTC(year, month, day, hours, minutes) - offsetMs
  // Adding offset back gives the local datetime in UTC-frame coordinates.
  const localStartMs = boundaries.startMs + offsetMinutes * 60 * 1000;
  const localStart = new Date(localStartMs);
  const appointmentDateStr =
    `${localStart.getUTCFullYear()}-` +
    `${String(localStart.getUTCMonth() + 1).padStart(2, "0")}-` +
    `${String(localStart.getUTCDate()).padStart(2, "0")}`;

  const localNow = new Date(now + offsetMinutes * 60 * 1000);
  const todayStr =
    `${localNow.getUTCFullYear()}-` +
    `${String(localNow.getUTCMonth() + 1).padStart(2, "0")}-` +
    `${String(localNow.getUTCDate()).padStart(2, "0")}`;

  return appointmentDateStr === todayStr;
}

/**
 * Returns true if the consultation's meeting window has fully elapsed.
 * (now > scheduledStart + durationMinutes)
 *
 * @param c   - Consultation object.
 * @param now - Unix timestamp in ms (pass `Date.now()`).
 */
export function isConsultationPast(c: ConsultationItem, now: number): boolean {
  const boundaries = getConsultationBoundaries(c);
  if (!boundaries) return false;
  return now > boundaries.endMs;
}

/**
 * Resolves which dashboard tab a consultation belongs to.
 *
 * PRECONDITIONS — callers are responsible for excluding before calling
 * this function:
 *   1. Consultations where `treatmentPlan.treatmentBooking` is present
 *      (these have graduated to the booking flow and must not appear in
 *      the consultation tab list).
 *   2. CANCELLED consultations — currently excluded from all tabs on both
 *      patient and dentist sides by the callers' pre-filter guard:
 *      `item.requestStatus?.toUpperCase() === "CANCELLED"`.
 *
 * This function is not a complete classifier on its own.
 *
 * Fail-safe: unknown/malformed status or missing schedule data → "upcoming".
 * A consultation can always be seen; it never silently disappears from all
 * tabs, and ambiguity never resolves toward granting meeting access.
 *
 * @param c   - Consultation object (typed `ConsultationItem`).
 * @param now - Unix timestamp in ms (pass `Date.now()`).
 */
export function resolveConsultationTab(
  c: ConsultationItem,
  now: number,
): ConsultationTab {
  const statusUpper = c.requestStatus?.toUpperCase() ?? "";

  // ── Estimate tab ──────────────────────────────────────────────────────────
  if (statusUpper === "COMPLETED") return "estimate-updates";

  // ── Always Active ─────────────────────────────────────────────────────────
  if (statusUpper === "MISSED" || statusUpper === "ACTIVE") return "active";

  // ── Always Upcoming ───────────────────────────────────────────────────────
  if (statusUpper === "PENDING" || statusUpper === "ACCEPTED") return "upcoming";

  // ── SCHEDULED: time-sensitive routing ─────────────────────────────────────
  if (statusUpper === "SCHEDULED") {
    const boundaries = getConsultationBoundaries(c);
    if (!boundaries) return "upcoming"; // malformed schedule → fail-safe

    // Window already elapsed → keep visible in Active (backend gap compensation)
    if (isConsultationPast(c, now)) return "active";

    // Today's appointment → promote to Active even before join window opens
    if (isConsultationToday(c, now)) return "active";

    // Within the 5-min-early join window
    const { windowOpenMs, endMs } = boundaries;
    if (now >= windowOpenMs && now <= endMs) return "active";

    // Future date, not today → Upcoming
    return "upcoming";
  }

  // Unknown status → fail-safe upcoming (never silently vanish)
  return "upcoming";
}
