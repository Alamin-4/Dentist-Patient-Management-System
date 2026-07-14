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
} from "@/hooks/admin/dentist/useDentist";
import { useSpecialties } from "@/hooks/dentist/useSpecialty";

import {
  type Dentist,
  type StatusFilter,
  PAGE_SIZE,
  mapApiDentistToUIDentist,
} from "./utils/dentist-types";

import { ListFilters } from "./components/list-filters";
import { ListBulkActions } from "./components/list-bulk-actions";
import { DentistsTable } from "./components/list-table";

export default function DentistsPage() {
  const router = useRouter();
  const { data: specialities } = useSpecialties();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDentistDirectory();

  // Search, Filter & Pagination States
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [tableSearch, setTableSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [city, setCity] = useState("All cities");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
      toast.error("Please upload a valid CSV or Excel file.");
      return;
    }

    const toastId = toast.loading("Uploading and importing dentist directory...");

    uploadMutation.mutate(file, {
      onSuccess: (response: any) => {
        toast.success(
          response?.message || "Dentist directory imported successfully.",
          { id: toastId }
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || err?.message || "Failed to import dentist directory.";
        toast.error(errMsg, { id: toastId });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const {
    dentists: apiDentists,
    isLoading,
    isError,
  } = useAdminDentists({
    params: { limit: 100 },
  });

  const mappedDentists = useMemo(() => {
    return (apiDentists || []).map(mapApiDentistToUIDentist);
  }, [apiDentists]);

  // Derive Statistics & Count Totals
  const meta = useMemo(() => {
    const total = mappedDentists.length;
    const active = mappedDentists.filter((d) => d.status === "active").length;
    const pending = mappedDentists.filter((d) => d.status === "pending").length;
    const suspended = mappedDentists.filter((d) => d.status === "suspended").length;
    const rejected = mappedDentists.filter((d) => d.status === "rejected").length;

    return {
      total_dentists: total,
      active,
      active_pct: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
      pending_verification: pending,
      suspended,
      suspended_pct: total > 0 ? `${Math.round((suspended / total) * 100)}%` : "0%",
      tab_counts: { all: total, active, pending, suspended, rejected },
    };
  }, [mappedDentists]);

  const stats = [
    { label: "Total Dentists", value: meta.total_dentists.toLocaleString(), sub: "Registered on platform" },
    { label: "Active", value: meta.active.toLocaleString(), sub: meta.active_pct },
    { label: "Pending Verification", value: meta.pending_verification.toString(), sub: "Awaiting review", valueColor: "text-amber-500" },
    { label: "Suspended", value: meta.suspended.toString(), sub: meta.suspended_pct },
  ];

  const tabs = [
    { key: "all", label: "All", count: meta.tab_counts.all },
    { key: "active", label: "Active", count: meta.tab_counts.active },
    { key: "pending", label: "Pending", count: meta.tab_counts.pending },
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
      <div className="flex min-h-[400px] items-center justify-center text-red-500 font-semibold">
        Failed to load dentists directory. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Dentists Directory</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage all practitioners on the platform — verification, status, performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={handleImportCSV}
            disabled={uploadMutation.isPending}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import CSV
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1A1A2E]/90">
            <UserPlus className="h-4 w-4" />
            Invite dentist
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <CustomStats stats={stats} />

      {/* Main Table Card */}
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
        {/* Navigation Tabs */}
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

      {/* Bulk Action Controls */}
      <ListBulkActions selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
    </div>
  );
}
