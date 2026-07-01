"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  referralCode: string;
}

export function OverviewReferralsCard({ referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-[0_4px_20px_rgba(15,35,61,0.06)] sm:p-8">
      <p className="text-sm font-medium text-muted-foreground">
        Your referral code
      </p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-3xl font-bold tracking-[0.14em] text-foreground sm:text-4xl">
          {referralCode}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-gray-100"
        >
          <Copy className="size-4 shrink-0" />
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Earn $150 for every colleague who joins and goes live.
      </p>
    </section>
  );
}
