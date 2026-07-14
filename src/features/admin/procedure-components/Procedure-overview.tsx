"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import {
  useGlobalProcedures,
  useCreateGlobalProcedure,
  useDeleteGlobalProcedures,
  useBulkUploadGlobalProcedures,
} from "@/hooks/procedures/useProcedures";
import { useSpecialties } from "@/hooks/admin/specialty/useSpecialty";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../Specialty-components/ConfirmDialog";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { CustomStats } from "@/app/(admin-dashboard)/modules/shared/custom-stats";
import { FormModal } from "@/components/ui/FormModal";
import { ProcedureFilters } from "./ProcedureFilters";
import { ProcedureTable } from "./ProcedureTable";

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
        const errMsg = getErrorMessage(err, "Failed to upload procedures");
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
          const errMsg = getErrorMessage(err, "Failed to create procedure");
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
        const errMsg = getErrorMessage(err, "Failed to delete procedure");
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
        const errMsg = getErrorMessage(err, "Failed to delete procedures");
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
      <CustomStats
        stats={[
          { label: "TOTAL PROCEDURES", value: isLoading ? "..." : stats.total.toLocaleString() },
          { label: "ASSIGNED TO SPECIALTY", value: isLoading ? "..." : stats.withSpecialty.toLocaleString() },
          { label: "UNASSIGNED PROCEDURES", value: isLoading ? "..." : stats.withoutSpecialty.toLocaleString() },
        ]}
        className="grid-cols-1 sm:grid-cols-3"
      />

      {/* ── Table Card ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
        <ProcedureFilters
          search={search}
          setSearch={setSearch}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          specialties={specialties}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDeleteClick}
          isBulkDeleting={deleteMutation.isPending}
        />

        <ProcedureTable
          isLoading={isLoading}
          paginatedData={paginatedData}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onDeleteClick={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={filteredData.length}
        />
      </div>

      {/* ── Add Procedure Modal ────────────────────────────────────────── */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        title="Add New Procedure"
        submitText="Create"
        isSubmitting={createMutation.isPending}
      >
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
      </FormModal>

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
