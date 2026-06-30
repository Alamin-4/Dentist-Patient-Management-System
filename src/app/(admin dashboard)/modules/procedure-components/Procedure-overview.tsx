"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import {
  useGlobalProcedures,
  useCreateGlobalProcedure,
  useDeleteGlobalProcedures,
  useBulkUploadGlobalProcedures,
} from "@/hooks/procedures/useProcedures";
import { useSpecialties } from "@/hooks/admin/specialty/useSpecialty";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../Specialty-components/ConfirmDialog";

// Extend Procedure type to match backend returned shape
type ExtendedProcedure = {
  id: string;
  name: string;
  slug: string;
  specialtyId: string | null;
  createdAt: string;
  specialty?: {
    id: string;
    name: string;
  } | null;
};

export default function ProcedureOverview() {
  // Search & Filtering States
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // Format: YYYY-MM
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals / Dialog States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecialtyId, setNewSpecialtyId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Selection States
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);

  // Hooks
  const { data: procedures = [], isLoading } = useGlobalProcedures(search);
  const { data: specialties = [] } = useSpecialties("");

  const createMutation = useCreateGlobalProcedure();
  const deleteMutation = useDeleteGlobalProcedures();
  const uploadMutation = useBulkUploadGlobalProcedures();

  // CSV File Handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Procedures uploaded successfully!");
        e.target.value = "";
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || err?.message || "Failed to upload procedures";
        toast.error(errMsg);
        e.target.value = "";
      },
    });
  };

  // Add Procedure Submit Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Procedure name is required");
      return;
    }

    createMutation.mutate(
      {
        name: newName.trim(),
        specialtyId: newSpecialtyId || null,
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Procedure created successfully!");
          setIsAddModalOpen(false);
          setNewName("");
          setNewSpecialtyId("");
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to create procedure";
          toast.error(errMsg);
        },
      }
    );
  };

  // Client-side filtering (Specialty filter & Date filter)
  const filteredData = useMemo(() => {
    return (procedures as ExtendedProcedure[]).filter((p) => {
      // 1. Specialty Filter
      if (selectedSpecialty && p.specialtyId !== selectedSpecialty) {
        return false;
      }
      // 2. Date Filter
      if (dateFilter) {
        if (!p.createdAt) return false;
        const createdMonth = p.createdAt.substring(0, 7);
        if (createdMonth !== dateFilter) return false;
      }
      return true;
    });
  }, [procedures, selectedSpecialty, dateFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedData.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedData.map((p) => p.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Delete Action Handlers
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate([deleteTarget], {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Procedure deleted successfully!");
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || err?.message || "Failed to delete procedure";
        toast.error(errMsg);
        setDeleteTarget(null);
      },
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleteOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    deleteMutation.mutate(selectedIds, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Selected procedures deleted successfully!");
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || err?.message || "Failed to delete procedures";
        toast.error(errMsg);
        setIsBulkDeleteOpen(false);
      },
    });
  };

  // Reset to page 1 and clear selections when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, selectedSpecialty, dateFilter]);

  // Clear selections on page change
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = procedures.length || 0;
    const withSpecialty = (procedures as ExtendedProcedure[]).filter((p) => p.specialtyId).length || 0;
    const withoutSpecialty = total - withSpecialty;
    return { total, withSpecialty, withoutSpecialty };
  }, [procedures]);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Procedures Catalog
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage global clinical procedures, classifications, and mapping.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            <Upload className="h-4 w-4 text-gray-500" />
            {uploadMutation.isPending ? "Uploading..." : "Upload CSV"}
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              disabled={uploadMutation.isPending}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2A2A3E]"
          >
            <Plus className="h-4 w-4" />
            Add Procedure
          </button>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "TOTAL PROCEDURES", value: stats.total.toLocaleString() },
          { label: "ASSIGNED TO SPECIALTY", value: stats.withSpecialty.toLocaleString() },
          { label: "UNASSIGNED PROCEDURES", value: stats.withoutSpecialty.toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {s.label}
            </p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight text-[#1A1A2E]">
              {isLoading ? "..." : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Table Card ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filters and Actions Row */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 min-h-[53px]">
          {selectedIds.length > 0 ? (
            <div className="flex flex-1 items-center justify-between rounded-lg bg-red-50/50 border border-red-100 px-3 py-1.5">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.length} procedure(s) selected
              </span>
              <button
                onClick={handleBulkDeleteClick}
                disabled={deleteMutation.isPending}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search procedures by name..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                />
              </div>

              {/* Specialty Dropdown Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="h-9 w-48 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
              >
                <option value="">All Specialties</option>
                {specialties.map((spec: any) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
              />
            </>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every((p) => selectedIds.includes(p.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
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
                paginatedData.map((p: ExtendedProcedure) => (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-gray-50/80 ${selectedIds.includes(p.id) ? "bg-blue-50/30" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) => handleSelectOne(p.id, e.target.checked)}
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
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDeleteClick(p.id, e)}
                          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
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
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-400">
            Showing {paginatedData.length} of {filteredData.length} procedures
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-medium text-gray-600 px-2">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Procedure Modal ────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-[#1A1A2E]">Add New Procedure</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Procedure Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tooth Extraction"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Associate Specialty (Optional)
                </label>
                <select
                  value={newSpecialtyId}
                  onChange={(e) => setNewSpecialtyId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
                >
                  <option value="">Select Specialty...</option>
                  {specialties.map((spec: any) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={createMutation.isPending}
                  className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex h-10 items-center rounded-lg bg-[#1A1A2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A3E] disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirmation Dialogs ───────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Procedure?"
        description="Are you sure you want to delete this global procedure? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Procedures?"
        description={`Are you sure you want to delete ${selectedIds.length} selected procedures? This action cannot be undone.`}
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
