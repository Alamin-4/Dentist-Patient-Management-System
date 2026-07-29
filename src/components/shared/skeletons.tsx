import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── 1. SkeletonText ──────────────────────────────────────────────────────────
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5 w-full", className)}>
      {Array.from({ length: lines }).map((_, idx) => {
        // Vary widths for a more organic feel
        const widths = ["w-full", "w-[92%]", "w-[85%]", "w-[95%]", "w-[78%]"];
        const widthClass = widths[idx % widths.length];
        return (
          <Skeleton
            key={idx}
            className={cn("h-4 rounded-md", widthClass)}
          />
        );
      })}
    </div>
  );
}

// ─── 2. SkeletonImage ─────────────────────────────────────────────────────────
export function SkeletonImage({
  aspectRatio = "aspect-square",
  className,
  rounded = "rounded-2xl",
}: {
  aspectRatio?: "aspect-square" | "aspect-video" | "aspect-auto" | "h-48" | "h-64";
  className?: string;
  rounded?: string;
}) {
  return (
    <Skeleton
      className={cn("w-full bg-slate-200/80 dark:bg-slate-800/80", aspectRatio, rounded, className)}
    />
  );
}

// ─── 3. SkeletonCard ──────────────────────────────────────────────────────────
export function SkeletonCard({
  layout = "vertical",
  hasImage = true,
  className,
}: {
  layout?: "vertical" | "horizontal";
  hasImage?: boolean;
  className?: string;
}) {
  if (layout === "horizontal") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-3xl shadow-sm",
          className
        )}
      >
        {hasImage && (
          <Skeleton className="size-24 sm:size-32 rounded-2xl shrink-0" />
        )}
        <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-4 w-1/4 rounded-md" />
          </div>
          <SkeletonText lines={2} />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-hidden",
        className
      )}
    >
      {hasImage && <Skeleton className="w-full h-48 rounded-t-3xl" />}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
        <SkeletonText lines={2} />
        <div className="flex items-center gap-3 pt-3 border-t border-slate-50 dark:border-slate-800/30">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── 4. SkeletonTable ─────────────────────────────────────────────────────────
export function SkeletonTable({
  columns = 5,
  rows = 5,
  hasFilters = true,
  className,
}: {
  columns?: number;
  rows?: number;
  hasFilters?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Table filters placeholder */}
      {hasFilters && (
        <div className="flex flex-col sm:flex-row gap-3 border-b border-slate-100 dark:border-slate-800/40 p-4">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      )}

      {/* Table grid layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-800/10">
              {Array.from({ length: columns }).map((_, idx) => (
                <th key={idx} className="px-4 py-3 text-left">
                  <Skeleton className="h-3 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/30">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                {Array.from({ length: columns }).map((_, colIdx) => {
                  // Vary cell content shapes
                  if (colIdx === 0) {
                    return (
                      <td key={colIdx} className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-8 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-24 rounded" />
                        </div>
                      </td>
                    );
                  }
                  const cellWidths = ["w-20", "w-28", "w-16", "w-24"];
                  const cellWidth = cellWidths[(rowIdx + colIdx) % cellWidths.length];
                  return (
                    <td key={colIdx} className="px-4 py-4">
                      <Skeleton className={cn("h-4 rounded", cellWidth)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 p-4">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── 5. SkeletonForm ──────────────────────────────────────────────────────────
export function SkeletonForm({
  fields = 4,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm", className)}>
      <div className="space-y-2 border-b border-slate-50 dark:border-slate-800/30 pb-4">
        <Skeleton className="h-6 w-1/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: fields }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-50 dark:border-slate-800/30">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
