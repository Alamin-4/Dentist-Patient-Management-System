/**
 * consultation-state.test.ts
 *
 * Unit tests for resolveConsultationState and its supporting helpers.
 * Uses plain TypeScript — no test framework dependency required.
 * Run with: npx tsx src/core/lib/__tests__/consultation-state.test.ts
 *
 * Each test calls assert() which throws on failure, so any broken test
 * terminates with a clear error message.
 */

import {
  resolveConsultationState,
  getConsultationStartUtcMs,
  getConsultationBoundaries,
  msUntilNextBoundary,
  resolveConsultationTab,
  isConsultationToday,
  isConsultationPast,
  type ConsultationDisplayState,
  type ConsultationTab,
} from "../consultation-state";
import type { ConsultationItem } from "../../types";

// ─── Minimal stub factory ─────────────────────────────────────────────────────

function makeConsultation(overrides: Partial<ConsultationItem> = {}): ConsultationItem {
  return {
    id: "test-id",
    intakeId: "intake-id",
    intake: {
      id: "intake-id",
      patientId: null,
      firstName: "Test",
      lastName: "Patient",
      email: "test@example.com",
      dateOfBirth: null,
      country: null,
      procedureIds: [],
      procedureNames: [],
      budget: null,
      travelFrom: null,
      travelTo: null,
      lastVisit: null,
      conditions: [],
      additionalInfo: null,
      photos: [],
      xrayUrl: null,
      xrayNotes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    patientId: null,
    dentistId: null,
    directoryEntryId: null,
    requestStatus: "SCHEDULED",
    // Scheduled for a fixed known UTC time: 2025-01-15 14:00 UTC
    scheduledDate: "2025-01-15",
    scheduledTime: "14:00",
    timezone: "UTC+0",
    durationMinutes: 15,
    roomId: null,
    meetingLink: null,
    socketSessionId: null,
    dentistResponseNote: null,
    respondedAt: null,
    cancelledBy: null,
    cancellationReason: null,
    cancelledAt: null,
    rescheduledBy: null,
    rescheduledAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dentist: null,
    ...overrides,
  };
}

// ─── Assertions ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(
  condition: boolean,
  testName: string,
  extra?: string,
): void {
  if (condition) {
    console.log(`  ✅ PASS  ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL  ${testName}${extra ? `\n         ${extra}` : ""}`);
    failed++;
  }
}

function assertState(
  actual: ConsultationDisplayState,
  expected: ConsultationDisplayState,
  testName: string,
): void {
  assert(actual === expected, testName, `expected "${expected}", got "${actual}"`);
}

function assertTab(
  actual: ConsultationTab,
  expected: ConsultationTab,
  testName: string,
): void {
  assert(actual === expected, testName, `expected "${expected}", got "${actual}"`);
}

// ─── Fixed reference times ────────────────────────────────────────────────────
// Meeting: 2025-01-15 14:00 UTC, duration 15 min → ends 14:15 UTC
// Join window opens at: 13:55 UTC (5 min early)

const SCHEDULED_DATE = "2025-01-15";
const SCHEDULED_TIME = "14:00";
const TIMEZONE = "UTC+0";

const START_UTC_MS = Date.UTC(2025, 0, 15, 14, 0, 0, 0); // 14:00 UTC
const WINDOW_OPEN_MS = START_UTC_MS - 5 * 60 * 1000;     // 13:55 UTC
const END_MS = START_UTC_MS + 15 * 60 * 1000;             // 14:15 UTC

const c = makeConsultation({
  scheduledDate: SCHEDULED_DATE,
  scheduledTime: SCHEDULED_TIME,
  timezone: TIMEZONE,
  durationMinutes: 15,
});

// ─── getConsultationStartUtcMs ────────────────────────────────────────────────

console.log("\n─── getConsultationStartUtcMs ───────────────────────────────────────────\n");

assert(
  getConsultationStartUtcMs(SCHEDULED_DATE, SCHEDULED_TIME, TIMEZONE) === START_UTC_MS,
  "Parses UTC+0 date + time correctly",
);

assert(
  getConsultationStartUtcMs(SCHEDULED_DATE, SCHEDULED_TIME, "UTC+5:30") ===
    START_UTC_MS - 5.5 * 60 * 60 * 1000,
  "Applies UTC+5:30 offset correctly",
);

assert(
  getConsultationStartUtcMs(null, null, null) === null,
  "Returns null for missing inputs (fail-safe)",
);

assert(
  getConsultationStartUtcMs("not-a-date", "14:00", null) === null,
  "Returns null for malformed date",
);

// ─── resolveConsultationState — boundary tests ────────────────────────────────

console.log("\n─── resolveConsultationState — boundary tests ───────────────────────────\n");

assertState(
  resolveConsultationState(c, WINDOW_OPEN_MS - 1),
  "view-details",
  "1 ms before window opens → view-details (not join)",
);

assertState(
  resolveConsultationState(c, WINDOW_OPEN_MS),
  "join",
  "exactly at window-open boundary → join",
);

assertState(
  resolveConsultationState(c, WINDOW_OPEN_MS + 1),
  "join",
  "1 ms after window opens → join",
);

assertState(
  resolveConsultationState(c, START_UTC_MS),
  "join",
  "exactly at meeting start → join",
);

assertState(
  resolveConsultationState(c, END_MS),
  "join",
  "exactly at meeting end boundary → join (inclusive end)",
);

assertState(
  resolveConsultationState(c, END_MS + 1),
  "reschedule-expired",
  "1 ms after meeting ends → reschedule-expired",
);

// ─── resolveConsultationState — status tests ──────────────────────────────────

console.log("\n─── resolveConsultationState — status tests ─────────────────────────────\n");

assertState(
  resolveConsultationState(makeConsultation({ requestStatus: "PENDING" }), START_UTC_MS),
  "awaiting-approval",
  "PENDING → awaiting-approval",
);

assertState(
  resolveConsultationState(makeConsultation({ requestStatus: "ACCEPTED" }), START_UTC_MS),
  "schedule-slot",
  "ACCEPTED → schedule-slot",
);

assertState(
  resolveConsultationState(makeConsultation({ requestStatus: "MISSED" }), START_UTC_MS),
  "reschedule-missed",
  "MISSED → reschedule-missed",
);

assertState(
  resolveConsultationState(makeConsultation({ requestStatus: "COMPLETED" }), START_UTC_MS),
  "completed",
  "COMPLETED → completed",
);

assertState(
  resolveConsultationState(makeConsultation({ requestStatus: "CANCELLED" }), START_UTC_MS),
  "view-details",
  "CANCELLED → view-details (safe default, not join)",
);

// ─── resolveConsultationState — malformed / missing data ─────────────────────

console.log("\n─── resolveConsultationState — malformed / missing data ─────────────────\n");

assertState(
  resolveConsultationState(
    makeConsultation({ scheduledDate: null, scheduledTime: null }),
    START_UTC_MS,
  ),
  "view-details",
  "Missing scheduledDate/Time on SCHEDULED → view-details (fail-safe, not join)",
);

assertState(
  resolveConsultationState(
    makeConsultation({ scheduledDate: "not-a-date", scheduledTime: "14:00" }),
    START_UTC_MS,
  ),
  "view-details",
  "Malformed scheduledDate → view-details (fail-safe, not join)",
);

assertState(
  resolveConsultationState(
    makeConsultation({ scheduledDate: SCHEDULED_DATE, scheduledTime: "bad-time" }),
    START_UTC_MS,
  ),
  "view-details",
  "Malformed scheduledTime → view-details (fail-safe, not join)",
);

// ─── Race condition simulation ────────────────────────────────────────────────

console.log("\n─── Race condition simulation ────────────────────────────────────────────\n");

const PRE_WINDOW = WINDOW_OPEN_MS - 60_000; // 1 minute before window opens
const POST_WINDOW = WINDOW_OPEN_MS + 1;     // 1 ms after window opens

const stateAtRender = resolveConsultationState(c, PRE_WINDOW);
const labelAtRender = stateAtRender;

const stateAtClick_wrongWay = resolveConsultationState(c, POST_WINDOW);

assert(
  stateAtRender === "view-details",
  "At render time (before window): state is view-details",
);

assert(
  labelAtRender === stateAtRender,
  "Label matches state (trivially true when both read same value)",
);

assert(
  stateAtClick_wrongWay === "join",
  "Clock-advanced re-computation would yield join (the old bug vector)",
);

assert(
  stateAtRender !== stateAtClick_wrongWay,
  "Confirms render-time state and click-time re-computation diverge",
);

// ─── msUntilNextBoundary ───────────────────────────────────────────────────────

console.log("\n─── msUntilNextBoundary ─────────────────────────────────────────────────\n");

const beforeWindow = msUntilNextBoundary(c, PRE_WINDOW);
assert(
  beforeWindow !== null && beforeWindow > 0,
  "msUntilNextBoundary returns positive ms before window opens",
  `got ${beforeWindow}`,
);
assert(
  beforeWindow === WINDOW_OPEN_MS - PRE_WINDOW,
  "msUntilNextBoundary returns exact ms to window-open when that is the nearest boundary",
  `expected ${WINDOW_OPEN_MS - PRE_WINDOW}, got ${beforeWindow}`,
);

const insideWindow = msUntilNextBoundary(c, WINDOW_OPEN_MS + 1);
assert(
  insideWindow !== null && insideWindow > 0,
  "Inside window, next boundary is meeting-end",
  `got ${insideWindow}`,
);
assert(
  insideWindow === END_MS - (WINDOW_OPEN_MS + 1),
  "Inside window, ms until next boundary equals time to end",
  `expected ${END_MS - (WINDOW_OPEN_MS + 1)}, got ${insideWindow}`,
);

const afterEnd = msUntilNextBoundary(c, END_MS + 1);
assert(
  afterEnd === null,
  "After meeting ends, no future boundary exists → null",
  `got ${afterEnd}`,
);

const pendingConsultation = makeConsultation({ requestStatus: "PENDING" });
assert(
  msUntilNextBoundary(pendingConsultation, START_UTC_MS) === null,
  "PENDING consultation has no time-based boundaries → null",
);

// ─── resolveConsultationTab — boundary-exact tests ───────────────────────────

console.log("\n─── resolveConsultationTab — boundary-exact tests ───────────────────────────\n");

assertTab(resolveConsultationTab(c, WINDOW_OPEN_MS - 1), "active",
  "SCHEDULED, 1ms before window opens but SAME DAY → active (isToday promotion)");

assertTab(resolveConsultationTab(c, WINDOW_OPEN_MS), "active",
  "SCHEDULED, exactly at windowOpenMs: active (inclusive)");

assertTab(resolveConsultationTab(c, WINDOW_OPEN_MS + 1), "active",
  "SCHEDULED, 1ms after window opens: active");

assertTab(resolveConsultationTab(c, END_MS), "active",
  "SCHEDULED, exactly at endMs: active (inclusive)");

assertTab(resolveConsultationTab(c, END_MS + 1), "active",
  "SCHEDULED, 1ms after endMs: active (isPast → keep visible)");

// isConsultationToday check with a future date
const NEXT_DAY_MS = START_UTC_MS + 24 * 60 * 60 * 1000;
const futureConsultation = makeConsultation({
  scheduledDate: "2025-01-16",
  scheduledTime: "14:00",
  timezone: "UTC+0",
});

assert(
  isConsultationToday(c, START_UTC_MS) === true,
  "isConsultationToday returns true for appointment on same calendar day",
);

assert(
  isConsultationToday(futureConsultation, START_UTC_MS) === false,
  "isConsultationToday returns false for appointment on different calendar day",
);

assertTab(resolveConsultationTab(futureConsultation, START_UTC_MS), "upcoming",
  "SCHEDULED, future date (not today, not window, not past): upcoming");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "COMPLETED" }), START_UTC_MS), "estimate-updates",
  "COMPLETED status → estimate-updates");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "MISSED" }), START_UTC_MS), "active",
  "MISSED status → active");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "ACTIVE" }), START_UTC_MS), "active",
  "ACTIVE status → active");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "PENDING" }), START_UTC_MS), "upcoming",
  "PENDING status → upcoming");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "ACCEPTED" }), START_UTC_MS), "upcoming",
  "ACCEPTED status → upcoming");

assertTab(resolveConsultationTab(makeConsultation({ requestStatus: "UNKNOWN_STATE" as any }), START_UTC_MS), "upcoming",
  "UNKNOWN status → upcoming (fail-safe)");

// ─── CANCELLED regression tests ───────────────────────────────────────────────

console.log("\n─── CANCELLED regression tests ──────────────────────────────────────────\n");

function patientFilter(c: ConsultationItem, activeTab: string, now: number): boolean {
  if ((c as any).treatmentPlan?.treatmentBooking) return false;
  if (c.requestStatus?.toUpperCase() === "CANCELLED") return false;
  return resolveConsultationTab(c, now) === activeTab;
}

function dentistFilter(c: ConsultationItem, activeTab: string, now: number): boolean {
  if ((c as any).treatmentPlan?.treatmentBooking) return false;
  if (c.requestStatus?.toUpperCase() === "CANCELLED") return false;
  const tab = resolveConsultationTab(c, now);
  if (activeTab === "Upcoming") return tab === "upcoming";
  if (activeTab === "Active") return tab === "active";
  if (activeTab === "Treatment Estimate") return tab === "estimate-updates";
  return false;
}

const cancelledUpper = makeConsultation({ requestStatus: "CANCELLED" });
const cancelledLower = makeConsultation({ requestStatus: "cancelled" as any });

assert(!patientFilter(cancelledUpper, "upcoming", START_UTC_MS), "CANCELLED (upper): excluded from patient upcoming");
assert(!patientFilter(cancelledUpper, "active", START_UTC_MS), "CANCELLED (upper): excluded from patient active");
assert(!patientFilter(cancelledUpper, "estimate-updates", START_UTC_MS), "CANCELLED (upper): excluded from patient estimate-updates");

assert(!patientFilter(cancelledLower, "upcoming", START_UTC_MS), "cancelled (lower): excluded from patient upcoming");
assert(!patientFilter(cancelledLower, "active", START_UTC_MS), "cancelled (lower): excluded from patient active");
assert(!patientFilter(cancelledLower, "estimate-updates", START_UTC_MS), "cancelled (lower): excluded from patient estimate-updates");

assert(!dentistFilter(cancelledUpper, "Upcoming", START_UTC_MS), "CANCELLED (upper): excluded from dentist Upcoming");
assert(!dentistFilter(cancelledUpper, "Active", START_UTC_MS), "CANCELLED (upper): excluded from dentist Active");
assert(!dentistFilter(cancelledUpper, "Treatment Estimate", START_UTC_MS), "CANCELLED (upper): excluded from dentist Treatment Estimate");

assert(!dentistFilter(cancelledLower, "Upcoming", START_UTC_MS), "cancelled (lower): excluded from dentist Upcoming");
assert(!dentistFilter(cancelledLower, "Active", START_UTC_MS), "cancelled (lower): excluded from dentist Active");
assert(!dentistFilter(cancelledLower, "Treatment Estimate", START_UTC_MS), "cancelled (lower): excluded from dentist Treatment Estimate");

// ─── Integration: patient and dentist filters yield identical tabs ─────────────

console.log("\n─── Integration: patient and dentist filters yield identical tabs ────────\n");

const scenarios: Array<{ label: string; c: ConsultationItem; now: number }> = [
  { label: "today, pre-window", c, now: PRE_WINDOW },
  { label: "in window", c, now: WINDOW_OPEN_MS + 1 },
  { label: "past end", c, now: END_MS + 1 },
  { label: "future date", c: futureConsultation, now: START_UTC_MS },
];

for (const { label, c: sc, now } of scenarios) {
  const patientTab = patientFilter(sc, "upcoming", now) ? "upcoming"
    : patientFilter(sc, "active", now) ? "active"
    : patientFilter(sc, "estimate-updates", now) ? "estimate-updates" : "none";

  const dentistTab = dentistFilter(sc, "Upcoming", now) ? "upcoming"
    : dentistFilter(sc, "Active", now) ? "active"
    : dentistFilter(sc, "Treatment Estimate", now) ? "estimate-updates" : "none";

  assert(
    patientTab === dentistTab,
    `Integration [${label}]: patient and dentist route to same tab (${patientTab})`,
    `patient="${patientTab}", dentist="${dentistTab}"`,
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("All tests passed ✅");
}

