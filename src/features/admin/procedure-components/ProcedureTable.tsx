import React from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface ProcedureTableProps {
  isLoading: boolean;
  paginatedData: any[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onDeleteClick: (id: string, e: React.MouseEvent) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  totalCount: number;
}

export function ProcedureTable({
  isLoading,
  paginatedData,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}: ProcedureTableProps) {
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
                    paginatedData.every((p) => selectedIds.includes(p.id))
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all procedures"
                  className="h-4 w-4 rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                />
              </th>
              {["NAME", "SLUG", "SPECIALTY", "CREATED AT", "ACTIONS"].map((h) => (
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
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  Loading procedures...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                  No procedures found
                </td>
              </tr>
            ) : (
              paginatedData.map((p: any) => (
                <tr
                  key={p.id}
                  className={`transition-colors hover:bg-gray-50/80 ${selectedIds.includes(p.id) ? "bg-blue-50/30" : ""
                    }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={(e) => onSelectOne(p.id, e.target.checked)}
                      aria-label={`Select procedure ${p.name}`}
                      className="h-4 w-4 rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                    />
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3.5 text-sm font-semibold text-[#1A1A2E]">
                    {p.name}
                  </td>
                  {/* Slug */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {p.slug}
                    </code>
                  </td>
                  {/* Specialty */}
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {p.specialty?.name ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {p.specialty.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  {/* Created At */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "0"}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => onDeleteClick(p.id, e)}
                        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                        aria-label={`Delete procedure ${p.name}`}
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-white">
        <p className="text-sm text-gray-400">
          Showing {paginatedData.length} of {totalCount} procedures
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
