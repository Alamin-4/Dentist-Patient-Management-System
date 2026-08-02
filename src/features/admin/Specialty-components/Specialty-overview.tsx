"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import { Specialty, useDeleteSpecialty, useSpecialties, useUploadSpecialties, useBulkDeleteSpecialties, useCreateSpecialty, useUpdateSpecialty } from "@/hooks/admin/specialty/useSpecialty";
import toast from "react-hot-toast";
import { ConfirmDialog } from "./ConfirmDialog";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { FormModal } from "@/components/ui/FormModal";
import { SpecialtyStats } from "./SpecialtyStats";
import { SpecialtyFilters } from "./SpecialtyFilters";
import { SpecialtyTable } from "./SpecialtyTable";
import { SpecialtyCsvModal } from "./specialty-csv-modal";

type ExtendedSpecialty = Specialty & {
    createdAt?: string;
};

export default function SpecialtyOverview() {
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
    const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Specialty | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const { data: specialties = [], isLoading: isTableLoading } = useSpecialties(search);
    const { data: allSpecialties = [], isLoading: isStatsLoading } = useSpecialties("");
    const deleteMutation = useDeleteSpecialty();
    const uploadMutation = useUploadSpecialties();
    const bulkDeleteMutation = useBulkDeleteSpecialties();
    const createMutation = useCreateSpecialty();
    const updateMutation = useUpdateSpecialty();

    const handleModalUpload = (file: File) => {
        uploadMutation.mutate(file, {
            onSuccess: (res: any) => {
                toast.success(res?.message || "Specialties uploaded successfully!");
                setIsCsvModalOpen(false);
            },
            onError: (err: any) => {
                const errMsg = getErrorMessage(err, "Failed to upload specialties");
                toast.error(errMsg);
            },
        });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = { name: newName };
        if (newDescription) payload.description = newDescription;

        createMutation.mutate(payload, {
            onSuccess: (res: any) => {
                toast.success(res?.message || "Specialty created successfully!");
                setIsAddModalOpen(false);
                setNewName("");
                setNewDescription("");
            },
            onError: (err: any) => {
                const errMsg = getErrorMessage(err, "Failed to create specialty");
                toast.error(errMsg);
            }
        });
    };

    const handleEditClick = (s: Specialty, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditTarget(s);
        setEditName(s.name);
        setEditDescription(s.description || "");
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTarget) return;

        updateMutation.mutate(
            {
                id: editTarget.id,
                payload: {
                    name: editName,
                    description: editDescription,
                },
            },
            {
                onSuccess: (res: any) => {
                    toast.success(res?.message || "Specialty updated successfully!");
                    setIsEditModalOpen(false);
                    setEditTarget(null);
                },
                onError: (err: any) => {
                    const errMsg = getErrorMessage(err, "Failed to update specialty");
                    toast.error(errMsg);
                },
            }
        );
    };

    // 1. Filter by Date (Client-side)
    const filteredByDate = useMemo(() => {
        if (!dateFilter) return specialties;
        return specialties?.filter((s: ExtendedSpecialty) => {
            if (!s.createdAt) return false;
            const createdMonth = s.createdAt.substring(0, 7);
            return createdMonth === dateFilter;
        });
    }, [specialties, dateFilter]);

    // 2. Calculate Stats (computed from overall database specialties so search doesn't alter system totals)
    const stats = useMemo(() => {
        const total = allSpecialties?.length || 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recent = allSpecialties?.filter((s: ExtendedSpecialty) => {
            if (!s.createdAt) return false;
            return new Date(s.createdAt) >= thirtyDaysAgo;
        }).length || 0;

        return { total, recent };
    }, [allSpecialties]);

    // 3. Pagination Logic
    const totalPages = Math.ceil(filteredByDate.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredByDate.slice(start, start + itemsPerPage);
    }, [filteredByDate, currentPage]);

    // Selection Handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const pageIds = paginatedData.map(s => s.id);
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
        } else {
            const pageIds = paginatedData.map(s => s.id);
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
        }
    };

    const handleSelectOne = (id: string | number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    // Delete Handlers (Using Custom Modal)
    const handleDeleteClick = (id: string | number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget(id);
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate(deleteTarget, {
            onSuccess: (res: any) => {
                toast.success(res?.message || "Specialty deleted successfully!");
                setDeleteTarget(null);
            },
            onError: (err: any) => {
                const errMsg = getErrorMessage(err, "Failed to delete specialty");
                toast.error(errMsg);
                setDeleteTarget(null);
            }
        });
    };

    const handleBulkDeleteClick = () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleteOpen(true);
    };

    const handleConfirmBulkDelete = () => {
        bulkDeleteMutation.mutate(selectedIds, {
            onSuccess: (res: any) => {
                toast.success(res?.message || "Selected specialties deleted successfully!");
                setSelectedIds([]);
                setIsBulkDeleteOpen(false);
            },
            onError: (err: any) => {
                const errMsg = getErrorMessage(err, "Failed to delete specialties");
                toast.error(errMsg);
                setIsBulkDeleteOpen(false);
            }
        });
    };

    // Reset to page 1 and clear selections when search or date filter changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]);
    }, [search, dateFilter]);

    // Clear selection on page change
    useEffect(() => {
        setSelectedIds([]);
    }, [currentPage]);

    return (
        <div className="flex flex-col gap-5">
            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text">
                        Specialties
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Manage medical specialties, niches, and categories.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsCsvModalOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 truncate text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        <Upload className="h-4 w-4 text-gray-500" />
                        Upload CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-text px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2A2A3E]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Specialty
                    </button>
                </div>
            </div>

            <SpecialtyStats
                isLoading={isStatsLoading}
                total={stats.total}
                recent={stats.recent}
            />

            <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
                <SpecialtyFilters
                    search={search}
                    setSearch={setSearch}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    selectedCount={selectedIds.length}
                    onBulkDelete={handleBulkDeleteClick}
                    isBulkDeleting={bulkDeleteMutation.isPending}
                />

                <SpecialtyTable
                    isLoading={isTableLoading}
                    paginatedData={paginatedData}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalCount={filteredByDate.length}
                />
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Specialty?"
                description="Are you sure you want to delete this specialty? This action cannot be undone and will remove it from all associated records."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                isLoading={deleteMutation.isPending}
            />

            <ConfirmDialog
                open={isBulkDeleteOpen}
                onClose={() => setIsBulkDeleteOpen(false)}
                onConfirm={handleConfirmBulkDelete}
                title="Delete Selected Specialties?"
                description={`Are you sure you want to delete ${selectedIds.length} selected specialties? This action cannot be undone.`}
                confirmText="Yes, Delete All"
                cancelText="Cancel"
                isLoading={bulkDeleteMutation.isPending}
            />

            {/* ── Add Specialty Modal ─────────────────────────────────── */}
            <FormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubmit}
                title="Add New Specialty"
                submitText="Create"
                isSubmitting={createMutation.isPending}
            >
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Specialty Name
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Cardiology"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-text focus:ring-1 focus:ring-text"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description (Optional)
                    </label>
                    <textarea
                        placeholder="Brief description of the specialty..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows={3}
                        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-text focus:ring-1 focus:ring-text resize-none"
                    />
                </div>
            </FormModal>

            {/* ── Edit Specialty Modal ─────────────────────────────────── */}
            <FormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                title="Edit Specialty"
                submitText="Save Changes"
                isSubmitting={updateMutation.isPending}
            >
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Specialty Name
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Cardiology"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-text focus:ring-1 focus:ring-text"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description (Optional)
                    </label>
                    <textarea
                        placeholder="Brief description of the specialty..."
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-text focus:ring-1 focus:ring-text resize-none"
                    />
                </div>
            </FormModal>
            {/* ── Specialty CSV Guide Upload Modal ────────────────── */}
            <SpecialtyCsvModal
                isOpen={isCsvModalOpen}
                onClose={() => setIsCsvModalOpen(false)}
                onUpload={handleModalUpload}
                isUploading={uploadMutation.isPending}
            />
        </div>
    );
}