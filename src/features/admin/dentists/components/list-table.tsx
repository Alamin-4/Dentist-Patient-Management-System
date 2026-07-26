"use client";

import { useRef, useEffect, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionMenu } from "./list-action-menu";
import {
  type Dentist,
  STATUS_BADGE,
  STATUS_DOT,
  STATUS_LABEL,
  PAGE_SIZE,
} from "../utils/dentist-types";

// Inner Helper Components
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-gray-700">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold">{rating}</span>
      <span className="text-gray-400">({count})</span>
    </span>
  );
}

interface DentistsTableProps {
  filtered: Dentist[];
  pageData: Dentist[];
  currentPage: number;
  totalPages: number;
  setPage: (p: number) => void;
  paginationRange: (number | "...")[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DentistsTable({
  filtered,
  pageData,
  currentPage,
  totalPages,
  setPage,
  paginationRange,
  selectedIds,
  setSelectedIds,
}: DentistsTableProps) {
  const router = useRouter();
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const pageIds = useMemo(() => pageData.map((d) => d.id), [pageData]);
  const isAllSelected = useMemo(() => {
    return pageData.length > 0 && pageData.every((d) => selectedIds.includes(d.id));
  }, [pageData, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return pageData.some((d) => selectedIds.includes(d.id)) && !isAllSelected;
  }, [pageData, selectedIds, isAllSelected]);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="overflow-x-auto min-h-87.5">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              <th className="w-8 px-4 py-3">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                />
              </th>
              {["Dentist", "Specialty", "Location", "Status", "Rating", "Bookings", "Membership", "Joined", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-sm font-normal text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                  No dentists found
                </td>
              </tr>
            ) : (
              pageData.map((dentist) => (
                <tr
                  key={dentist.id}
                  onClick={() => router.push(`/admin/dentists/${dentist.slug}`)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gray-50/80 *:truncate",
                    selectedIds.includes(dentist.id) && "bg-indigo-50/40 hover:bg-indigo-50/60"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(dentist.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(dentist.id);
                      }}
                      className="rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                    />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={dentist.initials} color={dentist.avatar_color} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1A1A2E]">
                          {dentist.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {dentist.email} · {dentist.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {dentist.specialty}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {dentist.location}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                        STATUS_BADGE[dentist.status] ?? "bg-gray-100 text-gray-500"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          STATUS_DOT[dentist.status] ?? "bg-gray-400"
                        )}
                      />
                      {STATUS_LABEL[dentist.status] ?? dentist.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {dentist.rating != null && dentist.review_count != null ? (
                      <StarRating rating={dentist.rating} count={dentist.review_count} />
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {dentist.bookings != null ? (
                      dentist.bookings.toLocaleString()
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-sm">
                    {(dentist as any).membershipPlan ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 uppercase">
                        {(dentist as any).membershipPlan.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {dentist.joined}
                  </td>

                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      dentist={dentist}
                      onViewProfile={() => router.push(`/admin/dentists/${dentist.slug}`)}
                      onSuspend={() => { }}
                      onDelete={() => { }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-400">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} results
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {paginationRange.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-8 items-center justify-center text-sm font-medium text-gray-400"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  p === currentPage
                    ? "bg-[#1A1A2E] text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
              >
                {p}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
