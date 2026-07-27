"use client";

import { useState, useEffect } from "react";
import { PolicyLayout } from "@/features/marketing/_components/shared/policy-layout/policy-layout";

const DEFAULT_PRIVACY = `# Privacy Policy\n\nLast updated: July 23, 2026\n\n## 1. Information We Collect\nWe collect personal identifiers such as name, email address, and billing details when you register as a patient or dentist on RatedDocs.\n\n## 2. How We Use Information\nWe use your collected credentials to establish consultations, verify professional dentistry licensing, and guarantee payouts in our surprise guarantee escrow system.\n\n## 3. Data Protection and Compliance\nYour health history, medical records, and booking images are encrypted end-to-end and stored securely. We do not sell or share patient data with third parties.`;

export default function PrivacyPage() {
  const [content, setContent] = useState(DEFAULT_PRIVACY);

  useEffect(() => {
    const saved = localStorage.getItem("policy_privacy");
    if (saved) setContent(saved);
  }, []);

  return <PolicyLayout title="Privacy Policy" content={content} />;
}
