"use client";

import { Search, SlidersHorizontal, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

type TopBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  viewMode: "list" | "map" | "filter";
  onViewModeChange: (mode: "list" | "map" | "filter") => void;
  showMapFilters: boolean;
  onToggleMapFilters: () => void;
  onOpenMobileFilters: () => void;
};

export default function TopBar({
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
  showMapFilters,
  onToggleMapFilters,
  onOpenMobileFilters,
}: TopBarProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 py-7">
        <h1 className="text-[32px] font-extrabold tracking-[-0.04em] text-[#0A0A1A] md:text-[40px]">
          Search Verified Dentists
        </h1>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search Dentist"
              className="h-14 w-full rounded-lg border border-slate-200 bg-[#F8F9FB] pl-5 pr-12 text-[14px] font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <Search className="size-6 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile-only Filters button (list view) */}
            {viewMode === "list" && (
              <Button
                type="button"
                variant="outline"
                onClick={onOpenMobileFilters}
                className="flex h-14 items-center rounded-lg border border-slate-200 bg-[#0E3E65]/3 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 lg:hidden"
              >
                Filters
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <SlidersHorizontal className="size-4 text-[#003366]" />
                </div>
              </Button>
            )}

            {/* Map mode: desktop Filters toggle */}
            {viewMode === "map" && (
              <Button
                type="button"
                variant="outline"
                onClick={onToggleMapFilters}
                className={`hidden h-14 items-center rounded-lg border border-slate-200 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 lg:flex ${
                  showMapFilters ? "bg-[#0E3E65]/10" : "bg-[#0E3E65]/3"
                }`}
              >
                Filters
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <SlidersHorizontal className="size-4 text-[#003366]" />
                </div>
              </Button>
            )}

            {/* Map mode: mobile Filters button */}
            {viewMode === "map" && (
              <Button
                type="button"
                variant="outline"
                onClick={onOpenMobileFilters}
                className={`flex h-14 items-center rounded-lg border border-slate-200 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 lg:hidden ${
                  showMapFilters ? "bg-[#0E3E65]/10" : "bg-[#0E3E65]/3"
                }`}
              >
                Filters
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <SlidersHorizontal className="size-4 text-[#003366]" />
                </div>
              </Button>
            )}

            {/* List View / Map View toggle */}
            {viewMode === "map" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onViewModeChange("list");
                  if (showMapFilters) onToggleMapFilters();
                }}
                className="flex h-14 items-center rounded-lg border border-slate-200 bg-[#0E3E65]/3 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10"
              >
                List View
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <List className="size-4 text-[#003366]" />
                </div>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onViewModeChange("map")}
                className="flex h-14 items-center rounded-lg border border-slate-200 bg-[#0E3E65]/3 px-5 text-[#003366] shadow-none transition-all hover:bg-[#0E3E65]/10"
              >
                Map View
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <Map className="size-4 text-[#003366]" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
