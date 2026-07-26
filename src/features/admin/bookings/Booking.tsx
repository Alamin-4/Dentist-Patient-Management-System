"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { useTreatmentBookings } from "@/hooks/treatment-booking/useTreatmentBooking";
import { mapDbBookingToUiBooking } from "./utils/booking-mapper";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { cn } from "@/lib/utils";

type StatusFilter = "All" | "In Progress" | "Completed" | "Cancelled";

const STATUS_BADGE: Record<string, string> = {
  "In Progress": "bg-blue-50 text-blue-600 border border-blue-200",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
};

const ESCROW_BADGE: Record<string, string> = {
  "In Escrow": "bg-amber-50 text-amber-600 border border-amber-200",
  Released: "bg-emerald-50 text-emerald-600",
  Refunded: "bg-gray-100 text-gray-500",
};

function Avatar({
  initials,
  color,
  size = "sm",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function BookingSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Page Header Skeleton */}
      <div>
        <div className="h-7 w-36 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 rounded bg-slate-100" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-8 w-16 rounded bg-slate-300" />
          </div>
        ))}
      </div>

      {/* Table Card Skeleton */}
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Tabs Skeleton */}
        <div className="border-b border-gray-100 px-4 py-3 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-16 rounded bg-slate-200" />
          ))}
        </div>

        {/* Filters Row Skeleton */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="h-9 flex-1 rounded-lg bg-slate-100" />
          <div className="h-9 w-36 rounded-lg bg-slate-100" />
          <div className="h-9 w-32 rounded-lg bg-slate-100" />
          <div className="h-9 w-32 rounded-lg bg-slate-100" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="px-4 py-3"><div className="h-3 w-16 rounded bg-slate-200" /></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-slate-200" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div className="h-4 w-24 rounded bg-slate-200" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="h-4 w-20 rounded bg-slate-200" />
                        <div className="h-3 w-16 rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><div className="h-4 w-32 rounded bg-slate-100" /></td>
                  <td className="px-4 py-4"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-12 rounded bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-slate-100" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  const router = useRouter();

  const { data: response, isLoading } = useTreatmentBookings();

  const [activeTab, setActiveTab] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedDentist, setSelectedDentist] = useState("All dentists");
  const [selectedEscrow, setSelectedEscrow] = useState("All escrow states");

  // Map the raw DB bookings response to the UI-compatible shape
  const uiBookings = useMemo(() => {
    const rawList = response?.data || [];
    return rawList.map(mapDbBookingToUiBooking).filter(Boolean) as any[];
  }, [response]);

  // Dynamic Metadata totals
  const meta = useMemo(() => {
    const total = uiBookings.length;
    const cancellations = uiBookings.filter((b) => b.status === "Cancelled").length;
    const completed = uiBookings.filter((b) => b.status === "Completed").length;
    return {
      total_bookings: total,
      cancellations,
      completed_mtd: completed,
    };
  }, [uiBookings]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      All: uiBookings.length,
      "In Progress": uiBookings.filter((b) => b.status === "In Progress").length,
      Completed: uiBookings.filter((b) => b.status === "Completed").length,
      Cancelled: uiBookings.filter((b) => b.status === "Cancelled").length,
    };
  }, [uiBookings]);

  const tabs = (["All", "In Progress", "Completed", "Cancelled"] as StatusFilter[]).map(
    (s) => ({ key: s, label: s, count: counts[s] })
  );

  // Dynamic list of dentists for the dentist filter dropdown
  const dentistOptions = useMemo(() => {
    const names = uiBookings.map((b) => b.dentist.name);
    return Array.from(new Set(names)).sort();
  }, [uiBookings]);

  // Filter logic
  const filtered = useMemo(() => {
    let list = uiBookings;
    if (activeTab !== "All") list = list.filter((b) => b.status === activeTab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.booking_id.toLowerCase().includes(q) ||
          b.patient.name.toLowerCase().includes(q) ||
          b.dentist.name.toLowerCase().includes(q) ||
          b.procedure.toLowerCase().includes(q)
      );
    }
    if (dateFilter) {
      const q = dateFilter.toLowerCase();
      list = list.filter((b) => b.date.toLowerCase().includes(q));
    }
    if (selectedDentist !== "All dentists") {
      list = list.filter((b) => b.dentist.name === selectedDentist);
    }
    if (selectedEscrow !== "All escrow states") {
      list = list.filter((b) => b.escrow_status === selectedEscrow);
    }
    return list;
  }, [uiBookings, activeTab, search, dateFilter, selectedDentist, selectedEscrow]);

  if (isLoading) {
    return <BookingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
          Bookings
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Monitor all patient bookings, stages and escrow statuses.
        </p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "TOTAL BOOKING", value: meta.total_bookings.toLocaleString() },
          { label: "CANCELLATIONS", value: meta.cancellations.toString() },
          { label: "COMPLETED MTD", value: meta.completed_mtd.toLocaleString() },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {s.label}
            </p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight text-[#1A1A2E]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tabs + Table card ─────────────────────────────────────────── */}
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-4 pt-1">
          <CustomTab
            tabs={tabs}
            active={activeTab}
            onChange={(k) => setActiveTab(k as StatusFilter)}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking ID, patient, dentist, procedure..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-500 outline-none focus:border-[#1A1A2E]"
          />
          <select
            value={selectedDentist}
            onChange={(e) => setSelectedDentist(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
          >
            <option value="All dentists">All dentists</option>
            {dentistOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={selectedEscrow}
            onChange={(e) => setSelectedEscrow(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#1A1A2E]"
          >
            <option value="All escrow states">All escrow states</option>
            <option value="In Escrow">In Escrow</option>
            <option value="Released">Released</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                {["BOOKING ID", "PATIENT", "DENTIST", "PROCEDURE", "STATUS", "ESCROW", "AMOUNT", "DATE", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] truncate font-semibold uppercase tracking-wide text-gray-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => router.push(`/admin/bookings/${b.id}`)}
                    className="cursor-pointer transition-colors hover:bg-gray-50/80 *:truncate"
                  >
                    {/* Booking ID */}
                    <td className="px-4 py-3.5 text-sm font-semibold text-blue-600">
                      {b.booking_id}
                    </td>
                    {/* Patient */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          initials={b.patient.initials}
                          color={b.patient.avatar_color}
                        />
                        <span className="text-sm font-medium text-[#1A1A2E] truncate">
                          {b.patient.name}
                        </span>
                      </div>
                    </td>
                    {/* Dentist */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          initials={b.dentist.initials}
                          color={b.dentist.avatar_color}
                        />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A2E]">
                            {b.dentist.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {b.dentist.specialty}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Procedure */}
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {b.procedure}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-500"
                        )}
                      >
                        {b.status}
                      </span>
                    </td>
                    {/* Escrow */}
                    <td className="px-4 py-3.5">
                      {b.escrow_status ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            ESCROW_BADGE[b.escrow_status] ?? "bg-gray-100 text-gray-500"
                          )}
                        >
                          {b.escrow_status}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#1A1A2E]">
                      ${b.amount.toLocaleString()}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {b.date}
                    </td>
                    {/* Arrow */}
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-400">
            Showing {filtered.length} of {uiBookings.length} bookings
          </p>
        </div>
      </div>
    </div>
  );
}
