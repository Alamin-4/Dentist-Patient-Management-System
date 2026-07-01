"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
// Note: Ensure useCreateSpecialty is exported from your hook file
import { Specialty, useDeleteSpecialty, useSpecialties, useUploadSpecialties, useBulkDeleteSpecialties, useCreateSpecialty } from "@/hooks/admin/specialty/useSpecialty";
import toast from "react-hot-toast";
import { ConfirmDialog } from "./ConfirmDialog";

// Extend the Specialty type to include a date field for filtering and stats
type ExtendedSpecialty = Specialty & {
    createdAt?: string;
};

export default function SpecialtyOverview() {
    const router = useRouter();

    // States for filtering and pagination
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState(""); // Format: YYYY-MM
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Selection & Delete States
    const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
    const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    // ── Add Modal States ──
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    // Fetch data using your hook
    const { data: specialties = [], isLoading } = useSpecialties(search);
    const deleteMutation = useDeleteSpecialty();
    const uploadMutation = useUploadSpecialties();
    const bulkDeleteMutation = useBulkDeleteSpecialties();
    const createMutation = useCreateSpecialty(); // Ensure this exists in your hook

    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        uploadMutation.mutate(file, {
            onSuccess: (res: any) => {
                toast.success(res?.message || "Specialties uploaded successfully!");
                e.target.value = "";
            },
            onError: (err: any) => {
                const errMsg = err?.response?.data?.message || err?.message || "Failed to upload specialties";
                toast.error(errMsg);
                e.target.value = "";
            }
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
                const errMsg = err?.response?.data?.message || err?.message || "Failed to create specialty";
                toast.error(errMsg);
            }
        });
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

    // 2. Calculate Stats
    const stats = useMemo(() => {
        const total = specialties?.length || 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recent = specialties?.filter((s: ExtendedSpecialty) => {
            if (!s.createdAt) return false;
            return new Date(s.createdAt) >= thirtyDaysAgo;
        }).length || 0;

        return { total, recent };
    }, [specialties]);

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
                const errMsg = err?.response?.data?.message || err?.message || "Failed to delete specialty";
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
                const errMsg = err?.response?.data?.message || err?.message || "Failed to delete specialties";
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
                    <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
                        Specialties
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Manage medical specialties, niches, and categories.
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
                    {/* Changed to open the modal instead of routing */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2A2A3E]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Specialty
                    </button>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                    { label: "TOTAL SPECIALTIES", value: stats.total.toLocaleString() },
                    { label: "RECENT (LAST 30 DAYS)", value: stats.recent.toLocaleString() },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
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

            {/* ── Table Card ─────────────────────────────────────────── */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
                {/* Filters row */}
                <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 min-h-13.25">
                    {selectedIds.length > 0 ? (
                        <div className="flex flex-1 items-center justify-between rounded-lg bg-red-50/50 border border-red-100 px-3 py-1.5">
                            <span className="text-sm font-medium text-red-700">
                                {selectedIds.length} specialty(ies) selected
                            </span>
                            <button
                                onClick={handleBulkDeleteClick}
                                disabled={bulkDeleteMutation.isPending}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                {bulkDeleteMutation.isPending ? "Deleting..." : "Delete Selected"}
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
                                    className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                                />
                            </div>
                            <input
                                type="month"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="h-9 w-40 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
                            />
                        </>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/40">
                                <th className="w-12 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={paginatedData.length > 0 && paginatedData.every(s => selectedIds.includes(s.id))}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                                    />
                                </th>
                                {["NAME", "SLUG", "DESCRIPTION", "CREATED AT", "ACTIONS"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                                        Loading specialties...
                                    </td>
                                </tr>
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
                                        onClick={() => router.push(`/admin/specialties/${s.slug}`)}
                                        className={`cursor-pointer transition-colors hover:bg-gray-50/80 ${selectedIds.includes(s.id) ? 'bg-blue-50/30' : ''}`}
                                    >
                                        {/* Checkbox */}
                                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(s.id)}
                                                onChange={(e) => handleSelectOne(s.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-[#1A1A2E] focus:ring-[#1A1A2E]"
                                            />
                                        </td>
                                        {/* Name */}
                                        <td className="px-4 py-3.5 text-sm font-semibold text-[#1A1A2E]">
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
                                            {s.createdAt
                                                ? new Date(s.createdAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => router.push(`/admin/specialties/${s.slug}/edit`)}
                                                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(s.id, e)}
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

                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                    <p className="text-sm text-gray-400">
                        Showing {paginatedData.length} of {filteredByDate.length} specialties
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

            {/* ── Confirmation Modals ─────────────────────────────────── */}
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
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-semibold text-[#1A1A2E]">Add New Specialty</h3>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="mt-4 flex flex-col gap-4">
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
                                    className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
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
                                    className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] resize-none"
                                />
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
        </div>
    );
}