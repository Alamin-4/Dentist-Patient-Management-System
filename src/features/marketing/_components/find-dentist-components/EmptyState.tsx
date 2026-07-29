// modules/find-dentists/components/EmptyState.tsx

"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
    onClearFilters?: () => void;
    hasActiveFilters?: boolean;
}

export default function EmptyState({
    onClearFilters,
    hasActiveFilters = true,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-[#f8f9fb] py-16 text-center sm:py-20">
            <SearchX className="mb-4 size-10 text-slate-300" aria-hidden="true" />
            <p className="text-[16px] font-semibold text-slate-700">
                {hasActiveFilters ? "No dentists found" : "No dentists available"}
            </p>
            <p className="mt-1 max-w-sm px-4 text-[13px] text-slate-400">
                {hasActiveFilters
                    ? "Try adjusting your search or filters, or add a new dentist profile to the directory if they are not listed yet."
                    : "There are currently no dentists listed in the directory. You can add a new dentist profile to get started."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters && onClearFilters && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="rounded-lg border-4 border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                    >
                        Clear filters
                    </button>
                )}

            </div>
        </div>
    );
}