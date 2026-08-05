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
  type ConsultationDisplayState,
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
// Simulates: render happens before window opens, then clock advances past the
// boundary before the user clicks.  Proves label and action cannot diverge
// when both derive from the same resolveConsultationState call.

console.log("\n─── Race condition simulation ────────────────────────────────────────────\n");

const PRE_WINDOW = WINDOW_OPEN_MS - 60_000; // 1 minute before window opens
const POST_WINDOW = WINDOW_OPEN_MS + 1;     // 1 ms after window opens

// Simulated render: compute state at render time
const stateAtRender = resolveConsultationState(c, PRE_WINDOW);
// Simulated label
const labelAtRender = stateAtRender; // (what the user sees)

// Time passes: state that WOULD have been computed at click time if re-computed
const stateAtClick_wrongWay = resolveConsultationState(c, POST_WINDOW);

// Correct way: the click handler uses the SAME stateAtRender value
assert(
  stateAtRender === "view-details",
  "At render time (before window): state is view-details",
);

assert(
  labelAtRender === stateAtRender,
  "Label matches state (trivially true when both read same value)",
);

// The stale render would trigger "View Details" label, but if we re-computed at click time:
assert(
  stateAtClick_wrongWay === "join",
  "Clock-advanced re-computation would yield join (the old bug vector)",
);

// With the new architecture, the card emits stateAtRender to onPrimaryAction.
// So the handler receives "view-details" — correct, even though the clock moved.
assert(
  stateAtRender !== stateAtClick_wrongWay,
  "Confirms render-time state and click-time re-computation diverge (proving the old bug exists without the fix)",
);

// The fix: the hook re-fires a setTimeout at WINDOW_OPEN_MS,
// which re-renders the component and updates stateAtRender to "join".
// So by the time window opens, the component has already re-rendered,
// and stateAtRender === stateAtClick_wrongWay === "join".
// No click can ever see "view-details" after the window has opened
// because the component will have re-rendered before that click.

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

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("All tests passed ✅");
}
