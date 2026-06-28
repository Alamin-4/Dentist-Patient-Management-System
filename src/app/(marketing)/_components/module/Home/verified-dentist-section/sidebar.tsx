"use client";

import { cn } from "@/lib/utils";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { useMemo } from "react";

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
    // Extract unique names from global procedures
    const names = globalProcedures.map((p: any) => p.name);
    
    // We want to make sure the currently active procedure is always visible/included in our list
    // and we show the first 9 procedures for visual layout balance.
    const uniqueNames = Array.from(new Set(names));
    const firstNine = uniqueNames.slice(0, 9);
    
    if (active && !firstNine.includes(active) && uniqueNames.includes(active)) {
      // If active is not in the first 9 but exists in the list, replace the last item with active
      firstNine[firstNine.length - 1] = active;
    }
    
    return firstNine;
  }, [globalProcedures, active]);

  return (
    <aside className="w-full lg:w-72 flex flex-col gap-1 p-6 border-r border-gray-100">
      <h3 className="text-[#10436B] text-lg font-bold mb-6 px-2">Select Procedure</h3>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-[44px] w-full bg-gray-100 animate-pulse rounded-xl mb-1"
            />
          ))
        ) : (
          procedureList.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "text-left px-4 py-3 rounded-xl text-[15px] transition-all duration-200",
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
}