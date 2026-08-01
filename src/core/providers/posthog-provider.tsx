"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "@/config/env";
import { stripSensitiveData } from "@/lib/posthog-sanitize";

const isProd = process.env.NODE_ENV === "production";

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isProd || posthog.__loaded) return;

    const key = env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key) {
      posthog.init(key, {
        api_host: host,
        ui_host: "https://us.posthog.com", // REQUIRED when api_host is a proxy
        
        // Critical: manually fire $pageview in the router effect (Phase 2).
        capture_pageview: false,
        capture_pageleave: true, 

        // Reduces PostHog billing/event volume: only identified users get profiles
        person_profiles: "identified_only",

        // Autocapture: disable for this health-adjacent product to ensure safety
        autocapture: false,

        // Session recording configuration
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "[data-ph-mask]",
        },

        // Belt-and-suspenders PII redaction
        before_send: stripSensitiveData,

        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug();
        },
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
