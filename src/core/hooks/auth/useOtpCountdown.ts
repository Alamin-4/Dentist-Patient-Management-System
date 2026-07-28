"use client";

/**
 * @file useOtpCountdown.ts
 * @description Reusable countdown timer hook for OTP resend rate-limiting on the frontend.
 *
 * Features:
 *  - 2-minute (120 s) default timer that starts immediately after OTP is sent.
 *  - Persists across page reloads by storing the target unblock timestamp in
 *    localStorage under a namespaced key (`otp_unblock_at:<storageKey>`).
 *  - On mount, automatically resumes any in-progress timer from storage.
 *  - Syncs with backend's `retryAfter` value when a 429 response is received.
 *  - Returns a formatted "MM:SS" display string and a boolean `isActive` flag.
 *
 * Usage:
 *   const { secondsLeft, isActive, displayTime, startCountdown, syncWithBackend } =
 *     useOtpCountdown({ storageKey: 'register_doctor' });
 */

import { useState, useEffect, useCallback, useRef } from "react";

/** Default OTP cooldown window: 2 minutes (matches backend OTP expiry). */
const DEFAULT_DURATION_SECONDS = 120;

interface UseOtpCountdownOptions {
  /**
   * A unique identifier used to namespace the localStorage key.
   * Use a descriptive string like 'register_doctor' or 'patient_signup'.
   */
  storageKey: string;
  /** Override the default countdown duration in seconds. Defaults to 120. */
  durationSeconds?: number;
}

interface UseOtpCountdownReturn {
  /** Remaining seconds in the countdown. 0 when inactive. */
  secondsLeft: number;
  /** True while the countdown is running (button should be disabled). */
  isActive: boolean;
  /** Formatted time string in "MM:SS" format, e.g. "01:45". */
  displayTime: string;
  /**
   * Start (or restart) the countdown for `durationSeconds` seconds.
   * Persists the target timestamp to localStorage.
   */
  startCountdown: (durationOverride?: number) => void;
  /**
   * Sync the countdown with the `retryAfter` seconds returned by a 429 response.
   * This replaces the current timer with the backend's authoritative value.
   */
  syncWithBackend: (retryAfterSeconds: number) => void;
  /** Clears the timer and removes the persisted timestamp from localStorage. */
  clearCountdown: () => void;
}

/**
 * Formats a number of seconds into a MM:SS display string.
 */
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function useOtpCountdown({
  storageKey,
  durationSeconds = DEFAULT_DURATION_SECONDS,
}: UseOtpCountdownOptions): UseOtpCountdownReturn {
  const storageItemKey = `otp_unblock_at:${storageKey}`;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Computes the remaining seconds from the persisted localStorage timestamp.
   * Returns 0 if no valid timestamp exists or if it has already expired.
   */
  const getRemainingFromStorage = useCallback((): number => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(storageItemKey);
    if (!raw) return 0;
    const unblockAt = parseInt(raw, 10);
    if (isNaN(unblockAt)) return 0;
    const remaining = Math.ceil((unblockAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }, [storageItemKey]);

  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    // Lazily initialise from persisted storage so the timer resumes after reloads.
    getRemainingFromStorage()
  );

  // ── Tick logic ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft <= 0) {
      // Ensure storage is clean when the timer expires naturally.
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageItemKey);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = getRemainingFromStorage();
      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(intervalRef.current!);
        localStorage.removeItem(storageItemKey);
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsLeft, storageItemKey, getRemainingFromStorage]);

  // ── Public API ────────────────────────────────────────────────────────────

  const startCountdown = useCallback(
    (durationOverride?: number) => {
      const duration = durationOverride ?? durationSeconds;
      const unblockAt = Date.now() + duration * 1000;
      if (typeof window !== "undefined") {
        localStorage.setItem(storageItemKey, String(unblockAt));
      }
      setSecondsLeft(duration);
    },
    [durationSeconds, storageItemKey]
  );

  const syncWithBackend = useCallback(
    (retryAfterSeconds: number) => {
      if (retryAfterSeconds <= 0) return;
      const unblockAt = Date.now() + retryAfterSeconds * 1000;
      if (typeof window !== "undefined") {
        localStorage.setItem(storageItemKey, String(unblockAt));
      }
      setSecondsLeft(retryAfterSeconds);
    },
    [storageItemKey]
  );

  const clearCountdown = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageItemKey);
    }
    setSecondsLeft(0);
  }, [storageItemKey]);

  return {
    secondsLeft,
    isActive: secondsLeft > 0,
    displayTime: formatTime(secondsLeft),
    startCountdown,
    syncWithBackend,
    clearCountdown,
  };
}
