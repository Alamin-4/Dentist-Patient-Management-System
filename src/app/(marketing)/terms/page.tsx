"use client";

import { useState, useEffect } from "react";
import { PolicyLayout } from "@/features/marketing/shared/policy-layout/policy-layout";

const DEFAULT_TERMS = `# Terms of Service\n\nLast updated: July 23, 2026\n\n## 1. User Agreement\nBy establishing an account on RatedDocs, you agree to comply with our patient safety standards and dispute resolution terms.\n\n## 2. Booking and Escrow Protection\nAll consultations are secured under our escrow service. Payouts are released once the treatment plan has been signed and confirmed by the patient.\n\n## 3. Account Termination Guidelines\nWe reserve the right to suspend any account violating compliance policies, license fraud checks, or clinical depth protocols.`;

export default function TermsPage() {
  const [content, setContent] = useState(DEFAULT_TERMS);

  useEffect(() => {
    const saved = localStorage.getItem("policy_terms");
    if (saved) setContent(saved);
  }, []);

  return <PolicyLayout title="Terms of Service" content={content} />;
}
