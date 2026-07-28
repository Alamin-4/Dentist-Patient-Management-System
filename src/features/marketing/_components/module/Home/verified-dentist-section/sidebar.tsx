"use client";

import { cn } from "@/lib/utils";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Stethoscope, Check } from "lucide-react";
import { proceduresLists } from "@/lib/location-data";

export default function Sidebar({ active, onChange }: { active: string; onChange: (val: string) => void }) {
  const { data: globalProcedures = proceduresLists, isLoading } = useGlobalProcedures();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const procedureList = useMemo(() => {
    if (!globalProcedures || !Array.isArray(globalProcedures)) return [];
    return Array.from(new Set(globalProcedures.map((p: any) => p.name))) as string[];
  }, [globalProcedures]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shared render logic to avoid duplication
  const renderList = (isMobile: boolean) => (
    <>
      <button
        onClick={() => { onChange("All Procedures"); if (isMobile) setIsMobileOpen(false); }}
        className={cn(
          "w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-all duration-150",
          (!active || active === "All Procedures") ? "bg-[#F4F9FD] text-[#10436B] font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-[#10436B]"
        )}
      >
        All Procedures
        {(!active || active === "All Procedures") && <Check size={16} className="text-[#10436B]" />}
      </button>
      {(showAll ? procedureList : procedureList.slice(0, 16)).map((p) => (
        <button
          key={p}
          onClick={() => { onChange(p); if (isMobile) setIsMobileOpen(false); }}
          className={cn(
            "w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-all duration-150",
            active === p ? "bg-[#F4F9FD] text-[#10436B] font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-[#10436B]"
          )}
        >
          {p}
          {active === p && <Check size={16} className="text-[#10436B]" />}
        </button>
      ))}
    </>
  );

  return (
    <>
      <div className="lg:hidden w-full px-4 py-3" ref={mobileDropdownRef}>
        <label className="mb-2 block text-sm font-semibold text-[#10436B]">Select Procedure</label>
        <div className="relative">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-[15px] font-medium shadow-sm transition-all hover:shadow-md focus:border-[#10436B] focus:outline-none focus:ring-2 focus:ring-[#10436B]/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10436B]/10 text-[#10436B]">
                <Stethoscope size={16} />
              </div>
              <span className={cn("truncate", !active || active === "All Procedures" ? "text-gray-500" : "text-[#10436B]")}>
                {active || "All Procedures"}
              </span>
            </div>
            <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isMobileOpen && "rotate-180")} />
          </button>

          {isMobileOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 w-full animate-in fade-in zoom-in-95 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg duration-200">
              <div className="max-h-[70vh] overflow-y-auto p-2 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
                {isLoading ? (
                  <div className="flex flex-col gap-2 p-2">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />)}
                  </div>
                ) : (
                  renderList(true)
                )}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 rounded-b-xl bg-linear-to-t from-white to-transparent" />
            </div>
          )}
        </div>
      </div>

      <aside className="hidden w-72 flex-col border-r border-border p-6 lg:flex">
        <h3 className="mb-6 px-2 text-lg font-bold text-[#10436B]">Select Procedure</h3>

        <div
          className={cn(
            "flex max-h-200 h-fit flex-col gap-1 pr-1 transition-all duration-300",
            "",
            showAll ? "overflow-y-auto" : "overflow-hidden",
            "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
          )}
        >
          {isLoading ? (
            Array.from({ length: 16 }).map((_, i) => <div key={i} className="mb-1 h-11 w-full animate-pulse rounded-lg bg-gray-100" />)
          ) : (
            renderList(false)
          )}
        </div>

        {!isLoading && procedureList.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full py-2.5 cursor-pointer hover:underline text-center text-sm font-semibold text-primary"
          >
            {showAll ? "Show Less" : "View all Procedures"}
          </button>
        )}
      </aside>
    </>
  );
}