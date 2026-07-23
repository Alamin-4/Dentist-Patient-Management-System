"use client";

import { Search, ChevronDown, ShieldOff, Trash2, X, CheckCircle } from "lucide-react";
import { CITIES } from "../utils/dentist-types";

interface ListFiltersProps {
  tableSearch: string;
  setTableSearch: (val: string) => void;
  specialty: string;
  setSpecialty: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  setPage: (page: number) => void;
  specialities?: any[];
  selectedCount: number;
  onBulkAction: (action: "suspend" | "unsuspend" | "delete") => void;
  isBulkPending: boolean;
  onClearSelection: () => void;
}

export function ListFilters({
  tableSearch,
  setTableSearch,
  specialty,
  setSpecialty,
  city,
  setCity,
  setPage,
  specialities,
  selectedCount,
  onBulkAction,
  isBulkPending,
  onClearSelection,
}: ListFiltersProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 min-h-13">
       <>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or ID..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>

          <div className="relative">
            <select
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E] cursor-pointer"
            >
              <option value="All specialties">All specialties</option>
              {specialities?.map((s) => (
                <option key={s.slug || s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E] cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </>
    </div>
  );
}
