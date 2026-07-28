"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { CustomStats } from "@/app/(admin-dashboard)/modules/shared/custom-stats";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { DentistsPageSkeleton } from "./DentistsPageSkeleton";

import {
  useAdminDentists,
  useUploadDentistDirectory,
  useBulkDentistAction,
} from "@/hooks/admin/dentist/useDentist";
import { useSpecialties } from "@/hooks/dentist/useSpecialty";

import {
  type Dentist,
  type StatusFilter,
  PAGE_SIZE,
  mapApiDentistToUIDentist,
} from "./utils/dentist-types";

import { ListFilters } from "./components/list-filters";
import { DentistsTable } from "./components/list-table";
import { ImportModal } from "./components/import-modal";

export default function DentistsPage() {
  const router = useRouter();
  const { data: specialities } = useSpecialties();
  const uploadMutation = useUploadDentistDirectory();
  const bulkActionMutation = useBulkDentistAction();

  // Search, Filter & Pagination States
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [tableSearch, setTableSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [city, setCity] = useState("All cities");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleBulkAction = (action: "suspend" | "unsuspend" | "delete") => {
    if (selectedIds.length === 0) return;
    bulkActionMutation.mutate(
      { ids: selectedIds, action },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || `Successfully executed bulk ${action} action.`);
          setSelectedIds([]);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || `Failed to perform bulk action.`;
          toast.error(errMsg);
        },
      }
    );
  };

  const handleImportCSV = () => {
    setIsImportModalOpen(true);
  };

  const handleUploadFile = (file: File, options?: { onSuccess?: (response: any) => void; onError?: (err: any) => void }) => {
    uploadMutation.mutate(file, {
      onSuccess: (response: any) => {
        options?.onSuccess?.(response);
      },
      onError: (err: any) => {
        options?.onError?.(err);
      },
    });
  };

  const {
    dentists: apiDentists,
    meta: apiMeta,
    isLoading,
    isError,
  } = useAdminDentists({
    params: { limit: 1000 },
  });

  const mappedDentists = useMemo(() => {
    return (apiDentists || []).map(mapApiDentistToUIDentist);
  }, [apiDentists]);

  const meta = useMemo(() => {
    const total = mappedDentists.length;
    const active = mappedDentists.filter((d) => d.status === "active").length;
    const pending = mappedDentists.filter((d) => d.status === "pending").length;
    const suspended = mappedDentists.filter((d) => d.status === "suspended").length;
    const rejected = mappedDentists.filter((d) => d.status === "rejected").length;
    const unclaimed = mappedDentists.filter((d) => d.status === "unclaimed").length;

    return {
      total_dentists: total,
      active,
      active_pct: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
      pending_verification: pending,
      suspended,
      suspended_pct: total > 0 ? `${Math.round((suspended / total) * 100)}%` : "0%",
      tab_counts: { all: total, active, pending, suspended, rejected, unclaimed },
    };
  }, [mappedDentists]);

  const stats = [
    { label: "Total Dentists", value: (apiMeta?.total_verifications ?? 0).toLocaleString(), sub: "Registered on platform" },
    { label: "Active", value: meta.active.toLocaleString(), sub: meta.active_pct },
    { label: "Pending Verification", value: (apiMeta?.pending_review ?? 0).toLocaleString(), sub: "Awaiting review", valueColor: "text-amber-500" },
    { label: "Suspended", value: meta.suspended.toString(), sub: meta.suspended_pct },
    { label: "Directory Entries", value: (apiMeta?.totalDirectory ?? 0).toLocaleString(), sub: "Imported via CSV" },
    { label: "Subscribed Members", value: (apiMeta?.totalSubscribed ?? 0).toLocaleString(), sub: "Active paid plans" },
  ];

  const tabs = [
    { key: "all", label: "All", count: (apiMeta?.total_verifications ?? 0) + (apiMeta?.totalDirectory ?? 0) },
    { key: "active", label: "Active", count: meta.tab_counts.active },
    { key: "pending", label: "Pending", count: apiMeta?.pending_review ?? 0 },
    { key: "unclaimed", label: "Unclaimed Directory", count: apiMeta?.totalDirectory ?? 0 },
    { key: "suspended", label: "Suspended", count: meta.tab_counts.suspended },
    { key: "rejected", label: "Rejected", count: meta.tab_counts.rejected },
  ];

  // Apply filters
  const filtered = useMemo(() => {
    let list = mappedDentists;
    if (activeTab !== "all") list = list.filter((d) => d.status === activeTab);
    if (specialty !== "All specialties") list = list.filter((d) => d.specialty === specialty);
    if (city !== "All cities") {
      const q = city.toLowerCase();
      list = list.filter(
        (d) =>
          d.location.toLowerCase().includes(q) ||
          q.includes(d.location.toLowerCase())
      );
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [mappedDentists, activeTab, specialty, city, tableSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [filtered, currentPage]);

  const paginationRange = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1, 2];
    if (currentPage > 2 && currentPage < totalPages) {
      if (currentPage > 3) pages.push("...");
      pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push("...");
    } else {
      pages.push("...");
    }
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const handleTabChange = (key: string) => {
    setActiveTab(key as StatusFilter);
    setPage(1);
  };

  if (isLoading) {
    return <DentistsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center text-red-500 font-semibold">
        Failed to load dentists directory. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dentists Directory</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage all practitioners on the platform — verification, status, performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 truncate"
          >
            <Upload className="h-4 w-4" />
            <span className="truncate">Import CSV</span>
          </button>
          <button className="flex truncate items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex truncate items-center gap-2 rounded-lg bg-text px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-text/90">
            <UserPlus className="h-4 w-4" />
            <span className="truncate">Invite dentist</span>
          </button>
        </div>
      </div>

      <CustomStats stats={stats} className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" />

      <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 overflow-x-auto pt-1">
          <CustomTab tabs={tabs} active={activeTab} onChange={handleTabChange} />
        </div>

        {/* Input Filters */}
        <ListFilters
          tableSearch={tableSearch}
          setTableSearch={setTableSearch}
          specialty={specialty}
          setSpecialty={setSpecialty}
          city={city}
          setCity={setCity}
          setPage={setPage}
          specialities={specialities}
          selectedCount={selectedIds.length}
          onBulkAction={handleBulkAction}
          isBulkPending={bulkActionMutation.isPending}
          onClearSelection={() => setSelectedIds([])}
        />

        {/* Dentists Data Table */}
        <DentistsTable
          filtered={filtered}
          pageData={pageData}
          currentPage={currentPage}
          totalPages={totalPages}
          setPage={setPage}
          paginationRange={paginationRange}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>

      {/* Professional Import Drawer/Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onUpload={handleUploadFile}
        isPending={uploadMutation.isPending}
      />
    </div>
  );
}
