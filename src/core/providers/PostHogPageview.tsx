"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthog from "posthog-js";

function PostHogPageviewContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    // Toggle session recording on high sensitivity routes
    if (pathname.startsWith("/verification/documents") || pathname.includes("/patient/medical-records")) {
      posthog.stopSessionRecording();
    } else {
      posthog.startSessionRecording();
    }

    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url = url + "?" + searchParams.toString();
    }

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogPageview() {
  return (
    <Suspense fallback={null}>
      <PostHogPageviewContent />
    </Suspense>
  );
}
