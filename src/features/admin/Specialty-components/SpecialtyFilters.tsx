import React from "react";
import { Search, Trash2 } from "lucide-react";

interface SpecialtyFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  isBulkDeleting: boolean;
}

export function SpecialtyFilters({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  selectedCount,
  onBulkDelete,
  isBulkDeleting,
}: SpecialtyFiltersProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 min-h-13.25">
      {selectedCount > 0 ? (
        <div className="flex flex-1 items-center justify-between rounded-lg bg-red-50/50 border border-red-100 px-3 py-1.5 animate-in fade-in duration-200">
          <span className="text-sm font-medium text-red-700">
            {selectedCount} specialty(ies) selected
          </span>
          <button
            onClick={onBulkDelete}
            disabled={isBulkDeleting}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isBulkDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search specialties..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-text focus:ring-1 focus:ring-text"
            />
          </div>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-text"
          />
        </>
      )}
    </div>
  );
}
