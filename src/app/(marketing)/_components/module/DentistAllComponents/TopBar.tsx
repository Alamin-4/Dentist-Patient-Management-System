"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFilter, FaListUl, FaMapMarkedAlt } from "react-icons/fa";
import { on } from "events";

type TopBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  viewMode: "list" | "map" | "filter";
  onViewModeChange: (mode: "list" | "map" | "filter") => void;
  resultCount: number;
  showMapFilters: boolean;
  onToggleMapFilters: () => void;
};

export default function TopBar({
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
  resultCount,
  showMapFilters,
  onToggleMapFilters,
}: TopBarProps) {
  return (
    <div className="w-full">
      <div className=" flex flex-col gap-6 py-7">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-[-0.04em] text-[#0A0A1A] md:text-[40px]">
            Search Verified Dentists
          </h1>
        </div>

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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {viewMode === "map" && (
              <Button
                type="button"
                hidden={showMapFilters}
                variant="outline"
                onClick={onToggleMapFilters}
                className={`h-14 rounded-lg border border-slate-200 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 ${
                  showMapFilters ? "bg-[#0E3E65]/10" : "bg-[#0E3E65]/3"
                }`}
              >
                Filters
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <FaFilter className="size-4 fill-[#003366] text-[#003366]" />
                </div>
              </Button>
            )}

            {viewMode === "map" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onViewModeChange("list");
                  onToggleMapFilters();
                }}
                className="h-14 rounded-lg border border-slate-200 bg-[#0E3E65]/3 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10"
              >
                List View
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <FaListUl className="size-4 fill-[#003366] text-[#003366]" />
                </div>
              </Button>
            ) : (
              <Button
                type="button"
                hidden={showMapFilters}
                onClick={() => onViewModeChange("map")}
                className="h-14 rounded-lg border border-slate-200 bg-[#0E3E65]/3 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10"
              >
                Map View
                <div className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD86B]">
                  <FaMapMarkedAlt className="size-4 fill-[#003366] text-[#003366]" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
