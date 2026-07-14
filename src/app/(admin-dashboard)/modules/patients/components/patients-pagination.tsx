import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    currentPage: number; totalPages: number; filteredLength: number; pageSize: number; onPageChange: (page: number) => void;
}

export function PatientsPagination({ currentPage, totalPages, filteredLength, pageSize, onPageChange }: Props) {
    const startItem = filteredLength === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, filteredLength);

    return (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-sm text-gray-400">Showing {startItem}–{endItem} of {filteredLength} results</p>
            <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => onPageChange(p)}
                        className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                            p === currentPage ? "bg-[#1A1A2E] text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                        )}>
                        {p}
                    </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}