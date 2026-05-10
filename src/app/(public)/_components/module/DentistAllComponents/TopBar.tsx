"use client";

import { Map as MapIcon, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TopBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  resultCount: number;
};

export default function TopBar({
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
}: TopBarProps) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto w-11/12 flex flex-col gap-6 py-6">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a0a1a] tracking-tight">
            Search Verified Dentists
          </h1>
        </div>

        {/* Search & Toggle Section */}
        <div className="flex items-center gap-4">
          {/* Search Input Container */}
          <div className="relative flex-1 group">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search Dentist"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-[#f8f9fb] pl-5 pr-12 text-base text-slate-700 outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Search className="size-6 text-slate-400 group-focus-within:text-[#003366] transition-colors" />
            </div>
          </div>

          {/* Conditional View Toggle Button */}
          <Button
            type="button"
            onClick={() =>
              onViewModeChange(viewMode === "list" ? "map" : "list")
            }
            className="h-14 rounded-2xl border border-slate-200 bg-white px-6 text-[#003366] hover:bg-slate-50 shadow-sm transition-all flex items-center gap-3"
          >
            <span className="font-bold text-lg">
              {viewMode === "list" ? "Map View" : "List View"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffda7a]">
              {viewMode === "list" ? (
                <MapIcon className="size-5 fill-[#003366] text-[#003366]" />
              ) : (
                <List className="size-5 text-[#003366]" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
