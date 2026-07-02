// modules/find-dentist/components/EmptyState.tsx

"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
    onClearFilters: () => void;
    onAddDentistClick: () => void;
}

export default function EmptyState({ onClearFilters, onAddDentistClick }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-[#f8f9fb] py-16 text-center sm:py-20">
            <SearchX className="mb-4 size-10 text-slate-300" aria-hidden="true" />
            <p className="text-[16px] font-semibold text-slate-700">No dentists found</p>
            <p className="mt-1 max-w-sm px-4 text-[13px] text-slate-400">
                Try adjusting your search or filters, or add a new dentist profile to the directory if they are not listed yet.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                >
                    Clear filters
                </button>
                <button
                    type="button"
                    onClick={onAddDentistClick}
                    className="rounded-lg bg-[#0E3E65] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0E3E65]/90  cursor-pointer focus:outline-none"
                >
                    Add a Dentist
                </button>
            </div>
        </div>
    );
}