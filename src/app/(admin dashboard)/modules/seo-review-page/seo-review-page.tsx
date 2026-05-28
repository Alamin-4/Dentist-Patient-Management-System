"use client";

import { useState, useMemo } from "react";
import {
  Globe, CheckCircle2, Trash2, CalendarDays, Search,
  ExternalLink, RotateCcw, Trash, ChevronDown, X,
} from "lucide-react";
import Link from "next/link";
import { CustomStats } from "@/app/(admin dashboard)/modules/shared/custom-stats";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { CustomTable } from "@/app/(admin dashboard)/modules/shared/custom-table";
import type { Column } from "@/app/(admin dashboard)/modules/shared/custom-table";
import seoPagesData from "@/lib/seo-pages-data";
import { cn } from "@/lib/utils";

type SEOPage = (typeof seoPagesData.pages)[number];
type MutablePage = SEOPage & { currentStatus: "published" | "removed" };
type TabKey = "all" | "published" | "removed";

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
function Avatar({ initials, color, size = "sm" }: { initials: string; color: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: "published" | "removed" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
      status === "published"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-gray-200 bg-gray-100 text-gray-500"
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "published" ? "bg-emerald-500" : "bg-gray-400")} />
      {status === "published" ? "Published" : "Removed"}
    </span>
  );
}

/* ─── Filter Dropdown ────────────────────────────────────────────────────── */
function FilterDropdown({
  label, value, options, open, onToggle, onSelect, onClear,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-medium transition-colors hover:bg-gray-50",
          value ? "border-[#1A1A2E] text-[#1A1A2E]" : "border-gray-200 text-gray-600"
        )}
      >
        {value || label}
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-20 min-w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <button
            onClick={onClear}
            className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", !value ? "font-semibold text-[#1A1A2E]" : "text-gray-500")}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={cn("w-full px-4 py-2 text-left text-sm hover:bg-gray-50", value === opt ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Remove Modal ───────────────────────────────────────────────────────── */
function RemoveModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-[#1A1A2E]">Remove this SEO page?</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            This page will be immediately taken down from the public site. The review will remain in the system but will no longer have a public URL.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Remove Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function SEOReviewPage() {
  const [pages, setPages] = useState<MutablePage[]>(() =>
    seoPagesData.pages.map((p) => ({ ...p, currentStatus: p.status as "published" | "removed" }))
  );
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [procedureFilter, setProcedureFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"country" | "procedure" | "status" | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const publishedCount = pages.filter((p) => p.currentStatus === "published").length;
  const removedCount = pages.filter((p) => p.currentStatus === "removed").length;

  const countries = [...new Set(seoPagesData.pages.map((p) => p.country))].sort();
  const procedures = [...new Set(seoPagesData.pages.map((p) => p.procedure))].sort();
  const statusOptions = ["Published", "Removed"];

  const filtered = useMemo(() => {
    let list = pages;
    if (activeTab === "published") list = list.filter((p) => p.currentStatus === "published");
    if (activeTab === "removed") list = list.filter((p) => p.currentStatus === "removed");
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.dentist_name.toLowerCase().includes(q) ||
        p.patient_name.toLowerCase().includes(q) ||
        p.procedure.toLowerCase().includes(q)
      );
    }
    if (countryFilter) list = list.filter((p) => p.country === countryFilter);
    if (procedureFilter) list = list.filter((p) => p.procedure === procedureFilter);
    if (statusFilter) list = list.filter((p) =>
      statusFilter === "Published" ? p.currentStatus === "published" : p.currentStatus === "removed"
    );
    return list;
  }, [pages, activeTab, search, countryFilter, procedureFilter, statusFilter]);

  const handleConfirmRemove = () => {
    if (!pendingRemoveId) return;
    setPages((prev) => prev.map((p) => p.id === pendingRemoveId ? { ...p, currentStatus: "removed" } : p));
    setPendingRemoveId(null);
  };

  const handleRestore = (id: string) => {
    setPages((prev) => prev.map((p) => p.id === id ? { ...p, currentStatus: "published" } : p));
  };

  const resetFilters = () => {
    setSearch(""); setCountryFilter(""); setProcedureFilter(""); setStatusFilter("");
  };

  const hasActiveFilters = search || countryFilter || procedureFilter || statusFilter;

  const stats = [
    { label: "Total SEO Pages", value: String(pages.length), icon: <Globe className="h-5 w-5" /> },
    { label: "Published", value: String(publishedCount), valueColor: "text-emerald-600", icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
    { label: "Removed", value: String(removedCount), icon: <Trash2 className="h-5 w-5" /> },
    { label: "This Month", value: String(seoPagesData.meta.this_month), icon: <CalendarDays className="h-5 w-5" /> },
  ];

  const tabs = [
    { key: "all", label: "All", count: pages.length },
    { key: "published", label: "Published", count: publishedCount },
    { key: "removed", label: "Removed", count: removedCount },
  ];

  const columns: Column<MutablePage>[] = [
    {
      key: "dentist",
      header: "Dentist",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar initials={row.dentist_initials} color={row.dentist_avatar_color} />
          <span className="font-medium text-[#1A1A2E]">{row.dentist_name}</span>
        </div>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar initials={row.patient_initials} color={row.patient_avatar_color} />
          <span className="text-[#1A1A2E]">{row.patient_name}</span>
        </div>
      ),
    },
    {
      key: "procedure",
      header: "Procedure",
      render: (row) => <span className="text-gray-600">{row.procedure}</span>,
    },
    {
      key: "city",
      header: "City",
      render: (row) => <span className="text-gray-500">{row.city}</span>,
    },
    {
      key: "published",
      header: "Published",
      render: (row) => <span className="text-gray-500">{row.published_date}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.currentStatus} />,
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/seo-review-pages/${row.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A2E] transition-colors hover:bg-gray-50"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View page
          </Link>
          {row.currentStatus === "published" ? (
            <button
              onClick={() => setPendingRemoveId(row.id)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          ) : (
            <button
              onClick={() => handleRestore(row.id)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">SEO Pages</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Pages are auto-generated from published reviews. Monitor status and remove when needed.
          </p>
        </div>

        {/* Stats */}
        <CustomStats stats={stats} />

        {/* Table card */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-100 px-4">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={(k) => { setActiveTab(k as TabKey); resetFilters(); }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by dentist or patient..."
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
              />
            </div>
            <FilterDropdown
              label="Country"
              value={countryFilter}
              options={countries}
              open={openDropdown === "country"}
              onToggle={() => setOpenDropdown((v) => v === "country" ? null : "country")}
              onSelect={(v) => { setCountryFilter(v); setOpenDropdown(null); }}
              onClear={() => { setCountryFilter(""); setOpenDropdown(null); }}
            />
            <FilterDropdown
              label="Procedure"
              value={procedureFilter}
              options={procedures}
              open={openDropdown === "procedure"}
              onToggle={() => setOpenDropdown((v) => v === "procedure" ? null : "procedure")}
              onSelect={(v) => { setProcedureFilter(v); setOpenDropdown(null); }}
              onClear={() => { setProcedureFilter(""); setOpenDropdown(null); }}
            />
            <FilterDropdown
              label="Status"
              value={statusFilter}
              options={statusOptions}
              open={openDropdown === "status"}
              onToggle={() => setOpenDropdown((v) => v === "status" ? null : "status")}
              onSelect={(v) => { setStatusFilter(v); setOpenDropdown(null); }}
              onClear={() => { setStatusFilter(""); setOpenDropdown(null); }}
            />
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 transition-colors hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Table */}
          <CustomTable
            columns={columns}
            data={filtered}
            emptyMessage="No SEO pages found"
            className="rounded-none border-0 shadow-none"
            footer={
              <p className="text-sm text-gray-400">
                Showing {filtered.length} of {pages.length} SEO pages
              </p>
            }
          />
        </div>
      </div>

      {openDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
      )}

      {pendingRemoveId && (
        <RemoveModal
          onCancel={() => setPendingRemoveId(null)}
          onConfirm={handleConfirmRemove}
        />
      )}
    </>
  );
}
