"use client";

import { useState, useEffect } from "react";
import { PolicyLayout } from "@/features/marketing/shared/policy-layout/policy-layout";

const DEFAULT_COOKIES = `# Cookie Policy\n\nLast updated: July 23, 2026\n\n## 1. What Are Cookies\nCookies are tiny text files saved on your browser to collect user interactions and session states.\n\n## 2. Strictly Necessary Cookies\nWe use necessary session tokens to keep you logged into the patient overview dashboard and admin settings panel.\n\n## 3. Performance and Analytics\nWe utilize anonymous performance trackers to analyze LCP, load speeds, and user navigation paths to optimize features.`;

export default function CookiesPage() {
  const [content, setContent] = useState(DEFAULT_COOKIES);

  useEffect(() => {
    const saved = localStorage.getItem("policy_cookies");
    if (saved) setContent(saved);
  }, []);

  return <PolicyLayout title="Cookie Policy" content={content} />;
}
