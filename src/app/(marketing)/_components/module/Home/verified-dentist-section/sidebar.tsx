"use client";

import { cn } from "@/lib/utils";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function Sidebar({
  active,
  onChange,
}: {
  active: string;
  onChange: (val: string) => void;
}) {
  const { data: globalProcedures, isLoading } = useGlobalProcedures();

  const procedureList = useMemo(() => {
    if (!globalProcedures || !Array.isArray(globalProcedures)) {
      return [];
    }
    const names = globalProcedures.map((p: any) => p.name);
    const uniqueNames = Array.from(new Set(names));
    const firstNine = uniqueNames.slice(0, 9);

    if (active && !firstNine.includes(active) && uniqueNames.includes(active)) {
      firstNine[firstNine.length - 1] = active;
    }

    return firstNine;
  }, [globalProcedures, active]);

  // Mobile Dropdown Version
  const MobileDropdown = () => (
    <div className="lg:hidden w-full px-4 py-3">
      <label className="block text-[#10436B] text-sm font-semibold mb-2">
        Select Procedure
      </label>
      <div className="relative">
        <select
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-[15px] text-[#10436B] font-medium focus:outline-none focus:ring-2 focus:ring-[#10436B]/20 focus:border-[#10436B] transition-all"
        >
          {isLoading ? (
            <option>Loading...</option>
          ) : (
            procedureList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  // Desktop Sidebar Version
  const DesktopSidebar = () => (
    <aside className="hidden lg:flex w-72 flex-col gap-1 p-6 border-r border-gray-100">
      <h3 className="text-[#10436B] text-lg font-bold mb-6 px-2">Select Procedure</h3>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-[44px] w-full bg-gray-100 animate-pulse rounded-lg mb-1"
            />
          ))
        ) : (
          procedureList.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "text-left px-4 py-3 rounded-lg text-[15px] transition-all duration-200",
                active === p
                  ? "bg-[#F4F9FD] text-[#10436B] font-bold shadow-sm"
                  : "text-gray-500 hover:text-[#10436B] hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))
        )}
      </div>
      <button className="text-[#10436B] text-sm font-semibold mt-6 px-4 hover:underline text-left">
        View all procedure
      </button>
    </aside>
  );

  return (
    <>
      <MobileDropdown />
      <DesktopSidebar />
    </>
  );
}