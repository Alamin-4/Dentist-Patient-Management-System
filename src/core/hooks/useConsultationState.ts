/**
 * useConsultationState.ts
 *
 * React hook that keeps a consultation's `ConsultationDisplayState` fresh
 * without a blind polling interval.
 *
 * Strategy: schedule a `setTimeout` to fire at the next state-change boundary
 * (window-open, meeting-start, or meeting-end), re-compute the state, then
 * schedule the next boundary again.  Also re-syncs when the browser tab
 * regains visibility (handles laptop-sleep / background-tab scenarios).
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ConsultationItem } from "@/types";
import {
  resolveConsultationState,
  msUntilNextBoundary,
  type ConsultationDisplayState,
} from "@/lib/consultation-state";

export function useConsultationState(
  consultation: ConsultationItem,
): ConsultationDisplayState {
  const compute = useCallback(
    () => resolveConsultationState(consultation, Date.now()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      consultation.requestStatus,
      consultation.scheduledDate,
      consultation.scheduledTime,
      consultation.timezone,
      consultation.durationMinutes,
    ],
  );

  const [state, setState] = useState<ConsultationDisplayState>(compute);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const ms = msUntilNextBoundary(consultation, Date.now());
    if (ms === null || ms <= 0) return; // No future boundary — state is stable

    // Add a small positive buffer (1 ms) so we land just after the boundary
    timerRef.current = setTimeout(() => {
      setState(compute());
      scheduleNext(); // Reschedule for the next boundary after this one
    }, ms + 1);
  }, [consultation, compute]);

  useEffect(() => {
    // Recompute immediately when consultation data or schedule changes
    setState(compute());
    scheduleNext();

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [compute, scheduleNext]);

  // Re-sync when the tab becomes visible again (handles laptop sleep / switch)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        setState(compute());
        scheduleNext();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [compute, scheduleNext]);

  return state;
}
