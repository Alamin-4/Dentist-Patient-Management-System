import React from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Specialty } from "@/hooks/admin/specialty/useSpecialty";

type ExtendedSpecialty = Specialty & {
  createdAt?: string;
};

interface SpecialtyTableProps {
  isLoading: boolean;
  paginatedData: ExtendedSpecialty[];
  selectedIds: Array<string | number>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string | number, checked: boolean) => void;
  onEditClick: (s: Specialty, e: React.MouseEvent) => void;
  onDeleteClick: (id: string | number, e: React.MouseEvent) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  totalCount: number;
}

export function SpecialtyTable({
  isLoading,
  paginatedData,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEditClick,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}: SpecialtyTableProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((s) => selectedIds.includes(s.id))
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all specialties"
                  className="h-4 w-4 rounded border-gray-300 text-text focus:ring-text"
                />
              </th>
              {["NAME", "SLUG", "DESCRIPTION", "CREATED AT", "ACTIONS"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="animate-pulse">
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-4 rounded border border-gray-200 bg-slate-100" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-5 w-20 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-48 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-16 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <div className="h-7 w-7 rounded bg-slate-100" />
                      <div className="h-7 w-7 rounded bg-slate-100" />
                    </div>
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  No specialties found
                </td>
              </tr>
            ) : (
              paginatedData.map((s: ExtendedSpecialty) => (
                <tr
                  key={s.id}
                  className={`transition-colors hover:bg-gray-50/80 ${selectedIds.includes(s.id) ? "bg-blue-50/30" : ""
                    }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.id)}
                      onChange={(e) => onSelectOne(s.id, e.target.checked)}
                      aria-label={`Select specialty ${s.name}`}
                      className="h-4 w-4 rounded border-gray-300 text-text focus:ring-text"
                    />
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3.5 text-sm font-semibold text-text">
                    {s.name}
                  </td>
                  {/* Slug */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {s.slug}
                    </code>
                  </td>
                  {/* Description */}
                  <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs truncate">
                    {s.description || <span className="text-gray-300">—</span>}
                  </td>
                  {/* Created At */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "0"}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => onEditClick(s, e)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                        aria-label={`Edit specialty ${s.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => onDeleteClick(s.id, e)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                        aria-label={`Delete specialty ${s.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-white">
        <p className="text-sm text-gray-400">
          Showing {paginatedData.length} of {totalCount} specialties
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium text-gray-600 px-2">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
