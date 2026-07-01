// modules/find-dentist/components/Pagination.tsx

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}

function getPages(page: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-1.5"
        >
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
                <ChevronLeft className="size-4" />
            </button>

            {getPages(page, totalPages).map((p, i) =>
                p === "..." ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="flex h-9 w-9 items-center justify-center text-[13px] text-slate-400"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p as number)}
                        aria-label={`Page ${p}`}
                        aria-current={page === p ? "page" : undefined}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg border text-[13px] font-medium transition-all",
                            page === p
                                ? "border-[#003366] bg-[#003366] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                        )}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
            >
                <ChevronRight className="size-4" />
            </button>
        </nav>
    );
}