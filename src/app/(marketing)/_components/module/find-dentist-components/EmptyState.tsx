// modules/find-dentist/components/EmptyState.tsx

"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
    onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-[#f8f9fb] py-16 text-center sm:py-20">
            <SearchX className="mb-4 size-10 text-slate-300" aria-hidden="true" />
            <p className="text-[16px] font-semibold text-slate-700">No dentists found</p>
            <p className="mt-1 max-w-sm px-4 text-[13px] text-slate-400">
                Try adjusting your search or filters to find what you're looking for
            </p>
            <button
                type="button"
                onClick={onClearFilters}
                className="mt-4 rounded-lg bg-[#003366] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#003366]/40 focus:ring-offset-2"
            >
                Clear filters
            </button>
        </div>
    );
}