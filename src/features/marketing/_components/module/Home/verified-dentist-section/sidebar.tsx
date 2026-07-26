"use client";

import { cn } from "@/lib/utils";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronDown, Stethoscope, Check } from "lucide-react";
import Link from "next/link";
import { proceduresLists } from "@/lib/location-data";

export default function Sidebar({
  active,
  onChange,
}: {
  active: string;
  onChange: (val: string) => void;
}) {
  const { data: globalProcedures = proceduresLists, isLoading } = useGlobalProcedures();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const procedureList = useMemo(() => {
    if (!globalProcedures || !Array.isArray(globalProcedures)) {
      return [];
    }
    const names = globalProcedures.map((p: any) => p.name);
    return Array.from(new Set(names)) as string[];
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

  // 📱 Mobile Dropdown Version (Custom UI)
  const MobileDropdown = () => (
    <div className="lg:hidden w-full px-4 py-3" ref={mobileDropdownRef}>
      <label className="block text-[#10436B] text-sm font-semibold mb-2">
        Select Procedure
      </label>
      <div className="relative">
        {/* Custom Select Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#10436B]/20 focus:border-[#10436B] transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            {/* Premium Icon Container */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10436B]/10 text-[#10436B]">
              <Stethoscope size={16} />
            </div>
            <span className={cn(
              "truncate",
              !active || active === "All Procedures" ? "text-gray-500" : "text-[#10436B]"
            )}>
              {active || "All Procedures"}
            </span>
          </div>
          <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", isMobileOpen && "rotate-180")} />
        </button>

        {/* Dropdown Menu */}
        {isMobileOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden">

            {/* 📱 Changed max-h to 70vh to utilize mobile screen space better. Added pb-6 so the last item isn't hidden by the linear */}
            <div className="max-h-[70vh] overflow-y-auto p-2 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {isLoading ? (
                <div className="flex flex-col gap-2 p-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 w-full bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onChange("All Procedures");
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-all duration-150",
                      (!active || active === "All Procedures")
                        ? "bg-[#F4F9FD] text-[#10436B] font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#10436B]"
                    )}
                  >
                    All Procedures
                    {(!active || active === "All Procedures") && <Check size={16} className="text-[#10436B]" />}
                  </button>

                  {procedureList.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        onChange(p);
                        setIsMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-all duration-150",
                        active === p
                          ? "bg-[#F4F9FD] text-[#10436B] font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#10436B]"
                      )}
                    >
                      {p}
                      {active === p && <Check size={16} className="text-[#10436B]" />}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* ✨ Subtle linear at the bottom to hint that there are more items to scroll */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent rounded-b-xl" />
          </div>
        )}
      </div>
    </div>
  );

  // 🖥️ Desktop Sidebar Version
  const DesktopSidebar = () => {
    const isAllActive = active === "All Procedures" || active === "" || !active;

    return (
      <aside className="hidden lg:flex w-72 flex-col gap-1 p-6 border-r border-gray-100">
        <h3 className="text-[#10436B] text-lg font-bold mb-6 px-2">Select Procedure</h3>

        <div
          className={cn(
            "flex flex-col gap-1 max-h-100 overflow-y-auto pr-1",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200",
            "hover:[&::-webkit-scrollbar-thumb]:bg-gray-300",
            "scrollbar-thin scrollbar-track-transparent"
          )}
        >
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-full bg-gray-100 animate-pulse rounded-lg mb-1"
              />
            ))
          ) : (
            <>
              {procedureList.length > 0 && (
                <button
                  onClick={() => onChange("All Procedures")}
                  className={cn(
                    "flex items-center justify-between text-left px-4 py-3 rounded-lg text-[15px] transition-all duration-200",
                    isAllActive
                      ? "bg-[#F4F9FD] text-[#10436B] font-bold shadow-sm"
                      : "text-gray-500 hover:text-[#10436B] hover:bg-gray-50"
                  )}
                >
                  All Procedures
                  {isAllActive && <Check size={16} className="text-[#10436B]" />}
                </button>
              )}
              {procedureList.map((p) => (
                <button
                  key={p}
                  onClick={() => onChange(p)}
                  className={cn(
                    "flex items-center justify-between text-left px-4 py-3 rounded-lg text-[15px] transition-all duration-200",
                    active === p
                      ? "bg-[#F4F9FD] text-[#10436B] font-bold shadow-sm"
                      : "text-gray-500 hover:text-[#10436B] hover:bg-gray-50"
                  )}
                >
                  {p}
                  {active === p && <Check size={16} className="text-[#10436B]" />}
                </button>
              ))}
            </>
          )}
        </div>

        {/* {procedureList.length > 1 && (
          <Link
            href="/find-dentists"
            className="text-[#10436B] text-sm font-semibold mt-6 px-4 hover:underline text-left block"
          >
            View all procedures
          </Link>
        )} */}
      </aside>
    );
  };

  return (
    <>
      <MobileDropdown />
      <DesktopSidebar />
    </>
  );
}