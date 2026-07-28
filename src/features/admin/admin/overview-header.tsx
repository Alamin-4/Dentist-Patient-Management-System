"use client";

import { Download } from "lucide-react";
import { useMe } from "@/hooks/auth/useAuth";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OverviewHeader() {
  const today = formatDate(new Date());
  const { user } = useMe();
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left — greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening across the platform &mdash;{" "}
          {today}.
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-text shadow-xs hover:bg-gray-50 transition-colors">
          Last 7 days
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-text shadow-xs hover:bg-gray-50 transition-colors">
          <Download className="h-3.5 w-3.5 text-gray-500" />
          Export
        </button>
      </div>
    </div>
  );
}
