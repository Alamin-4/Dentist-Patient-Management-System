"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/auth/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type TopBarProps = {
  query: string;
  onQueryChange: (value: string, src?: string) => void;
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
  const { user } = useMe();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchParams = useSearchParams();
  const src = searchParams.get("src") || "";
  const [localQuery, setLocalQuery] = useState(src === "top" ? query : "");
  const showJoinButton = !user || user.role !== "DENTIST";

  useEffect(() => {
    if (isFocused) return;

    if (src === "top") {
      setLocalQuery(query);
    } else {
      setLocalQuery("");
    }
  }, [query, src, isFocused]);

  const handleQueryInputChange = (val: string) => {
    setLocalQuery(val);
    onQueryChange(val, "top");
  };

  const handleJoinAsDentistClick = (e: React.MouseEvent) => {
    if (user && user.role !== "DENTIST") {
      e.preventDefault();
      setShowLogoutConfirm(true);
    }
  };

  const handleConfirmLogout = () => {
    document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/register-doctor";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 py-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-[32px] font-extrabold tracking-[-0.04em] text-[#0A0A1A] md:text-[40px]">
            Search Verified Dentists
          </h1>
          {showJoinButton && (
            <Link
              href="/register-doctor"
              onClick={handleJoinAsDentistClick}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#0E3E65] px-6 text-[14px] font-semibold text-white transition-all hover:bg-[#002850] active:scale-95 shadow-sm shrink-0"
            >
              Join as a Dentist
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative flex-1">
            <input
              value={localQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => handleQueryInputChange(e.target.value)}
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
                className={`hidden h-14 items-center rounded-lg border border-slate-200 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 lg:flex ${showMapFilters ? "bg-[#0E3E65]/10" : "bg-[#0E3E65]/3"
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
                className={`flex h-14 items-center rounded-lg border border-slate-200 px-5 text-[#003366] transition-all hover:bg-[#0E3E65]/10 lg:hidden ${showMapFilters ? "bg-[#0E3E65]/10" : "bg-[#0E3E65]/3"
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

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0E3E65] font-bold text-xl">Sign Out Required</DialogTitle>
            <DialogDescription className="text-slate-500">
              You are currently signed in as a Patient. To register a new Dentist account, you must sign out of your current account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 border-t border-slate-100 mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmLogout}
              className="bg-[#0E3E65] hover:bg-[#002850] text-white font-bold h-10 text-sm px-6"
            >
              Sign Out & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
